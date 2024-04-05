import {Routes, Route } from "react-router-dom"
import { BrowserRouter as Router } from "react-router-dom"
import './App.css'
import {Login } from './pages/login'
import { Signup } from './pages/signup'
import { Createpin } from './pages/createpin'
import { Dashboard } from './pages/dashboard'
import 'react-toastify/dist/ReactToastify.css'
import {Theme} from "@radix-ui/themes"
import { useState } from "react"

function App() {

  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    console.log("LEwat")
  }

  return (
    <>
    <Theme appearance={darkMode? "dark":"light"}>
    <div className="fixed mt-4">
      {darkMode ? (      
        <button onClick={toggleDarkMode} className="border-solid border-white bg-slate-600 hover:bg-slate-500 mx-6 mt-12">
        <svg className="fill-white"xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 452q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0-160Z"/></svg>
        </button>): 
        (<button onClick={toggleDarkMode} className="border-solid border-slate-400 bg-transparent hover:bg-gray-500 mx-6 mt-12">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 452q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0-160Z"/></svg>
        </button>)
        }
    </div>

    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/createpin" element={<Createpin/>} /> 
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
    </Theme>
    
    </>
  )
}

export default App
