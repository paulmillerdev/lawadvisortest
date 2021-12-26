import { Database, DBResponse } from "./database";

export class DatabaseManager {

    static async registerUser(username: string, password: string): Promise<DBResponse> {
        const sqlQuery = `insert into la_user (user_name, user_pass) values ("${username}", SHA1("${password}"))`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        return dbResponse;
    }

    static async loginUser(username: string, password: string): Promise<DBResponse> {
        const sqlQuery = `select user_id from la_user where user_name="${username}" and user_pass=SHA1("${password}")`;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        return dbResponse;
    }

    static async registerToken(userId: number, date: number): Promise<DBResponse> {
        const sqlQuery = ``;
        const dbResponse: DBResponse = await Database.query(sqlQuery);

        return dbResponse;
    }

}