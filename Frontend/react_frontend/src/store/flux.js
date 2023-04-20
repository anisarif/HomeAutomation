const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            users: null,
            token: null,
            message: null,
        },
        actions: {
            login: async (username, password) => {
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
                        alert("There has been an error");
                        return false;
                    }

                    const data = await res.json();
                    sessionStorage.setItem("token", data.access_token);
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
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("current_user");
                setStore({ token: null });
                console.log("logged out");
            },

            getMessage: async () => {
                const store = getStore();
                const opts = {
                    headers: {
                        "Authorization": "Bearer " + store.token
                    }
                };
                try {
                    // fetching data from the backend
                    const resp = await fetch("http://127.0.0.1:5000/", opts)
                    const data = await resp.json()
                    setStore({ message: data.message })
                    // don't forget to return something, that is how the async resolves
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error)
                }
            },

            addUser: (username, role) => {
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
                        "role": role,
                    }),
                };

                const data = fetch("http://127.0.0.1:5000/api/user/add", opts)
                return data;
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

                const data = fetch("http://127.0.0.1:5000/api/user/delete", opts)
                return data;
            },

            getUsers: async () => {
                try {
                    const res = await fetch("http://127.0.0.1:5000/api/user/getall")
                    if (res.status !== 200) {
                        alert("There has been an error");
                        return false;
                    }

                    const data = await res.json();
                    const users = JSON.stringify(data)
                    if (users && users !== undefined && users !== "[]" && users !== "") sessionStorage.setItem("users", users);
                    return true;
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

                const data = fetch("http://127.0.0.1:5000/api/board/add", opts)
                return data;
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

                const data = fetch("http://127.0.0.1:5000/api/board/delete", opts)
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

                const data = fetch("http://127.0.0.1:5000/api/actuator/add", opts)
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

                const data = fetch("http://127.0.0.1:5000/api/actuator/delete", opts)
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

            updateState: async ({lockId, state}) => {
                try {
                    console.log(lockId)
                    const store = getStore();
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
                    const url = `http://127.0.0.1:5000/api/actuator/update/${lockId}`
                    const data = await fetch(url, opts)
                    return data;
                }
                catch (error) {
                    console.error(error)
                }
            },

        }
    };
};

export default getState;