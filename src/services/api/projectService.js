import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    await this.delay();
    return [...this.projects];
  }

  async getById(id) {
    await this.delay();
    const project = this.projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  }

  async create(projectData) {
    await this.delay();
    const maxId = this.projects.length > 0 ? Math.max(...this.projects.map(p => p.Id)) : 0;
    const newProject = {
      ...projectData,
      Id: maxId + 1,
      createdAt: projectData.createdAt || new Date().toISOString(),
      taskCount: 0
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, projectData) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    this.projects[index] = { ...this.projects[index], ...projectData };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    const deletedProject = this.projects.splice(index, 1)[0];
    return { ...deletedProject };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const projectService = new ProjectService();