// key : string;
const get = async (key) => {
    let result = sessionStorage.getItem(key);
    return result ? JSON.parse(result) : false;
};

const store = async (key, parameters) => {
    try {
        await sessionStorage.setItem(key, JSON.stringify(parameters));
        return true;
    } catch (e) {
        return false;
    }
};

const refresh = async (key, parameters) => {
    try {
        await sessionStorage.removeItem(key).then(() => {
            sessionStorage.setItem(key, JSON.stringify(parameters));
        });
        return true;
    } catch (e) {
        return false;
    }
};

const remove = async (key) => {
    try {
        await sessionStorage.removeItem(key);
        return true;
    } catch (e) {
        return false;
    }
};

export default {get, refresh, store, remove};
