export interface IBackendError {
    backendError: string;
    type: string;
    message: string
    display(): Function
}

export interface IJWTError {
    name: string,
    message: string,
    expiredAt: string
}

export const errorTypes = {
    Auth: "Auth",
    Controller: "Controller",
    TodoItem: "TodoItem",
    Todoist: "Todoist"
}

export class BackendError{
    type: string;
    message: string;

    constructor(type: string, message: string){
        this.type = type;
        this.message = message;
    }

    display() : string {
        return this.type + " - " + this.message;
    }
}