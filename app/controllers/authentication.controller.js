import { getConnection } from "../database/config.js";
import {getByEmail,getByUser,insertnewUser} from "../queries/queries.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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






export const metodos = {
login,
register
}