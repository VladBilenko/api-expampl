import axios from 'axios';

interface IRequestObject {
    link: string,
    data?: any
}

import UserStore from '../stores/userStore';

interface IRestApi {
    get(requestConfig: IRequestObject): any,

    post(requestConfig: IRequestObject): any,

    privatePost(requestConfig: IRequestObject): any,

    privateGet(requestConfig: IRequestObject): any
}

class API implements IRestApi {
    private config = {
        apiUrl: "url"
    };

    public get = (requestConfig: IRequestObject) => {
        return axios.get((this.config.apiUrl + requestConfig.link), {params: requestConfig.data});
    };

    public post = (requestConfig: IRequestObject) => {
        return axios.post((this.config.apiUrl + requestConfig.link), requestConfig.data);
    };

    public privateGet = (requestConfig: IRequestObject) => {
        return axios.get((this.config.apiUrl + requestConfig.link), {params: this.getApiKey});
    };

    public privatePost = (requestConfig: IRequestObject) => {
            const response = axios.post((this.config.apiUrl + requestConfig.link), {...requestConfig.data, ...this.getApiKey});

            // listen if user api key is not valid
            response.then(
                res => {
                    if (res.data.error) {
                        console.log(res.data.error);
                        UserStore.forceUserLogout();
                    }
                }
            );

            return response;

    };

    public privatePostMultipart = (requestConfig: IRequestObject) => {
        requestConfig.data.append('api', localStorage.getItem('apiKey') || '');

        const response = axios.post((this.config.apiUrl + requestConfig.link), requestConfig.data, {headers: {'content-type': 'multipart/form-data'}});

        // listen if user api key is not valid
        response.then(
            res => {
                if (res.data.error) {
                    console.log(res.data.error);
                    UserStore.forceUserLogout();
                }
            }
        );

        return response;
    };

    private get getApiKey() {
        return {api: localStorage.getItem('apiKey') || ''};
    }
}

export const Api = new API();