import { useAuth } from "../Hooks/useAuth";
import { Navigate } from "react-router";
import Loading from "../../../components/Loading";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected;