const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
            token: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
            
            login: async (username, password) =>  {
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

                try{
                    const res =  await fetch("http://127.0.0.1:5000/auth/login", opts)
                    if (res.status !== 200){
                        alert("There has been an error");
                        return false;
                    }

                    const data = await res.json();
                    sessionStorage.setItem("token", data.access_token);
                    setStore({ token: data.access_token });
                    return true;
                }
                catch(error){
                    console.error(error)
                }
            },
            
            syncTokenFromSessionStore: () => {
                const token = sessionStorage.getItem("token");
                if (token && token!="" && token!=undefined) setStore({ token: token });
            },

            logout: () => {
                sessionStorage.removeItem("token");
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
				try{
					// fetching data from the backend
					const resp = await fetch("http://127.0.0.1:5000/", opts)
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;