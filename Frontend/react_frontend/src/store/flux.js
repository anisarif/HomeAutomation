
const getState = ({ getStore, getActions, setStore }) => {
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

                    const res = await fetch("http://127.0.0.1:5000/auth/login", opts)
                    if (res.status !== 200) {
                        alert(res);
                        actions.refreshToken();
                        return false;
                    }

                    const data = await res.json();
                    sessionStorage.setItem("token", data.access_token);
                    sessionStorage.setItem("refresh_token", data.refresh_token);
                    setStore({ token: data.access_token });
                    return true;
                }
                catch (error) {
                    console.error(error)
                }
            },

            syncTokenFromSessionStore: () => {
                const token = sessionStorage.getItem("token");
                if (token && token !== "" && token !== undefined) setStore({ token: token });
            },

            syncUsersFromSessionStore: () => {
                const users = sessionStorage.getItem("users");
                if (users && users !== undefined && users !== "" && users !== []) setStore({ users: users });
            },

            syncIdFromSessionStore: () => {
                const token = sessionStorage.getItem("token");
                if (token && token !== "" && token !== undefined) setStore({ currentUserId: token });
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
                fetch("http://127.0.0.1:5000/auth/logout", opts)
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("current_user");
                sessionStorage.removeItem("current_User");
                sessionStorage.removeItem("refresh_token");

                setStore({ token: null });
                console.log("logged out");
            },


            addUser: (username, password, role) => {
                const store = getStore();
                const actions = getActions();
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

                const data = fetch("http://127.0.0.1:5000/api/user/add", opts)
                if (data.status !== 200) {
                    alert("Token expired, press ok to refresh token");
                    actions.refreshToken();
                    return false;
                }

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
                    const url = `http://127.0.0.1:5000/api/user/update/${id}`
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
                    const url = `http://127.0.0.1:5000/api/user/modifyPassword/${id}`
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
                    const url = `http://127.0.0.1:5000/api/user/updateUsername/${id}`
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
                    const url = `http://127.0.0.1:5000/api/getHistory`
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
                    const url = `http://127.0.0.1:5000/api/user/get/${id}`
                    const data = await fetch(url)
                    return data;
                }
                catch (error) {
                    console.log(error)
                }
            },
            




            deleteUser: (id) => {
                const store = getStore();
                const actions = getActions();
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

                const data = fetch(`http://127.0.0.1:5000/api/user/delete/${id}`, opts)
                if (data.status !== 200) {
                    alert("Token expired, press ok to refresh token");
                    actions.refreshToken();
                    return false;
                }
                console.log("user deleted")
                return data;
            },

            getUsers: async () => {
                try {
                    const res = await fetch("http://127.0.0.1:5000/api/user/getall")
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
                const actions = getActions();
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

                const data = fetch("http://127.0.0.1:5000/api/board/add", opts)
                if (data.status !== 200) {
                    alert("Token expired, press ok to refresh token");
                    actions.refreshToken();
                    return false;
                }
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
                    const url = `http://127.0.0.1:5000/api/board/update/${id}`
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
                const actions = getActions();
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

                const data = fetch(`http://127.0.0.1:5000/api/board/delete/${id}`, opts)
                if (data.status !== 200) {
                    alert("Token expired, press ok to refresh token");
                    actions.refreshToken();
                    return false;
                }
                console.log("board deleted")
                return data;
            },

            addActuator: (name, pin, board_id, type) => {
                const store = getStore();
                const actions = getActions();
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

                const data = fetch("http://127.0.0.1:5000/api/actuator/add", opts)
                if (data.status !== 200) {
                    alert("Token expired, press ok to refresh token");
                    actions.refreshToken();
                    return false;
                }

                console.log("actuator added")
                return data;
            },

            deleteActuator: (id) => {
                const store = getStore();
                const actions = getActions();
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

                const data = fetch(`http://127.0.0.1:5000/api/actuator/delete/${id}`, opts)
                if (data.status !== 200) {
                    alert("Token expired, press ok to refresh token");
                    actions.refreshToken();
                    return false;
                }

                return data;
            },

            getBoardsByUserId: (currentId) => {
                const id = Object.stringify(currentId.id)
                const url = "http://127.0.0.1:5000/api/user/boards/" + { id }
                const data = fetch(url)
                return data;
            },

            getActuatorById: async (lockId) => {

                try {
                    const id = Object.values(lockId)
                    console.log(id)
                    const url = `http://127.0.0.1:5000/api/actuator/get/${id}`
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
                    const url = `http://127.0.0.1:5000/api/actuator/updateState/${lockId}`
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
                    const url = `http://127.0.0.1:5000/api/actuator/update/${id}`
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
                    const url = `http://127.0.0.1:5000/api/act/${lockId}`;
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
                const url = "http://127.0.0.1:5000/api/sensor/temp_hum/"
                return fetch(url, opts)
                    .then(res => res.json())
                    .catch(error => console.log(error))
            },

            refreshToken: async () => {
                try {
                    const refresh_token = sessionStorage.getItem("refresh_token")
                    const opts = {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + refresh_token
                        },
                    };

                    const url = "http://127.0.0.1:5000/auth/refresh";
                    const response = await fetch(url, opts);
                    const data = await response.json();

                    if (response.status !== 200) {
                        alert(data);
                        return false;
                    }

                    sessionStorage.setItem("token", data.access_token);
                    setStore({ token: data.access_token });
                    return true;

                } catch (error) {
                    console.error(error);
                }
            },

        }
    };
};

export default getState;