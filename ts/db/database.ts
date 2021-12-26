import mysql, { PoolConfig } from "mysql";
import { DBCredentials } from "./database_credentials"; // COMMENT THIS, UNCOMMENT THE LINE BELOW
//import { DBCredentials } from "./database_credentials_stub"; 

export type DBResponse = {
    code: string;
    response?: any[];
    message?: string;
}

export enum DBResponseCode {
    OK = 'OK'
}

export class Database {
    static pool: mysql.Pool;

    static connect(): void {
        let connectionDetails: PoolConfig = {
            connectionLimit: 10,
            host: DBCredentials.HOST,
            user: DBCredentials.USERNAME,
            password: DBCredentials.PASSWORD,
            database: DBCredentials.DATABASE
        };

        this.pool = mysql.createPool(connectionDetails);
    }

    static async query(query: string): Promise<DBResponse> {
        let dbResponse: DBResponse = {
            code: ''
        };

        try {
            let queryResponse: object[] = await this.sendQuery(query);
            dbResponse.code = DBResponseCode.OK;
            dbResponse.response = queryResponse;
        } catch (err: any) {
            dbResponse.code = err.code;
            dbResponse.message = this.getErrorMessage(err.code);
        }

        return dbResponse;
    }

    private static sendQuery(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool.query(query, (error: any, result: any) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    private static getErrorMessage(code: string): string {
        const errorMap: { [ key: string ] : string } = {
            "ER_DUP_ENTRY" : "There is an existing user with the same username."
        }

        if (code in errorMap) {
            return errorMap[code];
        }

        return "Sorry. We should've caught that, but we didn't.";
    }
}