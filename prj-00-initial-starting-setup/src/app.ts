import { ProjectInput } from './components/project-input-component';
import { ProjectList } from './components/project-list-component';
import { ProjectStatus } from './models/project-model';

new ProjectList(ProjectStatus.FINISHED);
new ProjectList(ProjectStatus.ACTIVE);
new ProjectInput();
