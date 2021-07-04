import React, {useContext} from 'react';
import AuthContext from "../../storage/Contexts/AuthContext";


export default function ApiHeader(auth = false, media = false) {
    const authContext = useContext(AuthContext);
    const Headers = {
        'content-Type': media ? 'multipart/form-data' : 'application/json',
        Accept: 'application/json'
    };
    if (auth) {
        Headers.Authorization = 'Bearer ' + authContext.auth.apiToken;
    }
    return Headers;
}
