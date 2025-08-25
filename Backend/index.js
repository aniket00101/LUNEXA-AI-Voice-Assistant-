
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/authroutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/UserRoutes.js"
import geminiResponse from "./gemini.js"

const app = express()

app.use(cors({
    origin: "https://lunexa-ai-voice-assistant-frontend.onrender.com",
    credentials: true
}))

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.get("/", async (req, res) => {
    try {
        let prompt = req.query.prompt 
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" })
        }
        let data = await geminiResponse(prompt)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong" })
    }
})


app.listen(port, () => {
    connectDb()
    console.log(`Server started at port ${port}`)
})

