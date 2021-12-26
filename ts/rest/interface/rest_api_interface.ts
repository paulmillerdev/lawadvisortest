import { ExpressMethod } from "../../adapter/express";
import { Callback } from "./rest_api_callback_interface";

export interface API {
    httpMethod: ExpressMethod;
    path: string;
    getCallback(): Callback;
}