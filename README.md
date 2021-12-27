# LawAdvisor Test
## Requirements
Setup a project with your programming language of choice and create an API for managing a TODO list with the following specification:
- Register
    - The user should be able to register with a username and password
    - Usernames must be unique across all users
- Login
    - The user should be able to log in with the credentials they provided in the register endpoint
    - Should return an access token that can be used for the other endpoints
- TODO List
    - The user should only be able to access their own tasks
    - The user should be able to list all tasks in the TODO list
    - The user should be able to add a task to the TODO list
    - The user should be able to update the details of a task in their TODO list
    - The user should be able to remove a task from the TODO list
    - The user should be able to reorder the tasks in the TODO list
    - A task in the TODO list should be able to handle being moved more than 50 times
    - A task in the TODO list should be able to handle being moved to more than one task away from its current position
## Dev & deployment specs
- Run with Nodejs
- Project is written in TypeScript (included in dev dependencies); no-brainer but compile before you run
- I used my own mysql db but did not include the connection details for obvious reasons (update /ts/db/database_credentials.ts)
- Project deploys to localhost:3000 (didn't bother setting up a conf file for this)
## Testing
- You can test a deployed version in [my site](http://code.benndl.com:3000)
- Send POST requests only (via Postman or your preferred tool); refer to API documentation below
- Project is daemonized but just in case it isn't running, send me a message so I can check and start it up
## API documentation a.k.a. payload descrptions
### /user
#### /user/register
```
{
    "username": "USERNAME",
    "password": "PASSWORD"
}
```
#### /user/login
```
{
    "username": "USERNAME",
    "password": "PASSWORD"
}
```
### /task
#### /task/list
```
{
    "token": "TOKEN_FROM_LOGIN"
}
```
#### /task/add
```
{
    "token": "TOKEN_FROM_LOGIN",
    "task": {
        "title": "TITLE",
        "details": "DETAILS"
    }
}
```

#### /task/update
```
{
    "token": "TOKEN_FROM_LOGIN",
    "task": {
        "id": "TASK_ID",
        "title": "TITLE",
        "details": "DETAILS"
    }
}
```

#### /task/remove
```
{
    "token": "TOKEN_FROM_LOGIN",
    "task": {
        "id": "TASK_ID"
    }
}
```

#### /task/reorder
```
{
    "token": "TOKEN_FROM_LOGIN",
    "task": {
        "id": "TASK_ID",
        "order": "NEW_ORDER"
    }
}
```
