export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
    return async dispatch => {
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
        dispatch({
            type: SIGNUP,
            token: responseData.idToken,
            userId: responseData.localId
        });
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
        dispatch({
            type: LOGIN,
            token: responseData.idToken,
            userId: responseData.localId
        });
    };
};