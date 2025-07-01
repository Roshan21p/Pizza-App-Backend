# Pizzify - Online Pizza Ordering App (Backend)

**Pizzify** is the backend API of a modern pizza ordering application built with **Node.js**, **Express.js**, and **MongoDB**. It supports secure user authentication, product and order management, Stripe payment processing, and sales analytics.

The backend uses **JWT-based authentication with HTTP-only cookies** for secure sessions. It supports admin functionality to manage users, orders, and view total sales (filtered by month or year).


🔗 **Frontend Repository**: [https://github.com/Roshan21p/Pizza-Frontend](https://github.com/Roshan21p/Pizza-Frontend)  
🔗 **Live Backend URL**: [https://pizza-app-backend-807z.onrender.com](https://pizza-app-backend-807z.onrender.com/ping)

> ⚠️ Render may take 40–50 seconds to wake up if idle.

---

##  Features
- JWT-based authentication with **HTTP-only cookies**
- Forgot password and reset password via email
- Role-based access control (User/Admin)
- Product creation, update, and deletion with image upload (via **Cloudinary**)
- Order placement with email notification
- Manual order status updates (Admin)
- Stripe payment integration
- Monthly and yearly **total amount** analytics (Admin)
- Contact form endpoint (sends email)
- Centralized error handling
- Basic input validation
---

## 💻 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Roshan21p/Pizza-App-Backend.git
cd Pizza-App-Backend
```
### 2. Install dependencies
```bash
npm install
```
### 3. To run the project, use the following command
```bash
npm start
```
### 4 Backend .env
Create a .env file in the root of Pizza-App-Backend
```bash
PORT=8000
FRONTEND_URL=http://localhost:5173

# Add your actual credentials below:
DB_URL=mongodb+srv://<your-mongo-credentials>.oqsvz.mongodb.net/pizzify?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=your_jwt_secret
JWT_EXPIRY= expiry_time

COOKIE_SECURE=false    # true in production

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=your_email

STRIPE_SECRET_KEY=your_stripe_secret_key

CONTACT_US_EMAIL=your_email
```

##  API Documentation (Postman)

You can test the API using the official Postman collection.

📁 **Postman Collection (GitHub)**:  
[View or Download Pizza-App-Backend Postman Collection](https://github.com/Roshan21p/Pizza-App-Backend/blob/main/Pizzify.postman_collection.json)

> This collection includes all routes: Auth, Users Orders, Products, Cart Payments, and Admin.

 > Note: This collection is configured to use `http://localhost:8000`.<br/>
 > Make sure the backend is running locally or update the base URL to your deployed backend.

---
