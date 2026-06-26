import { useContext } from "react";
import { AuthContext } from "../Auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api.js";

export function useAuth() {

    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    const handlelogin = async (email, password) => {
        setLoading(true);
        try {
            const data = await login({email, password});
            setUser(data.user);
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false);
        }
    }

    const handleregister = async (username, email, password) => {
        setLoading(true);
        try {
            const data = await register({username, email, password});
            setUser(data.user);
        } catch (error) {
            
        }
        finally{
            setLoading(false);
        }
    }

    const handlelogout = async () => {
        setLoading(true);
        try {
            const data =await logout();
            setUser(null);
        } catch (error) {
            
        }
        finally{
            setLoading(false);
        }
    }

    return {
        user,
        loading,
        handlelogin,
        handleregister,
        handlelogout
    }
}