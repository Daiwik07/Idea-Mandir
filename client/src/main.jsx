import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./index.css";
import Ai from "./routes/Ai";
import Dashboard from "./routes/Dashboard";
import Feed from "./routes/Feed";
import Home from "./routes/Home";
import Ideas from "./routes/Ideas";
import LandingPage from "./routes/LandingPage";
import Signup from "./routes/Signup";

const router = createBrowserRouter([
  { path: "/", element: <><LandingPage /></> },
  { path: "/signup", element: <><Navbar /><Signup /><Footer /></> },
  { path: "/home", element: <><Navbar/><Home /><Footer /></> },
  { path: "/feedback", element: <><Navbar /><Feed /><Footer /></> },
  { path: "/ai", element: <><Navbar /><Ai /><Footer /></> },
  { path: "/dashboard", element: <><Navbar /><Dashboard /></> },
  { path: "/ideas", element: <><Navbar /><Ideas /><Footer /></> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
