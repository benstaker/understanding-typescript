export enum ProjectStatus {
    ACTIVE = 'active',
    FINISHED = 'finished'
}

export class Project {
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
