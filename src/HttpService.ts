import axios from "axios";

const API = axios.create({
    // baseURL: process.env.REACT_APP_BASE_URL
    baseURL: "https://api.weekday.technology"
});

const token = sessionStorage.getItem("token");

export const client = ({ ...options }) => {

    const headers: any = {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    };

    const onSuccess = (res: any) => {
        return res;
    };
    const onError = (err: any) => {
        console.log('Err', err.response);
        return Promise.reject(err);
    };

    API.defaults.headers = headers.headers;
    return API(options)
        .then(onSuccess)
        .catch(onError);
};