import { useContext, useState, useEffect } from 'react'
import { Container, Alert, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import AuthContext from '../contexts/AuthContext'
import MushroomListCard from './MushroomListCard'
import { getAllUserSpecimens } from '../services/mushroomService'

export default function MushList() {
    const [authStatus] = useContext(AuthContext)
    const [userSpecimens, setUserSpecimens] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (authStatus) {
            // Load user's specimens from the new database structure
            const specimens = getAllUserSpecimens(authStatus.username)
            setUserSpecimens(specimens)
        }
    }, [authStatus])

    if (!authStatus) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    <Alert.Heading>Authentication Required</Alert.Heading>
                    <p>You need to be logged in to view your mushroom collection.</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button as={Link} to="/login" variant="outline-primary">
                            Go to Login
                        </Button>
                    </div>
                </Alert>
            </Container>
        )
    }

    return (
        <Container className="mt-4">
            <div className="mb-4">
                <h1 className="text-primary fw-bold">My Mushroom Collection</h1>
                <p className="text-muted mb-0">Welcome back, {authStatus.username}!</p>
            </div>
            
            {userSpecimens.length === 0 ? (
                <Alert variant="info" className="text-center py-5">
                    <Alert.Heading className="h3">No specimens in your collection yet!</Alert.Heading>
                    <p className="mb-3">Start building your mushroom collection by adding specimen findings.</p>
                    <hr />
                    <div className="d-flex justify-content-center">
                        <Button as={Link} to="/add" variant="primary" size="lg">
                            Add New Specimen
                        </Button>
                    </div>
                </Alert>
            ) : (
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="text-muted mb-0">
                                You have {userSpecimens.length} specimen{userSpecimens.length !== 1 ? 's' : ''} in your collection
                            </p>
                            <small className="text-muted">
                                Click any card to view the mushroom species details
                            </small>
                        </div>
                        
                        {userSpecimens.map((specimen) => (
                            <div key={specimen.id} className="card mb-3">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3">
                                            {specimen.imageUrl ? (
                                                <img 
                                                    src={specimen.imageUrl} 
                                                    alt={specimen.mushroomTitle}
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="bg-light rounded d-flex align-items-center justify-content-center" 
                                                     style={{ height: '150px' }}>
                                                    <span className="text-muted">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-9">
                                            <h5 className="card-title">{specimen.mushroomTitle}</h5>
                                            <p className="text-muted fst-italic">{specimen.mushroomScientificName}</p>
                                            <p className="card-text">
                                                <strong>Location:</strong> {specimen.location}<br/>
                                                <strong>Date Found:</strong> {specimen.date}<br/>
                                                <strong>Privacy:</strong> {specimen.privacy === 'private' ? 'Private' : 'Public'}<br/>
                                                {specimen.notes && (
                                                    <>
                                                        <strong>Notes:</strong> {specimen.notes}
                                                    </>
                                                )}
                                            </p>
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                onClick={() => navigate(`/details/${specimen.mushroomId}`)}
                                            >
                                                View Species Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Col>
                </Row>
            )}
        </Container>
    )
}