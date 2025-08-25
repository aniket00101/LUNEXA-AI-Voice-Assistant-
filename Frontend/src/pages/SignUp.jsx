import React, { useContext, useState } from 'react'
import bg from "../assets/1638192.jpg"
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext.jsx';
import axios from "axios"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const navigate = useNavigate()

  const {serverUrl, userData, setUserData} = useContext(userDataContext)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, {withCredentials: true})
      
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response.data.message)
    }
  }

  return (
    <div className="w-full h-[100vh] bg-cover flex justify-center items-center bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-black" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      
      <form className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]" onSubmit = {handleSignUp}>
      
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">Register to <span className="text-blue-400">Lunexa</span></h1>
      
        <input type="text" placeholder="Enter your Name" className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]" onChange={(e) => setName(e.target.value)} value={name} required />
      
        <input type="email" placeholder="Email" className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]" onChange={(e) => setEmail(e.target.value)} value={email} required />
      
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
      
          <input type={showPassword ? "text" : "password"} placeholder="password" className="w-full h-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]" onChange={(e) => setPassword(e.target.value)} value={password} required />
      
          {!showPassword && <IoEye className="absolute top-[18px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer" onClick={() => setShowPassword(true)} />}
      
          {showPassword && <IoEyeOffSharp className="absolute top-[18px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer" onClick={() => setShowPassword(false)}/>}   
        </div>

        {err.length>0 && <p className="text-red-500 text-[17px]">*{err}</p>}
        
        <button className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold mt-[30px] text-[19px]" disabled={loading}>{loading?"Loading...":"Sign Up"}</button>   

        <p className="text-[white] text-[18px] cursor-pointer" onClick={()=>navigate("/signin")}>Already have an account? <span className="text-blue-400"> Sign In</span></p>
      </form>
    </div>
  )
}

export default SignUp
