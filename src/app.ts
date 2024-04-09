import express from "express"
import dotenv from "dotenv"
import router from "./routes/authRoutes";
import usersRoutes from "./routes/userRoute"
const app = express()

dotenv.config();


app.use(express.json());

//ROUTES
app.use('/auth',router)
app.use('/users',usersRoutes)
//AUTHENTICATE
//USER

export default app