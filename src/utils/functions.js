import { isNotNullOrEmpty } from "../components/CommonFunctions";

export const getTokenFromLocalStorage = () => {
    let token = localStorage.getItem('token');
    if(isNotNullOrEmpty(token)) {
        token = JSON.parse(token)?.token;
    }else {
        token = '';
    }
    return token;
};
  