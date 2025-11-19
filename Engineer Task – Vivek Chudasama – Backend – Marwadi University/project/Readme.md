# Node.js User Management API

This is a Backend Assessment project built with **Node.js**, **Express**, and **TypeORM**. It implements a RESTful API for managing users with JWT authentication, Role-Based Access Control (RBAC), and database filtering capabilities.

## 🚀 Features

* **User Registration:** Validated input using `Joi`.
* **Authentication:** Secure login using `bcrypt` for password hashing and `jsonwebtoken` (JWT).
* **Role-Based Access Control:**
    * **Admin:** Can view all users and search/filter the list.
    * **Staff:** Can only view their own profile.
* **Advanced Querying:** Search users by Name/Email and filter by Country.
* **Database:** Uses **SQLite** for easy setup (no external database server required).
* **Architecture:** Modular design separating Controllers, Routes, Middleware, and Entities.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **ORM:** TypeORM
* **Database:** SQLite (stored locally as `database.sqlite`)
* **Validation:** Joi
* **Security:** Helmet, CORS, BcryptJS

---

## ⚙️ Installation & Setup

1.  **Clone the repository** (or extract the zip file):
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Application:**
    ```bash
    npm start
    ```
    *The server will start on `http://localhost:3000`*
    *A `database.sqlite` file will be created automatically in the root directory.*

---

## 📂 Project Structure

The project follows a modular MVC-style architecture:

```text

├── controller/      # Handles business logic (Registration, Login, etc.)
├── entity/          # Database Schemas (TypeORM EntitySchemas)
├── middleware/      # Authentication & Role verification
├── routes/          # API Route definitions
├── data-source.js   # Database connection settings
└── index.js         # App entry point
├── package.json
└── README.md