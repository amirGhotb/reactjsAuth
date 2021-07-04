import Store from '../Store';

const init = {
    email: null,
    emailVerify: false,
    apiToken: ''
};


const setEmail = (prevState, action) => {
    let data = {
        ...prevState,
        email: action.email,
        emailVerify: false,
        apiToken: '',
        isAdmin: false
    };
    Store.store('USER_INFO', data).then();
    return {
        ...prevState,
        ...data,
    };
    ;
};

const login = (prevState, action) => {
    Store.store('USER_INFO', action.data).then();
    return {
        ...prevState,
        ...action.data,
    };
};

const initData = (prevState, action) => {
    return {
        ...prevState,
        ...action.data??init,
    };
};

const logout = (prevState, action) => {
    Store.store('USER_INFO', init).then();
    return {
        ...prevState,
        ...init,
    };
};


function AuthReducer(prevState, action) {
    switch (action.type) {
        case 'LOGIN':
            return login(prevState, action);
        case 'LOGOUT':
            return logout(prevState, action);
        case 'INIT_DATA':
            return initData(prevState, action);
        case 'SET_EMAIL':
            return setEmail(prevState, action);
        default:
            throw new Error();
    }
}

export default AuthReducer;
