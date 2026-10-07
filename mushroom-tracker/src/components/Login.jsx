import { useRef, useContext, useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router'
import AuthContext from '../contexts/AuthContext'
import { authenticateUser } from '../services/authService'

export default function Login() {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [authStatus, setAuthStatus] = useContext(AuthContext)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const username = usernameRef.current.value.trim()
        const password = passwordRef.current.value
        
        // Basic validation
        if (!username || !password) {
            setError('Please enter both username and password.')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Use the authentication service
            const authData = authenticateUser(username, password)
            setAuthStatus(authData)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // If already logged in, redirect to home
    if (authStatus) {
        navigate('/')
        return null
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Header className="text-center">
                    <h3>Login to Mushroom Tracker</h3>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="login-username">Username</Form.Label>
                            <Form.Control 
                                id="login-username"
                                type="text" 
                                ref={usernameRef}
                                placeholder="Enter username"
                                required
                                disabled={isLoading}
                                aria-describedby="username-demo-help"
                            />
                            <Form.Text id="username-demo-help" className="text-muted">
                                Demo: username "demo", password "password"
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="login-password">Password</Form.Label>
                            <Form.Control 
                                id="login-password"
                                type="password" 
                                ref={passwordRef}
                                placeholder="Enter password"
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <div className="d-grid mb-3">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>

                        <div className="text-center">
                            <small>
                                Don't have an account? <Link to="/register">Register here</Link>
                            </small>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}