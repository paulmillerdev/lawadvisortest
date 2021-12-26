import { ExpressRequest, ExpressResponse } from "../../adapter/express";

export interface Callback {
    (request: ExpressRequest, response: ExpressResponse): void;
}