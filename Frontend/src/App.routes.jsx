import {createBrowserRouter} from "react-router";
import Register from "./features/Auth/pages/Register";
import Login from "./features/Auth/pages/Login";
import Protected from "./features/Auth/components/Protected";
import Home from "./features/Interview-prep/pages/Home";
import Interview from "./features/Interview-prep/pages/Interview";

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
                <Home />
            </Protected>
    },
    {
        path: "/interview/:id",
        element: <Interview />
    }

])