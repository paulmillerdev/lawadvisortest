import { Database, DBResponse, DBResponseCode } from "./database";

export enum DBManagerStatus {
    SUCCESS,
    FAIL
}

export class DBManager {

    private static encrypt(password: string): string {
        const salt: string = "L4w4dv!s0rT3$T";

        return `SHA1("${salt}${password}")`;
    }

    static async addUser(username: string, password: string): Promise<boolean> {
        const sqlQuery: string = `insert into la_user (user_name, user_pass) select "${username}", ${this.encrypt(password)}`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }

    static async loginUser(username: string, password: string): Promise<string> {
        const sqlQuery: string = `select user_id from la_user where user_name="${username}" and user_pass=${this.encrypt(password)}`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            let [ row ] = dbResponse.response;
            return row.user_id;
        }
        console.error(dbResponse);
        return "";
    }

    static async registerAccessToken(userId: string, timestamp: number): Promise<boolean> {
        const sqlQuery: string = `insert into la_token (user_id, token_value, token_timestamp) select "${userId}", ${this.encrypt(`${userId}${timestamp}`)}, "${timestamp}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }

    static async getAccessToken(userId: string, timestamp: number): Promise<string> {
        const sqlQuery: string = `select token_value from la_token where user_id="${userId}" and token_timestamp="${timestamp}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            let [ row ] = dbResponse.response;
            return row.token_value;
        }
        console.error(dbResponse);
        return "";
    }

    static async getTokenUserId(token: string): Promise<string> {
        const sqlQuery: string = `select user_id from la_token where token_value="${token}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);
        const [ row ] = DBResponseCode.OK ? dbResponse.response : [];

        if (row) {
            return row.user_id;
        }
        console.error(dbResponse);
        return "";
    }

    static async getTaskList(userId: string): Promise<any[]>{
        const sqlQuery: string = `select task_id, task_title, task_details, task_order from la_task where user_id="${userId}" order by task_order asc`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return dbResponse.response;
        }
        console.error(dbResponse);
        return [];
    }

    static async addTask(userId: string, title: string, details: string, order: number): Promise<boolean> {
        const sqlQuery: string = `insert into la_task (user_id, task_title, task_details, task_order) values("${userId}", "${title}", "${details}", "${order}")`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }

    static async getMaxTaskOrder(userId: string): Promise<number> {
        const sqlQuery: string = `select max(task_order) as max_order from la_task where user_id="${userId}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            const [ row ] = dbResponse.response;
            return row.max_order ? row.max_order : 0;
        }
        console.error(dbResponse);
        return 0;
    }

    static async updateTask(userId: string, taskId: string, title: string, details: string): Promise<boolean> {
        const sqlQuery: string = `update la_task set task_title="${title}", task_details="${details}" where task_id="${taskId}" and user_id="${userId}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }

    static async updateTaskOrder(userId: string, taskId: string, order: number): Promise<boolean> {
        const sqlQuery: string = `update la_task set task_order="${order}" where task_id="${taskId}" and user_id="${userId}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }

    static async removeTask(userId: string, taskId: string): Promise<boolean> {
        const sqlQuery: string = `delete from la_task where task_id="${taskId}" and user_id="${userId}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }

    static async getTaskOrder(userId: string, taskId: string): Promise<number> {
        const sqlQuery: string = `select task_order from la_task where task_id="${taskId}" and user_id="${userId}"`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            const [ row ] = dbResponse.response;
            return row.task_order ? row.task_order : 0;
        }
        console.error(dbResponse);
        return 0;
    }

    static async moveTasksUp(userId: string, fromOrder: number, toOrder?: number): Promise<boolean> {
        const sqlQueryTo: string = toOrder ? `and task_order <= "${toOrder}"` : "";
        const sqlQuery: string = `update la_task set task_order=task_order - 1 where task_order > "${fromOrder}" ${sqlQueryTo} and user_id=${userId}`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }

    static async moveTasksDown(userId: string, fromOrder: number, toOrder: number): Promise<boolean> {
        const sqlQuery: string = `update la_task set task_order=task_order+1 where task_order < "${fromOrder}" and task_order >= "${toOrder}" and user_id=${userId}`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        if (dbResponse.code == DBResponseCode.OK) {
            return true;
        }
        console.error(dbResponse);
        return false;
    }
}