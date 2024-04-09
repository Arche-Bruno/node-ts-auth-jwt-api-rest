import app from "./app";


const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log("listening in the port ", PORT)
})