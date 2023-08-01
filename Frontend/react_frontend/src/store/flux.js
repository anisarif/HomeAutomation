import CryptoJS from "crypto-js";
const backendurl = "https://197.240.48.101:5000/"

const getState = ({ getStore, getActions, setStore }) => {
    const secretKey = "homeautomation"; // Key used to encrypt and decrypt tokens
    return {
        store: {
            users: null,
            token: null,
        },
        actions: {
            login: async (username, password) => {
                const actions = getActions();
                
                const opts = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "username": username,
                        "password": password,
                    }),
                };
            
                try {
                    const res = await fetch(backendurl + "auth/login", opts)
                    if (res.status !== 200) {
                        alert(res);
                        return false;
                    }
            
                    const data = await res.json();
            
                    // Encrypt tokens using AES
                    const encryptedAccessToken = CryptoJS.AES.encrypt(data.access_token, secretKey).toString();
                    const encryptedRefreshToken = CryptoJS.AES.encrypt(data.refresh_token, secretKey).toString();
            
                    sessionStorage.setItem("token", encryptedAccessToken);
                    sessionStorage.setItem("refresh_token", encryptedRefreshToken);
            
                    setStore({ token: data.access_token });
            
                    return true;
                }
                catch (error) {
                    console.error(error)
                }
            },

            syncTokenFromSessionStore: () => {
                const encryptedToken = sessionStorage.getItem("token");
                if (encryptedToken && encryptedToken !== "" && encryptedToken !== undefined) {
                    const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
                    setStore({ token: decryptedToken });
                }
            },
            
            syncUsersFromSessionStore: () => {
                const users = sessionStorage.getItem("users");
                if (users && users !== undefined && users !== "" && users !== []) setStore({ users: users });
            },
            
            syncIdFromSessionStore: () => {
                const encryptedToken = sessionStorage.getItem("token");
                if (encryptedToken && encryptedToken !== "" && encryptedToken !== undefined) {
                    const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
                    setStore({ currentUserId: decryptedToken });
                }
            },

            logout: () => {
                const store = getStore();
                const opts = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token,
                    },
                };
                fetch(backendurl + "auth/logout", opts)
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("current_user");
                sessionStorage.removeItem("current_User");
                sessionStorage.removeItem("refresh_token");

                setStore({ token: null });
                console.log("logged out");
            },


            addUser: (username, password, role) => {
                const store = getStore();
                const opts = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token,
                    },
                    body: JSON.stringify({
                        "username": username,
                        "password": password,
                        "role": role,
                    }),
                };

                const data = fetch(backendurl + "api/user/add", opts)

                return data;
            },

            updateUser: async (id, username, role) => {
                try {
                    const store = getStore();
                    const actions = getActions();
                    const opts = {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + store.token
                        },
                        body: JSON.stringify({
                            "username": username,
                            "role": role,
                        }),
                    };
                    const url = backendurl + `api/user/update/${id}`
                    const res = await fetch(url, opts)
                    if (res.status !== 200) {
                        alert("Token expired, press ok to refresh token");
                        actions.refreshToken();
                        return false;
                    }

                    console.log("user updated")
                    return true;
                }

                catch (error) {
                    console.error(error)
                }
            },

            modifyPassword: async (id, password, newPassword) => {
                try {
                    const store = getStore();
                    const actions = getActions();
                    const opts = {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + store.token
                        },
                        body: JSON.stringify({
                            "password": password,
                            "newPassword": newPassword,
                        }),
                    };
                    const url = backendurl + `api/user/modifyPassword/${id}`
                    const res = await fetch(url, opts)
                    if (res.status !== 200) {
                        alert("Token expired, press ok to refresh token");
                        actions.refreshToken();
                        return false;
                    }

                    console.log("password updated")
                    return true;
                }

                catch (error) {
                    console.error(error)
                }
            },

            updateUserProfile: async (id, username) => {
                try {
                    const store = getStore();
                    const actions = getActions();
                    const opts = {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + store.token
                        },
                        body: JSON.stringify({
                            "username": username,
                        }),
                    };
                    const url = backendurl + `api/user/updateUsername/${id}`
                    const res = await fetch(url, opts)
                    if (res.status !== 200) {
                        alert("Token expired, press ok to refresh token");
                        actions.refreshToken();
                        return false;
                    }

                    console.log("user updated")
                    return true;
                }

                catch (error) {
                    console.error(error)
                }
            },

            getHistory: async () => {
                try {
                    const actions = getActions();
                    const opts = {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',

                        },
                    };
                    const url = backendurl + `api/getHistory`
                    const res = await fetch(url, opts)
                    if (res.status !== 200) {
                        alert("error getting history");
                        actions.refreshToken();
                        return false;
                    }

                    const history = await res.json();
                    return history;
                }
                catch (error) {

                    console.error(error)
                }
            },

            getUserbyId: async (id) => {
                try {
                    const url = backendurl + `api/user/get/${id}`
                    const data = await fetch(url)
                    return data;
                }
                catch (error) {
                    console.log(error)
                }
            },
            




            deleteUser: (id) => {
                const store = getStore();
                const opts = {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token
                    },
                    body: JSON.stringify({
                        "id": id,
                    }),
                    
                };

                const data = fetch(backendurl + `api/user/delete/${id}`, opts)
                console.log("user deleted")
                return data;
            },

            getUsers: async () => {
                try {
                    const res = await fetch(backendurl + "api/user/getall")
                    if (res.status !== 200) {
                        alert("There has been an error");
                    }

                    const data = await res.json();
                    const users = JSON.stringify(data)
                    if (users && users !== undefined && users !== "[]" && users !== "") sessionStorage.setItem("users", users);
                    return users;
                }
                catch (error) {
                    console.error(error)
                }
            },

            addBoard: (name, privacy, users) => {
                const store = getStore();
                const opts = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token,
                    },
                    body: JSON.stringify({
                        "name": name,
                        "privacy": privacy,
                        "users": users,
                    }),
                };

                const data = fetch( backendurl + "api/board/add", opts)
                console.log("board added")
                return data;
            },

            updateBoard: async (id, name, privacy, users) => {
                try {
                    const store = getStore();
                    const actions = getActions();
                    const opts = {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + store.token
                        },
                        body: JSON.stringify({
                            "name": name,
                            "privacy": privacy,
                            "users": users,
                        }),
                    };
                    const url = backendurl + `api/board/update/${id}`
                    const res = await fetch(url, opts)
                    if (res.status !== 200) {
                        alert("Token expired, press ok to refresh token");
                        actions.refreshToken();
                        return false;
                    }

                    console.log("board updated")
                    return true;
                }

                catch (error) {
                    console.error(error)
                }
            },

            deleteBoard: (id) => {
                const store = getStore();
                const opts = {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token
                    },
                    body: JSON.stringify({
                        "id": id,
                    }),
                };

                const data = fetch( backendurl + `api/board/delete/${id}`, opts)
                console.log("board deleted")
                return data;
            },

            addActuator: (name, pin, board_id, type) => {
                const store = getStore();
                const opts = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token,
                    },
                    body: JSON.stringify({
                        "name": name,
                        "pin": pin,
                        "board_id": board_id,
                        "type": type,
                    }),
                };

                const data = fetch( backendurl + "api/actuator/add", opts)

                console.log("actuator added")
                return data;
            },

            deleteActuator: (id) => {
                const store = getStore();
                const opts = {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token
                    },
                    body: JSON.stringify({
                        "id": id,
                    }),
                };

                const data = fetch(backendurl + `api/actuator/delete/${id}`, opts)
                return data;
            },

            getBoardsByUserId: (currentId) => {
                const id = Object.stringify(currentId.id)
                const url = backendurl + "api/user/boards/" + { id }
                const data = fetch(url)
                return data;
            },

            getActuatorById: async (lockId) => {

                try {
                    const id = Object.values(lockId)
                    console.log(id)
                    const url = backendurl + `api/actuator/get/${id}`
                    const data = await fetch(url)
                    return data;
                }
                catch (error) {
                    console.log(error)
                }
            },

            updateState: async ({ lockId, state }) => {
                try {
                    const store = getStore();
                    const actions = getActions();
                    const opts = {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + store.token
                        },
                        body: JSON.stringify({
                            "state": state,
                        }),
                    };
                    const url = backendurl + `api/actuator/updateState/${lockId}`
                    const res = await fetch(url, opts)
                    if (res.status !== 200) {
                        alert("An error has occured, refreshing token, please try again");
                        actions.refreshToken();
                        return false;
                    }

                    const res2 = actions.act({ lockId, state })

                    if (res2 === true) {
                        alert("actions.act res.status !== 200");
                        return false;
                    }

                    console.log("update and action done")
                    return true;
                }

                catch (error) {
                    console.error(error)
                }
            },

            updateActuator: async (id, name, pin, board_id, type) => {
                try {
                    const store = getStore();
                    const actions = getActions();
                    const opts = {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + store.token
                        },
                        body: JSON.stringify({
                            "name": name,
                            "pin": pin,
                            "board_id": board_id,
                            "type": type,
                        }),
                    };
                    const url = backendurl + `api/actuator/update/${id}`
                    const res = await fetch(url, opts)
                    if (res.status !== 200) {
                        alert("Token expired, Press OK to refresh token");
                        actions.refreshToken();
                        return false;
                    }

                    console.log("Actuator " + id + " updated")
                    return true;
                }

                catch (error) {
                    console.error(error)
                }
            },


            act: async ({ lockId, state }) => {
                try {
                    const store = getStore();
                    const opts = {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + store.token
                        },
                        body: JSON.stringify({
                            "state": state,
                        }),
                    };
                    const url = backendurl + `api/act/${lockId}`;
                    const response = await fetch(url, opts);

                    if (response.status !== 200) {
                        return false;
                    }

                    return true;

                } catch (error) {
                    console.error(error);
                }
            },

            getCurrentWeather: () => {
                const url = "https://api.open-meteo.com/v1/forecast?latitude=36.845128&longitude=10.163944&current_weather=true&forecast_days=1&timezone=Europe%2FBerlin"
                return fetch(url)
                    .then(res => res.json())
                    .catch(error => console.log(error))
            },

            getRoomSensor: () => {
                const store = getStore();
                const opts = {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store.token
                    },
                };
                const url = backendurl + "api/sensor/temp_hum/"
                return fetch(url, opts)
                    .then(res => res.json())
                    .catch(error => console.log(error))
            },

            refreshToken: async () => {
                try {
                    const encryptedRefreshToken = sessionStorage.getItem("refresh_token");
                    if (encryptedRefreshToken && encryptedRefreshToken !== "" && encryptedRefreshToken !== undefined) {
                        const decryptedRefreshToken = CryptoJS.AES.decrypt(encryptedRefreshToken, secretKey).toString(CryptoJS.enc.Utf8);
                        
                        const opts = {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + decryptedRefreshToken
                            },
                        };
            
                        const url = backendurl + "auth/refresh";
                        const response = await fetch(url, opts);
                        const data = await response.json();
            
                        if (response.status !== 200) {
                            alert(data);
                            return false;
                        }
            
                        // Encrypt the new token before storing it in sessionStorage
                        const encryptedNewToken = CryptoJS.AES.encrypt(data.access_token, secretKey).toString();
                        sessionStorage.setItem("token", encryptedNewToken);
                        setStore({ token: data.access_token }); // You might want to set the store with the decrypted token instead
                        return true;
                    }
            
                } catch (error) {
                    console.error(error);
                }
            },

        }
    };
};

export default getState;