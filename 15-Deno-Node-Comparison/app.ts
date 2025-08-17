import { Application } from "jsr:@oak/oak/application";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World"
})

await app.listen({ port: 8000 })