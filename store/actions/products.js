import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS'; //this is essentially fetch products via database

export const deleteProduct = productId => { 
    return async dispatch => {
        const response = await fetch(`https://real-shop-app-a3353-default-rtdb.firebaseio.com/products/${productId}.json`, {
            method: 'DELETE'
        });

        if (!response.ok) { 
            throw new Error('Something Went Wrong');
        }

        dispatch({ type: DELETE_PRODUCT, pid: productId });
    };
};

//This syntax does everything the OG syntax did but now also dispatches to the server
export const createProduct = (title, description, imageUrl, price) => { 
    //this was updated with ReduxThunk ... before just returned an action JS object
    return async dispatch => { 
        //can put any aysnc code we want right here!
        //Fetch is a built-in api that can send and recieve data from a database
        //can add /"anything".json to end of link to add a new folder in the database
        //this is a POST request and fetch always returns a promise object so you can use
        // then and cathc on it or the new async await way too
        const response = await fetch('https://real-shop-app-a3353-default-rtdb.firebaseio.com/products.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                imageUrl: imageUrl,
                price: price
            })
        });

        //this is the data firebase sends to use when we post the response above 
        const responseData = await response.json();
        //console.log(responseData);

        //this will only be dispatched when the above code is done running because of the awaits
        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: responseData.name,
                title: title,
                description: description,
                imageUrl: imageUrl,
                price: price
            }
        });
    };
};

export const updateProduct = (id, title, description, imageUrl) => { 
    return async dispatch => { 

        //Dont need to save as const response because response.name is not needed anywhere
        const response = await fetch(`https://real-shop-app-a3353-default-rtdb.firebaseio.com/products/${id}.json`, {
            method: 'PATCH', //Patch changes values of the values in the body below
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                imageUrl: imageUrl
            })
        });

        //400 or 500 status code
        if (!response.ok) { 
            throw new Error('Something Went Wrong');
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title: title,
                description: description,
                imageUrl: imageUrl
            }
        });
    }
};

export const fetchProducts = () => { 
    return async dispatch => { 
        try {
            //dont have arguments after link because method is GET which is the default
            const response = await fetch('https://real-shop-app-a3353-default-rtdb.firebaseio.com/products.json');

            //This makes sure server is dealing with the right type of data
            if (!response.ok) { 
                throw new Error('Something Went Wrong');
            }

            const responseData = await response.json();
            const loadedProducts = [];

            for (const key in responseData) {
                loadedProducts.push(new Product(
                    key,
                    'u1',
                    responseData[key].title,
                    responseData[key].imageUrl,
                    responseData[key].description,
                    responseData[key].price
                ))
            }
            dispatch({ type: SET_PRODUCTS, products: loadedProducts });
        } catch (error) { 
            //could send to custom analytics server
            throw error;
        }
    }
}