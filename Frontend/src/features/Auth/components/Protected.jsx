import { useAuth } from "../Hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import { Children } from "react";

const Protected = ({Children}) => {

    const {loading, user} = useAuth();

    if(loading) {
        return (<main><h1>Loading....</h1></main>)
    }

    if(!user){
        return <Navigate to = {'/login'} />
    }
    
    return Children

}

export default Protected