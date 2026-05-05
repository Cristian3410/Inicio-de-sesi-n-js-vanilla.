import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import {metodos} from "./controllers/authentication.controller.js"
import { autorizaciones } from "./middlewares/authorization.js";


//servidor

const app = express();

app.set("port",4000)
app.listen(app.get("port"))
console.log("servidor corriendo en puerto " , app.get("port"));

//configuracion


app.use(express.static(__dirname + "/public"));
app.use(express.json())
app.use(cookieParser())


//Rutas

app.get("/",autorizaciones.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/login.html"))
app.get("/register",autorizaciones.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"))
app.get("/admin",autorizaciones.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"))
app.post("/api/register",metodos.register)
app.post("/api/login",metodos.login)
app.get("/verificar/:token", metodos.verificarUsuario)