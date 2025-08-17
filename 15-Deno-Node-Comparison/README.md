# 15-Deno-Node-Comparison

This project demonstrates a simple backend implementation using both Node.js (Express) and Deno (Oak). Both provide a REST API for a Todo resource, allowing you to compare the two environments.

## Folder Structure

```
15-Deno-Node-Comparison/
│
├── deno/
│   ├── app.ts
│   └── routes/
│       └── todos.ts
│
└── node/
    ├── app.js
    ├── package.json
    └── routes/
        └── todos.js
```

## Description

### Node.js (Express)

- Location: [node/app.js](node/app.js)
- Uses Express to create a REST API.
- Routing for `/todos` is handled in [node/routes/todos.js](node/routes/todos.js).
- Supports GET, POST, PUT, and DELETE operations for todos.

#### Run Node.js Example

```sh
cd node
npm install
node app.js
```

Access the API at `http://localhost:3000/todos`.

---

### Deno (Oak)

- Location: [deno/app.ts](deno/app.ts)
- Uses Oak (a middleware framework for Deno).
- Routing for `/todos` is handled in [deno/routes/todos.ts](deno/routes/todos.ts).
- Supports GET, POST, PUT, and DELETE operations for todos.

#### Run Deno Example

```sh
cd deno
deno run --allow-net app.ts
```

Access the API at `http://localhost:3000/todos`.

---

## Comparison

- **Node.js** uses CommonJS (`require`) and Express.
- **Deno** uses ES Modules (`import`) and Oak.
- Both provide similar endpoints and logic to highlight ecosystem differences.
