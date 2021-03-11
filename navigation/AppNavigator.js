import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';


import ShopNavigator from './ShopNavigator';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';

//object with .Navigator & .Screen properties which are react component



const AppNavigator = props => { 
    const isAuth = useSelector(state => !!state.auth.token);

    return (
        <NavigationContainer>
            
        </NavigationContainer>
    );
};

export default AppNavigator;