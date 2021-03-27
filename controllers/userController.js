import sql from '../database/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Obtener usuarios
export const getUsers = async (req, res) => {
  try {
    const { recordset: result } = await sql.query`SELECT nombreUsuario FROM usuario`;

    res.status(200).json({
      ok: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    })
  }
}

// Obtener usuario
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM usuario WHERE nombreUsuario = ${ id }`;

    if (!result[0])
      return res.status(404).json({
        ok: false,
        message: 'El usuario no existe'
      });

    res.status(200).json({
      ok: true,
      user: result[0]
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    });
  }
}

// Registrar usuario
export const createUser = async (req, res) => {
  const { nombreUsuario, contrasenia, confirmarContrasenia } = req.body;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM usuario WHERE nombreUsuario = ${ nombreUsuario }`;

    if (result[0])
      return res.status(400).json({
        ok: false,
        message: `El usuario ${ nombreUsuario } ya existe`
      });

    if (contrasenia !== confirmarContrasenia)
      return res.status(400).json({
        ok: false,
        message: 'Las contraseñas no coinciden'
      });

    // Encriptado de la contraseña
    const contraseniaEncriptada = await bcrypt.hash(contrasenia, 12);

    await sql.query`INSERT INTO usuario VALUES (${ nombreUsuario }, ${ contraseniaEncriptada })`;

    res.status(201).json({
      ok: true,
      message: 'Usuario creado'
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    })
  }
}

// Ingreso de un usuario
export const loginUser = async (req, res) => {
  const { nombreUsuario, contrasenia } = req.body;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM usuario WHERE nombreUsuario = ${ nombreUsuario }`;

    if (!result[0])
      return res.status(400).json({
        ok: false,
        message: `El usuario ${ nombreUsuario } no existe`
      });

    // Comparación de contraseñas
    const isPasswordCorrect = await bcrypt.compare(contrasenia, result[0].contrasenia);

    if (!isPasswordCorrect)
      return res.status(400).json({
        ok: false,
        message: 'Credenciales inválidas'
      });

    // Creación del token
    const token = jwt.sign({
      nombreUsuario: result[0].nombreUsuario
    }, process.env.TOKEN_KEY, { expiresIn: '1h' });

    res.status(200).json({
      ok: true,
      user: result[0],
      token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    })
  }
}

// Actualización del usuario
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { contrasenia, contraseniaActual } = req.body;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM usuario WHERE nombreUsuario = ${ id }`;

    if (!result[0])
      return res.status(404).json({
        ok: false,
        message: `El usuario ${ id } no existe`
      });

    // Comparación de contraseñas
    const isPasswordCorrect = await bcrypt.compare(contraseniaActual, result[0].contrasenia);

    if (!isPasswordCorrect)
      return res.status(400).json({
        ok: false,
        message: 'Contraseña actual incorrecta'
      });

    // Encriptado de la contraseña
    const contraseniaEncriptada = await bcrypt.hash(contrasenia, 12);
    await sql.query`UPDATE usuario SET contrasenia = ${ contraseniaEncriptada } WHERE nombreUsuario = ${ id }`;

    res.status(200).json({
      ok: true,
      message: 'Usuario actualizado'
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    });
  }
}

// Eliminación de un usuario
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM usuario WHERE nombreUsuario = ${ id }`;

    if (!result[0])
      return res.status(404).json({
        ok: false,
        message: `El usuario ${ id } no existe`
      });

    // Eliminación de las tareas del usuario
    await sql.query`DELETE FROM tarea WHERE idUsuario = ${ id }`;
    await sql.query`DELETE FROM usuario WHERE nombreUsuario = ${ id }`;

    res.status(200).json({
      ok: true,
      message: 'Usuario eliminado'
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    });
  }
}