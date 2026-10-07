import detailedMushrooms from '../components/data/detailedMushrooms.json'
import { isLoggedIn, getCurrentSession } from './authService'

// Initialize the public database with detailed mushrooms data
export const initializePublicDatabase = () => {
    // Check if the public database is already initialized
    const existingData = localStorage.getItem('publicMushroomDatabase')
    
    if (!existingData) {
        // Initialize with detailed mushrooms data, adding specimens array to each
        const initialData = detailedMushrooms.map(mushroom => ({
            ...mushroom,
            specimens: [] // Array to hold public specimens
        }))
        
        localStorage.setItem('publicMushroomDatabase', JSON.stringify(initialData))
        console.log('Public mushroom database initialized with', initialData.length, 'mushrooms')
    }
    
    // Always return the current database state
    return JSON.parse(localStorage.getItem('publicMushroomDatabase') || '[]')
}

// Initialize private database for user's private specimens
export const initializePrivateDatabase = () => {
    if (!isLoggedIn()) {
        return {}
    }
    
    const session = getCurrentSession()
    if (!session || !session.username) {
        return {}
    }
    
    const key = `privateMushroomSpecimens_${session.username}`
    const existingData = localStorage.getItem(key)
    
    if (!existingData) {
        // Initialize empty private database - stores specimens by mushroom ID
        localStorage.setItem(key, JSON.stringify({}))
        console.log(`Private specimen database initialized for user: ${session.username}`)
    }
    
    return JSON.parse(localStorage.getItem(key) || '{}')
}

// Get all mushrooms from the public database
export const getAllMushrooms = () => {
    const data = localStorage.getItem('publicMushroomDatabase')
    
    // If no data exists, initialize the database first
    if (!data) {
        return initializePublicDatabase()
    }
    
    return JSON.parse(data)
}

// Get private specimens for current user
export const getPrivateSpecimens = () => {
    if (!isLoggedIn()) {
        return {}
    }
    
    const session = getCurrentSession()
    if (!session || !session.username) {
        return {}
    }
    
    const key = `privateMushroomSpecimens_${session.username}`
    const data = localStorage.getItem(key)
    
    if (!data) {
        return initializePrivateDatabase()
    }
    
    return JSON.parse(data)
}

// Get all mushrooms including user data (combines public + private specimens for display)
export const getAllMushroomsWithUserData = () => {
    // Get mushrooms from public database (includes public specimens)
    const publicMushrooms = getAllMushrooms()
    
    // Only include private specimens if user is logged in
    if (!isLoggedIn()) {
        // Return only public data for non-logged-in users
        return publicMushrooms.map(mushroom => ({
            ...mushroom,
            allSpecimens: mushroom.specimens, // Only public specimens
            publicSpecimens: mushroom.specimens,
            privateSpecimens: [] // No private specimens for non-logged-in users
        }))
    }
    
    // Get private specimens only if user is logged in
    const privateSpecimens = getPrivateSpecimens()
    
    // Combine public mushrooms with private specimens for logged-in users
    const combinedMushrooms = publicMushrooms.map(mushroom => {
        const privateSpecs = privateSpecimens[mushroom.id] || []
        
        return {
            ...mushroom,
            allSpecimens: [...mushroom.specimens, ...privateSpecs], // Combined for display
            publicSpecimens: mushroom.specimens, // Keep track of public ones
            privateSpecimens: privateSpecs // Keep track of private ones
        }
    })
    
    return combinedMushrooms
}

// Get a single mushroom by ID with all specimens
export const getMushroomById = (id) => {
    const publicMushrooms = getAllMushrooms()
    const mushroom = publicMushrooms.find(m => m.id === parseInt(id))
    
    if (!mushroom) {
        console.warn(`Mushroom with ID ${id} not found`)
        return null
    }
    
    // Only add private specimens if user is logged in
    if (!isLoggedIn()) {
        return {
            ...mushroom,
            allSpecimens: mushroom.specimens, // Only public specimens
            publicSpecimens: mushroom.specimens,
            privateSpecimens: [] // No private specimens for non-logged-in users
        }
    }
    
    // Add private specimens to the mushroom for logged-in users
    const privateSpecimens = getPrivateSpecimens()
    const privateSpecs = privateSpecimens[mushroom.id] || []
    
    return {
        ...mushroom,
        allSpecimens: [...mushroom.specimens, ...privateSpecs],
        publicSpecimens: mushroom.specimens,
        privateSpecimens: privateSpecs
    }
}

// Search mushrooms by term (searches public database)
export const searchMushrooms = (searchTerm) => {
    const mushrooms = getAllMushrooms()
    const term = searchTerm.toLowerCase()
    
    return mushrooms.filter(mushroom =>
        mushroom.title.toLowerCase().includes(term) ||
        mushroom.description.toLowerCase().includes(term) ||
        (mushroom.scientificName && mushroom.scientificName.toLowerCase().includes(term)) ||
        (mushroom.edibility && mushroom.edibility.toLowerCase().includes(term)) ||
        (mushroom.habitat && mushroom.habitat.toLowerCase().includes(term))
    )
}

