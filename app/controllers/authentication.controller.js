import { getConnection } from "../database/config.js";
import {getByEmail,getByUser,insertnewUser} from "../queries/queries.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { enviarEmailVerificacion } from "../services/mail.services.js";
import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))


dotenv.config();



async function login(req,res){
  console.log(req.body);
  const user = req.body.user;
  const password = req.body.password;
  if(!user || !password ){
   return res.status(400).send({status:"Error",message:"los campos estan vacios"})
  }
       const db = await getConnection()
    const [userExist] = await db.query(getByUser,[user])
    if(!userExist.length>0){
      return res.status(400).send({status:Error,message:"error al iniciar sesion"})
    }
  
    const userFound = userExist[0]

    const loginCorrecto = await bcryptjs.compare(password,userFound.pass)
  
     if(!loginCorrecto){
      return res.status(400).send({status:"Error",message:"error al iniciar sesion"})
     }   

     const token = jwt.sign(
      {user:userFound.usuario},
      process.env.JWT_SECRET,
      {
        expiresIn:process.env.JWT_EXPIRATION
      }
    )

    const cookieOption ={
      expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path:"/"
    }
    res.cookie("jwt1",token,cookieOption)
   return  res.send({status:"ok",message:"Usuario logueado con exito",redirect:"/admin"})
}




async function register (req,res){
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
  if(!user || !password || !email){
    res.status(400).send({status:"Error", message:"Los campos estan incompletos"})
  }

  
   const db = await getConnection();

   const [userRows] = await db.query(getByUser,[user])
   if(userRows.length > 0){
    return res.status(400).send({status:"Error", message:"el usuario ya se encuentra registrado"})
   }
     const [emailRows] = await db.query(getByEmail,[email])
       
     if(emailRows.length > 0){
     return res.status(400).send({status:"Error", message:"el email ya se encuentra registrado"})
     }
     
     const tokenVerificacion = jwt.sign(
      {email:email},
      process.env.JWT_SECRET,
      {expiresIn:"1h"}
     )
       
     const mail = await enviarEmailVerificacion(email,tokenVerificacion)
     console.log(mail)

     if(mail.accepted===0){
      return res(500).send({status:"error",message:"error enviando mail de verificacion"})
     }
       
     
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password,salt)
     console.log(hashPassword)
     const result = await db.query(insertnewUser,[user,email,hashPassword])
     const NewUser ={
         user,email,password:hashPassword
     }
     console.log(NewUser)
     return res.status(201).send({status:"ok",message:`Usuario ${NewUser} agregado`,redirect:"/"})
}


async function verificarUsuario(req,res){

  const{token} = req.params
  console.log(token)
  try{
    
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const usermail = decoded.email;
    const db = await getConnection();
    const query = "UPDATE usuarios SET verificado = true WHERE email = ?";
    const [result] = await db.query(query,[usermail])

    if(result.affectedRows === 0){
      return res.status(400).send("Usuario no encontrado")
    }
     const rutaHtml = path.join(__dirname, "..", "pages", "verificacion.html");
     return res.sendFile(rutaHtml)

  }catch(error){

    console.error(error)
    return res.status(400).send("token invalido o expirado")
}
  
}




export const metodos = {
login,
register,
verificarUsuario
}