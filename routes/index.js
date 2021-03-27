import express from 'express';
// Routes
import states from './states.js';
import users from './users.js';
import tasks from './tasks.js';
import uploads from './uploads.js';

const app = express();

//
app.get('/', (req, res) => {
  res.json({
    API: 'Schultz: ToDo app',
    mainRoutes: {
      states: '/states',
      users: '/users',
      tasks: '/tasks',
      uploads: '/uploads',
    }
  });
});

app.use('/states', states);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/uploads', uploads);

export default app;