import fs from 'fs';
import path from 'path';

export const getFile = (req, res) => {
  const { type, fileName } = req.params;

  if (!verificarTipo(type))
    return res.status(400).json({
      ok: false,
      message: 'Parámetro \'type\' inválido'
    });

  const filePath = path.resolve(`uploads/${ type }/${ fileName }`);
  if (fs.existsSync(filePath))
    res.status(200).sendFile(filePath);
  else
    res.status(404).json({
      ok: false,
      message: 'Archivo no encontrado'
    });
}

export const uploadFile = (req, res) => {
  const { type, id, idUsuario } = req.params;

  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).json({
      ok: false,
      message: 'Ningún archivo fue seleccionado'
    });

  if (!verificarTipo(type))
    return res.status(400).json({
      ok: false,
      message: 'Parámetro \'type\' inválido'
    });

  const archivo = req.files.archivo;

  if (archivo.mimetype === 'audio/mp3') {
    archivo.name = 'blob.mp3';
  }

  const arrayName = archivo.name.split('.'),
        extension = arrayName[arrayName.length - 1].toLowerCase();

  if(!verificarExtension(extension))
    return res.status(400).json({
      ok: false,
      message: 'La extensión del archivo no es soportada'
    });

  const nombre = `${ id }-${ idUsuario }.${ extension }`,
        path = `uploads/${ type }/${ nombre }`;

  archivo.mv(path, (error) => {
    if (error)
      return res.status(500).send({
        ok: false,
        error
      });

    if (fs.existsSync(path))
    res.status(201).json({
      ok: true,
      message: 'Archivo cargado correctamente',
      path
    });
  });
}

export const deleteFile = (req, res) => {
  const { type, fileName } = req.params;

  if (!verificarTipo(type))
    return res.status(400).json({
      ok: false,
      message: 'Parámetro \'type\' inválido'
    });

  const path = `uploads/${ type }/${ fileName }`;
  if (fs.existsSync(path))
    fs.unlinkSync(path);

  res.status(200).json({
    ok: true,
    message: 'Archivo eliminado'
  });
}

const verificarTipo = (tipo) => (['audio', 'user', 'task'].includes(tipo))

const verificarExtension = (extension) => (['png','jpg','jpeg','gif','mp3'].includes(extension))