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
        name: 'init',
        url: 'sanctum/csrf-cookie',
        method: 'get',
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
            return data.data.status;
    }
}

export {preProcessAuth, postProcessAuth};
