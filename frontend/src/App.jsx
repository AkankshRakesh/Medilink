import { Slide, ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Service from "./pages/Service";
import Contact from "./pages/Contect";

function App() {
  return (
    <>
      <div className="bg-gray-900 h-screen">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
}

export default App;
