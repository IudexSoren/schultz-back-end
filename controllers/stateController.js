import sql from '../database/connection.js';

// Obtener estados
export const getStates = async (req, res) => {
  try {
    const { recordset: result } = await sql.query`SELECT * FROM estado`;

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

// Obtener estado
export const getState = async (req, res) => {
  const id = req.params.id;
  try {
    const { recordset: result } = await sql.query`SELECT * FROM estado WHERE id = ${ id }`;

    if (!result[0])
      res.status(404).json({
        ok: false,
        message: 'El estado no existe'
      })

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