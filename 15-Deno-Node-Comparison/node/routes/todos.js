const express = require('express');

const router = express.Router();

let todos = [];

router.get('/todos', (req, res, next) => {
    res.status(200).json({todos});
});

router.post('/todos', (req, res, next) => {
    const todo = {
        id: new Date().toISOString(),
        text: req.body.text
    };
    todos.push(todo);
    res.status(201).json({message: 'Todo created!', todo});
});

router.put('/todos/:id', (req, res, next) => {
    const todoId = req.params.id;
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex === -1) {
        return res.status(404).json({message: 'Todo not found!'});
    }
    todos[todoIndex].text = req.body.text;
    res.status(200).json({message: 'Todo updated!', todo: todos[todoIndex]});
});

router.delete('/todos/:id', (req, res, next) => {
    const todoId = req.params.id;
    todos = todos.filter(t => t.id !== todoId);
    res.status(200).json({message: 'Todo deleted!'});
});

module.exports = router;