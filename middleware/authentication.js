import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authentication = async (req, res, next) => {
  try {
    const token = req.get('Authorization');

    jwt.verify(token, process.env.TOKEN_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          ok: false,
          message: 'Token inválido'
        });
      }
      req.userId = decoded?.id;

      next();
    });
  } catch (error) {
    console.log(error);
  }
}

export default authentication;