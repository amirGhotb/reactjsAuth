import React, {useContext, useEffect, useState} from 'react';
import useApi from "../useApi/useApi";
import {postProcessAuth, preProcessAuth} from "../useApi/preProcesses/AuthProcesseApi";
import cogoToast from 'cogo-toast';
import {useHistory} from "react-router-dom";
import SpinnerLoading from "../components/Spinner";
import routes from "../routes";
import {Redirect} from "react-router-dom";
import AuthContext from "../storage/Contexts/AuthContext";
import AdminRequireLogoutMiddleware from "../helper/AdminRequireLogoutMiddleware";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [registerPost, setRegisterPost] = useState(false);
    const [inValid, setInvalid] = useState({name: false, email: false, password: false, rePassword: false});
    const history = useHistory()
    const authContext = useContext(AuthContext)

    const [registerData, registerStatus, registerCode] = useApi(
        preProcessAuth('register', {email, password, name}),
        postProcessAuth, [registerPost],
        registerPost
    );

    function validate(e) {
        e.preventDefault();
        let invalidTemp = inValid
        invalidTemp.email = !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
        invalidTemp.name = (name === '')
        invalidTemp.password = password.length < 8
        invalidTemp.rePassword = (password !== rePassword)
        setInvalid({...invalidTemp})
        console.log(invalidTemp);
        if (!Object.values(invalidTemp).includes(true)) {
            setRegisterPost(true)
        }
    }

    useEffect(() => {
        if (registerCode === 422) {
            cogoToast.error('ایمیل وارد شده قبلا ثبت شده است.')
        }
        if (registerStatus === 'SUCCESS') {
            authContext.authDispatch({
                type: 'SET_EMAIL',
                email: email
            })
            history.push(routes.auth.verify)
        }
        setRegisterPost(false)
    }, [registerStatus])

    return AdminRequireLogoutMiddleware(<div className={'d-flex justify-content-center'}>
        <SpinnerLoading show={registerStatus === 'LOADING'}/>
        <div className="authBox">
            <div className="register-logo">
                <img src="../../../images/logo.svg" alt="logo"/>
            </div>
            <div className="card">
                <div className="card-body register-card-body">
                    <p className="login-box-msg">ثبت نام</p>

                    <form onSubmit={validate} method="post" className={'my-3'}>
                        <div className="input-group mb-3 has-validation">
                            <input type="text" className={`form-control ${inValid['name'] ? 'is-invalid' : ''}`}
                                   placeholder="نام و نام خانوادگی" value={name}
                                   onChange={(e) => setName(e.target.value)}/>
                            <div className="input-group-append">
                                <span className="fa fa-user input-group-text"></span>
                            </div>
                            {
                                inValid['name'] &&
                                <p className={'invalid-feedback'}>لطفا نام و نام خانوادگی را وارد نمایید.</p>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input type="email" className={`form-control ${inValid['email'] ? 'is-invalid' : ''}`}
                                   placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <div className="input-group-append">
                                <span className="fa fa-envelope input-group-text"></span>
                            </div>
                            {
                                inValid['email'] &&
                                <p className={'invalid-feedback'}>لطفا ایمیل را به صورت صحیح وارد نمایید.</p>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className={`form-control ${inValid['password'] ? 'is-invalid' : ''}`}
                                   placeholder="رمز عبور" value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <div className="input-group-append">
                                <span className="fa fa-lock input-group-text"></span>
                            </div>
                            {
                                inValid['password'] &&
                                <p className={'invalid-feedback'}>لطفا رمز عبور را به صورت صحیح وارد نمایید.</p>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input type="password"
                                   className={`form-control ${inValid['rePassword'] ? 'is-invalid' : ''}`}
                                   placeholder="تکرار رمز عبور" value={rePassword}
                                   onChange={(e) => setRePassword(e.target.value)}/>
                            <div className="input-group-append">
                                <span className="fa fa-lock input-group-text"></span>
                            </div>
                            {
                                inValid['rePassword'] &&
                                <p className={'invalid-feedback'}>رمز عبور و تکرار رمز عبور مطابقت ندارند.</p>
                            }
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">ثبت نام</button>
                            </div>
                        </div>
                    </form>
                    <a href="login.html" className="text-center">من قبلا ثبت نام کرده ام</a>
                </div>
            </div>
        </div>
    </div>)
}
