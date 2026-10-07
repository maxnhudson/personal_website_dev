import {Container, Nav, Navbar} from "react-bootstrap"
import {Link, Outlet} from "react-router"
import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import { logoutUser } from "../services/authService"

export default function MushNav() {
    const [authStatus, setAuthStatus] = useContext(AuthContext);

    const handleLogout = () => {
        logoutUser(); // Use the auth service
        setAuthStatus(null);
    };

    return (
        <div>
            {/* Dark banner with mushroom background */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '120px',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=1200&h=300&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 1030,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Container>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <h1 className="text-white mb-0" style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                                    Mushroom Tracker
                                </h1>
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
            
            {/* Navigation bar below the banner */}
            <Navbar bg="dark" variant="dark" fixed="top" style={{ top: '120px', zIndex: 1029 }}>
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/browse">Browse</Nav.Link>
                        <Nav.Link as={Link} to="/search">Search</Nav.Link>
                        {authStatus && (
                            <>
                                <Nav.Link as={Link} to="/list">My Mushrooms</Nav.Link>
                                <Nav.Link as={Link} to="/add">Add Mushroom</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {authStatus ? (
                            <Nav.Link onClick={handleLogout} style={{cursor: 'pointer'}}>
                                Logout ({authStatus.username})
                            </Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>
            <main id="main-content" style={{ paddingTop: '170px' }}>
                <Outlet />
            </main>
        </div>
    )
}