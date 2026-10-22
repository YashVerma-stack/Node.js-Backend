## API's
- POST /api/auth/register

```
{
    "name": "Yash Verma",
    "email": "yash@gmail.com",
    "password": "yash1"
}
```
- POST /api/auth/login

```
{
    "email": "yash@gmail.com",
    "password": "yash1"
}
```
- you will recieved the access token when you login, copy the token and use the next api and paste the token in authentication tab select the bearer token and git the send button to get the response

- GET /api/auth/profile
