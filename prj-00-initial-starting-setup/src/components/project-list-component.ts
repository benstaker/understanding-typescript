import { Component } from './base-component.js';
import { ProjectItem } from './project-item-component.js';
import { Autobind } from '../decorators/autobind-decorator.js';
import { DragTarget } from '../models/drag-drop-model.js';
import { Project, ProjectStatus } from '../models/project-model.js';
import { projectState } from '../state/project-state.js';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[] = [];
    listElement: HTMLUListElement;
    titleElement: HTMLHeadingElement;

    constructor(private type: ProjectStatus) {
        super('project-list', 'app', false, `${type}-projects`);

        this.listElement = this.element.querySelector('ul')!;
        this.titleElement = this.element.querySelector('h2')!;

        this.configureRender();
    }

    configureRender() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);

        const listId = `${this.type}-projects-list`;
        this.listElement.id = listId;
        this.titleElement.textContent = `${this.type.toUpperCase()} PROJECTS`;

        projectState.addListener((projects: Project[]) => {
            this.assignedProjects = projects.filter((project) => project.status === this.type);
            this.renderProjects();
        });
    }

    protected renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;

        // Clear projects
        listEl.innerHTML = '';

        // Render project items
        for (const item of this.assignedProjects) {
            new ProjectItem(this.listElement.id, item);
        }
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer?.types[0] === 'text/plain') {
            event.preventDefault();
            this.listElement.classList.add('droppable');
        }
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer?.getData('text/plain');
        if (projectId) {
            projectState.moveProject(projectId, this.type);
        }
    }

    @Autobind
    dragLeaveHandler(_: DragEvent) {
        this.listElement.classList.remove('droppable');
    }
}
