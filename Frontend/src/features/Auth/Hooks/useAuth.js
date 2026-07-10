import { useContext, useEffect } from "react";
import { AuthContext } from "../Auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api.js";

export const useAuth = () => {

    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    const handlelogin = async (email, password) => {
        setLoading(true);
        try {
            const data = await login({email, password});
            setUser(data.user);
        } catch (error) {
            console.log(error)
            throw error;
        }
        finally{
            setLoading(false);
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            const data = await register({username, email, password});
            setUser(data.user);
        } catch (error) {
            console.log(error)
            throw error;
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

    useEffect(() => {

        const getandsetUser = async() => {

            try {
                const data = await getMe();
                console.log("getMe response:", data);
                setUser(data.user);
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
            
        }

        getandsetUser();

    },[])

    return {
        user,
        loading,
        handlelogin,
        handleRegister,
        handlelogout
    }
}