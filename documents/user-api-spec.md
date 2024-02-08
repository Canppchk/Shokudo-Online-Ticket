## Register User

Request:
* Endpoint: /register
* Method: POST
* Request Body:
  * user_id: user_id (string)
  * password: password (string)

Response:
* Success Response:
  * HTTP Status Code: 201 Created
  * Response Body:
    * message: Account successfully created (string)
    * user: user
* Error Responses:
  * HTTP Status Code: 400 Bad Request
  * Response Body:
    * message: Account creation failed (string)
    * cause: reason (string)

## Authenticate User

Request:
* Endpoint: /authenticate
* Method: POST
* Request Body:
  * user_id: user_id (string)
  * passowrd: password (string)

Response:
* Success Response:
  * HTTP Status Code: 200 OK
  * Response Body:
    * message: Account successfully authenticated (string)
    * token: token (string)
* Error Responses:
  * HTTP Status Code: 401 Unauthorized
  * Response Body:
    * message: Account authentication failed (string)
    * cause: reason (string)
