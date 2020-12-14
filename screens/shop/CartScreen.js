import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors'
import Card from '../../components/UI/Card';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';

const CartScreen = props => { 

    const [isLoading, setIsLoading] = useState(false);

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);

    const cartItems = useSelector(state => { 
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                totalPrice: state.cart.items[key].totalPrice
            })
        }
        return transformedCartItems;
    });

    const dispatch = useDispatch();

    const handleSendOrder = async () => { 
        setIsLoading(true);
        await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
        setIsLoading(false);
    };

    return (
    <View style={styles.background}>
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>Total: <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text></Text>
                {isLoading? 
                    <ActivityIndicator size='small' color={Colors.primary} /> : 
                    <Button
                        color={Colors.accent}
                        title='Order Now'
                        disabled={cartItems.length === 0}
                        onPress={handleSendOrder}
                    />
                }
            </Card>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={itemData => { 
                    return (
                        <CartItem
                            quantity={itemData.item.quantity}
                            title={itemData.item.productTitle}
                            amount={itemData.item.totalPrice}
                            deletable={true}
                            onRemove={() => {
                                dispatch(cartActions.removeFromCart(itemData.item.productId))
                             } }
                        />
                    )
                }}
            />
        </View>
    </View>
    );
};

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
    screen: {
        margin: 15,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    },
    background: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
});

export default CartScreen;