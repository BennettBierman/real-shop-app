import React from 'react';
import { Platform, SafeAreaView, Button, View, StyleSheet } from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/start/StartUpScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

// const ProductsNavigator = createStackNavigator({
//     ProductsOverview: ProductsOverviewScreen,
//     ProductDetail: ProductDetailScreen,
//     Cart: CartScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         ) 
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

// const OrdersNavigator = createStackNavigator({
//     Order: OrdersScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         ) 
//     },
//     defaultNavigationOptions: defaultNavOptions
// });

const ProductsStackNavigator = createStackNavigator();

const ProductsNavigator = () => {
    return (
        <ProductsStackNavigator.Navigator>
            <ProductsStackNavigator.Screen
                name='ProductsOverview'
                component={ProductsOverviewScreen}
            />
            <ProductsStackNavigator.Screen
                name='ProductDetail'
                component={ProductDetailScreen }
            />
            <ProductsStackNavigator.Screen
                name='Cart'
                component={CartScreen }
            />
        </ProductsStackNavigator.Navigator>
    )

 };

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size={23}
                color={drawerConfig.tintColor}
            />
        ) 
    },
    defaultNavigationOptions: defaultNavOptions
});

const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
        contentOptions: {
            activeTintColor: Colors.primary
        },
        contentComponent: props => { 
            const dispatch = useDispatch();
            return (
                <View style={styles.container}>
                    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                        {/* This makes sure we get the icons from before we wanted a new button */}
                        <DrawerNavigatorItems {...props} /> 
                        <Button
                            title='Logout'
                            color={Colors.primary}
                            onPress={() => {
                                dispatch(authActions.logout());
                            }}
                        />
                    </SafeAreaView>

                </View>
            );
        }
});

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
});

const MainNavigator = createSwitchNavigator({
    Startup: StartUpScreen, 
    Auth: AuthNavigator,
    Shop: ShopNavigator
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    }
});

export default createAppContainer(MainNavigator);