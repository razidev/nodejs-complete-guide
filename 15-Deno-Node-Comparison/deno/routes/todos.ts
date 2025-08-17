import { Router } from "jsr:@oak/oak";
import { todo } from "node:test";

const router = new Router();

interface Todo {
  id: string;
  text: string;
}

let todos: Todo[] = [];

router.get('/todos', (ctx) => {
    ctx.response.body = { todos };
});

router.post('/todos', async (ctx) => {
    const body = await ctx.request.body.json();
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text,
    };
    todos.push(newTodo);

    ctx.response.body = {message: 'Todo created!', todo: newTodo};
});

router.put('/todos/:id', async (ctx) => {
    const todoId = ctx.params.id;
    const body = await ctx.request.body.json();

    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex === -1) {
        ctx.response.status = 404;
        ctx.response.body = {message: 'Todo not found!'};
        return;
    }
    todos[todoIndex].text = body.text;

    ctx.response.body = {message: 'Todo updated!', todo: todos[todoIndex]}
});

router.delete('/todos/:id', (ctx) => {
    const todoId = ctx.params.id;
    todos = todos.filter(t => t.id !== todoId);
    ctx.response.body = {message: 'Todo deleted!'};
});

export default router;