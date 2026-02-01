# WebMeet - Real-Time Communication Platform

A full-stack real-time communication platform featuring instant messaging and video calling capabilities, powered by [Stream](https://getstream.io/).

![WebMeet](https://img.shields.io/badge/WebMeet-RTC%20Platform-blue)

## ✨ Features

- **Real-Time Messaging** - Instant chat with friends using Stream Chat
- **Video Calling** - High-quality video calls powered by Stream Video SDK
- **User Authentication** - Secure JWT-based authentication
- **Friend System** - Send, accept, and manage friend requests
- **Notifications** - Real-time notifications for friend requests
- **Responsive Design** - Mobile-first UI that works on all devices
- **Theme Support** - Multiple themes with DaisyUI

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **DaisyUI** - UI Components
- **React Router** - Navigation
- **TanStack Query** - Data Fetching & Caching
- **Zustand** - State Management
- **Stream Chat React** - Chat Components
- **Stream Video React SDK** - Video Calling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stream Chat** - Real-time Messaging API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Stream.io Account (API Key & Secret)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-Upadhyay005/WebMeet.git
   cd WebMeet
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```
   
   Create a `.env` file in the Backend folder:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   JWT_SECRET_KEY=your_jwt_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend/vite-project
   npm install
   ```
   
   Create a `.env` file in the Frontend/vite-project folder:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

4. **Run the Application**
   
   Start Backend:
   ```bash
   cd Backend
   npm run dev
   ```
   
   Start Frontend (in a new terminal):
   ```bash
   cd Frontend/vite-project
   npm run dev
   ```

5. **Open in Browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
WebMeet/
├── Backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── lib/            # Database & Stream config
│   │   └── server.js       # Entry point
│   └── package.json
│
└── Frontend/
    └── vite-project/
        ├── src/
        │   ├── components/  # Reusable components
        │   ├── pages/       # Page components
        │   ├── hooks/       # Custom React hooks
        │   ├── lib/         # API & utilities
        │   ├── store/       # Zustand stores
        │   └── constants/   # App constants
        └── package.json
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/onboarding` - Complete user profile

### Users
- `GET /api/users` - Get recommended users
- `GET /api/users/friends` - Get user's friends

### Friend Requests
- `POST /api/users/friend-request/:id` - Send friend request
- `PUT /api/users/friend-request/:id/accept` - Accept friend request
- `GET /api/users/friend-request` - Get incoming requests
- `GET /api/users/outgoing-friend-request` - Get outgoing requests

### Chat
- `GET /api/chat/token` - Get Stream chat token

## 🎨 Screenshots

### Home Page
The home page displays your friends list and recommended users to connect with.

### Chat Page
Real-time messaging interface powered by Stream Chat with message history and typing indicators.

### Video Call
High-quality video calling with call controls and speaker layout.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Harsh Upadhyay**
- GitHub: [@Harsh-Upadhyay005](https://github.com/Harsh-Upadhyay005)

---

⭐ Star this repo if you find it helpful!
