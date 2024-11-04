import React, { useReducer, createContext } from 'react';
import { Todo } from '../types/Todo';

type Action =
  | { type: 'add'; payload: string }
  | { type: 'delete'; payload: Date }
  | { type: 'toggleCompleted'; payload: Date }
  | { type: 'updateAll'; payload: boolean }
  | { type: 'updateTitle'; payload: { id: Date; title: string } };

function reducer(state: Todo[], action: Action): Todo[] {
  let newTodosList;

  switch (action.type) {
    case 'add':
      const newTodo: Todo = {
        id: new Date(),
        title: action.payload,
        completed: false,
      };

      newTodosList = [...state, newTodo];
      break;

    case 'delete':
      newTodosList = state.filter(todo => todo.id !== action.payload);
      break;

    case 'toggleCompleted':
      newTodosList = state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo,
      );
      break;

    case 'updateAll':
      newTodosList = state.map(todo => ({
        ...todo,
        completed: action.payload,
      }));
      break;

    case 'updateTitle':
      newTodosList = state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, title: action.payload.title }
          : todo,
      );
      break;

    default:
      return state;
  }

  if (newTodosList.length > 0) {
    localStorage.setItem('todos', JSON.stringify(newTodosList));
  } else {
    localStorage.removeItem('todos');
  }

  return newTodosList;
}

const initialState: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');

export const StateContext = createContext<Todo[]>(initialState);
export const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={todos}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};