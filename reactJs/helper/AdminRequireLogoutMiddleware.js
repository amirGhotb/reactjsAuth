import React, {useContext, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import routes from "../routes";
import AuthContext from "../storage/Contexts/AuthContext";

export default function AdminRequireLogoutMiddleware(screen) {
    const authContext = useContext(AuthContext)
    const history = useHistory()
    if (authContext.auth?.apiToken !== '') {
        history.push(routes.landing.home)
    }
    return screen
}
