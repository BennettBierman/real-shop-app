import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;
            const id = addedProduct.id;

            let updatedOrNewCartItem;

            if (state.items[id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[id].totalPrice + prodPrice
                );
            }
            else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
            }
            return {
                ...state, //dont need to copy state HERE because both fields are changed
                items: { ...state.items, [id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice
            };
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            let updatedCartItems;

            if (selectedCartItem.quantity > 1) {
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.totalPrice - selectedCartItem.productPrice
                );

                updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
            }
            else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.pid];
            }

            return {
                ...state, 
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) { 
                return state;
            }
            const updatedItems = { ...state.items };
            const itemTotal = state.items[action.pid].totalPrice;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            };

    } 
    return state;
    
};