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
                if (token && token != "" && token != undefined) setStore({ token: token });
            },

            syncUsersFromSessionStore: () => {
                const users = sessionStorage.getItem("users");
                if (users && users != undefined && users != "") setStore({ users: users });
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
                        "role":role,
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
                    if (users && users != undefined && users != "[]" && users != "") sessionStorage.setItem("users", users);
                    return true;
                }
                catch (error) {
                    console.error(error)
                }
            },
            
        }
    };
};

export default getState;