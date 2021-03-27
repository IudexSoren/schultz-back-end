import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const CONNECTION_STRING  = process.env.CONNECTION_STRING;

(async () => {
    try {
      await sql.connect(CONNECTION_STRING);
    } catch (err) {
      console.log(err);
    }
})()

export default sql;