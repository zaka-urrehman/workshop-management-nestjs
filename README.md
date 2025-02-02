#  Workshop Management Backend System (NestJS)

##  Project Overview
This project is a **Workshop Management Backend System** built using **NestJS**. It provides a backend solution to manage workshops, track activities, and handle users efficiently.

## 🔹 Features
✅ User Authentication & Authorization (JWT)  
✅ Role-based access control (Admin, Mentor, Learner)  
✅ Workshop Scheduling & Management  
✅ RESTful API with Swagger Documentation  
✅ Database Management (PostgreSQL)  
✅ Logging & Error Handling  

## 🛠 Tech Stack
- **Framework**: NestJS  
- **Database**: PostgreSQL   
- **ORM**: TypeORM 
- **Authentication**: JWT, Passport  
- **API Documentation**: Swagger  


---

## Database Schema (ER Diagram)

![Database ER Diagram](/images/er-diagram.png)

##  Installation & Setup

### **1️⃣ Clone the Repository**
Clone the project from GitHub and navigate into the project directory.

### **2️⃣ Install Dependencies**
Install all necessary dependencies required for the project using "pnpm install".

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and configure the database, authentication secret, and port.

### **4️⃣ Start the Application**
Run the backend server in normal or development mode.

---

##  API Documentation (Swagger UI)

This backend provides an **interactive API documentation** using Swagger.

### ** Accessing Swagger UI**
Once the application is running, open a browser and go to:
```
http://localhost:3000/api
```


This will display the **Swagger UI**, where you can explore and test the available API endpoints.

### ** How to Test APIs Using Swagger**
1. Open **Swagger UI** in the browser.
2. Browse through the list of available **API endpoints**.
3. Click on an API route (e.g., `POST /auth/login`) to expand it.
4. Click **"Try it out"** to enable request input fields.
5. Fill in the required parameters or request body.
6. Click **"Execute"** to send the request.
7. View the **API response** with status codes and data.

### ** Common API Endpoints**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/user/register` | `POST` | Register a new user (learner or mentor) |
| `/auth/user/login` | `POST` | Authenticate user & receive JWT |
| `/auth/admin/register` | `POST` | Register a new admin |
| `/auth/admin/login` | `POST` | Authenticate admin & receive JWT |
| `/workshops` | `POST` | Create a new workshop (mentor only) |
| `/workshops` | `GET` | Fetch all available workshops |
| `/workshops/:id` | `GET` | Get a specific workshop by ID |
| `/workshops/:workshop-id/activity` | `POST` | Create a new activity in workshop |
| `/workshops/:workshop-id/activity` | `DELETE` | Delete an activity |
| `/enrollments` | `POST` | Enroll in a workshop |
| `/enrollments/:id` | `DELETE` | Cancel Enrollment |

---

##  Contribution Guidelines
Contributions are welcome! To contribute:
1. **Fork** the repository.
2. Create a **new branch** (`feature/new-feature`).
3. **Commit** your changes.
4. **Push** to your branch.
5. Create a **Pull Request**.

---

##  License
This project is licensed under the **MIT License**.

---



