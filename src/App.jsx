import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoPage from "./pages/TodoPage";
import PrivateRoute from "./route/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import Loader from "./components/common/Loader";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/common/AppModal.css";
import "./App.css";
import api from "./utils/api";

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const getUser = async () => {
    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        api.defaults.headers["authorization"] = "Bearer " + storedToken;
        const response = await api.get("/user/me");
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers["authorization"];
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!authReady) return <Loader />;

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ top: 34 }}
        toastOptions={{
          duration: 3000,
          className: "app-snackbar-toast",
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid rgba(173, 216, 230, 0.8)",
            borderRadius: "8px",
            boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.12)",
          },
          success: {
            iconTheme: {
              primary: "lightblue",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/todo"
          element={
            <PrivateRoute user={user}>
              <TodoPage logout={logout} user={user} />
            </PrivateRoute>
          }
        />

        <Route path="/register" element={<RegisterPage user={user} />} />

        <Route
          path="/login"
          element={<LoginPage user={user} setUser={setUser} />}
        />
      </Routes>
    </>
  );
}

export default App;
