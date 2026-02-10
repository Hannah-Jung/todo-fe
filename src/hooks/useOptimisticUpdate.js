import api from "../utils/api";
import { showSnackbar } from "../utils/Snackbar.jsx";

export const useOptimisticUpdate = (todoList, setTodoList) => {
  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      if (!task) return;
      const originalIsComplete = task.isComplete;

      setTodoList((prevList) =>
        prevList.map((item) =>
          item._id === id ? { ...item, isComplete: !item.isComplete } : item,
        ),
      );

      const response = await api.put(`/tasks/${id}`, {
        isComplete: !originalIsComplete,
      });

      if (response.status !== 200) {
        setTodoList((prevList) =>
          prevList.map((item) =>
            item._id === id
              ? { ...item, isComplete: originalIsComplete }
              : item,
          ),
        );
      }
    } catch (error) {
      setTodoList((prevList) =>
        prevList.map((item) =>
          item._id === id ? { ...item, isComplete: originalIsComplete } : item,
        ),
      );
    }
  };

  const updateTask = async (id, newTask) => {
    try {
      const task = todoList.find((item) => item._id === id);
      if (!task) return;
      const originalTask = task.task;

      setTodoList((prevList) =>
        prevList.map((item) =>
          item._id === id ? { ...item, task: newTask } : item,
        ),
      );

      const response = await api.put(`/tasks/${id}`, {
        task: newTask,
      });

      if (response.status !== 200) {
        setTodoList((prevList) =>
          prevList.map((item) =>
            item._id === id ? { ...item, task: originalTask } : item,
          ),
        );
      } else {
        const updated = response.data?.data;
        if (updated) {
          setTodoList((prevList) =>
            prevList.map((item) =>
              item._id === id
                ? { ...item, ...updated, author: item.author }
                : item,
            ),
          );
        }
      }
    } catch (error) {
      setTodoList((prevList) =>
        prevList.map((item) =>
          item._id === id ? { ...item, task: originalTask } : item,
        ),
      );
    }
  };

  const deleteItem = async (id) => {
    let deletedTask = null;
    try {
      const task = todoList.find((item) => item._id === id);
      if (!task) return null;
      deletedTask = { ...task };

      setTodoList((prev) => prev.filter((item) => item._id !== id));
      const response = await api.delete(`/tasks/${id}`);

      if (response.status !== 200) {
        setTodoList((prev) => [...prev, deletedTask]);
        return null;
      }
      return deletedTask;
    } catch (error) {
      if (deletedTask) {
        setTodoList((prev) => [...prev, deletedTask]);
      }
      showSnackbar(error?.error || "Failed to delete");
      return null;
    }
  };

  return { toggleComplete, updateTask, deleteItem };
};
