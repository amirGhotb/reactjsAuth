import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {useHistory} from "react-router-dom";
import Store from "../storage/Store";
import AuthContext from "../storage/Contexts/AuthContext";
import cogoToast from 'cogo-toast';

export const apiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};

export default function (fetchData, postProcess, watch = [], condition = true) {
    let apiBaseUrl = 'http://127.0.0.1:8000/api/';
    const [data, setData] = useState([{}, '', null]);
    const history = useHistory()
    const authContext = useContext(AuthContext)
    useEffect(() => {
        if (condition) {
            setData([{}, apiStates.LOADING, null]);
            axios({
                method: fetchData.method,
                url: apiBaseUrl + fetchData.url,
                headers: fetchData.headers,
                data: fetchData.data
            }).then((response) => {
                if (response.status !== 200) {
                    setData([{}, apiStates.ERROR, response.status]);
                    return null;
                }
                return response.data;
            })
                .then((response) => {
                    if (response) {
                        setData([
                            postProcess
                                ? postProcess(fetchData.urlName, response)
                                : response,
                            apiStates.SUCCESS]);
                    }
                })
                .catch((e) => {
                    if (e.response.status === 401) {
                        Store.remove('USER_INFO')
                        authContext.authDispatch({
                            type: 'INIT_DATA',
                        });
                        history.push('/login')
                    }
                    console.log(e);
                    cogoToast.error('خطا در عملیات')
                    setData([{}, apiStates.ERROR, e.response.status]);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, watch);

    return data;
}
