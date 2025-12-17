import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <EventsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/events/new"
            element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
