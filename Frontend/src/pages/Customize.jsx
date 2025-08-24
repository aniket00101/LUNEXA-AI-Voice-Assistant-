import React, { useState, useRef, useContext } from 'react'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image4.png"
import image4 from "../assets/image5.png"
import image5 from "../assets/image6.jpeg"
import image6 from "../assets/image7.jpeg"
import Card from '../components/Card'
import { MdKeyboardBackspace } from "react-icons/md"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Customize = () => {
  
  const {serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage} = useContext(userDataContext);

  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  const navigate = useNavigate()

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-black flex justify-center items-center flex-col p-[20px]">

      <MdKeyboardBackspace className="absolute top-[30px] left-[30px] text-white w-[25px] cursor-pointer h-[25px]" onClick={()=>navigate("/")}/>

      <h1 className="text-white text-[30px] text-center mb-[40px]">
        Select Your <span className="text-blue-400">Assistant Image</span>
      </h1>

      <div className="w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">

        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />

        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center flex-col ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-500" : ""}`} onClick={() => {inputImage.current.click(); setSelectedImage("input");}}>
          
          {!frontendImage && <RiImageAddLine className="text-white w-[25px] h-[25px]" />}
          
          {!frontendImage && <h2 className="text-white mt-[10px]">Upload</h2>}
          
          {frontendImage && <img src={frontendImage} className="h-full object-cover" />}
        
        </div>

        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
      
      </div>

      {selectedImage && <button className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold mt-[30px] text-[19px] cursor-pointer" onClick={() => navigate("/customize2")}>Next</button>}

    </div>
  )
}

export default Customize
