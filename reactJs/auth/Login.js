import React, {useContext, useEffect, useState} from "react";
import useApi from "../useApi/useApi";
import {preProcessAuth, postProcessAuth} from '../useApi/preProcesses/AuthProcesseApi'
import SpinnerLoading from "../components/Spinner";
import AdminRequireLogoutMiddleware from "../helper/AdminRequireLogoutMiddleware";
import cogoToast from "cogo-toast";
import routes from "../routes";
import AuthContext from "../storage/Contexts/AuthContext";
import {useHistory} from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginPost, setLoginPost] = useState(false)
    const [loginData, loginStatus] = useApi(
        preProcessAuth('login', {email, password}),
        postProcessAuth, [loginPost],
        loginPost
    );
    const authContext = useContext(AuthContext)
    const history = useHistory()

    useEffect(() => {
        if (loginStatus === 'SUCCESS') {
            if (loginData.status === 'success') {
                authContext.authDispatch({
                    'type': 'LOGIN',
                    'data': {
                        'email': email,
                        'emailVerify': true,
                        'apiToken': loginData.apiToken,
                        'isAdmin': loginData.isAdmin
                    }
                })
                history.push(routes.panel.home)
            } else {
                cogoToast.error('نام کاربری یا رمز عبور اشتباه می‌باشد.')
            }

        }
        setLoginPost(false)
    }, [loginStatus])

    function validate(e) {
        e.preventDefault();
        setLoginPost(true)
    }

    return AdminRequireLogoutMiddleware(<div className={'d-flex justify-content-center'}>
        <SpinnerLoading show={loginStatus === 'LOADING'}/>
        <div className="authbox">
            <div className="login-logo">
                <img src="../../../images/logo.svg" alt="logo"/>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                    <p className="login-box-msg">ورود</p>
                    <form onSubmit={validate} method="post">
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" value={email}
                                   onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل"/>
                            <div className="input-group-append">
                                <span className="fa fa-envelope input-group-text"></span>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" value={password}
                                   onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور"/>
                            <div className="input-group-append">
                                <span className="fa fa-lock input-group-text"></span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">ورود</button>
                            </div>
                        </div>
                    </form>

                    <p className="my-3">
                        <a href="#">رمز عبورم را فراموش کرده ام.</a>
                    </p>
                    <p className="my-3">
                        <a href="register.html" className="text-center">ثبت نام</a>
                    </p>
                </div>
            </div>
        </div>
    </div>)
}
