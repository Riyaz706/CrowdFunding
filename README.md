# 🚀 CrowdFunding Platform

A full-stack web application that enables users to create, manage, and support fundraising campaigns in real-time.  
Built using modern web technologies with secure authentication and scalable backend architecture.

---

## 📌 Features

- 🧑‍💼 **User Authentication**
  - Secure login/signup using JWT
  - Protected routes for authorized users

- 💰 **Campaign Management**
  - Create, edit, and delete fundraising campaigns
  - Set funding goals and track progress

- 🤝 **Donation System**
  - Users can donate to campaigns
  - Real-time updates on donation progress

- 📊 **Dashboard**
  - View active, trending, and completed campaigns
  - Track contributions and campaign performance

- 🔍 **Search & Filter**
  - Find campaigns based on categories or keywords

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MongoDB

**Authentication**
- JSON Web Tokens (JWT)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Riyaz706/CrowdFunding.git
cd CrowdFunding
```

### 2️⃣ Install dependencies

**Frontend**
```bash
cd client
npm install
```

**Backend**
```bash
cd server
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run the application

**Backend**
```bash
cd server
npm start
```

**Frontend**
```bash
cd client
npm start
```

---

## 📂 Project Structure

```
CrowdFunding/
│
├── client/          # React frontend
├── server/          # Node.js backend
├── models/          # Database schemas
├── routes/          # API routes
├── controllers/     # Business logic
└── README.md
```

---

## 🔐 Security Features

- Password hashing
- JWT-based authentication
- Protected API routes

---

## 🚀 Future Improvements

- 💳 Payment gateway integration (Stripe/Razorpay)
- 📱 Mobile app support
- 📈 Advanced analytics dashboard
- 🌍 Multi-language support

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork the repo and submit a pull request.

---

## 📧 Contact

**Mohammad Riyaz**  
📩 riyazmohammad70608@gmail.com  
🔗 https://www.linkedin.com/in/md-riyaz-1a746b272/

---

## ⭐ Show your support

If you like this project, give it a ⭐ on GitHub!
