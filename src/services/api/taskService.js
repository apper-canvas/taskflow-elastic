import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByProject(projectId) {
    await this.delay();
    return this.tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  }

  async create(taskData) {
    await this.delay();
    const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.Id)) : 0;
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      projectId: parseInt(taskData.projectId),
      createdAt: taskData.createdAt || new Date().toISOString(),
      completedAt: taskData.status === "done" ? new Date().toISOString() : null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      projectId: parseInt(taskData.projectId || this.tasks[index].projectId)
    };

    // Set completedAt when status changes to done
    if (taskData.status === "done" && this.tasks[index].status !== "done") {
      updatedTask.completedAt = new Date().toISOString();
    } else if (taskData.status !== "done") {
      updatedTask.completedAt = null;
    }

    this.tasks[index] = updatedTask;
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const taskService = new TaskService();