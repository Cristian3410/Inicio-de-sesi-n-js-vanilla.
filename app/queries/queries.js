export const getByEmail = "SELECT * FROM usuarios where email = ?";
export const getByUser = "SELECT * FROM usuarios WHERE usuario = ?";
export const insertnewUser = "INSERT INTO usuarios (usuario, email,pass) VALUES (?,?,?)"
             
