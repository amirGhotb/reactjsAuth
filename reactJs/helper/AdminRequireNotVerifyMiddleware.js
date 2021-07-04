import React, {useContext, useEffect} from 'react';
import AuthContext from "./Storage/Contexts/AuthContext";
import {useHistory} from "react-router-dom";
import routes from "../routes";

export default function AdminRequireLogoutMiddleware(screen) {
    const authContext = useContext(AuthContext)
    const history = useHistory()
    if (authContext.auth?.emailVerify) {
        history.push(routes.landing.home)
    }
    return screen
}
