import React from "react";
import {Route, Navigate, useLocation, Outlet} from "react-router-dom";
import { useAppContext } from "../lib/contextLib";

export default function RequireAuth({children, ...rest}) {
    const {pathname, search} = useLocation();
    const {AuthenticateUser} = useAppContext();
    
    if (!AuthenticateUser) {
        alert("Sorry! You don't have access to that page. Please log in and try again.")
        return <Navigate to="/login" state={{from: pathname}}/>;
    }
    return <Outlet/>;
}