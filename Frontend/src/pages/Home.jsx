import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import { FaBars, FaTimes } from "react-icons/fa"

export const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const recognitionRef = useRef(null)
  const synth = window.speechSynthesis

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

  const speak = (text) => {
  const utterance = new window.SpeechSynthesisUtterance(text);
  isSpeakingRef.current = true;
  utterance.onend = () => {
    isSpeakingRef.current = false;
    // Prevent double starting
    if (!isRecognizingRef.current && recognitionRef.current) {
      recognitionRef.current.start();
      isRecognizingRef.current = true;
    }
  };
  synth.speak(utterance);
};

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    if (type === 'google_search') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }
    if (type === 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }
    if (type === 'instagram_open') {
      window.open(`https://www.instagram.com`, '_blank')
    }
    if (type === 'facebook_open') {
      window.open(`https://www.facebook.com`, '_blank')
    }
    if (type === 'weather_show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }
    if (type === 'youtube_search' || type === 'youtube_play') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Sorry, your browser does not support Speech Recognition!')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'

    recognitionRef.current = recognition

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          isRecognizingRef.current = true;
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Start error: ", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }
    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition()
        }, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      // console.log(transcript)
      if (transcript.toLowerCase().includes("siri")) {
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        try {
          const data = await getGeminiResponse(transcript)
          // console.log(data)
          handleCommand(data)
        } catch (err) {
          console.error("Gemini response error: ", err)
        }
      }
    }

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition()
      }
    }, 10000)
    safeRecognition()
    return () => {
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
      clearInterval(fallback)
    }
  }, [])

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-black flex justify-center items-center flex-col gap-[15px]">
      <div className="absolute top-[20px] right-[20px]">
        <div className="hidden md:flex gap-3">
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:scale-105 cursor-pointer transition-transform duration-200" onClick={() => navigate("/customize")}>Edit</button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={handleLogOut}>Logout</button>
        </div>
        <div className="md:hidden">
          <button className="text-white text-2xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          {menuOpen && (
            <div className="mt-3 flex flex-col gap-2 absolute right-0 bg-gray-900 p-3 rounded-lg shadow-lg">
              <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:scale-105 cursor-pointer transition-transform duration-200" onClick={() => navigate("/customize")}>Edit</button>
              <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={handleLogOut}>Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">
        <img src={userData?.assistantImage || ""} alt="Assistant Avatar" className="h-full w-full object-cover" />
      </div>
      <h1 className="text-white text-[18px] font-semibold mb-[30px]">
        Hi, I'm <span className="text-blue-400">{userData?.assistantName || "Voice Assistant"}</span> – your personal voice assistant
      </h1>
    </div>
  )
}
