// Authentication service using sessionStorage for faux user management

// Initialize user database in localStorage (persistent across sessions)
export const initializeUserDatabase = () => {
    const existingUsers = localStorage.getItem('registeredUsers')
    
    if (!existingUsers) {
        // Initialize with demo user
        const initialUsers = [
            {
                username: 'demo',
                password: 'password', // In real app, this would be hashed
                email: 'demo@example.com',
                registeredDate: new Date().toISOString()
            }
        ]
        
        localStorage.setItem('registeredUsers', JSON.stringify(initialUsers))
        console.log('User database initialized with demo users')
    }
    
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
}

// Get all registered users
export const getRegisteredUsers = () => {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
}

// Check if username already exists
export const userExists = (username) => {
    const users = getRegisteredUsers()
    return users.some(user => user.username.toLowerCase() === username.toLowerCase())
}

// Register a new user
export const registerUser = (userData) => {
    const users = getRegisteredUsers()
    
    // Check if user already exists
    if (userExists(userData.username)) {
        throw new Error('Username already exists. Please choose a different username.')
    }
    
    // Create new user
    const newUser = {
        ...userData,
        registeredDate: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(users))
    
    return newUser
}

// Authenticate user login
export const authenticateUser = (username, password) => {
    const users = getRegisteredUsers()
    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
    )
    
    if (!user) {
        throw new Error('Invalid username or password.')
    }
    
    // Create session data
    const sessionData = {
        username: user.username,
        email: user.email,
        token: `session-${Date.now()}`, // Mock token
        loginTime: new Date().toISOString()
    }
    
    // Store in sessionStorage (persists until browser closes or logout)
    sessionStorage.setItem('mushroomTrackerAuth', JSON.stringify(sessionData))
    
    return sessionData
}

// Get current session
export const getCurrentSession = () => {
    const sessionData = sessionStorage.getItem('mushroomTrackerAuth')
    return sessionData ? JSON.parse(sessionData) : null
}

// Logout user
export const logoutUser = () => {
    sessionStorage.removeItem('mushroomTrackerAuth')
}

// Check if user is logged in
export const isLoggedIn = () => {
    return getCurrentSession() !== null
}
