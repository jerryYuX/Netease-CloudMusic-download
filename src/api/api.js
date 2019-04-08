import axios from 'axios';
let base = 'http://132.232.82.77:3000';
axios.defaults.withCredentials = true;
//login
export const baseUrl = () => {
    return base;

};
export const login = params => {
    return axios.post(`${base}/aies/user/permlogin`, params).then(res => res.data);

};
export const search = (params,page) => {
    return axios.get(`${base}/search?keywords= ${params}&offset=${page}`).then(res => res.data);

};
export const get_song_urls = params => {
    return axios.get(`${base}/song/url?id=${params}&br=999000`).then(res => res.data);

};
export const search_suggest = params => {
    return axios.get(`${base}/search/suggest?keywords= ${params}`).then(res => res.data);

};
export const get_album = params => {
    return axios.get(`${base}/album?id=${params}`).then(res => res.data);

};
