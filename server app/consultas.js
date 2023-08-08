express = require('express');
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')


// Conexion a Postgres 
const pool = new Pool({
    host: 'localhost',
    user: 'neil',
    password: '123',
    database: 'softjobs',
    allowExitOnIdle: true,   // Corta  la conexion si deja de usarse (en reposo).
});



// Función para registrar un nuevo usuario en la base de datos.
const registrarUsuario = async (usuario) => {
    try {
        // Desestructurar el objeto usuario.
        const { email, password, rol, lenguage } = usuario;

        // Verificar si el usuario ya existe en la base de datos mediante su correo electrónico.
        const emailValue = [email];
        const consultaExist = "SELECT * FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(consultaExist, emailValue);

        // Si el usuario no existe en la base de datos, lo registramos.
        if (rows.length === 0) {
            // Ciframos la contraseña antes de almacenarla en la base de datos.
            const passwordEncriptada = bcrypt.hashSync(password, 10);

            // Valores a insertar en la base de datos.
            const values = [email, passwordEncriptada, rol, lenguage];
            const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *";
            await pool.query(consulta, values);
        } else {
            // Si el usuario ya existe, lanzamos un error.
            throw new Error("El usuario ya ha sido registrado");
        }
    } catch (error) {
        throw error;
    }
};


// Función para obtener los datos de un usuario a partir de su correo electrónico.
const obtenerDatosUsuario = async (email) => {
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const { rows: [usuario], rowCount } = await pool.query(consulta, values);

    // Si no existe un usuario con el correo electrónico proporcionado, lanzamos un error.
    if (!rowCount) {
        throw { code: 404, message: "No existe usuario con este mail asociado🥺" };
    }

    // Eliminamos la contraseña del objeto del usuario antes de devolverlo.
    delete usuario.password;
    return usuario;
};


// Función para verificar las credenciales de inicio de sesión (correo electrónico y contraseña).
const verificarCredenciales = async (email, password) => {
    try {
        // Consulta para obtener el usuario a partir del correo electrónico.
        const values = [email];
        const consulta = "SELECT * FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(consulta, values);

        // Si no se encuentra un usuario con el correo electrónico proporcionado, lanzamos un error.
        if (rows.length === 0) {
            throw new Error("Email o contraseña es incorrecta🥺");
        }

        const usuario = rows[0];

        // Comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos.
        const { password: passwordEncriptada } = usuario;
        const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

        // Si la contraseña es incorrecta, lanzamos un error.
        if (!passwordEsCorrecta) {
            throw new Error("Email o contraseña es incorrecta🥺");
        }
    } catch (error) {
        // Si ocurre un error, simplemente relanzamos el error para que se maneje en el nivel superior.
        throw error;
    }
};



// Exportar.
module.exports = {
    registrarUsuario,
    obtenerDatosUsuario,
    verificarCredenciales
};