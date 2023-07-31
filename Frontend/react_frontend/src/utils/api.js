
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



export const getUsers = () => {
    return fetch('https://197.240.120.86:5000/api/user/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getBoards = () => {
    return fetch('https://197.240.120.86:5000/api/board/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getActuators = () => {
    return fetch('https://197.240.120.86:5000/api/actuator/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}