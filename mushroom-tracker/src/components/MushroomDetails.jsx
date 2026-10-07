import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router'
import Mushroom from './Mushroom'
import { getAllMushroomsWithUserData } from '../services/mushroomService'

export default function MushroomDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [selectedMushroom, setSelectedMushroom] = useState(null)
    const [allMushrooms, setAllMushrooms] = useState([])

    useEffect(() => {
        // Get all mushrooms including user data
        const mushrooms = getAllMushroomsWithUserData()
        console.log('Loaded all mushrooms including user data:', mushrooms.length)
        
        setAllMushrooms(mushrooms)
        
        if (id) {
            console.log('Looking for mushroom with ID:', id)
            // Find mushroom by ID from URL parameter
            const mushroom = mushrooms.find(m => m.id === parseInt(id))
            console.log('Found mushroom:', mushroom)
            
            if (mushroom) {
                setSelectedMushroom(mushroom)
            } else {
                console.warn('Mushroom not found, redirecting to browse page')
                // Mushroom not found, redirect to browse page instead of details to avoid loop
                navigate('/browse')
            }
        } else {
            // No ID specified, show first mushroom from database
            if (mushrooms.length > 0) {
                console.log('No ID specified, showing first mushroom:', mushrooms[0])
                setSelectedMushroom(mushrooms[0])
            } else {
                console.warn('No mushrooms found in database')
            }
        }
    }, [id, navigate])

    if (!selectedMushroom) {
        return (
            <Container className="mt-4">
                <Alert variant="info">
                    <Alert.Heading>Loading Mushroom Details...</Alert.Heading>
                    <p>Please wait while we load the mushroom information.</p>
                </Alert>
            </Container>
        )
    }

    return (
        <Container className="mt-4">
            {!id && (
                <Row className="mb-4">
                    <Col>
                        <h2>Mushroom Detail View</h2>
                        <p className="text-muted">Select a mushroom to view detailed information:</p>
                        <ButtonGroup className="mb-3 flex-wrap">
                            {detailedMushrooms.map((mushroom) => (
                                <Button
                                    key={mushroom.id}
                                    variant={selectedMushroom.id === mushroom.id ? "primary" : "outline-primary"}
                                    onClick={() => setSelectedMushroom(mushroom)}
                                    size="sm"
                                >
                                    {mushroom.title}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Col>
                </Row>
            )}
            
            {id && (
                <Row className="mb-3">
                    <Col>
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => navigate(-1)}
                            className="mb-3"
                        >
                            ← Back
                        </Button>
                    </Col>
                </Row>
            )}
            
            <Mushroom mushroom={selectedMushroom} />
        </Container>
    )
}
