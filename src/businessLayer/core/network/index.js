import axios from 'axios';
import memory from '#services/memory';

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

// let BASE_URL = 'https://api-dev.smartpos.uz';
// let BASE_URL = 'http://37.61.213.135:9021';
// let BASE_URL = 'http://localhost:8080';

let instance = axios.create({ withCredentials: true });

instance.interceptors.request.use(function(config) {
    config.headers['Authorization'] = `Bearer ${memory.get('token')}`;
    return config;
}, function(error) {
    return Promise.reject(error)
});

const onAccessTokenFetched = (accessToken) => {
    subscribers = subscribers.filter(callback => callback(accessToken))
};

const addSubscriber = (callback) => {
    subscribers.push(callback)
};


const refreshToken = () => {
    let formData = new FormData();
    formData.set('refresh_token', memory.refreshToken);
    formData.set('grant_type', 'refresh_token');
    return axios.post('/services/uaa/oauth/token', formData, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa('web_app:changeit')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
};

instance.interceptors.response.use(function (response) {
    return response
}, async (error) => {
    let config = error.config;
    let status = (error.response && error.response.status) || 0;
    const originalRequest = config;
    if (status === 403) {

        window.location = '/user/auth';
    }
    if (status === 401) {
        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            try {
                let response = await refreshToken();
                if (response.status < 400)  {
                    isAlreadyFetchingAccessToken = false;
                    onAccessTokenFetched(response.data.accessToken)
                } else {
                    window.location = '/user/auth'
                }
            } catch (error) {
                window.location = '/user/auth'
            }
        }
        return new Promise((resolve) => {
            addSubscriber(accessToken => {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                resolve(axios(originalRequest))
            })
        })
    }
    return Promise.reject(error)
});

export default instance;
