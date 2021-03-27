import sql from '../database/connection.js';

// Obtener tareas de un usuario
export const getTasks = async (req, res) => {
  const usuario = req.params.usuario;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM tarea WHERE idUsuario = ${ usuario }`;

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

// Obtener tarea
export const getTask = async (req, res) => {
  const { id, idUsuario } = req.params;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM tarea WHERE id = ${ id } and idUsuario = ${ idUsuario }`;

    res.status(200).json({
      ok: true,
      result: result[0]
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    })
  }
}

// Crear tarea
export const createTask = async (req, res) => {
  const { id, titulo = '', descripcion = '', fecha = Date.now(), img = '', audio = '', idUsuario, idEstado = 1 } = req.body;
  try {
    await sql.query`INSERT INTO tarea VALUES (${ id }, ${ idUsuario }, ${ titulo }, ${ descripcion }, ${ fecha }, ${ idEstado }, ${ img }, ${ audio })`;
    const { recordset: result } = await sql.query`SELECT * FROM tarea WHERE id = ${ id } and idUsuario = ${ idUsuario }`;

    res.status(201).json({
      ok: true,
      message: 'Tarea creada',
      task: result[0]
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    });
  }
}

// Actualizar tarea
export const updateTask = async (req, res) => {
  const { id, idUsuario } = req.params;
  const { titulo = '', descripcion = '', fecha = Date.now(), img = '', audio= '', idEstado } = req.body;
  try {
    await sql.query`UPDATE tarea SET titulo = ${ titulo }, descripcion = ${ descripcion }, fecha = ${ fecha }, idEstado = ${ idEstado }, img = ${ img }, audio = ${ audio } WHERE id = ${ id } and idUsuario = ${ idUsuario }`;
    const { recordset: result } = await sql.query`SELECT * FROM tarea WHERE id = ${ id } and idUsuario = ${ idUsuario }`;

    res.status(200).json({
      ok: true,
      message: 'Tarea actualizada',
      task: result[0]
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    });
  }
}

// Eliminar tarea
export const deleteTask = async (req, res) => {
  const { id, idUsuario } = req.params;
  try {
    await sql.query`DELETE FROM tarea WHERE id = ${ id } and idUsuario = ${ idUsuario }`;

    res.status(200).json({
      ok: true,
      message: 'Tarea eliminada'
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error
    });
  }
}

// export const nextTaskId = async (req, res) => {
//   try {
//     const { recordset: result } = await sql.query`SELECT IDENT_CURRENT('tarea') + 1`;
//     return parseInt(result[0]);
//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       error
//     })
//   }
// }