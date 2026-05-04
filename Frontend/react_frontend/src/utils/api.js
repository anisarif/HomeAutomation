const backendurl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

export const getUsers = () => {
    return fetch(backendurl + 'api/user/getall')
        .then(res => res.json())
        .catch(error => { console.error('getUsers failed:', error); return []; })
}

export const getBoards = () => {
    return fetch(backendurl + 'api/board/getall')
        .then(res => res.json())
        .catch(error => { console.error('getBoards failed:', error); return []; })
}

export const getActuators = () => {
    return fetch(backendurl + 'api/actuator/getall')
        .then(res => res.json())
        .catch(error => { console.error('getActuators failed:', error); return []; })
}
