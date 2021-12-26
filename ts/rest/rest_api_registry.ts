import { API } from "./interface/rest_api_interface";
import { Register } from "./api/post/register/rest_api_post_register";

export class APIRegistry {
    static apis: API[] = [
        new Register()
    ];
}