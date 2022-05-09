import { Component } from './base-component';
import { Autobind } from '../decorators/autobind-decorator';
import { projectState } from '../state/project-state';
import { validateInputValue } from '../util/validation-util';

type ProjectInputValues = [string, string, number];

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
            validateInputValue({
                value: title,
                required: true
            }) &&
            validateInputValue({
                value: description,
                required: true,
                minLength: 5
            }) &&
            validateInputValue({
                value: people,
                required: true,
                min: 1,
                max: 5
            })
        );
    }
}
