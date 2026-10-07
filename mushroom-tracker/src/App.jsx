import { useState, useEffect } from 'react'
import './App.css'
import { HashRouter, Route, Routes } from 'react-router'
import Search from './components/Search'
import Browse from './components/Browse'
import MushNav from './components/MushNav'
import Login from './components/Login'
import Register from './components/Register'
import MushList from './components/MushList'
import AddMushroom from './components/AddMushroom'
import MushroomDetails from './components/MushroomDetails'
import Landing from './components/Landing'
import AuthContext from './contexts/AuthContext'
import { initializePublicDatabase, initializePrivateDatabase } from './services/mushroomService'
import { initializeUserDatabase, getCurrentSession } from './services/authService'

function App() {
  // Initialize auth state from sessionStorage if available
  const [authStatus, setAuthStatus] = useState(() => {
    return getCurrentSession(); // Use the auth service instead of direct sessionStorage access
  });

  // Initialize the mushroom databases and user database on app start
  useEffect(() => {
    initializePublicDatabase()
    initializePrivateDatabase()
    initializeUserDatabase()
  }, [])

  return <HashRouter>
    <AuthContext.Provider value={[authStatus, setAuthStatus]}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Routes>
        <Route path ="/" element = {<MushNav/>}>
          <Route index element={<Landing/>} />
          <Route path ="/browse" element ={<Browse/>}></Route>
          <Route path ="/search" element ={<Search/>}></Route>
          <Route path ="/login" element ={<Login/>}></Route>
          <Route path ="/register" element ={<Register/>}></Route>
          <Route path ="/list" element ={<MushList/>}></Route>
          <Route path ="/add" element ={<AddMushroom/>}></Route>
          <Route path ="/details" element ={<MushroomDetails/>}></Route>
          <Route path ="/details/:id" element ={<MushroomDetails/>}></Route>
        </Route>
      </Routes>
    </AuthContext.Provider>
  </HashRouter>
}
    

export default App
