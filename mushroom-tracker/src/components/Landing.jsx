import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

export default function Landing() {
    const [authStatus] = useContext(AuthContext)

    return (
        <Container className="py-5">
            {/* Hero Section */}
            <div className="text-center mb-5">
                <h1 className="display-4 mb-3">Mushroom Tracker</h1>
                <p className="lead mb-4">
                    Your comprehensive tool for identifying, cataloging, and learning about mushrooms.
                    Explore our database, build your personal collection, and enhance your mycology knowledge.
                </p>
                {!authStatus && (
                    <div className="mb-4">
                        <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
                            Login
                        </Button>
                        <Button as={Link} to="/register" variant="outline-primary" size="lg">
                            Register
                        </Button>
                    </div>
                )}
            </div>

            {/* Feature Cards */}
            <Row className="g-4">
                {/* Browse Mushrooms */}
                <Col sm={6} lg={3}>
                    <Card className="h-100 shadow-sm hover-card">
                        <Card.Body className="text-center">
                            <div className="mb-3" style={{ fontSize: '3rem' }}>📚</div>
                            <Card.Title>Browse Mushrooms</Card.Title>
                            <Card.Text>
                                Explore our comprehensive database of mushrooms with detailed information, 
                                images, and safety guidelines.
                            </Card.Text>
                            <Button as={Link} to="/browse" variant="primary" className="mt-auto">
                                Start Browsing
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Search Functionality */}
                <Col sm={6} lg={3}>
                    <Card className="h-100 shadow-sm hover-card">
                        <Card.Body className="text-center">
                            <div className="mb-3" style={{ fontSize: '3rem', fontWeight: 'bold' }}>Search</div>
                            <Card.Title>Search & Identify</Card.Title>
                            <Card.Text>
                                Quickly find specific mushrooms by name or description. 
                                Perfect for field identification and research.
                            </Card.Text>
                            <Button as={Link} to="/search" variant="primary" className="mt-auto">
                                Search Now
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Personal Collection - Only show if logged in */}
                {authStatus && (
                    <Col sm={6} lg={3}>
                        <Card className="h-100 shadow-sm hover-card">
                            <Card.Body className="text-center">
                                <div className="mb-3" style={{ fontSize: '3rem', fontWeight: 'bold' }}>Track</div>
                                <Card.Title>My Collection</Card.Title>
                                <Card.Text>
                                    View and manage your personal mushroom findings. 
                                    Track locations, dates, and personal observations.
                                </Card.Text>
                                <Button as={Link} to="/list" variant="success" className="mt-auto">
                                    View Collection
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Add Mushroom - Only show if logged in */}
                {authStatus && (
                    <Col sm={6} lg={3}>
                        <Card className="h-100 shadow-sm hover-card">
                            <Card.Body className="text-center">
                                <div className="mb-3" style={{ fontSize: '3rem', fontWeight: 'bold' }}>Add</div>
                                <Card.Title>Add Discovery</Card.Title>
                                <Card.Text>
                                    Record a new mushroom discovery with location, date, 
                                    habitat details, and personal notes.
                                </Card.Text>
                                <Button as={Link} to="/add" variant="success" className="mt-auto">
                                    Add Mushroom
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Authentication Card - Only show if not logged in */}
                {!authStatus && (
                    <Col sm={6} lg={3}>
                        <Card className="h-100 shadow-sm hover-card border-warning">
                            <Card.Body className="text-center">
                                <div className="mb-3" style={{ fontSize: '3rem', fontWeight: 'bold' }}>Secure</div>
                                <Card.Title>Join the Community</Card.Title>
                                <Card.Text>
                                    Create an account to build your personal mushroom collection, 
                                    track your discoveries, and access advanced features.
                                </Card.Text>
                                <div className="d-grid gap-2">
                                    <Button as={Link} to="/register" variant="warning">
                                        Sign Up Free
                                    </Button>
                                    <Button as={Link} to="/login" variant="outline-warning">
                                        Already a Member?
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Safety Warning */}
            <Row className="mt-5">
                <Col>
                    <Card className="border-danger">
                        <Card.Header className="bg-danger text-white">
                            <h5 className="mb-0">Important Safety Notice</h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="mb-2">
                                <strong>Never consume any mushroom without expert identification.</strong> 
                                Many edible mushrooms have poisonous look-alikes that can cause serious illness or death.
                            </p>
                            <ul className="mb-0 small">
                                <li>Always consult multiple reliable sources and experts before consuming wild mushrooms</li>
                                <li>When in doubt, don't consume - it's better to be safe than sorry</li>
                                <li>This application is for educational purposes and should not be used as the sole source for mushroom identification</li>
                                <li>Consider joining local mycological societies for hands-on learning with experts</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Welcome Message for Logged In Users */}
            {authStatus && (
                <Row className="mt-4">
                    <Col>
                        <Card className="bg-light">
                            <Card.Body className="text-center">
                                <h5>Welcome back, {authStatus.username}! 👋</h5>
                                <p className="mb-0">
                                    Ready to explore the fascinating world of mycology? 
                                    Check out your collection or discover new species in our database.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    )
}
