export const getUsers = () => {
    return fetch('https://197.240.170.142:5000/api/user/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getBoards = () => {
    return fetch('https://197.240.170.142:5000/api/board/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getActuators = () => {
    return fetch('https://197.240.170.142:5000/api/actuator/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}