import React, {useEffect, useReducer} from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";
import Landing from "./landing/Landing";
import AuthReducer from './storage/Reducers/AuthReducer';
import AuthContext from './storage/Contexts/AuthContext';
import Panel from "./panel/Panel";
import Store from "./storage/Store";
import Login from "./auth/Login";
import routes from "./routes";
import Register from "./auth/Register";
import Verify from "./auth/Verify";

const initializeUser = {
    user: null,
    apiToken: '',
};

function App() {
    const [auth, authDispatch] = useReducer(AuthReducer, {});
    const retrieveAuthData = async () => {
        try {
            let result = await Store.get('USER_INFO');
            result = result !== false ? result : initializeUser;
            return result;
        } catch (error) {
        }
    };

    useEffect(() => {
        retrieveAuthData().then((data) => {
            authDispatch({
                type: 'INIT_DATA',
                data: data,
            });
        });
    }, [])

    return auth.apiToken !== undefined ? <AuthContext.Provider value={{auth, authDispatch}}>
        <Router>
            <Route exact path={routes.landing.home}><Landing/></Route>
            <Route path={routes.panel.home}><Panel/></Route>
            <Route path={routes.auth.login}><Login/></Route>
            <Route path={routes.auth.register}><Register/></Route>
            <Route path={routes.auth.verify}><Verify/></Route>
        </Router>
    </AuthContext.Provider> : null
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App/>, document.getElementById('root'));
}
