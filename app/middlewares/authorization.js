import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {getByUser} from "../queries/queries.js"
import { getConnection } from "../database/config.js";


 async function soloAdmin(req,res,next){

   const logueado = await revisarCookie(req)
   if(logueado) return next();
       return res.redirect("/")
   
   

}



 async function soloPublico(req,res,next){
       const logueado  =  await revisarCookie(req)
     
       if(!logueado) return next();
         return res.redirect("/admin")
}


async function revisarCookie (req){

   try{
      if(!req.headers.cookie){
         console.log("no hay cookies en la peticion");
         return false
      }
        
      const cookieTexto = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt1="));
      if(!cookieTexto){
         return false;
      }

      const cookieJWT = cookieTexto.slice(5);

      const decodificada = jwt.verify(cookieJWT,process.env.JWT_SECRET)

      const db = await getConnection();
      const [userCorrect] = await db.query(getByUser,[decodificada.user])
      if(userCorrect.length === 0){
         return false
      }
      return true

   }catch(error){
      console.error(error,"fallo en la validacion de cookie", error.message)
      return false
   }
  

}




export const autorizaciones ={
    soloAdmin,
    soloPublico
}