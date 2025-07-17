import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    try {
      const todoString = localStorage.getItem("todos");
      if (todoString) {
        const todos = JSON.parse(todoString);
        setTodos(todos);
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setTodos([]);
    }
  }, []);

  const saveToLs = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    const t = todos.find((item) => item.id === id);
    if (t) {
      setTodo(t.todo);
      const newTodos = todos.filter((item) => item.id !== id);
      setTodos(newTodos);
      saveToLs(newTodos);
    }
  };

  const handleDelete = (e, id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLs(newTodos);
  };

  const handleAdd = () => {
    if (!todo.trim()) return;
    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLs(newTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    if (index !== -1) {
      const newTodos = [...todos];
      newTodos[index].isCompleted = !newTodos[index].isCompleted;
      setTodos(newTodos);
      saveToLs(newTodos);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto bg-purple-100 my-5 rounded-xl p-5 min-h-[70vh] max-w-[1000px]">
        <h1 className="font-bold text-center text-xl mb-4">
          iTask - Manage your todos at one place
        </h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <input
            onChange={handleChange}
            value={todo}
            className="bg-white w-full p-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            type="text"
            placeholder="Enter your task here..."
          />
          <button
            onClick={handleAdd}
            disabled={todo.length === 0}
            className="bg-purple-800 hover:bg-purple-950 disabled:bg-purple-700 p-2 py-1 text-sm font-bold text-white rounded-md mx-6"
          >
            Save
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input 
            onChange={toggleFinished}
            type="checkbox"
            checked={showFinished}
            className="accent-purple-800 my-4"
          />
          <label className="font-medium">Show Finished</label>
        </div>
        <div className="divider h-[1px] bg-purple-300 w-full mb-4"></div>

        <h2 className="text-lg font-bold mb-3">Your Todos</h2>

        <div className="todos flex flex-wrap gap-4">
          {todos.length === 0 && (
            <div className="m-5 text-gray-500">No Todos to display</div>
          )}

          {todos
            .filter((item) => showFinished || !item.isCompleted)
            .map((item) => (
              <div
  key={item.id}
  className="todo flex bg-white p-4 rounded shadow-md w-full md:w-1/3"
>
  {/* Left Side: Checkbox and Text */}
  <div className="flex gap-3 flex-grow">
    <input
      name={item.id}
      onChange={handleCheckbox}
      type="checkbox"
      checked={item.isCompleted}
      className="accent-purple-800 mt-1"
    />
    <div
      className={`break-words ${
        item.isCompleted ? "line-through text-gray-500" : ""
      }`}
    >
      {item.todo}
    </div>
  </div>

  {/* Right Side: Buttons */}
  <div className="flex  gap-2 ml-4 items-end">
    <button
      onClick={(e) => handleEdit(e, item.id)}
      className="bg-purple-700 hover:bg-purple-900 p-2 py-1 text-sm font-bold text-white rounded-md"
    >
      <FaEdit />
    </button>
    <button
      onClick={(e) => handleDelete(e, item.id)}
      className="bg-red-600 hover:bg-red-800 p-2 py-1 text-sm font-bold text-white rounded-md"
    >
      <MdDelete />
    </button>
  </div>
</div>

            ))}
        </div>
      </div>
    </>
  );
}

export default App;
