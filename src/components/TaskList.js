import axios from "axios";
import { useState, useEffect } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import { URL } from "../App";
import { FaCentercode, FaSkiing } from "react-icons/fa";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [todo, setToDo] = useState([]);
  const [completed, setCompletedTask] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/v1/tasks`);
      const todo = data.filter((item) => item.completed === false);
      const completedTasks = data.filter((item) => item.completed === true);
      setTasks(todo);
      setToDo(todo);
      setCompletedTask(completedTasks);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //console.log(e.target);
    setFormData({ ...formData, [name]: value });
    //formData && console.log(formData);
  };

  const createTask = async (e) => {
    e.preventDefault();
    //console.log(formData);
    if (name === "") {
      return toast.error("Your task cannot be empty!!!");
    }
    try {
      if (tasks.find((item) => item.name === name)) {
        toast.error("You already have this task on your list!");
      } else {
        await axios.post(`${URL}/api/v1/tasks`, formData);
        getTasks();
        toast.success("Task added successfully");
        setFormData({ ...formData, name: "" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/v1/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Your task cannot be empty!");
    }
    try {
      if (tasks.find((item) => item.name === name)) {
        toast.error("You already have this task on your list!");
      } else {
        await axios.put(`${URL}/api/v1/tasks/${taskID}`, formData);
        setFormData({ ...formData, name: "" });
        setIsEditing(false);
        getTasks();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`${URL}/api/v1/tasks/${id}`, { completed: true });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      <div className="--flex-between --pb">
        <button onClick={() => setTasks(todo)}>
          <b>Total TODO tasks: </b>
          {todo.length}
        </button>
        <button onClick={() => setTasks(completed)}>
          <b>Completed Tasks: </b>
          {completed.length}
        </button>
      </div>
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added yet!</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                num={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                completeTask={completeTask}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
