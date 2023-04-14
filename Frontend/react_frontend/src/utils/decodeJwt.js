import { decodeToken } from "react-jwt";

export const Testjwt = (token) => {

    if (token && token != undefined) {
        const decoded_token = decodeToken(token)
        console.log(decoded_token)
        sessionStorage.setItem("decoded_token", decoded_token)
    }
    
}
