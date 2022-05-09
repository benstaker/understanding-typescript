// Types
enum ProjectStatus {
    ACTIVE = 'active',
    FINISHED = 'finished'
}
type ProjectInputValues = [string, string, number];
type Listener<T> = (items: T[]) => void;
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

// Decorators
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const { configurable, enumerable } = descriptor;
    return {
        configurable,
        enumerable,
        get() {
            return descriptor.value.bind(this);
        }
    };
}

// Component
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as U;
        if (newElementId) {
            this.element.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(
            insertAtStart ? 'afterbegin' : 'beforeend',
            this.element
        );
    }

    abstract configureRender(): void;
}

// Project
class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus = ProjectStatus.ACTIVE
    ) {}

    get persons() {
        if (this.people > 1) {
            return `${this.people} persons`;
        } else if (this.people === 1) {
            return `1 person`;
        }

        return 'No one';
    }
}

// State
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>): void {
        this.listeners.push(listener);
    }

    protected _triggerListeners(items: T[]): void {
        this.listeners.forEach((listener) => listener(items.slice()));
    }
}

// ProjectState
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

// ProjectItem
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

// ProjectList
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector(
            '#description'
        )! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configureRender();
    }

    configureRender() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    private clearInputValues(): void {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    private gatherInputValues(): ProjectInputValues {
        const { value: title } = this.titleInputElement;
        const { value: description } = this.descriptionInputElement;
        const { value: people } = this.peopleInputElement;

        return [title.trim(), description.trim(), +people.trim()];
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();

        const userInput = this.gatherInputValues();

        if (this.validate(userInput)) {
            console.log('valid user input: ', userInput);
            projectState.addProject(...userInput);
            this.clearInputValues();
        } else {
            console.error('invalid user input: ', userInput);
        }
    }

    private validate(userInput: ProjectInputValues): boolean {
        const [title, description, people] = userInput;

        return (
            this.validateInputValue({
                value: title,
                required: true
            }) &&
            this.validateInputValue({
                value: description,
                required: true,
                minLength: 5
            }) &&
            this.validateInputValue({
                value: people,
                required: true,
                min: 1,
                max: 5
            })
        );
    }

    private validateInputValue(input: Validatable): boolean {
        let isValid = true;

        if (input.required) {
            isValid = isValid && !!input.value.toString().length;
        }

        if (typeof input.value === 'string') {
            if (input.minLength != null) {
                isValid = isValid && input.value.length >= input.minLength;
            }
            if (input.maxLength != null) {
                isValid = isValid && input.value.length <= input.maxLength;
            }
        }

        if (typeof input.value === 'number') {
            if (input.min) {
                isValid = isValid && input.value >= input.min;
            }
            if (input.max) {
                isValid = isValid && input.value <= input.max;
            }
        }

        return isValid;
    }
}

// Initialise
const projectState = ProjectState.getInstance();
const finishedProjectList = new ProjectList(ProjectStatus.FINISHED);
const activeProjectList = new ProjectList(ProjectStatus.ACTIVE);
const projectInput = new ProjectInput();
