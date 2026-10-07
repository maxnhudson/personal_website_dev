import { useState, useRef } from 'react'
import { Container, Row, Col, Form, InputGroup, Alert, Button } from 'react-bootstrap'
import MushroomListCard from './MushroomListCard'
import { searchAllMushrooms } from '../services/mushroomService'

export default function Search() {
    const [searchResults, setSearchResults] = useState([])
    const [hasSearched, setHasSearched] = useState(false)
    const searchInputRef = useRef()

    const handleSearch = (e) => {
        e.preventDefault()
        const searchTerm = searchInputRef.current.value.trim()
        
        if (searchTerm) {
            const results = searchAllMushrooms(searchTerm)
            setSearchResults(results)
        } else {
            setSearchResults([])
        }
        setHasSearched(true)
    }

    return (
        <Container className="py-4">
            <div className="text-center mb-4">
                <h1 className="text-primary fw-bold">Search Mushrooms</h1>
                <p className="text-muted">Find mushrooms by name, description, edibility, or habitat</p>
            </div>
            
            {/* Search Bar */}
            <Row className="justify-content-center mb-4">
                <Col md={8} lg={6}>
                    <Form onSubmit={handleSearch}>
                        <Form.Label htmlFor="mushroom-search-input" className="visually-hidden">
                            Search mushrooms
                        </Form.Label>
                        <InputGroup size="lg" className="shadow-sm">
                            <Form.Control
                                id="mushroom-search-input"
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search mushrooms by name, description, edibility, habitat..."
                                className="border-primary"
                                aria-describedby="search-help-text"
                            />
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="border-primary"
                                aria-describedby="search-help-text"
                            >
                                Search
                            </Button>
                        </InputGroup>
                        <Form.Text id="search-help-text" className="visually-hidden">
                            Enter keywords to search for mushrooms in our database
                        </Form.Text>
                    </Form>
                </Col>
            </Row>

            {/* Search Results */}
            <Row>
                <Col>
                    {!hasSearched ? (
                        <Alert variant="info" className="text-center py-5">
                            <Alert.Heading className="h4">Ready to Search</Alert.Heading>
                            <p className="mb-0">
                                Enter a search term above and click "Search" to find mushrooms by name, description, edibility, or habitat.
                            </p>
                        </Alert>
                    ) : searchResults.length > 0 ? (
                        searchResults.map(mushroom => (
                            <MushroomListCard 
                                key={mushroom.id} 
                                mushroom={mushroom} 
                                showFullDescription={false}
                            />
                        ))
                    ) : (
                        <Alert variant="warning" className="text-center py-5">
                            <Alert.Heading className="h4">No mushrooms found</Alert.Heading>
                            <p className="mb-0">
                                Try adjusting your search terms or browse all mushrooms to discover new species.
                            </p>
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    )
}