// Search all mushrooms including private specimens
export const searchAllMushrooms = (searchTerm) => {
    const allMushrooms = getAllMushroomsWithUserData()
    const term = searchTerm.toLowerCase()
    
    return allMushrooms.filter(mushroom =>
        mushroom.title.toLowerCase().includes(term) ||
        mushroom.description.toLowerCase().includes(term) ||
        (mushroom.scientificName && mushroom.scientificName.toLowerCase().includes(term)) ||
        (mushroom.edibility && mushroom.edibility.toLowerCase().includes(term)) ||
        (mushroom.habitat && mushroom.habitat.toLowerCase().includes(term))
    )
}

// Add a specimen to a mushroom (public or private based on privacy setting)
// Geocoding function using Nominatim (OpenStreetMap's geocoding service)
const geocodeLocation = async (locationString) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        } else {
            throw new Error('Location not found');
        }
    } catch (err) {
        throw new Error('Geocoding failed: ' + err.message);
    }
};

// Enhanced function that geocodes location before storing
export const addSpecimenToMushroomWithGeocoding = async (mushroomId, specimenData, isPrivate = true) => {
    const parsedId = parseInt(mushroomId)
    
    // Try to geocode the location if provided
    let coordinates = null;
    let hasGeolocation = false;
    
    if (specimenData.location && specimenData.location.trim() !== '') {
        try {
            coordinates = await geocodeLocation(specimenData.location);
            hasGeolocation = true;
        } catch (error) {
            console.warn('Failed to geocode location:', specimenData.location, error);
            // Continue without coordinates
        }
    }
    
    // Create the specimen submission object with geocoded coordinates
    const specimenSubmission = {
        id: Date.now(),
        mushroomId: parsedId,
        imageUrl: specimenData.imageUrl || '',
        location: specimenData.location || '',
        latitude: coordinates ? coordinates.lat : (specimenData.latitude || ''),
        longitude: coordinates ? coordinates.lng : (specimenData.longitude || ''),
        hasGeolocation: hasGeolocation || specimenData.hasGeolocation || false,
        date: specimenData.date || new Date().toISOString().split('T')[0],
        notes: specimenData.notes || '',
        findDate: specimenData.date || new Date().toISOString().split('T')[0],
        addedBy: specimenData.addedBy || 'Anonymous',
        dateAdded: new Date().toISOString(),
        privacy: isPrivate ? 'private' : 'public'
    }
    
    if (isPrivate) {
        // Add to private database
        const privateSpecimens = getPrivateSpecimens()
        
        if (!privateSpecimens[parsedId]) {
            privateSpecimens[parsedId] = []
        }
        
        privateSpecimens[parsedId].push(specimenSubmission)
        
        // Save to user-specific key
        if (isLoggedIn()) {
            const session = getCurrentSession()
            if (session && session.username) {
                const key = `privateMushroomSpecimens_${session.username}`
                localStorage.setItem(key, JSON.stringify(privateSpecimens))
            }
        }
        
    } else {
        // Add to public database
        const publicMushrooms = getAllMushrooms()
        const mushroomIndex = publicMushrooms.findIndex(m => m.id === parsedId)
        
        if (mushroomIndex !== -1) {
            if (!publicMushrooms[mushroomIndex].specimens) {
                publicMushrooms[mushroomIndex].specimens = []
            }
            
            publicMushrooms[mushroomIndex].specimens.push(specimenSubmission)
            localStorage.setItem('publicMushroomDatabase', JSON.stringify(publicMushrooms))
        }
    }
    
    return specimenSubmission
}

export const addSpecimenToMushroom = (mushroomId, specimenData, isPrivate = true) => {
    const parsedId = parseInt(mushroomId)
    
    // Create the specimen submission object
    const specimenSubmission = {
        id: Date.now(),
        mushroomId: parsedId,
        imageUrl: specimenData.imageUrl || '',
        location: specimenData.location || '',
        date: specimenData.date || new Date().toISOString().split('T')[0],
        notes: specimenData.notes || '',
        findDate: specimenData.date || new Date().toISOString().split('T')[0],
        addedBy: specimenData.addedBy || 'Anonymous',
        dateAdded: new Date().toISOString(),
        latitude: specimenData.latitude || '',
        longitude: specimenData.longitude || '',
        hasGeolocation: specimenData.hasGeolocation || false,
        privacy: isPrivate ? 'private' : 'public'
    }
    
    if (isPrivate) {
        // Add to private database
        const privateSpecimens = getPrivateSpecimens()
        
        if (!privateSpecimens[parsedId]) {
            privateSpecimens[parsedId] = []
        }
        
        privateSpecimens[parsedId].push(specimenSubmission)
        
        // Save to user-specific key
        if (isLoggedIn()) {
            const session = getCurrentSession()
            if (session && session.username) {
                const key = `privateMushroomSpecimens_${session.username}`
                localStorage.setItem(key, JSON.stringify(privateSpecimens))
            }
        }
        
    } else {
        // Add to public database
        const publicMushrooms = getAllMushrooms()
        const mushroomIndex = publicMushrooms.findIndex(m => m.id === parsedId)
        
        if (mushroomIndex !== -1) {
            if (!publicMushrooms[mushroomIndex].specimens) {
                publicMushrooms[mushroomIndex].specimens = []
            }
            
            publicMushrooms[mushroomIndex].specimens.push(specimenSubmission)
            localStorage.setItem('publicMushroomDatabase', JSON.stringify(publicMushrooms))
        }
    }
    
    return specimenSubmission
}

