import PreProcess from './PreProcess';

const apiAddress = [
    {
        name: 'register',
        url: 'register',
        method: 'post',
    },
    {
        name: 'verify',
        url: 'verify',
        method: 'post',
    },
    {
        name: 'login',
        url: 'login',
        method: 'post',
    },
    {
        name: 'sendCode',
        url: 'send-code',
        method: 'post',
    },
    {
        name: 'changePassword',
        url: 'change-password',
        method: 'post',
    },
];

function preProcessAuth(urlName, params) {
    return PreProcess(apiAddress, urlName, params);
}

function postProcessAuth(urlName, data) {
    switch (urlName) {
        case 'verify':
        case 'login':
            return {
                status: data.data.status,
                apiToken: data.data.apiToken,
            };
        case 'register':
        case 'sendCode':
            return data.data.status;
        case 'changePassword':
            return {
                status: data.data.status,
                code: data.data.code,
                apiToken: data.data.apiToken,
            }
    }
}

export {preProcessAuth, postProcessAuth};
