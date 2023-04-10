export const insertStatus = (action) => {
    return fetch(`http://192.168.178.171:5000/Act`,{
            method:'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(action)
        })
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getAccurators = () => {
    return fetch('http://192.168.178.171:5000/')
        .then(res => res.json())
        .catch(error => console.log(error))
}


export const getCurrentWeather = () => {
    return fetch('http://192.168.178.171:5000/Weather/')
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getAcc = () => {
    return fetch('http://192.168.178.171:5000/dbtest/')
        .then(res => res.json())
        .catch(error => console.log(error))
}

/* LOGIN API */

export const loginApi = () => {
    const opts = {    
        method:'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "username": username,
          "password": password,
        }),
      
    }
    fetch("http://127.0.0.1:5000/auth/login", opts)
  .then(res => res.json())
  .then(data => {sessionStorage.setItem("token", data.access_token)})
  .catch(error => console.log(error))}

/* GET ALL USERS API */

  export const getUsers = () => {
    return fetch('http://127.0.0.1:5000/api/user/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}