import axios from 'axios';
import ACTIONS from './constants.js';

//? ==================== Change REST_API ==========================?//
const rest_api = axios.create({
    baseURL: 'https://paiteawkan-431ea-default-rtdb.firebaseio.com/'
})

//? ----------------- Realtime Database ---------------------------?//

export const fetchData = async () => {
    let response = await rest_api.get("/crud.json");
    return Object.values(response.data)
}

export const insertData = async (payload) => {
    let key = await rest_api.post("/crud.json", payload);
    await rest_api.patch(`/crud/${key.data["name"]}.json`, { "key": key.data["name"] });
    let get = await rest_api.get("/crud.json");
    return Object.values(get.data)
}

export const updateData = async (key, payload) => {
    await rest_api.patch(`/crud/${key}.json`, payload);
    let get = await rest_api.get("/crud.json");
    return Object.values(get.data)
}

export const deleteData = async (key) => {
    await rest_api.delete(`/crud/${key}.json`);
    let get = await rest_api.get("/crud.json");
    return Object.values(get.data)
}
//* ------------- Google Auth ---------------- *//
export const signIn = (payload) => {
    return {
        type: ACTIONS.SIGN_IN,
        payload: payload
    };
}

export const signOut = () => {
    return {
        type: ACTIONS.SIGN_OUT
    };
}