import { useRef, useContext, useState, useEffect } from 'react'
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router'
import AuthContext from '../contexts/AuthContext'
import { getAllMushrooms, addSpecimenToMushroom, addNewMushroomSpecies } from '../services/mushroomService'

export default function AddMushroom() {
    const nameRef = useRef()
    const scientificNameRef = useRef()
    const imageUrlRef = useRef()
    const locationRef = useRef()
    const dateRef = useRef()
    const notesRef = useRef()
    const [authStatus] = useContext(AuthContext)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [edibility, setEdibility] = useState('')
    const [habitat, setHabitat] = useState('')
    const [privacy, setPrivacy] = useState('private')
    const [submissionType, setSubmissionType] = useState('specimen') // 'specimen' or 'new-species'
    const [includeLocation, setIncludeLocation] = useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [description, setDescription] = useState('')
    const [season, setSeason] = useState('')
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [texture, setTexture] = useState('')
    const [sporeColor, setSporeColor] = useState('')
    const [distribution, setDistribution] = useState('')
    const [growingConditions, setGrowingConditions] = useState('')
    const [culinaryUses, setCulinaryUses] = useState('')
    const [similarSpecies, setSimilarSpecies] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    // Handle prefilled data from navigation state and set default date
    useEffect(() => {
        // Set current date as default
        if (dateRef.current) {
            const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
            dateRef.current.value = today
        }

        if (location.state?.prefillData) {
            const { 
                title, 
                scientificName, 
                edibility: prefillEdibility, 
                habitat: prefillHabitat,
                season,
                size,
                color,
                texture,
                sporeColor,
                distribution,
                growingConditions,
                culinaryUses,
                similarSpecies
            } = location.state.prefillData
            
            if (nameRef.current) nameRef.current.value = title || ''
            if (scientificNameRef.current) scientificNameRef.current.value = scientificName || ''
            setEdibility(prefillEdibility || '')
            setHabitat(prefillHabitat || '')
            
            // Store additional data for potential future use (not displayed in form but could be used for specimen matching)
            // These fields are kept for reference but aren't shown in the add form since they're species-level data
        }
    }, [location.state])

    // Redirect if not logged in
    if (!authStatus) {
        navigate('/login')
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const name = nameRef.current.value.trim()
        const scientificName = scientificNameRef.current.value.trim()
        const imageUrl = imageUrlRef.current.value.trim()
        const location = locationRef.current.value.trim()
        const date = dateRef.current.value
        const notes = notesRef.current.value.trim()
        
        // Basic validation
        if (!name || !location || !date) {
            setError('Please fill in all required fields (Name, Location, and Date).')
            return
        }

        // Validate coordinates if location is included
        if (includeLocation) {
            if (!latitude || !longitude) {
                setError('Please provide both latitude and longitude when including location coordinates.')
                return
            }
            
            const lat = parseFloat(latitude)
            const lng = parseFloat(longitude)
            
            if (isNaN(lat) || isNaN(lng)) {
                setError('Latitude and longitude must be valid numbers.')
                return
            }
            
            if (lat < -90 || lat > 90) {
                setError('Latitude must be between -90 and 90 degrees.')
                return
            }
            
            if (lng < -180 || lng > 180) {
                setError('Longitude must be between -180 and 180 degrees.')
                return
            }
        }

        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            if (submissionType === 'new-species') {
                // Create a new mushroom species
                const newMushroomData = {
                    title: name,
                    name: name,
                    scientificName: scientificName,
                    image: imageUrl,
                    description: description,
                    edibility: edibility,
                    habitat: habitat,
                    season: season,
                    size: size,
                    color: color,
                    texture: texture,
                    sporeColor: sporeColor,
                    distribution: distribution,
                    growingConditions: growingConditions,
                    culinaryUses: culinaryUses,
                    similarSpecies: similarSpecies
                }
                
                const newMushroom = addNewMushroomSpecies(newMushroomData)
                
                // Also add the current observation as a specimen to this new species
                const specimenData = {
                    id: Date.now(),
                    name: name,
                    scientificName: scientificName,
                    imageUrl: imageUrl,
                    location: location,
                    date: date,
                    notes: notes,
                    edibility: edibility,
                    habitat: habitat,
                    privacy,
                    includeLocation,
                    hasGeolocation: includeLocation && latitude && longitude,
                    latitude: includeLocation ? latitude : '',
                    longitude: includeLocation ? longitude : '',
                    addedBy: authStatus.username,
                    dateAdded: new Date().toISOString()
                }
                
                const isPrivate = privacy === 'private'
                addSpecimenToMushroom(newMushroom.id, specimenData, isPrivate)
                
                setSuccess(`New mushroom species "${name}" added to the public database! Your specimen has been added as ${isPrivate ? 'private' : 'public'}. The species will be reviewed by moderators.`)
                
            } else {
                // Regular specimen submission to existing mushroom
                const specimenData = {
                    id: Date.now(),
                    name,
                    scientificName,
                    imageUrl,
                    location,
                    date,
                    notes,
                    edibility,
                    habitat,
                    privacy,
                    includeLocation,
                    hasGeolocation: includeLocation && latitude && longitude,
                    latitude: includeLocation ? latitude : '',
                    longitude: includeLocation ? longitude : '',
                    addedBy: authStatus.username,
                    dateAdded: new Date().toISOString()
                }

                // Check if this is a specimen of an existing mushroom from the public database
                const publicMushrooms = getAllMushrooms()
                const mushroomMatch = publicMushrooms.find(m => 
                    m.title?.toLowerCase() === name.toLowerCase() && 
                    m.scientificName?.toLowerCase() === scientificName.toLowerCase()
                )

                if (mushroomMatch) {
                    // This is a specimen of a public database mushroom
                    const isPrivate = privacy === 'private'
                    addSpecimenToMushroom(mushroomMatch.id, specimenData, isPrivate)
                    
                    const privacyText = isPrivate ? 'private' : 'public'
                    setSuccess(`${privacyText} specimen added successfully to ${mushroomMatch.title}! ${isPrivate ? 'Only you can see this specimen.' : 'This specimen is now visible to all users.'}`)
                } else {
                    setError('Mushroom species not found in database. Please try "Add New Species" if this is a species not yet in our database.')
                    setIsLoading(false)
                    return
                }
            }
            
            // Clear form
            clearForm()
            
            // Navigate to mushroom list after a short delay
            setTimeout(() => {
                navigate('/list')
            }, 1500)
            
        } catch (error) {
            setError(error.message || 'An error occurred while adding the mushroom.')
        } finally {
            setIsLoading(false)
        }
    }
    
    const clearForm = () => {
        nameRef.current.value = ''
        scientificNameRef.current.value = ''
        imageUrlRef.current.value = ''
        locationRef.current.value = ''
        dateRef.current.value = ''
        notesRef.current.value = ''
        setEdibility('')
        setHabitat('')
        setPrivacy('private')
        setSubmissionType('specimen')
        setIncludeLocation(false)
        setLatitude('')
        setLongitude('')
        setDescription('')
        setSeason('')
        setSize('')
        setColor('')
        setTexture('')
        setSporeColor('')
        setDistribution('')
        setGrowingConditions('')
        setCulinaryUses('')
        setSimilarSpecies('')
    }

    return (
        <Container fluid className="mt-3 px-2 px-md-3 px-lg-4 px-xl-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <style>
                {`
                .large-checkbox input[type="checkbox"] {
                    width: 1.5rem !important;
                    height: 1.5rem !important;
                    border: 2px solid #495057 !important;
                    border-radius: 0.375rem !important;
                    background-color: #ffffff !important;
                }
                .large-checkbox input[type="checkbox"]:checked {
                    background-color: #0d6efd !important;
                    border-color: #0d6efd !important;
                }
                .large-checkbox input[type="checkbox"]:focus {
                    border-color: #0d6efd !important;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
                }
                `}
            </style>
            <div className="mb-4 text-center">
                <h2 className="text-primary fw-bold">Add New Mushroom</h2>
                <p className="text-muted">
                    {submissionType === 'specimen' 
                        ? 'Record your mushroom findings'
                        : 'Contribute a new species to the community database'}
                </p>
            </div>
            
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {success && <Alert variant="success" className="mb-3">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                        {/* Submission Type Selection */}
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">What would you like to add?</Form.Label>
                            <div className="d-flex gap-3 mt-2">
                                <Form.Check
                                    type="radio"
                                    id="specimen-radio"
                                    name="submissionType"
                                    label="Add Specimen to Existing Species"
                                    checked={submissionType === 'specimen'}
                                    onChange={() => setSubmissionType('specimen')}
                                    disabled={isLoading}
                                />
                                <Form.Check
                                    type="radio"
                                    id="new-species-radio"
                                    name="submissionType"
                                    label="Add New Species to Database"
                                    checked={submissionType === 'new-species'}
                                    onChange={() => setSubmissionType('new-species')}
                                    disabled={isLoading}
                                />
                            </div>
                            <Form.Text className="text-muted">
                                {submissionType === 'specimen' 
                                    ? 'Record your observation of an existing mushroom species' 
                                    : 'Contribute a new mushroom species to the public database (requires more details)'}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="mushroom-name" className="fw-semibold">Common Name *</Form.Label>
                            <Form.Control 
                                id="mushroom-name"
                                type="text" 
                                ref={nameRef}
                                placeholder="e.g., Chanterelle, Morel, etc."
                                required
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                aria-describedby="name-help"
                            />
                            <Form.Text id="name-help" className="visually-hidden">
                                Enter the common name of the mushroom species
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="scientific-name" className="fw-semibold">Scientific Name</Form.Label>
                            <Form.Control 
                                id="scientific-name"
                                type="text" 
                                ref={scientificNameRef}
                                placeholder="e.g., Cantharellus cibarius"
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                aria-describedby="scientific-name-help"
                            />
                            <Form.Text id="scientific-name-help" className="text-muted">
                                Optional: Latin scientific name of the species
                            </Form.Text>
                        </Form.Group>

                        <Row className="g-2 g-md-3">
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="location-found" className="fw-semibold">Location Found *</Form.Label>
                                    <Form.Control 
                                        id="location-found"
                                        type="text" 
                                        ref={locationRef}
                                        placeholder="e.g., Oak forest, Madison, WI"
                                        required
                                        disabled={isLoading}
                                        size="lg"
                                        className="shadow-sm"
                                        style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        aria-describedby="location-help"
                                    />
                                    <Form.Text id="location-help" className="visually-hidden">
                                        Describe where you found this mushroom
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="date-found" className="fw-semibold">Date Found *</Form.Label>
                                    <Form.Control 
                                        id="date-found"
                                        type="date" 
                                        ref={dateRef}
                                        required
                                        disabled={isLoading}
                                        size="lg"
                                        className="shadow-sm"
                                        style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        aria-describedby="date-help"
                                    />
                                    <Form.Text id="date-help" className="visually-hidden">
                                        Select the date when you found this mushroom
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Additional fields for new species - wrapped to prevent layout shift */}
                        <div className={`${submissionType === 'new-species' ? 'd-block' : 'd-none'}`}>
                            <Row className="g-2 g-md-3">
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="edibility-select" className="fw-semibold">Edibility</Form.Label>
                                        <Form.Select 
                                            id="edibility-select"
                                            value={edibility} 
                                            onChange={(e) => setEdibility(e.target.value)}
                                            disabled={isLoading}
                                            size="lg"
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                            aria-describedby="edibility-help"
                                        >
                                            <option value="">Select...</option>
                                            <option value="edible">Edible</option>
                                            <option value="poisonous">Poisonous</option>
                                            <option value="unknown">Unknown</option>
                                            <option value="inedible">Inedible</option>
                                        </Form.Select>
                                        <Form.Text id="edibility-help" className="text-muted">
                                            Select the edibility status if known
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="habitat-select" className="fw-semibold">Habitat</Form.Label>
                                        <Form.Select 
                                            id="habitat-select"
                                            value={habitat} 
                                            onChange={(e) => setHabitat(e.target.value)}
                                            disabled={isLoading}
                                            size="lg"
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                            aria-describedby="habitat-help"
                                        >
                                            <option value="">Select...</option>
                                            <option value="deciduous">Deciduous Forest</option>
                                            <option value="coniferous">Coniferous Forest</option>
                                            <option value="mixed">Mixed Forest</option>
                                            <option value="grassland">Grassland</option>
                                            <option value="urban">Urban Area</option>
                                            <option value="wetland">Wetland</option>
                                            <option value="other">Other</option>
                                        </Form.Select>
                                        <Form.Text id="habitat-help" className="text-muted">
                                            Describe the habitat where you found it
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Alert variant="info" className="mb-3">
                                <Alert.Heading>Adding New Species</Alert.Heading>
                                <p>You're contributing a new mushroom species! Please provide as much detail as possible to help other users identify this species.</p>
                            </Alert>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="description" className="fw-semibold">Description</Form.Label>
                                <Form.Control 
                                    id="description"
                                    as="textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the mushroom's appearance, characteristics, and identifying features..."
                                    disabled={isLoading}
                                    className="shadow-sm"
                                    style={{ borderColor: '#495057', borderWidth: '2px' }}
                                    aria-describedby="description-help"
                                />
                                <Form.Text id="description-help" className="text-muted">
                                    Detailed description helps others identify this species
                                </Form.Text>
                            </Form.Group>

                            <Row className="g-2 g-md-3">
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="season" className="fw-semibold">Growing Season</Form.Label>
                                        <Form.Control 
                                            id="season"
                                            type="text"
                                            value={season}
                                            onChange={(e) => setSeason(e.target.value)}
                                            placeholder="e.g., Spring to Fall, Summer only"
                                            disabled={isLoading}
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="size" className="fw-semibold">Size Range</Form.Label>
                                        <Form.Control 
                                            id="size"
                                            type="text"
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                            placeholder="e.g., 2-8 cm cap diameter"
                                            disabled={isLoading}
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="g-2 g-md-3">
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="color" className="fw-semibold">Color</Form.Label>
                                        <Form.Control 
                                            id="color"
                                            type="text"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            placeholder="e.g., Golden yellow cap, white stem"
                                            disabled={isLoading}
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="texture" className="fw-semibold">Texture</Form.Label>
                                        <Form.Control 
                                            id="texture"
                                            type="text"
                                            value={texture}
                                            onChange={(e) => setTexture(e.target.value)}
                                            placeholder="e.g., Smooth, rough, scaly"
                                            disabled={isLoading}
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="g-2 g-md-3">
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="spore-color" className="fw-semibold">Spore Color</Form.Label>
                                        <Form.Control 
                                            id="spore-color"
                                            type="text"
                                            value={sporeColor}
                                            onChange={(e) => setSporeColor(e.target.value)}
                                            placeholder="e.g., White, brown, black"
                                            disabled={isLoading}
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="distribution" className="fw-semibold">Distribution</Form.Label>
                                        <Form.Control 
                                            id="distribution"
                                            type="text"
                                            value={distribution}
                                            onChange={(e) => setDistribution(e.target.value)}
                                            placeholder="e.g., North America, Europe"
                                            disabled={isLoading}
                                            className="shadow-sm"
                                            style={{ borderColor: '#495057', borderWidth: '2px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="growing-conditions" className="fw-semibold">Growing Conditions</Form.Label>
                                <Form.Control 
                                    id="growing-conditions"
                                    as="textarea"
                                    rows={2}
                                    value={growingConditions}
                                    onChange={(e) => setGrowingConditions(e.target.value)}
                                    placeholder="Describe preferred soil, moisture, temperature conditions..."
                                    disabled={isLoading}
                                    className="shadow-sm"
                                    style={{ borderColor: '#495057', borderWidth: '2px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="culinary-uses" className="fw-semibold">Culinary Uses</Form.Label>
                                <Form.Control 
                                    id="culinary-uses"
                                    as="textarea"
                                    rows={2}
                                    value={culinaryUses}
                                    onChange={(e) => setCulinaryUses(e.target.value)}
                                    placeholder="How is this mushroom used in cooking? (Leave blank if inedible/unknown)"
                                    disabled={isLoading}
                                    className="shadow-sm"
                                    style={{ borderColor: '#495057', borderWidth: '2px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="similar-species" className="fw-semibold">Similar Species</Form.Label>
                                <Form.Control 
                                    id="similar-species"
                                    as="textarea"
                                    rows={2}
                                    value={similarSpecies}
                                    onChange={(e) => setSimilarSpecies(e.target.value)}
                                    placeholder="Describe any similar-looking species and how to distinguish them..."
                                    disabled={isLoading}
                                    className="shadow-sm"
                                    style={{ borderColor: '#495057', borderWidth: '2px' }}
                                />
                            </Form.Group>
                        </div>                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="privacy-select" className="fw-semibold">Privacy Setting</Form.Label>
                            <Form.Select 
                                id="privacy-select"
                                value={privacy} 
                                onChange={(e) => setPrivacy(e.target.value)}
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                aria-describedby="privacy-help"
                            >
                                <option value="private">Private (My Collection Only)</option>
                                <option value="shared">Shared (Public Community List)</option>
                            </Form.Select>
                            <Form.Text id="privacy-help" className="text-muted">
                                Choose whether to share this finding with the community or keep it private
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="image-url" className="fw-semibold">Image URL</Form.Label>
                            <Form.Control 
                                id="image-url"
                                type="url" 
                                ref={imageUrlRef}
                                placeholder="e.g., https://example.com/mushroom-photo.jpg"
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                aria-describedby="image-help"
                            />
                            <Form.Text id="image-help" className="text-muted">
                                Optional: Add a link to a photo of your mushroom finding
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                id="include-location"
                                type="checkbox"
                                label="Include precise location data"
                                checked={includeLocation}
                                onChange={(e) => setIncludeLocation(e.target.checked)}
                                disabled={isLoading}
                                className="mb-3 fw-semibold large-checkbox"
                                aria-describedby="location-checkbox-help"
                            />
                            <Form.Text id="location-checkbox-help" className="visually-hidden">
                                Check this to add latitude and longitude coordinates
                            </Form.Text>
                            {includeLocation && (
                                <Row className="g-2 g-md-3">
                                    <Col xs={12} sm={6}>
                                        <Form.Group>
                                            <Form.Label htmlFor="latitude" className="fw-semibold">Latitude</Form.Label>
                                            <Form.Control
                                                id="latitude"
                                                type="number"
                                                step="any"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                                placeholder="e.g., 43.0731"
                                                disabled={isLoading}
                                                size="lg"
                                                className="shadow-sm"
                                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                                aria-describedby="latitude-help"
                                            />
                                            <Form.Text id="latitude-help" className="visually-hidden">
                                                Enter the latitude coordinate where you found the mushroom
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group>
                                            <Form.Label htmlFor="longitude" className="fw-semibold">Longitude</Form.Label>
                                            <Form.Control
                                                id="longitude"
                                                type="number"
                                                step="any"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                                placeholder="e.g., -89.4012"
                                                disabled={isLoading}
                                                size="lg"
                                                className="shadow-sm"
                                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                                aria-describedby="longitude-help"
                                            />
                                            <Form.Text id="longitude-help" className="visually-hidden">
                                                Enter the longitude coordinate where you found the mushroom
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label htmlFor="mushroom-notes" className="fw-semibold">Notes</Form.Label>
                            <Form.Control 
                                id="mushroom-notes"
                                as="textarea" 
                                rows={4}
                                ref={notesRef}
                                placeholder="Additional observations, description, conditions, etc."
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ resize: 'vertical', borderColor: '#495057', borderWidth: '2px' }}
                                aria-describedby="notes-help"
                            />
                            <Form.Text id="notes-help" className="text-muted">
                                Optional: Add any additional observations about this mushroom finding
                            </Form.Text>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                size="lg"
                                disabled={isLoading}
                                className="py-3 fw-semibold shadow-sm"
                                style={{ fontSize: '1.1rem' }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {submissionType === 'new-species' ? 'Adding New Species...' : 'Adding Specimen...'}
                                    </>
                                ) : (
                                    submissionType === 'new-species' ? 'Add New Species' : 'Add Specimen'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Container>
            )
}
