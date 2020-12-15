import { ActionSheetIOS } from 'react-native';
import PRODUCTS from '../../data/dummy-data';
import Product from '../../models/product';
import { CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT } from '../actions/products';

const initialState = {
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id, //this was created with the server
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price
            );
            return {
                ...state, 
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            };
        
        case UPDATE_PRODUCT:
            const userProductId = state.userProducts.findIndex(prod => prod.id === action.pid);
            const availableProductId = state.availableProducts.findIndex(prod => prod.id === action.pid);

            const updatedProduct = new Product(
                action.pid,
                state.userProducts[userProductId].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[userProductId].price,
            );
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[userProductId] = updatedProduct;

            const updatedAvailableProducts = [...state.availableProducts]; 
            updatedAvailableProducts[availableProductId] = updatedProduct;

            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            };

        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== action.pid),
                availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
            }
        
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }
    }
    return state;
}