import { FaEdit, FaCheckDouble, FaRegTrashAlt } from "react-icons/fa";
const Task = ({ task, num, deleteTask, getSingleTask, completeTask }) => {
  return (
    <div className="task">
      <p>
        <b>{num + 1}. </b>
        {task && task.name}
      </p>
      <div className="task-icons">
        <FaCheckDouble color="green" onClick={() => completeTask(task._id)} />
        <FaEdit color="purple" onClick={() => getSingleTask(task)} />
        <FaRegTrashAlt color="red " onClick={() => deleteTask(task._id)} />
      </div>
    </div>
  );
};

export default Task;
