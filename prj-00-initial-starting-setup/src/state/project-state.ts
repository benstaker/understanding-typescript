import { Project, ProjectStatus } from '../models/project-model';

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>): void {
        this.listeners.push(listener);
    }

    protected _triggerListeners(items: T[]): void {
        this.listeners.forEach((listener) => listener(items.slice()));
    }
}

class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }

        return this.instance;
    }

    addProject(title: string, description: string, people: number): void {
        const newProject = new Project(Math.random().toString(), title, description, people);
        this.projects.push(newProject);

        this._triggerListeners(this.projects);
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find((item) => item.id === projectId);

        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this._triggerListeners(this.projects);
        }
    }
}

export const projectState = ProjectState.getInstance();
