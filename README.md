# Document Management System

This repository contains the backend for a robust document management system built with NestJS, designed with a microservices architecture for scalability and maintainability.

## About

The Document Management System provides a comprehensive solution for managing documents, including uploading, storing, processing, and tracking their ingestion status. It features user authentication, role-based access control (RBAC), and asynchronous document processing via RabbitMQ. This system is designed to handle a large volume of documents efficiently, making it suitable for enterprise-level applications.

## Features

* **User Authentication and Authorization:** Secure user management with JWT-based authentication and role-based access control.
* **Document Upload and Storage:** Ability to upload various document types (PDF, DOC, DOCX, TXT) with secure storage.
* **Asynchronous Document Ingestion:** Document processing is handled asynchronously using RabbitMQ for improved performance.
* **Ingestion Status Tracking:** Real-time tracking of document ingestion status (pending, processing, completed, failed).
* **Microservices Architecture:** Scalable and maintainable system with separate services for authentication, users, documents, and ingestion status.
* **Robust Error Handling and Validation:** Comprehensive input validation and error handling for reliability.
* **Database Integration:** Persistent data storage using PostgreSQL.
* **File Uploads:** Multer for file uploads.
* **Configuration:** NestJS ConfigModule for environment variable management.

## Technology Stack

* **NestJS:** Backend framework.
* **TypeScript:** Programming language.
* **TypeORM:** Object-Relational Mapping (ORM).
* **PostgreSQL:** Database.
* **RabbitMQ:** Message broker.
* **JWT:** JSON Web Tokens for authentication.
* **Multer:** File upload middleware.
* **Bcrypt:** Password hashing.
* **Class-validator:** DTO validation.
* **Jest:** Testing framework.

## Setup

1.  **Clone the Repository:**

    ```bash
    git clone [repository URL]
    cd document-management
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**

    * Create a `.env` file in the root directory.
    * Add the following environment variables:

        ```
        POSTGRES_HOST=your_postgres_host
        POSTGRES_PORT=your_postgres_port
        POSTGRES_USER=your_postgres_user
        POSTGRES_PASSWORD=your_postgres_password
        POSTGRES_DB=your_postgres_db
        JWT_SECRET=your_jwt_secret
        RABBITMQ_URL=amqp://your_rabbitmq_url
        ```

    * Replace the placeholders with your actual database and RabbitMQ credentials.

4.  **Database Migration:**

    * Run TypeORM migrations to create the database schema:

        ```bash
        npm run typeorm migration:run
        ```

## Running the Application

1.  **Start the Application:**

    ```bash
    npm run start:dev
    ```

2.  **Run Tests:**

    * Unit tests:

        ```bash
        npm run test
        ```

    * End-to-end tests:

        ```bash
        npm run test:e2e
        ```

## Project Flow

1.  **User Authentication:** Users register and log in via the `auth-service`, receiving a JWT for authenticated requests.
2.  **Document Upload:** Authenticated users upload documents via the `document-service`, which stores the file and metadata.
3.  **Document Ingestion Trigger:** Upon upload, the `document-service` publishes a message to RabbitMQ, triggering the ingestion process.
4.  **Asynchronous Processing:** A separate service (not included in this backend repository, but should be a separate microservice that listens to the rabbitMQ queue) consumes the RabbitMQ message and processes the document.
5.  **Ingestion Status Update:** The processing service updates the ingestion status in the `ingestion-status-service`.
6.  **Status Retrieval:** Users can retrieve the ingestion status of documents via the `ingestion-status-service`.
7.  **Document Retrieval:** Authenticated users can retrieve stored documents via the `document-service`.

## API Endpoints

### Auth Service

* `POST /auth/register`: Register a new user.
* `POST /auth/login`: Log in and receive a JWT.

### User Service

* `POST /users`: Create a new user (admin only).
* `GET /users`: Get all users (admin only).
* `GET /users/:id`: Get a user by ID (admin only).
* `PATCH /users/:id`: Update a user (admin only).
* `DELETE /users/:id`: Delete a user (admin only).

### Document Service

* `POST /documents/upload`: Upload a document (editor/admin only).
* `GET /documents`: Get all documents.
* `GET /documents/:id`: Get a document by ID.
* `PATCH /documents/:id`: Update a document (editor/admin only).
* `DELETE /documents/:id`: Delete a document (editor/admin only).
* `POST /documents/:id/trigger-ingestion`: Triggers the ingestion process for a specific document (admin only).
* `PATCH /documents/:id/ingestion-status`: Updates the ingestion status of a specific document.

### Ingestion Status Service

* `POST /ingestion-status`: Create a new ingestion status (admin only).
* `GET /ingestion-status`: Get all ingestion statuses (admin only).
* `GET /ingestion-status/:documentId`: Get an ingestion status by document ID (admin only).
* `PATCH /ingestion-status/:documentId`: Update an ingestion status (admin only).
* `DELETE /ingestion-status/:documentId`: Delete an ingestion status (admin only).

## Important Notes

* Ensure RabbitMQ and PostgreSQL are running before starting the application.
* This backend is designed to work with a separate document processing service that consumes RabbitMQ messages.
* Security best practices should be followed, especially in production environments.

This `README.md` provides a comprehensive overview of your document management system, making it easier for developers to understand, set up, and use your project.