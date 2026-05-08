# 🎨 CRM Frontend

A modern CRM frontend application built using React.js.  
This project connects with the CRM Backend API and provides a clean dashboard experience for managing leads with secure JWT authentication.

---

# 🚀 Features

- 🔐 JWT Authentication
- 📊 CRM Dashboard UI
- 📋 Lead Management System
- ➕ Create Leads
- ✏️ Update Lead Status & Deal Value
- ❌ Delete Leads
- 🔒 Protected Routes
- ⚡ Axios API Integration
- 🎨 Responsive UI
- 🌐 React Router Navigation

---

# 🛠️ Technologies Used

- React.js
- Vite
- Axios
- React Router DOM
- CSS
- JWT Authentication
- Local Storage

---

# 📁 Project Structure

```bash
crm-frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│
├── public/
├── package.json
├── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mhdinshaf/crm-frontend.git
```

---

## 2️⃣ Navigate into the Project

```bash
cd crm-frontend
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# ▶️ Run the Project

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔗 Backend Connection

Make sure the CRM Backend API is running on:

```bash
http://localhost:5000
```

Backend Repository:

[crm-backend repository](https://github.com/Mhdinshaf/crm-backend?utm_source=chatgpt.com)

---

# 🔐 Authentication Flow

1. User logs in using email & password
2. Backend validates credentials
3. JWT token is returned
4. Token is stored in localStorage
5. Protected routes use the token for API requests

---

# 📡 Main Features

## 🔑 Login System

Users can securely log in using JWT authentication.

---

## 📋 Lead Management

Authenticated users can:

- View all leads
- Create new leads
- Update lead details
- Delete leads

---

# 📂 API Integration Example

```js
axios.get("http://localhost:5000/api/leads", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

# 🛡️ Security Features

- JWT Authentication
- Protected Routes
- Token-based API Access
- Secure Backend Communication

---

# 🔥 Future Improvements

- Dashboard Analytics
- Charts & Reports
- Dark Mode
- Search & Filters
- Pagination
- Role-Based Access
- Responsive Mobile Dashboard

---

# 👨‍💻 Author

Mohomed Inshaf

GitHub:

[Mhdinshaf GitHub Profile](https://github.com/Mhdinshaf?utm_source=chatgpt.com)

---

# 📄 License

This project is licensed under the ISC License.
