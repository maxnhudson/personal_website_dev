import { Container, Row, Col, Card, Badge, ListGroup, Alert, Carousel, Button } from 'react-bootstrap'
import SpecimenMap from './SpecimenMap'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getSpecimensForMushroom } from '../services/mushroomService'

export default function Mushroom({ mushroom }) {
    const [userSpecimens, setUserSpecimens] = useState([])
    const [sharedSpecimens, setSharedSpecimens] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (mushroom) {
            // Get specimens for this mushroom from the new database structure
            const specimensData = getSpecimensForMushroom(mushroom.id)
            
            if (specimensData) {
                // Get all specimens (with and without images for the map)
                const publicSpecs = specimensData.public || []
                const privateSpecs = specimensData.private || []
                
                // For carousel display, filter only those with images
                const publicSpecsWithImages = publicSpecs.filter(s => s.imageUrl && s.imageUrl.trim() !== '')
                const privateSpecsWithImages = privateSpecs.filter(s => s.imageUrl && s.imageUrl.trim() !== '')
                
                setUserSpecimens([...publicSpecsWithImages, ...privateSpecsWithImages])
                setSharedSpecimens([...publicSpecs, ...privateSpecs]) // All specimens for map
            }
        }
    }, [mushroom])

    if (!mushroom) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    <Alert.Heading>No Mushroom Data</Alert.Heading>
                    <p>No mushroom information available to display.</p>
                </Alert>
            </Container>
        )
    }

    const getEdibilityVariant = (edibility) => {
        switch (edibility?.toLowerCase()) {
            case 'edible': return 'success'
            case 'poisonous': return 'danger'
            case 'toxic': return 'danger'
            case 'inedible': return 'warning'
            case 'unknown': return 'secondary'
            default: return 'secondary'
        }
    }

    const getSafetyLevel = (edibility) => {
        switch (edibility?.toLowerCase()) {
            case 'edible': return { text: 'Safe to Eat', variant: 'success' }
            case 'poisonous': 
            case 'toxic': return { text: 'DANGEROUS - Do Not Eat', variant: 'danger' }
            case 'inedible': return { text: 'Not Recommended', variant: 'warning' }
            default: return { text: 'Unknown Safety', variant: 'secondary' }
        }
    }

    const safetyInfo = getSafetyLevel(mushroom.edibility)

    const handleAddSpecimen = () => {
        const prefillData = {
            title: mushroom.title || mushroom.name || '',
            scientificName: mushroom.scientificName || '',
            edibility: mushroom.edibility || '',
            habitat: mushroom.habitat || '',
            season: mushroom.season || '',
            size: mushroom.size || '',
            color: mushroom.color || '',
            texture: mushroom.texture || '',
            sporeColor: mushroom.sporeColor || '',
            distribution: mushroom.distribution || '',
            growingConditions: mushroom.growingConditions || '',
            culinaryUses: mushroom.culinaryUses || '',
            similarSpecies: mushroom.similarSpecies || ''
        }
        
        navigate('/add', { 
            state: { 
                prefillData: prefillData
            }
        })
    }

    return (
        <Container className="mt-4">
            {/* Add Specimen Button - Positioned at top */}
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button 
                        variant="success" 
                        size="lg"
                        onClick={handleAddSpecimen}
                        className="shadow-sm"
                    >
                        Add My Specimen
                    </Button>
                </Col>
            </Row>
            
            <Row>
                {/* Main Image and Basic Info */}
                <Col lg={6}>
                    <Card className="mb-4">
                        <Card.Img 
                            variant="top" 
                            src={mushroom.image || "https://via.placeholder.com/400x300?text=No+Image"} 
                            alt={mushroom.image ? `${mushroom.title || mushroom.name} mushroom` : "No image available"}
                            style={{ height: '300px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                            <h1 className="h2">{mushroom.title || mushroom.name}</h1>
                            {mushroom.scientificName && (
                                <Card.Subtitle className="mb-2 text-muted font-italic h5">
                                    {mushroom.scientificName}
                                </Card.Subtitle>
                            )}
                            {mushroom.description && (
                                <Card.Text className="lead">{mushroom.description}</Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Detailed Information */}
                <Col lg={6}>
                    {/* Safety Information */}
                    <Card className="mb-4">
                        <Card.Header className={`bg-${safetyInfo.variant} text-white`}>
                            <h5 className="mb-0">Safety Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <strong>Edibility Status:</strong>
                                <Badge bg={getEdibilityVariant(mushroom.edibility)} className="ms-2">
                                    {mushroom.edibility || 'Unknown'}
                                </Badge>
                            </div>
                            <Alert variant={safetyInfo.variant} className="mb-0">
                                <strong>{safetyInfo.text}</strong>
                                {mushroom.edibility === 'poisonous' && (
                                    <div className="mt-1">
                                        <small>Never consume without expert identification</small>
                                    </div>
                                )}
                            </Alert>
                        </Card.Body>
                    </Card>

                    {/* Characteristics */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Characteristics</h5>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {mushroom.habitat && (
                                <ListGroup.Item>
                                    <strong>Habitat:</strong> {mushroom.habitat}
                                </ListGroup.Item>
                            )}
                            {mushroom.season && (
                                <ListGroup.Item>
                                    <strong>Season:</strong> {mushroom.season}
                                </ListGroup.Item>
                            )}
                            {mushroom.size && (
                                <ListGroup.Item>
                                    <strong>Size:</strong> {mushroom.size}
                                </ListGroup.Item>
                            )}
                            {mushroom.color && (
                                <ListGroup.Item>
                                    <strong>Color:</strong> {mushroom.color}
                                </ListGroup.Item>
                            )}
                            {mushroom.texture && (
                                <ListGroup.Item>
                                    <strong>Texture:</strong> {mushroom.texture}
                                </ListGroup.Item>
                            )}
                            {mushroom.sporeColor && (
                                <ListGroup.Item>
                                    <strong>Spore Print:</strong> {mushroom.sporeColor}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>

                    {/* Location & Growing Info */}
                    {(mushroom.location || mushroom.distribution || mushroom.growingConditions) && (
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Location & Growing</h5>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {mushroom.location && (
                                    <ListGroup.Item>
                                        <strong>Found At:</strong> {mushroom.location}
                                    </ListGroup.Item>
                                )}
                                {mushroom.distribution && (
                                    <ListGroup.Item>
                                        <strong>Distribution:</strong> {mushroom.distribution}
                                    </ListGroup.Item>
                                )}
                                {mushroom.growingConditions && (
                                    <ListGroup.Item>
                                        <strong>Growing Conditions:</strong> {mushroom.growingConditions}
                                    </ListGroup.Item>
                                )}
                                {mushroom.date && (
                                    <ListGroup.Item>
                                        <strong>Date Found:</strong> {new Date(mushroom.date).toLocaleDateString()}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    )}

                    {/* Specimen Locations Map - Show whenever there are specimens with location data */}
                    {sharedSpecimens.length > 0 && (
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Specimen Locations</h5>
                            </Card.Header>
                            <Card.Body>
                                <SpecimenMap 
                                    specimens={sharedSpecimens}
                                    mushroomName={mushroom.title || mushroom.name}
                                />
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Additional Information */}
            <Row>
                {/* Culinary Uses */}
                {mushroom.culinaryUses && (
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Culinary Uses</h5>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{mushroom.culinaryUses}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Similar Species Warning */}
                {mushroom.similarSpecies && (
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header className="bg-warning">
                                <h5 className="mb-0">Similar Species</h5>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{mushroom.similarSpecies}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Personal Notes */}
                {mushroom.notes && (
                    <Col md={12}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Notes</h5>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{mushroom.notes}</Card.Text>
                                {mushroom.dateAdded && (
                                    <small className="text-muted">
                                        Added on {new Date(mushroom.dateAdded).toLocaleDateString()}
                                    </small>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* User Specimens Carousel */}
                {userSpecimens.length > 0 && (
                    <Col md={12}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">User Specimens Gallery</h5>
                            </Card.Header>
                            <Card.Body>
                                <Carousel 
                                    indicators={false}
                                    controls={true}
                                    role="region"
                                    aria-label="User specimens gallery"
                                >
                                    {userSpecimens.map((specimen, index) => (
                                            <Carousel.Item key={specimen.id || index}>
                                                <div className="position-relative d-flex justify-content-center" style={{ minHeight: '400px' }}>
                                                    <img
                                                        src={specimen.imageUrl || "https://via.placeholder.com/400x300?text=Specimen+Image"}
                                                        alt={specimen.imageUrl ? `${specimen.name} specimen found at ${specimen.location}` : "No specimen image available"}
                                                        style={{ 
                                                            maxHeight: '400px', 
                                                            maxWidth: '100%',
                                                            objectFit: 'contain'
                                                        }}
                                                        className="rounded"
                                                    />
                                                    {/* Custom positioned indicators overlay */}
                                                    <div 
                                                        className="position-absolute d-flex justify-content-center"
                                                        style={{ 
                                                            bottom: '40px', 
                                                            left: '50%', 
                                                            transform: 'translateX(-50%)',
                                                            zIndex: 5
                                                        }}
                                                    >
                                                        {userSpecimens.map((_, idx) => (
                                                            <span
                                                                key={idx}
                                                                role="button"
                                                                tabIndex="0"
                                                                aria-label={`View specimen ${idx + 1} of ${userSpecimens.length}`}
                                                                className={`d-inline-block rounded-circle mx-1 ${idx === index ? 'bg-white' : 'bg-secondary'}`}
                                                                style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    opacity: idx === index ? 1 : 0.5,
                                                                    cursor: 'pointer'
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        // This would need carousel state management to implement navigation
                                                                    }
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-center mt-3 p-3 bg-light rounded">
                                                    <h2 className="h5 mb-2">{specimen.name}</h2>
                                                    <p className="mb-1">
                                                        <strong>Location:</strong> {specimen.location}<br/>
                                                        <strong>Date:</strong> {new Date(specimen.date).toLocaleDateString()}<br/>
                                                        <strong>Added by:</strong> {specimen.addedBy}<br/>
                                                        {specimen.notes && (
                                                            <>
                                                                <strong>Notes:</strong> {specimen.notes}
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    )
}