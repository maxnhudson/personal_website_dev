import { Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import MushroomListCard from './MushroomListCard'
import { getAllMushroomsWithUserData } from '../services/mushroomService'

export default function Browse() {
    const [mushrooms, setMushrooms] = useState([])

    useEffect(() => {
        setMushrooms(getAllMushroomsWithUserData())
    }, [])

    return (
        <Container className="py-4">
            <div className="text-center mb-4">
                <h1 className="text-primary fw-bold">Browse Mushrooms</h1>
                <p className="text-muted">Explore our collection of mushroom species</p>
            </div>
            
            <Row>
                <Col>
                    <div className="mb-3">
                        <p className="text-muted">
                            Showing {mushrooms.length} mushroom species
                        </p>
                    </div>
                    
                    {mushrooms.map(mushroom => (
                        <MushroomListCard 
                            key={mushroom.id} 
                            mushroom={mushroom} 
                            showFullDescription={false}
                        />
                    ))}
                </Col>
            </Row>
        </Container>
    )
}