# Mini Event Platform (MERN)

A mini event management platform where users can sign up, create events, upload event images, and RSVP to attend. The UI is styled to closely match the “EventHorizon” template.

---

## Live Links

- **Frontend:** https://your-frontend-url.com  
- **Backend API:** https://your-backend-url.com/api  

(Replace these with your actual deployed URLs before submitting.)

---

## Tech Stack

- **Frontend:** React, React Router, Axios, Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Auth:** JSON Web Tokens (JWT)  
- **Uploads:** Multer + static `/uploads` folder  

---

## Features

### Authentication

- User signup and login using email and password.  
- JWT-based authentication with tokens stored on the client.  
- Protected routes on the frontend via a custom `AuthContext` and `<PrivateRoute />` component.[file:4]

### Events

- Create, read, update, and delete events.  
- Each event includes:
  - Title  
  - Description  
  - Date & time  
  - Location  
  - Capacity (max attendees)  
- Only the owner (creator) of an event can edit or delete it. Owner checks are enforced in backend routes.[file:4]

### RSVP System (Concurrency Safe)

- Logged-in users can **join** (RSVP) or **leave** an event.  
- Capacity is strictly enforced: users cannot join if the event is full.  
- Backend uses a single atomic MongoDB `findOneAndUpdate` for join:

  - Condition `attendees: { $ne: req.user.id }` prevents the same user being added twice.  
  - Condition  
    \`\`\`js
    $expr: { $lt: [ { $size: "$attendees" }, "$capacity" ] }
    \`\`\`  
    ensures the current attendee count is still less than capacity.[file:4]

- Because both checks and the update happen in one database operation, the RSVP logic is safe even when multiple users try to join at the same time.

### Image Upload

- After creating an event, the owner can attach an image.  
- Route `POST /api/events/:id/image` uses Multer to upload a single file.  
- The event document stores `imageUrl` like `/uploads/<filename>.jpg`.  
- Express statically serves the `uploads` directory:

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

- The React frontend constructs a full URL from `VITE_API_URL` and `imageUrl` to display the image on the event cards.

### UI / UX

- Top navigation bar with:
- App logo / name  
- “+ Create” button  
- Logged-in user email  
- “Log out” button  

- Hero section:
- Heading “Discover Unforgettable Experiences”  
- Supporting text  
- Search input and categories dropdown styled similar to the template.

- Upcoming Events section:
- Shows count: “Showing N events”.  
- Responsive grid of event cards.

- Event cards include:
- Large image at the top.  
- Category pill (e.g., “TECH”) in top-right corner.  
- Date and time row with calendar icon.  
- Event title and short description.  
- Location with pin icon and capacity with people icon.  
- For owner: **Edit** and **Delete** buttons.  
- For all users: **Join / Leave / Event full** button with correct disabled state.

---

## Project Structure

mern-events-platform/
├─ server/
│ ├─ index.js
│ ├─ models/
│ │ ├─ User.js
│ │ └─ Event.js
│ ├─ routes/
│ │ ├─ auth.js
│ │ └─ events.js
│ ├─ middleware/
│ │ └─ auth.js
│ └─ uploads/ # uploaded images (ignored by git)
├─ client/
│ ├─ src/
│ │ ├─ App.jsx
│ │ ├─ main.jsx
│ │ ├─ api/client.js
│ │ ├─ context/AuthContext.jsx
│ │ ├─ components/PrivateRoute.jsx
│ │ └─ pages/
│ │ ├─ Login.jsx
│ │ ├─ EventsList.jsx
│ │ └─ CreateEvent.jsx
│ ├─ index.html
│ └─ tailwind.config.js
└─ README.md

text

---

## Local Setup

### Prerequisites

- Node.js (v18+ recommended)  
- MongoDB Atlas account  
- Git

### 1. Clone the repository

git clone https://github.com/your-username/mern-events-platform.git
cd mern-events-platform

text

### 2. Backend setup

From project root:

cd server
npm install

text

Create `server/.env`:

MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000

text

Run the backend dev server:

npm run dev

The backend will start on `http://localhost:5000`.

### 3. Frontend setup

In a new terminal window/tab:

cd mern-events-platform/client
npm install

text

Create `client/.env`:

VITE_API_URL=http://localhost:5000/api

text

Run the frontend dev server:

npm run dev

text

The frontend will be available at `http://localhost:5173`.

---

## Deployment

### Backend (Render / Railway / similar)

1. Push the project to GitHub.  
2. Create a new Web Service from the repo.  
3. Set root to `server` if required.  
4. Configure:

   - **Build command:** `npm install`  
   - **Start command:** `node index.js`  

5. Set environment variables:

   - `MONGODB_URI` – your Atlas connection string  
   - `JWT_SECRET` – same secret as local  
   - `PORT` – (optional, platform may set this)  
   - `CLIENT_URL` – your deployed frontend URL (used for CORS)[file:4]

6. After deployment, note the backend base URL, for example:
   `https://your-backend.onrender.com`.

### Frontend (Vercel / Netlify / similar)

1. Import the same GitHub repository.  
2. Set project root to `client`.  
3. Configure build:

   - **Build command:** `npm run build`  
   - **Output directory:** `dist`  

4. Set environment variable:

VITE_API_URL=https://your-backend.onrender.com/api

text

5. Deploy and test:
- Open the frontend URL.  
- Sign up, log in, create events, upload images, and RSVP.

---

## How to Use

1. **Sign up** for a new account and log in.  
2. Click **“+ Create”** to create a new event.  
3. Fill in title, description, date & time, location, and capacity.  
4. Choose an **image file** for the event and save.  
5. The new event appears under **Upcoming Events** with its image.  
6. Use **Join / Leave** to RSVP and test capacity handling in multiple tabs.  
7. As the event owner, you can **Edit** or **Delete** your event.

---

## Concurrency & Requirements Note

- The RSVP feature is implemented using MongoDB’s `findOneAndUpdate` with conditions that:
- Prevent duplicate attendance for the same user.  
- Prevent overbooking beyond the event’s capacity.  
- This satisfies the assignment requirement for a **concurrency-safe RSVP system** using MongoDB’s atomic operations.[file:4]
