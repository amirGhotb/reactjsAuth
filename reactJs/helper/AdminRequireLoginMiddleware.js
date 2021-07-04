import React, {useContext, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import routes from "../routes";
import AuthContext from "../storage/Contexts/AuthContext";

export default function AdminRequireLoginMiddleware(screen) {
    const authContext = useContext(AuthContext)
    const history = useHistory()
    if (authContext.auth?.apiToken !== '') {
        return screen;
    } else {
        history.push(routes.auth.login)
    }
    return <div></div>
}
