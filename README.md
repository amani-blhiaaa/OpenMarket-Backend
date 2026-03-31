# OpenMarket-Backend.

A scalable Node.js backend for a general-purpose e-commerce platform using MongoDB. It provides secure authentication, product management, order processing, and API endpoints designed to support any type of online marketplace or selling system.

---

##  Features.

* User authentication (JWT-based)
* Role-based access control (admin / user)
* Product management (CRUD operations)
* Image upload with Cloudinary
* Order creation and management
* Secure password hashing (bcrypt)
* RESTful API structure
* Error handling middleware
* Environment-based configuration

---

##  Tech Stack.

* **Node.js**
* **Express.js**
* **MongoDB & Mongoose**
* **JWT (jsonwebtoken)**
* **Cloudinary**
* **Multer**
* **Nodemailer**

---

##  Project Structure.

```
e_commerce/
│
├── config/         
├── controller/       
├── middlewares/     
├── models/           
├── routes/       
├── utils/            
├── public/images/    
├── index.js         
├── .env             
└── package.json
```

---

##  Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

##  Running the Project

Development mode:

```bash
npm run amani
```

Production mode:

```bash
npm start
```

---

##  API Overview

### Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`

### Product Routes

* `GET /api/products`
* `POST /api/products`
* `PUT /api/products/:id`
* `DELETE /api/products/:id`

### Order Routes

* `POST /api/orders`
* `GET /api/orders`

---

##  Environment Variables

Make sure to configure all required environment variables before running the project.

---

##  Testing

Currently no automated tests are configured.

---

##  Future Improvements

* Payment integration (Stripe / PayPal)
* Admin dashboard
* Frontend integration (React / Next.js)
* Product reviews & ratings
* Caching (Redis)

---


