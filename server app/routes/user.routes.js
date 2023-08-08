const { Router } = require('express');
// Middlewares personalizados.
const { checkCredentialsExists, tokenVerification } = require('../middleware');
const { registrarUsuario, obtenerDatosUsuario } = require('../consultas');
// Crear una instancia del enrutador de usuario.
const userRouter = Router();



// Definir una ruta GET que requiere la verificación del token antes de procesarla.
userRouter.get("/", 
tokenVerification, async (req, res) => {
    try {     
        // Extraer el correo electrónico del usuario decodificado del token.
        const { email } = req.user;

        // Obtener los datos del usuario a partir del correo electrónico.
        const usuario = await obtenerDatosUsuario(email);

        // Enviar la respuesta en formato JSON con los datos del usuario.
        res.json(usuario);
    } catch (error) {
        // En caso de error, enviar una respuesta con el código de error y el mensaje de error.
        const { code, message } = error;
        res.status(code).send(message);
    }
});


// Definir una ruta POST que requiere la verificación de credenciales antes de procesarla.
userRouter.post("/", 
checkCredentialsExists, async (req, res) => {
    try {
        // Obtener los datos del usuario del cuerpo de la solicitud.
        const usuario = req.body;

        // Registrar al usuario en la base de datos.
        await registrarUsuario(usuario);

        // Enviar una respuesta con el mensaje de éxito.
        res.send("Usuario ha sido registrado con ÉXITO!😁");
    } catch (error) {
        // En caso de error, enviar una respuesta con el código de error y el mensaje de error.
        res.status(500).send(error);
    }
});









/*
// Definir una ruta GET para probar, que acepta el parámetro 'email' en la URL.
userRouter.get("/email/:email", async (req, res) => {
    try {
        // Obtener el valor del parámetro 'email' de la URL.
        const email = req.params.email;

        // Mostrar el correo electrónico en la consola (para fines de prueba).
        console.log(email);

        // Obtener los datos del usuario a partir del correo electrónico.
        const usuario = await obtenerDatosUsuario(email);

        // Enviar la respuesta en formato JSON con los datos del usuario.
        res.json(usuario);
    }
    catch(error) {
        // En caso de error, enviar una respuesta con el código de error y el mensaje de error.
        res.status(400).json(error.message);
    }
});
*/



// Exportar el enrutador de usuario.
module.exports = {
    userRouter
};
