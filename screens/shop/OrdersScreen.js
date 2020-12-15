import React, { useEffect, useState } from 'react';
import { FlatList, Platform, ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => { 

    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect( () => {
        setIsLoading(true);
        dispatch(ordersActions.fetchOrders()).then(() => setIsLoading(false));
     }, [dispatch]);

    if (isLoading) { 
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        );
    }

    if (orders.length === 0) { 
        return (
            <View style={styles.message}>
                <Text>No Orders Found, Maybe Start Ordering Some Products</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => {
                return (
                    <OrderItem
                        amount={itemData.item.totalAmount}
                        date={itemData.item.readableDate}
                        items={itemData.item.items}
                    />
                )
            }}
        />
    );
}

OrdersScreen.navigationOptions = navigationData => {
    return {
        headerTitle: 'Your Order',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => { 
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        )
    }; 
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;