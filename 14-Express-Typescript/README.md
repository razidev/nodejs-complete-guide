# 14-Express-Typescript

This project is a simple REST API example built with [Express](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/). The API manages a Todo resource with basic CRUD (Create, Read, Update, Delete) operations.

## Folder Structure

```
.
├── src/
│   ├── app.ts           # Express application entry point
│   ├── models/
│   │   └── todo.ts      # Todo data model (TypeScript class)
│   └── routes/
│       └── todos.ts     # Routing for /todos endpoints
├── package.json         # npm dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── .gitignore
```

## How to Run

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Run in development mode (with ts-node-dev)**
   ```sh
   npx ts-node-dev src/app.ts
   ```

   Or, after building:
   ```sh
   tsc
   node dist/app.js
   ```

## Code Overview

- **src/app.ts**  
  Main file that initializes Express, sets up middleware, and connects the routes from [`routes/todos.ts`](src/routes/todos.ts).

- **src/models/todo.ts**  
  Defines the `Todo` class representing a todo item (id, text).

- **src/routes/todos.ts**  
  Implements RESTful endpoints for `/todos`:
  - `GET /todos` : Retrieve all todos.
  - `POST /todos` : Add a new todo.
  - `PUT /todos/:id` : Update a todo by id.
  - `DELETE /todos/:id` : Delete a todo by id.

## Example Requests

- **GET /todos**
- **POST /todos**
  ```json
  {
    "text": "Learn TypeScript"
  }
  ```
- **PUT /todos/:id**
  ```json
  {
    "text": "Update todo"
  }
  ```
- **DELETE /todos/:id**

## Notes

- Todos are stored in memory (an array), so data will be lost when the server restarts.
- This project is intended for learning the basics of Express with TypeScript.