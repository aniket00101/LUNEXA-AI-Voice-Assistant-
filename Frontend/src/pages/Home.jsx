import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import { FaBars, FaTimes } from "react-icons/fa"

export const Home = () => {
  const { userData, serverUrl, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-black flex justify-center items-center flex-col gap-[15px]">
      <div className="absolute top-[20px] right-[20px]">
        <div className="hidden md:flex gap-3">
          
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:scale-105 cursor-pointer transition-transform duration-200" onClick={() => navigate("/customize")}>Edit</button>

          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={handleLogOut}>Logout</button>

        </div>

        <div className="md:hidden">
          
          <button className="text-white text-2xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FaTimes /> : <FaBars />}</button>

          {menuOpen && (
            <div className="mt-3 flex flex-col gap-2 absolute right-0 bg-gray-900 p-3 rounded-lg shadow-lg">
              
              <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:scale-105 cursor-pointer transition-transform duration-200" onClick={() => navigate("/customize")}>Edit</button>

              <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={handleLogOut}>Logout</button>

            </div>
          )}
        </div>
      </div>


      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">

        <img src={userData?.assistantImage} alt="Assistant Avatar" className="h-full object-cover" /></div>

      <h1 className="text-white text-[18px] font-semibold mb-[30px]">Hi, I'm <span className="text-blue-400">{userData?.assistantName}</span> – your personal voice assistant</h1>
    </div>
  )
}
