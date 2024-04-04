import {Routes, Route } from "react-router-dom"
import { BrowserRouter as Router } from "react-router-dom"
import './App.css'
import {Login } from './pages/login'
import { Signup } from './pages/signup'
import { Createpin } from './pages/createpin'
import { Dashboard } from './pages/dashboard'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/createpin" element={<Createpin/>} /> 
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
