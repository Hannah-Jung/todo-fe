import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoPage from "./pages/TodoPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/common/AppModal.css";
import "./App.css";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
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
        <Route path="/" element={<TodoPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
