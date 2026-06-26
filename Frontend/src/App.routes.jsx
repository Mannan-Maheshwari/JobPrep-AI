import {createBrowserRouter} from "react-router";
import Register from "./features/Auth/pages/Register";
import Login from "./features/Auth/pages/Login";


export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },{
        path: "/login",
        element: <Login />
    },{
        path: "/",
        element: <h1>Home Page</h1>
    }

])