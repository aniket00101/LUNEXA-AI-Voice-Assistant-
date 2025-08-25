import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import { FaTimes } from "react-icons/fa"
import { CgMenuRight } from "react-icons/cg";
import aiImage from "../assets/ai.gif"
import userImage from "../assets/user.gif"

export const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [showHistory, setShowHistory] = useState(false);
  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
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
      setAiText("")
      isSpeakingRef.current = false;
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
    if (type === 'weather') {
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
      if (transcript.toLowerCase().includes("siri")) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        try {
          const data = await getGeminiResponse(transcript)
          handleCommand(data)
          setAiText(data.response)
          setUserText("")
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
        <div className="hidden md:flex gap-3 items-center">
    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:scale-105 cursor-pointer transition-transform duration-200" onClick={() => navigate("/customize")}>Edit</button>

    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={handleLogOut}>Logout</button>

    <button className="text-white px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full font-semibold shadow-md hover:scale-105 cursor-pointer transition-transform duration-200" onClick={() => setShowHistory(!showHistory)}>{showHistory ? "Close History" : "Show History"} </button>

    {showHistory && (
      <div className="fixed top-0 left-0 w-[300px] h-full bg-gray-900 bg-opacity-95 z-50 shadow-lg p-4 overflow-y-auto flex flex-col gap-3">
        <h2 className="text-white text-xl font-semibold mb-2">History</h2>
        {userData?.history?.map((his, index) => (
          <span key={index} className="text-gray-200 text-[16px] truncate px-2 py-1 border-b border-gray-700" >{his}</span>
        ))}
      </div>
    )}
  </div>

        <div className="md:hidden">
          <button className="text-white text-2xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FaTimes /> : <CgMenuRight />}</button>

          {menuOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 z-50 flex flex-col">
              <div className="w-full flex flex-row justify-between items-center p-6 mt-1.5">
                <div className="flex flex-row gap-4">
                  <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:scale-105 cursor-pointer transition-transform duration-200" onClick={() => navigate("/customize")}>Edit</button>

                  <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={handleLogOut}>Logout</button>
                </div>

                <button className="text-white text-3xl focus:outline-none" onClick={() => setMenuOpen(false)}><FaTimes /></button>
              </div>

              <div className="w-full h-[2px] bg-gray-400"></div>
              <h1 className="text-white font-semibold text-[19px] flex justify-center  mt-[16px]">History</h1>
              <div className="w-full h-[400px] overflow-y-auto flex flex-col gap-[10px] mt-[15px]">
                {userData?.history?.map((his, index) => (
                  <span key={index} className="text-gray-200 text-[18px] truncate px-3">{his}</span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">
        <img src={userData?.assistantImage || ""} alt="Assistant Avatar" className="h-full w-full object-cover" />
      </div>

      <h1 className="text-white text-[18px] font-semibold mb-[30px]">Hi, I'm{" "}<span className="text-blue-400">{userData?.assistantName || "Voice Assistant"}</span>{" "}– your personal voice assistant</h1>

      {!aiText && <img src={userImage} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImage} alt="" className="w-[200px]" />}

      <h1 className="text-white text-[15px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  )
}