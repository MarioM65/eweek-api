## Acidente Routes (`src/routes/acidente.routes.ts`)

### `POST /acidentes`
*   **Description:** Creates a new accident record.
*   **Authentication:** None.
*   **Request Body:**
    ```json
    {
      "tipo": "string",
      "localizacao": "string",
      "data_hora": "string" (date-time format),
      "confirmado": "boolean",
      "gravidade": "string",
      "itemId": "number",
      "usuarioId": "number"
    }
    ```
*   **Expected Response (Success):**
    ```json
    {
      "id": "number",
      "tipo": "string",
      "localizacao": "string",
      "data_hora": "string" (date-time format),
      "confirmado": "boolean",
      "gravidade": "string",
      "itemId": "number",
      "usuarioId": "number",
      "createdAt": "string" (date-time),
      "updatedAt": "string" (date-time)
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "Validation error or other error message"
    }
    ```

### `GET /acidentes`
*   **Description:** Retrieves a list of all accident records.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Expected Response (Success):**
    ```json
    [
      {
        "id": "number",
        "tipo": "string",
        "localizacao": "string",
        "data_hora": "string" (date-time format),
        "confirmado": "boolean",
        "gravidade": "string",
        "itemId": "number",
        "usuarioId": "number",
        "createdAt": "string" (date-time),
        "updatedAt": "string" (date-time)
      }
    ]
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "Error message"
    }
    ```

### `GET /acidentes/:id`
*   **Description:** Retrieves a single accident record by its ID.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the accident.
*   **Expected Response (Success):**
    ```json
    {
      "id": "number",
      "tipo": "string",
      "localizacao": "string",
      "data_hora": "string" (date-time format),
      "confirmado": "boolean",
      "gravidade": "string",
      "itemId": "number",
      "usuarioId": "number",
      "createdAt": "string" (date-time),
      "updatedAt": "string" (date-time)
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Acidente not found"
    }
    ```

### `GET /acidentes/check/:id`
*   **Description:** Checks the status or existence of an accident record by its ID.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the accident.
*   **Expected Response (Success):**
    ```json
    {
      "exists": "boolean",
      "status": "string"
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Acidente not found"
    }
    ```

### `PUT /acidentes/:id`
*   **Description:** Updates an existing accident record by its ID.
*   **Authentication:** None.
*   **Request Body:** (Partial update, any of the fields from `POST /acidentes`)
    ```json
    {
      "tipo"?: "string",
      "localizacao"?: "string",
      "data_hora"?: "string" (date-time format),
      "confirmado"?: "boolean",
      "gravidade"?: "string",
      "itemId"?: "number",
      "usuarioId"?: "number"
    }
    ```
*   **Path Parameters:** `id` (string) - The ID of the accident.
*   **Expected Response (Success):**
    ```json
    {
      "id": "number",
      "tipo": "string",
      "localizacao": "string",
      "data_hora": "string" (date-time format),
      "confirmado": "boolean",
      "gravidade": "string",
      "itemId": "number",
      "usuarioId": "number",
      "createdAt": "string" (date-time),
      "updatedAt": "string" (date-time)
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Acidente not found"
    }
    ```

### `DELETE /acidentes/:id`
*   **Description:** Deletes an accident record by its ID (soft delete, moves to trash).
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the accident.
*   **Expected Response (Success):**
    ```json
    {
      "message": "Acidente moved to trash successfully"
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Acidente not found"
    }
    ```

### `PUT /acidentes/restore/:id`
*   **Description:** Restores a soft-deleted accident record from trash.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the accident to restore.
*   **Expected Response (Success):**
    ```json
    {
      "message": "Acidente restored successfully"
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Acidente not found in trash"
    }
    ```

### `DELETE /acidentes/purge/:id`
*   **Description:** Permanently deletes an accident record.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the accident to purge.
*   **Expected Response (Success):**
    ```json
    {
      "message": "Acidente purged successfully"
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Acidente not found"
    }
    ```

