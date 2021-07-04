import React, {useState, useContext, useEffect} from "react";
import useApi from "../useApi/useApi";
import {preProcessAuth, postProcessAuth} from '../useApi/preProcesses/AuthProcesseApi'
import SpinnerLoading from "../components/Spinner";
import AuthContext from "../storage/Contexts/AuthContext";
import {useHistory} from "react-router-dom";
import routes from "../routes";
import cogoToast from "cogo-toast";
import AdminRequireLogoutMiddleware from "../helper/AdminRequireLogoutMiddleware";

export default function Verify() {
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyPost, setVerifyPost] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);
    const authContext = useContext(AuthContext)
    const history = useHistory()

    const [verifyData, verifyStatus] = useApi(
        preProcessAuth('verify', {code: verifyCode, email: authContext.auth.email}),
        postProcessAuth, [verifyPost],
        verifyPost
    );

    function validate(e) {
        e.preventDefault();
        if (verifyCode !== '') {
            setVerifyPost(true)
        } else {
            setInvalidCode(true)
        }
    }

    useEffect(() => {
        if (verifyStatus === 'SUCCESS') {
            if (verifyData.status === 'success') {
                authContext.authDispatch({
                    'type': 'LOGIN',
                    'data': {
                        'email': authContext.auth.email,
                        'emailVerify': true,
                        'apiToken': verifyData.apiToken
                    }
                })
                history.push(routes.panel.home)
            } else {
                cogoToast.error('کد وارد شده اشتباه است')
            }
        }
        setVerifyPost(false)
    }, [verifyStatus])

    return AdminRequireLogoutMiddleware(<div className={'d-flex justify-content-center'}>
        <SpinnerLoading show={verifyStatus === 'LOADING'}/>
        <div className="authBox">
            <div className="login-logo">
                <img src="../../../images/logo.svg" alt="logo"/>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                    <p className="login-box-msg">لطفا کد احراز هویت ارسال شده از طریق ایمیل را وارد نمایید.</p>

                    <form onSubmit={validate} method="post">
                        <div className="input-group mb-3 has-validation">
                            <input type="text" className={`form-control ${invalidCode ? 'is-invalid' : ''}`}
                                   value={verifyCode}
                                   onChange={(e) => setVerifyCode(e.target.value)} placeholder="کد احراز هویت"/>
                            <div className="input-group-append">
                                <span className="fa fa-lock input-group-text"></span>
                            </div>
                            {invalidCode && <p className={'invalid-feedback'}>کد وارد شده اشتباه است.</p>}
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">تأیید</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>)
}
