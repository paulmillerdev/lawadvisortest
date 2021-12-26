import { API } from "./interface/rest_api_interface";
import { RegisterAPI } from "./api/post/rest_api_post_register";
import { LoginAPI } from "./api/post/rest_api_post_login";

export class APIRegistry {
    static apis: API[] = [
        new RegisterAPI(),
        new LoginAPI()
    ];
}