import { Component } from './base-component';
import { Autobind } from '../decorators/autobind-decorator';
import { Draggable } from '../models/drag-drop-model';
import { Project } from '../models/project-model';

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    titleElement: HTMLHeadingElement;
    peopleElement: HTMLHeadingElement;
    descriptionElement: HTMLParagraphElement;

    constructor(hostId: string, private project: Project) {
        super('single-project', hostId, false, `project-${project.id}`);

        this.titleElement = this.element.querySelector('h2')!;
        this.peopleElement = this.element.querySelector('h3')!;
        this.descriptionElement = this.element.querySelector('p')!;

        this.configureRender();
    }

    configureRender() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);

        this.titleElement.textContent = this.project.title;
        this.peopleElement!.textContent = `${this.project.persons} assigned`;
        this.descriptionElement!.textContent = this.project.description;
    }

    @Autobind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    @Autobind
    dragEndHandler(event: DragEvent) {
        console.log('dragend. event: ', event);
    }
}
