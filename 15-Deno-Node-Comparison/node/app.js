const express = require('express');

const todosRoutes = require('./routes/todos');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log('Some middleware');
    next();
});
app.use(todosRoutes);

app.listen(3000);