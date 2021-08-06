import React, {useContext, useEffect, useState} from "react";
import SpinnerLoading from "../components/Spinner";
import useApi from "../useApi/useApi";
import {postProcessAuth, preProcessAuth} from "../useApi/preProcesses/AuthProcesseApi";
import cogoToast from "cogo-toast";
import routes from "../routes";
import AuthContext from "../storage/Contexts/AuthContext";
import {useHistory} from "react-router-dom";

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [sendCodePost, setSendCodePost] = useState(false);
    const [changePasswordPost, setChangePasswordPost] = useState(false);
    const [inValid, setInvalid] = useState({email: false, password: false, rePassword: false});
    const authContext = useContext(AuthContext)
    const history = useHistory()

    const [sendCodeData, sendCodeStatus, sendCodeStatusCode] = useApi(
        preProcessAuth('sendCode', {email}),
        postProcessAuth, [sendCodePost],
        sendCodePost
    );

    const [changePasswordData, changePasswordStatus, changePasswordCode] = useApi(
        preProcessAuth('changePassword', {email, code: verifyCode, password}),
        postProcessAuth, [changePasswordPost],
        changePasswordPost
    );

    useEffect(() => {
        if (sendCodeStatus === 'SUCCESS') {
            if (sendCodeData === 'success') {
                cogoToast.success('کد احراز هویت ارسال به ایمیل مورد نظر ارسال گردید.')
            }
        }
        setSendCodePost(false)
    }, [sendCodeStatus])

    useEffect(() => {
        if (changePasswordStatus === 'SUCCESS') {
            if (changePasswordData.status === 'success') {
                authContext.authDispatch({
                    'type': 'LOGIN',
                    'data': {
                        'email': email,
                        'emailVerify': true,
                        'apiToken': changePasswordData.apiToken
                    }
                })
                history.push(routes.panel.home)
            } else {
                if (changePasswordData.code === 'code') {
                    cogoToast.error('کد احراز هویت ارسال شده نادرست است.')
                } else {
                    cogoToast.error('ایمیل مورد نظر در سیستم ثبت نشده است.')
                }
            }
        }
        setChangePasswordPost(false)
    }, [changePasswordStatus])

    function validate(e) {
        e.preventDefault();
        let invalidTemp = inValid
        invalidTemp.email = !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
        invalidTemp.password = password.length < 8
        invalidTemp.rePassword = (password !== rePassword)
        setInvalid({...invalidTemp})
        if (!Object.values(invalidTemp).includes(true)) {
            setChangePasswordPost(true)
        }
    }

    return <div className={'d-flex justify-content-center'}>
        <SpinnerLoading show={[sendCodeStatus, changePasswordStatus].includes('LOADING')}/>
        <div className="authBox">
            <div className="register-logo">
                <img src="../../../images/logo.svg" alt="logo"/>
            </div>
            <div className="card">
                <div className="card-body register-card-body">
                    <p className="login-box-msg">فراموشی رمز عبور</p>

                    <form onSubmit={validate} method="post" className={'my-3'}>
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
                        <button className={'btn btn-primary mb-3'} type='button'
                                onClick={() => setSendCodePost(true)}>ارسال کد احراز هویت
                        </button>

                        <div className="input-group mb-3">
                            <input type="text"
                                   className={`form-control ${inValid['verifyCode'] ? 'is-invalid' : ''}`}
                                   placeholder="کد احراز هویت" value={verifyCode}
                                   onChange={(e) => setVerifyCode(e.target.value)}/>
                            <div className="input-group-append">
                                <span className="fa fa-lock input-group-text"></span>
                            </div>
                            {
                                inValid['password'] &&
                                <p className={'invalid-feedback'}>کد وارد شده اشتباه است</p>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className={`form-control ${inValid['password'] ? 'is-invalid' : ''}`}
                                   placeholder="رمز عبور جدید" value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <div className="input-group-append">
                                <span className="fa fa-lock input-group-text"></span>
                            </div>
                            {
                                inValid['password'] &&
                                <p className={'invalid-feedback'}>لطفا رمز عبور را به صورت حداقل ۸ کارکتر وارد نمایید.</p>
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
                                <button type="submit" className="btn btn-primary btn-block btn-flat">تائید</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}
