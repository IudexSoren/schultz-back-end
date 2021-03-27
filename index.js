import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlinjection from 'sql-injection';
import dotenv from 'dotenv';

import routes from './routes/index.js';

dotenv.config();

const app = express();

const PORT  = process.env.PORT;

// app.use(sqlinjection);
// app.use(express.static('/uploads'));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '100mb'
}));
app.use(bodyParser.json({
  extended: true,
  limit: '100mb'
}));
app.use(routes);

app.listen(PORT, () => {
  console.log(`API working at http://localhost:${ PORT }`)
});
