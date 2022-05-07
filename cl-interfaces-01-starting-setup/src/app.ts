class Department {
    protected employees: string[] = [];

    constructor(private readonly id: string, public name: string) {}

    describe() {
        console.log(`Department ${this.id}: ${this.name}`);
    }

    static createEmployee(name: string) {
        return {
            name
        };
    }

    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployeeInfo() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartment extends Department {
    constructor(id: string, public admins: string[]) {
        super(id, 'IT');
    }
}

class AccountingDepartment extends Department {
    private lastReport: string;

    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        throw new Error('No report found.');
    }

    set mostRecentReport(value: string) {
        if (!value) {
            throw new Error('Please pass in a valid value!');
        }
        this.addReport(value);
    }

    constructor(id: string, public reports: string[]) {
        super(id, 'Accounting');
        this.lastReport = reports[0];
    }

    addEmployee(employee: string): void {
        if (employee === 'Max') {
            return;
        }

        this.employees.push(employee);
    }

    addReport(text: string) {
        this.reports.push(text);
        this.lastReport = text;
    }

    printReports() {
        console.log(this.reports);
    }
}

const employee1 = Department.createEmployee('Max');

const accounting = new AccountingDepartment('d1', []);
accounting.addReport('Something went wrong...');
accounting.printReports();
accounting.addEmployee('Max');
accounting.addEmployee('Manu');
accounting.describe();
accounting.printEmployeeInfo();

const itDepartment = new ITDepartment('d1', ['Max']);
itDepartment.addEmployee('Max');
itDepartment.addEmployee('Manu');
itDepartment.describe();
itDepartment.printEmployeeInfo();
