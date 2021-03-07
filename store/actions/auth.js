import AsyncStorage from '@react-native-community/async-storage';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token) => { 
    return { type: AUTHENTICATE, userId: userId, token: token };
};

export const signup = (email, password) => {
    return async dispatch =>  {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA3P6OYq7k9z9gssy8vu38Xg6rT4O_Xa0A',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

        if (!response.ok) { 
            const errorResponseData = await response.json();
            errorId = errorResponseData.error.message;
            let message = 'Something Went Wrong';
            
            if (errorId === 'EMAIL_EXISTS') { 
                message = 'This email exists already';
            }
            
            throw new Error(message);
        }

        const responseData = await response.json();
        console.log(responseData);
        dispatch(authenticate(responseData.localId, responseData.idToken));
        console.log(`localId: ${responseData.localId}`);
        console.log(`idToek: ${responseData.idToken}`);
        const expirationDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);
        saveDataToStorage(responseData.idToken, responseData.localId, expirationDate); //saved for autologin
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3P6OYq7k9z9gssy8vu38Xg6rT4O_Xa0A',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

        if (!response.ok) { 
            const errorResponseData = await response.json();
            errorId = errorResponseData.error.message;
            let message = 'Something Went Wrong';
            
            if (errorId === 'EMAIL_NOT_FOUND') { 
                message = 'This email could not be found';
            }
            if (errorId === 'INVALID_PASSWORD') { 
                message = 'This password is not valid';
            }

            throw new Error(message);
        }

        const responseData = await response.json();
        console.log(responseData);
        dispatch(authenticate(responseData.localId, responseData.idToken));
        const expirationDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);
        saveDataToStorage(responseData.idToken, responseData.localId, expirationDate); //saved for autologin 
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const clearLogoutTimer = () => { 
    if (timer) { 
        clearTimeout(timer); 
    }
};

export const setLogoutTimer = expirationTime => { 
    return dispatch => { 
        timer = setTimeout(() => { 
            dispatch(logout());
        }, expirationTime);
    };
};

export const saveDataToStorage = (token, userId, expirationDate) => { 
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token,
            userId: userId, 
            expireDate: expirationDate.toISOString()
    }));
};