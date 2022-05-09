import { RequestHandler } from 'express';

import { Todo } from '../models/Todo';

const TODOS: Todo[] = [];

export const createTodo: RequestHandler = (req, res, next) => {
    const newTodo = new Todo(`t${TODOS.length + 1}`, req.body.text);

    TODOS.push(newTodo);

    res.status(201).json({ message: 'Created the todo', data: newTodo });
};

export const getTodos: RequestHandler = (req, res, next) => {
    res.json({ message: 'Fetched the todos', data: TODOS });
};

export const getTodo: RequestHandler<{ id: string }> = (req, res, next) => {
    const todoIndex = TODOS.findIndex((todo) => todo.id === req.params.id);

    if (todoIndex > -1) {
        res.status(201).json({ message: 'Fetched the todo', data: TODOS[todoIndex] });
    } else {
        res.status(404).send();
    }
};

export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
    const todoIndex = TODOS.findIndex((todo) => todo.id === req.params.id);

    if (todoIndex > -1) {
        TODOS[todoIndex] = new Todo(TODOS[todoIndex].id, req.body.text);
        res.status(201).json({ message: 'Updated the todo', data: TODOS[todoIndex] });
    } else {
        res.status(404).send();
    }
};

export const deleteTodo: RequestHandler<{ id: string }> = (req, res, next) => {
    const todoIndex = TODOS.findIndex((todo) => todo.id === req.params.id);

    if (todoIndex > -1) {
        TODOS.splice(todoIndex, 1);
        res.status(201).json({ message: 'Deleted the todo', data: null });
    } else {
        res.status(404).send();
    }
};
