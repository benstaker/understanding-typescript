import React, { useState } from 'react';

import TodoList from './components/TodoList';
import NewTodo from './components/NewTodo';
import Todo from './models/Todo';

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = (text: string) => {
        setTodos((prevTodos) => [
            ...prevTodos,
            {
                id: 't' + (prevTodos.length + 1),
                text
            }
        ]);
    };

    const deleteTodo = (id: string) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    return (
        <div className="App">
            <NewTodo onAddTodo={addTodo} />
            <TodoList items={todos} onDeleteTodo={deleteTodo} />
        </div>
    );
};

export default App;