### `GET /acidentes/trash`
*   **Description:** Retrieves a list of soft-deleted accident records (in trash).
*   **Authentication:** None.
*   **Request Body:** None.
*   **Expected Response (Success):**
    ```json
    [
      {
        "id": "number",
        "tipo": "string",
        "localizacao": "string",
        "data_hora": "string" (date-time format),
        "confirmado": "boolean",
        "gravidade": "string",
        "itemId": "number",
        "usuarioId": "number",
        "createdAt": "string" (date-time),
        "updatedAt": "string" (date-time),
        "deletedAt": "string" (date-time)
      }
    ]
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "Error message"
    }
    ```

### `GET /acidentes/fake`
*   **Description:** Generates or retrieves fake accident data. (Purpose needs clarification from `AcidenteController.fake`).
*   **Authentication:** None.
*   **Request Body:** None.
*   **Expected Response (Success):**
    ```json
    [
      {
        // Fake accident object details
      }
    ]
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "Error message"
    }
    ```

---

## Chat Routes (`src/routes/chat.routes.ts`)

### `POST /chats`
*   **Description:** Creates a new chat record.
*   **Authentication:** None.
*   **Request Body:**
    ```json
    {
      "nome": "string",
      "criadoPor": "number"
    }
    ```
*   **Expected Response (Success):**
    ```json
    {
      "id": "number",
      "nome": "string",
      "criadoPor": "number",
      "createdAt": "string" (date-time),
      "updatedAt": "string" (date-time)
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "Validation error or other error message"
    }
    ```

### `GET /chats`
*   **Description:** Retrieves a list of all chat records.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Expected Response (Success):**
    ```json
    [
      {
        "id": "number",
        "nome": "string",
        "criadoPor": "number",
        "createdAt": "string" (date-time),
        "updatedAt": "string" (date-time)
      }
    ]
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "Error message"
    }
    ```

### `GET /chats/:id`
*   **Description:** Retrieves a single chat record by its ID.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the chat.
*   **Expected Response (Success):**
    ```json
    {
      "id": "number",
      "nome": "string",
      "criadoPor": "number",
      "createdAt": "string" (date-time),
      "updatedAt": "string" (date-time)
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Chat not found"
    }
    ```

### `PUT /chats/:id`
*   **Description:** Updates an existing chat record by its ID.
*   **Authentication:** None.
*   **Request Body:** (Partial update, any of the fields from `POST /chats`)
    ```json
    {
      "nome"?: "string",
      "criadoPor"?: "number"
    }
    ```
*   **Path Parameters:** `id` (string) - The ID of the chat.
*   **Expected Response (Success):**
    ```json
    {
      "id": "number",
      "nome": "string",
      "criadoPor": "number",
      "createdAt": "string" (date-time),
      "updatedAt": "string" (date-time)
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Chat not found"
    }
    ```

### `DELETE /chats/:id`
*   **Description:** Deletes a chat record by its ID (soft delete, moves to trash).
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the chat.
*   **Expected Response (Success):**
    ```json
    {
      "message": "Chat moved to trash successfully"
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Chat not found"
    }
    ```

### `PUT /chats/restore/:id`
*   **Description:** Restores a soft-deleted chat record from trash.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the chat to restore.
*   **Expected Response (Success):**
    ```json
    {
      "message": "Chat restored successfully"
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Chat not found in trash"
    }
    ```

### `DELETE /chats/purge/:id`
*   **Description:** Permanently deletes a chat record.
*   **Authentication:** None.
*   **Request Body:** None.
*   **Path Parameters:** `id` (string) - The ID of the chat to purge.
*   **Expected Response (Success):**
    ```json
    {
      "message": "Chat purged successfully"
    }
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Chat not found"
    }
    ```

### `GET /chats/trash`
*   **Description:** Retrieves a list of soft-deleted chat records (in trash).
*   **Authentication:** None.
*   **Request Body:** None.
*   **Expected Response (Success):**
    ```json
    [
      {
        "id": "number",
        "nome": "string",
        "criadoPor": "number",
        "createdAt": "string" (date-time),
        "updatedAt": "string" (date-time),
        "deletedAt": "string" (date-time)
      }
    ]
    ```
*   **Expected Response (Error):**
    ```json
    {
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "Error message"
    }
    ```

---
