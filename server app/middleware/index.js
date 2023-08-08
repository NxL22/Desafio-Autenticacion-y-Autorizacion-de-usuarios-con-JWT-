const jwt = require("jsonwebtoken"); 
const { secretKey } = require("../secretKey"); 


// Middleware: verifica si existen las credenciales requeridas en el cuerpo de la solicitud.
const checkCredentialsExists = (req, res, next) => {
    try {
        // Extrae 'email', 'password', 'rol' y 'lenguage' del cuerpo de la solicitud(req.body).
        const { email, password, rol, lenguage } = req.body;

        // Verifica si alguna de las credenciales requeridas falta.
        if (!email || !password || !rol || !lenguage) {
            // Si falta alguna credencial, envía una respuesta de 401 No autorizado con un mensaje de error.
            res.status(401).send({ message: "No se obtuvieron las credenciales necesarias😢" });
        }

        // Si todas las credenciales están presentes, procede al siguiente middleware.
        next();
    } catch (error) {
        // Si ocurre un error durante la ejecución de este middleware, registra el mensaje de error y pásalo al siguiente middleware de manejo de errores.
        console.error('Error en la consulta:', error.message);
        next(error);
    }
};

// Middleware: verifica la validez del token JWT proporcionado en el encabezado 'Authorization'.
const tokenVerification = (req, res, next) => {
    try {
        // Obtiene el encabezado 'Authorization' de la solicitud(req.header).
        const tokenHeader = req.header("Authorization");

        // Verifica si falta el encabezado del token o si no está en el formato esperado (comenzando con "Bearer ").
        if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
            // Si el encabezado del token falta o tiene un formato no válido, lanza un error.
            throw new Error("Token de autorización no proporcionado o formato no válido");
        }

        // Extrae la parte del token del encabezado, eliminando el prefijo "Bearer ".
        const token = tokenHeader.split("Bearer ")[1].trim(); // El trim borra espacio si es que lo hay. 

        // Verifica el token usando la clave secreta. Esto decodificará el token si es válido o lanzará un error si no lo es.
        const decodedToken = jwt.verify(token, secretKey);

        // Si el token es válido, adjunta la información del usuario decodificada al objeto 'req' para su uso posterior.
        req.user = decodedToken;

        // Procede al siguiente middleware.
        next();
    } catch (error) {
        // Si ocurre un error durante la verificación del token, pásalo al siguiente middleware de manejo de errores.
        next(error);
    }
};

// Exportar
module.exports = {
    checkCredentialsExists,
    tokenVerification
};
