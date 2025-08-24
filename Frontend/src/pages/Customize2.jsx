import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext.jsx'
import { MdKeyboardBackspace } from "react-icons/md"
import axios from "axios"

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
  const [loading, setLoading] = useState(false)

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      setLoading(true)
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
      
      console.log(result.data)
      setUserData(result.data)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
      
  }

  

  const navigate = useNavigate()

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-black flex justify-center items-center flex-col p-[20px] relative">
      
      <MdKeyboardBackspace className="absolute top-[30px] left-[30px] text-white w-[25px] cursor-pointer h-[25px]" onClick={()=>navigate("/customize")}/>
      
      <h1 className="text-white text-[30px] text-center mb-[40px]">Enter Your <span className="text-blue-400">Assistant Name</span></h1>

      <input type="text" placeholder="eg: Lunexa" className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />

      {assistantName && ( <button className="min-w-[300px] h-[60px] bg-white rounded-full text-black font-semibold mt-[30px] text-[19px] cursor-pointer" disabled={loading} onClick={handleUpdateAssistant}
        >{!loading ? "Launch Your Assistant" : "Loading..."} </button>)}
        
    </div>
  )
}

export default Customize2
