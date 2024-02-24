require('dotenv').config();
import { AddTaskArgs, GetTasksArgs, Project, Task, TodoistApi, UpdateTaskArgs } from '@doist/todoist-api-typescript'

const api = new TodoistApi(process.env.TODOIST_API_KEY)

export namespace Todoist {
    export async function getProjectID(name: string): Promise<string | void> {
        return api.getProjects()
            .then((projects : Project[]) => {
                if(!projects) throw new Error("No projects");

                let projectFound : Project = projects.find((e : Project) => e.name == name);
                if(!projectFound) throw new Error("No projects with name : " + name);

                return projectFound.id;
            })
            .catch((error : Error) => {
                throw error;
            });
    }
    
    export async function getItemsInProjectByName(name: string): Promise<Task[] | void>{
        let projectID = await getProjectID(name)
        .catch(error => {
            throw error;
        })
        if(!projectID) throw new Error("Project not found with name : " + name);
        
        return api.getTasks({projectId: projectID})
        .catch((error : Error) => {
            throw error;
        });
    }
    
    export async function addItemsInProjectByName(projectName: string, itemText: string, description?: string): Promise<Task>{
        let projectID = await getProjectID(projectName)
        .catch(error => {
            throw error;
        });
        if(!projectID) throw new Error("Project not found with name : " + projectName);

        let args : AddTaskArgs = {
            projectId: projectID,
            content: itemText,
            dueLang: 'fr'
        };
        if(description) args.description = description;
    
        return api.addTask(args)
        .catch((error : Error) => {
            throw error;
        });
    }
    
    export async function updateItem(itemID: string, content?: string, description?: string): Promise<boolean>{
        let updateArgs : UpdateTaskArgs = { };

        if(content) updateArgs.content = content;
        if(description) updateArgs.description = description;

        return api.updateTask(itemID, updateArgs)
        .then(result => {
            return result.isCompleted;
        })
        .catch(error => {
            throw error;
        })
    }
    
    export async function deleteItem(itemID: string): Promise<boolean>{
        return api.deleteTask(itemID);
    }
}