const express = require("express");
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.router")
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());

// FRONTEND_URL should be set in your hosting provider's environment variables
// to your deployed frontend's exact URL (e.g. https://your-app.vercel.app).
// Local dev (http://localhost:5173) is always allowed too.
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


// using all routes here
app.use("/api/auth",authRouter);
app.use("/api/interview", interviewRouter)



module.exports = app;