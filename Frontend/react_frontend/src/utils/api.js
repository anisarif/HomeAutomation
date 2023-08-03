const backendurl = 'https://www.soloproject.pro:5000/'

export const getUsers = () => {
    return fetch(backendurl + 'api/user/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getBoards = () => {
    return fetch(backendurl + 'api/board/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}

export const getActuators = () => {
    return fetch(backendurl + 'api/actuator/getall')
        .then(res => res.json())
        .catch(error => console.log(error))
}