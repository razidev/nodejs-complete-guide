import { Application } from "jsr:@oak/oak/application";

import todosRouter from "./routes/todos.ts";

const app = new Application();

app.use(async (ctx, next) => {
  ctx.response.body = "Hello World"
  await next();
})

app.use(todosRouter.routes());
app.use(todosRouter.allowedMethods());

await app.listen({ port: 3000 })