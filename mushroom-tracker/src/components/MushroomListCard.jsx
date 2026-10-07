import { Card, Row, Col, Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { getSpecimensForMushroom } from '../services/mushroomService'

export default function MushroomListCard({ mushroom, showFullDescription = false }) {
    const navigate = useNavigate()
    const [displayImage, setDisplayImage] = useState("https://via.placeholder.com/80x60?text=Loading")

    // Get the best available image (default image or first user specimen image)
    useEffect(() => {
        let imageToUse = mushroom.image || mushroom.imageUrl

        if (!imageToUse && mushroom.id) {
            // If no default image, look for specimens with images using the new structure
            const specimenData = getSpecimensForMushroom(mushroom.id)
            const allSpecimens = specimenData.all || []
            
            // Find the first specimen with an image
            const specimenWithImage = allSpecimens.find(spec => spec.imageUrl && spec.imageUrl.trim() !== '')
            if (specimenWithImage) {
                imageToUse = specimenWithImage.imageUrl
            }
        }

        setDisplayImage(imageToUse || "https://via.placeholder.com/80x60?text=No+Image")
    }, [mushroom])

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

    const getEdibilityIcon = (edibility) => {
        switch (edibility?.toLowerCase()) {
            case 'edible': return 'SAFE'
            case 'poisonous': return 'TOXIC'
            case 'toxic': return 'TOXIC'
            case 'inedible': return '🚫'
            case 'unknown': return '❓'
            default: return '❓'
        }
    }

    const handleCardClick = () => {
        navigate(`/details/${mushroom.id}`)
    }

    // Truncate description for list view
    const truncateText = (text, maxLength = 150) => {
        if (!text) return ''
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return (
        <Card 
            className="mb-2 mushroom-list-card shadow-sm" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onClick={handleCardClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
            }}
        >
            <Card.Body className="p-2">
                <Row className="align-items-center">
                    {/* Image Column */}
                    <Col xs={12} sm={2} md={2} className="mb-2 mb-sm-0">
                        <img 
                            src={displayImage || "https://via.placeholder.com/80x60?text=No+Image"} 
                            alt={displayImage && displayImage !== "https://via.placeholder.com/80x60?text=No+Image" ? 
                                `${mushroom.title || mushroom.name} mushroom` : 
                                "No image available"}
                            className="img-fluid rounded"
                            style={{ 
                                width: '100%',
                                maxWidth: '80px',
                                height: '60px', 
                                objectFit: 'cover',
                                margin: '0 auto',
                                display: 'block'
                            }}
                        />
                    </Col>

                    {/* Content Column */}
                    <Col xs={12} sm={10} md={10}>
                        <Row className="align-items-center">
                            {/* Title and Description */}
                            <Col xs={12} lg={8}>
                                <div className="d-flex align-items-center mb-1">
                                    <h6 className="mb-0 text-primary fw-bold me-2">
                                        {mushroom.title || mushroom.name}
                                    </h6>
                                    {mushroom.edibility && (
                                        <Badge 
                                            bg={getEdibilityVariant(mushroom.edibility)} 
                                            className="me-2"
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            {getEdibilityIcon(mushroom.edibility)} {mushroom.edibility}
                                        </Badge>
                                    )}
                                </div>
                                
                                {mushroom.scientificName && (
                                    <p className="text-muted font-italic mb-1 small">
                                        {mushroom.scientificName}
                                    </p>
                                )}
                                
                                <p className="mb-1 small text-dark">
                                    {truncateText(mushroom.description, 120)}
                                </p>
                            </Col>

                            {/* Details and Action Column */}
                            <Col xs={12} lg={4}>
                                <div className="d-flex flex-column">
                                    {/* Compact Info */}
                                    <div className="d-flex flex-wrap mb-1">
                                        {mushroom.habitat && (
                                            <Badge bg="info" className="me-1 mb-1" style={{ fontSize: '0.65rem' }}>
                                                {mushroom.habitat}
                                            </Badge>
                                        )}
                                        {mushroom.season && (
                                            <Badge bg="secondary" className="me-1 mb-1" style={{ fontSize: '0.65rem' }}>
                                                📅 {mushroom.season}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Location/Date Info - Single line */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            {mushroom.location && (
                                                <small className="text-muted">
                                                    {mushroom.location.length > 25 ? mushroom.location.substring(0, 25) + '...' : mushroom.location}
                                                </small>
                                            )}
                                            {mushroom.date && (
                                                <small className="text-muted d-block">
                                                    📅 {new Date(mushroom.date).toLocaleDateString()}
                                                </small>
                                            )}
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="d-flex gap-1">
                                            <Button 
                                                variant="outline-success" 
                                                size="sm"
                                                style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate('/add', { 
                                                        state: { 
                                                            prefillData: {
                                                                title: mushroom.title || mushroom.name,
                                                                scientificName: mushroom.scientificName || '',
                                                                edibility: mushroom.edibility || '',
                                                                habitat: mushroom.habitat || ''
                                                            }
                                                        }
                                                    })
                                                }}
                                            >
                                                Add Specimen
                                            </Button>
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCardClick()
                                                }}
                                            >
                                                View →
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}