// Get specimens for a specific mushroom (combines public and private)
export const getSpecimensForMushroom = (mushroomId) => {
    const parsedId = parseInt(mushroomId)
    
    // Get public specimens
    const publicMushrooms = getAllMushrooms()
    const mushroom = publicMushrooms.find(m => m.id === parsedId)
    const publicSpecimens = mushroom?.specimens || []
    
    // Only get private specimens if user is logged in
    if (!isLoggedIn()) {
        return {
            public: publicSpecimens,
            private: [], // No private specimens for non-logged-in users
            all: publicSpecimens // Only public specimens
        }
    }
    
    // Get private specimens for logged-in users
    const privateSpecimens = getPrivateSpecimens()
    const privateSpecs = privateSpecimens[parsedId] || []
    
    return {
        public: publicSpecimens,
        private: privateSpecs,
        all: [...publicSpecimens, ...privateSpecs]
    }
}

// Get all user's specimens across all mushrooms
export const getAllUserSpecimens = (username) => {
    const privateSpecimens = getPrivateSpecimens()
    const publicMushrooms = getAllMushrooms()
    
    let userSpecimens = []
    
    // Get user's private specimens
    Object.entries(privateSpecimens).forEach(([mushroomId, specimens]) => {
        const mushroom = publicMushrooms.find(m => m.id === parseInt(mushroomId))
        if (mushroom) {
            specimens.forEach(specimen => {
                if (!username || specimen.addedBy === username) {
                    userSpecimens.push({
                        ...specimen,
                        mushroomTitle: mushroom.title,
                        mushroomScientificName: mushroom.scientificName,
                        mushroomId: mushroom.id
                    })
                }
            })
        }
    })
    
    // Get user's public specimens
    publicMushrooms.forEach(mushroom => {
        if (mushroom.specimens) {
            mushroom.specimens.forEach(specimen => {
                if (!username || specimen.addedBy === username) {
                    userSpecimens.push({
                        ...specimen,
                        mushroomTitle: mushroom.title,
                        mushroomScientificName: mushroom.scientificName,
                        mushroomId: mushroom.id
                    })
                }
            })
        }
    })
    
    return userSpecimens.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
}

// Add a completely new mushroom species to the public database
export const addNewMushroomSpecies = (mushroomData) => {
    if (!isLoggedIn()) {
        throw new Error('Must be logged in to add new mushroom species')
    }

    const publicMushrooms = getAllMushrooms()
    
    // Generate new ID
    const newId = Math.max(...publicMushrooms.map(m => m.id), 0) + 1
    
    const newMushroom = {
        id: newId,
        title: mushroomData.title || mushroomData.name,
        name: mushroomData.name || mushroomData.title,
        scientificName: mushroomData.scientificName || '',
        image: mushroomData.image || mushroomData.imageUrl || '',
        description: mushroomData.description || '',
        edibility: mushroomData.edibility || 'unknown',
        habitat: mushroomData.habitat || '',
        season: mushroomData.season || '',
        size: mushroomData.size || '',
        color: mushroomData.color || '',
        texture: mushroomData.texture || '',
        sporeColor: mushroomData.sporeColor || '',
        distribution: mushroomData.distribution || '',
        growingConditions: mushroomData.growingConditions || '',
        culinaryUses: mushroomData.culinaryUses || '',
        similarSpecies: mushroomData.similarSpecies || '',
        specimens: [], // Initialize empty specimens array
        contributedBy: getCurrentSession()?.username || 'Anonymous',
        dateContributed: new Date().toISOString(),
        verified: false // New species need verification
    }
    
    publicMushrooms.push(newMushroom)
    localStorage.setItem('publicMushroomDatabase', JSON.stringify(publicMushrooms))
    
    return newMushroom
}

// Legacy functions to maintain compatibility
export const addMushroom = (mushroomData) => {
    // For now, redirect to adding a specimen to an existing mushroom
    // This could be expanded to add entirely new mushroom species to the public database
    console.warn('addMushroom is deprecated, use addSpecimenToMushroom instead')
    return null
}

export const updateMushroom = (id, updates) => {
    // This could be used to update mushroom metadata in the public database
    console.warn('updateMushroom not implemented in new structure')
    return null
}

export const deleteMushroom = (id) => {
    // This could be used to remove mushrooms from public database (admin function)
    console.warn('deleteMushroom not implemented in new structure')
    return []
}
