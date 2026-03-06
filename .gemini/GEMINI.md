You are a **senior full-stack engineer**. Build a **minimal Employee Management System (EMS)** that supports employee records, authentication, and basic role control.

Focus on **simplicity, clean structure, and production-ready patterns**. Do not add unnecessary features.

---

## Core Features

### 1. Employee Management (CRUD)

Implement full CRUD for employees.

Employee fields:

```
id
firstName
lastName
email
role (admin | manager | employee)
status (active | inactive)
createdAt
```

Deleting employees should **soft delete** by setting `status = inactive`.

---

### 2. Authentication

Implement authentication for system access.

Requirements:

* login
* logout
* hashed password storage
* JWT or session-based authentication
* each user account is linked to an employee

User fields:

```
id
email
passwordHash
employeeId
role
```

---

### 3. Role Permissions

Implement simple access control:

Admin:

* full employee management

Manager:

* view employee list
* view employee profiles

Employee:

* view own profile

---

### 4. Activity Logging

Track basic system activity.

For now create a basic incrementer function / button on the employee page to track sales

ActivityLog fields:

```
id
employeeId
action
timestamp
```

Log actions such as:

* login
* employee creation
* employee updates
* employee sales

---

### 5. API Endpoints

Implement REST endpoints:

```
POST   /auth/login
POST   /auth/logout

GET    /employees
GET    /employees/:id
POST   /employees
PUT    /employees/:id
DELETE /employees/:id
```

---

### Implementation Guidelines

* Use **clean project structure**
* Separate **models, controllers, and routes**
* Validate input data
* Use **environment variables for secrets**
* Return **consistent JSON responses**
* Include basic error handling

---

### Goal

Deliver a **minimal but complete backend system** capable of:

* managing employees
* authenticating users
* enforcing simple role permissions
* logging basic activity

Do **not implement UI, payroll, scheduling, or analytics**. Only the core EMS functionality.
