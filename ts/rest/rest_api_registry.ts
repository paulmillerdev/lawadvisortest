import { API } from "./interface/rest_api_interface";
import { UserRegisterAPI } from "./api/post/user/rest_api_post_user_register";
import { UserLoginAPI } from "./api/post/user/rest_api_post_user_login";
import { TaskListAPI } from "./api/post/task/rest_api_post_task_list";
import { TaskAddAPI } from "./api/post/task/rest_api_post_task_add";
import { TaskUpdateAPI } from "./api/post/task/rest_api_post_task_update";
import { TaskRemoveAPI } from "./api/post/task/rest_api_post_task_remove";
import { TaskReorderAPI } from "./api/post/task/rest_api_post_task_reorder";
import { POSTCatchAPI } from "./api/post/rest_api_post_catch";
import { GETCatchAPI } from "./api/get/rest_api_get_catch";

export class APIRegistry {
    static apis: API[] = [
        new UserRegisterAPI(),
        new UserLoginAPI(),
        new TaskListAPI(),
        new TaskAddAPI(),
        new TaskUpdateAPI(),
        new TaskRemoveAPI(),
        new TaskReorderAPI(),
        new POSTCatchAPI(),
        new GETCatchAPI()
    ];
}