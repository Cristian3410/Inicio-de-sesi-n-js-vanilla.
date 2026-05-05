import nodemailer from "nodemailer";
import dotenv from "dotenv";

const transporter = nodemailer.createTransport({
  host:"sandbox.smtp.mailtrap.io",
  port:587,
  secure:false,
  auth: {
    user: "0ad7d97e08cf64",
    pass: "6db16e923a7a39"
  }
});
export async function enviarEmailVerificacion(direccion,token){
   return await transporter.sendMail({
    from:"no-reply@cristianinc.com",
    to:direccion,
    subject:"verificacion de cuenta nueva - CristianInc",
    html:crearMailverificacion(token),
   })
}

 function  crearMailverificacion(token){
    return `<!DOCTYPE hmtl>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        html{
            background-color: white;
        }
        body{
            max-width: 600px;
            font-family: 'Courier New', Courier, monospace;
            margin: auto;
            background-color: aqua;
            padding: 40px;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Verificacion de correo electronico</h1>
    <p>se ha creado una cuenta en la pagina cristian  con este correo electronico</p>
    <p>asi esta cuentano fue creada por usted omita este correo</p>
    <p>si usted creo la cuenta, entonces verifique la cuenta <a href="http://localhost:4000/verificar/${token}" target="_blank" rel="noopener nofeferrer ">verificar</a></p>
    <p><strong>Cristian </strong></p>
    <p>Ceo Cristian</p>
</body>   
</html>
    `
}