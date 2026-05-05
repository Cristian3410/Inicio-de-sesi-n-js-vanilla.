import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host:"localhost",
    database:"proyectoJSvanilla",
    user:"root",
    password:"123456",
    connectionLimit:10
});


export const getConnection = () =>{
    return pool
}