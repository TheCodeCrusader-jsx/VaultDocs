# 🗃️ VaultDocs Backend

VaultDocs is a **secure document upload and management backend** built with **Node.js**, **Express.js**, **MongoDB**, and **Multer**. It allows users to upload documents like Aadhar, PAN, Passport, or License, and enables admin-level status updates (pending, approved, rejected). This backend is structured for clarity, scalability, and ease of maintenance.

---

## 🌐 Project Objective

VaultDocs is designed to securely collect and manage important documents from users. Its key features include:

* Secure file uploads using Multer
* MongoDB-based document storage
* Role-ready backend (future-ready for admin-user roles)
* Status-based document management
* Download capability for documents
* Well-structured, modular, and clean codebase

---

## 🧠 Key Features

### 🔒 Secure Document Upload

Users can upload documents like Aadhar, PAN, etc. The backend validates the document type and stores the file on the server.

### ✅ Document Verification Flow

Admins (or a future admin panel) can update the status of each document (pending, approved, or rejected).

### 🧾 Document Metadata

Every document stores:

* Uploader's name
* Document type (restricted to valid values)
* File path for retrieval
* Status (used for verification workflow)

### 📥 Document Downloads

Each uploaded document can be downloaded using a unique ID, simulating real-world workflows like admin review, download, and processing.

---

## 🏗️ Folder Structure Explained

| Folder / File                 | Purpose                                           |
| :---------------------------- | :------------------------------------------------ |
| `config/db.js`                | Handles MongoDB connection using Mongoose. Loads from `.env`. |
| `controllers/documentController.js` | Core logic: upload, fetch, update status, download. |
| `models/documentModel.js`     | Mongoose schema for documents.                    |
| `routes/documentRoutes.js`    | All API route definitions.                        |
| `uploads/`                    | Stores user-uploaded documents.                   |
| `.env`                        | Keeps sensitive config like DB connection.        |
| `server.js`                   | App entry point — configures Express, middleware, routes. |

---

## ⚙️ How It Works

### 🧩 1. MongoDB Connection

* Securely connects using Mongoose.
* Auto-connects when the server boots.
* Handles errors gracefully.

### 🧩 2. API Routing System

* Routes are modular and placed in `routes/documentRoutes.js`.
* Each route is mapped to a controller function.

### 🧩 3. Multer Middleware

* Handles `multipart/form-data` uploads.
* Saves files in a dedicated `uploads/` folder with unique filenames (timestamp-based).
* Only stores metadata in MongoDB, keeping the database lean.

### 🧩 4. Mongoose Schema

* Validates document type (only `aadhar`, `pan`, `passport`, `license`).
* Validates name (only letters).
* Sets default status to `pending`.

---

## 📬 API Endpoints Summary

| METHOD  | ENDPOINT             | PURPOSE                       |
| :------ | :------------------- | :---------------------------- |
| `POST`  | `/api/documents`     | Upload a new document         |
| `GET`   | `/api/documents`     | Get all uploaded documents    |
| `PATCH` | `/api/documents/:id` | Update a document’s status    |
| `GET`   | `/api/documents/:id` | Download a specific document  |

---

## 🌍 Environment Setup

You need to create a `.env` file in your project's root directory with the following content:

```ini
PORT=5000
MONGODB_URI=your-mongo-uri
