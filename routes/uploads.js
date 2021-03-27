import express from 'express';
import fileUpload from 'express-fileupload';

import { getFile, uploadFile, deleteFile } from '../controllers/uploadController.js';
import authentication from '../middleware/authentication.js';

const app = express();

app.use(fileUpload({
  useTempFiles: true,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}));

app.get('/:type/:fileName', getFile);
app.post('/:type/:id/:idUsuario', authentication, uploadFile);
app.delete('/:type/:fileName', authentication, deleteFile);

export default app;