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

export const setRGBColor = (id, r, g, b, effect = 'solid', speed = 5) => {
    return fetch(backendurl + `api/rgb/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ r, g, b, effect, speed }),
    }).catch(error => { console.error('setRGBColor failed:', error); })
}

export const getRGBState = (id) => {
    return fetch(backendurl + `api/rgb/${id}`)
        .then(res => res.json())
        .catch(error => { console.error('getRGBState failed:', error); return { r: 0, g: 0, b: 0 }; })
}
