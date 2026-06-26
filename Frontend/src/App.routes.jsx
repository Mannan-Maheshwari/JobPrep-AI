import {createBrowserRouter} from "react-router";
import Register from "./features/Auth/pages/Register";
import Login from "./features/Auth/pages/Login";
import Protected from "./features/Auth/components/Protected";

export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },{
        path: "/login",
        element: <Login />
    },{
        path: "/",
        element: <Protected>
                <h1 className="text-white text-4xl bold">Home Page</h1>
            </Protected>
    }

])