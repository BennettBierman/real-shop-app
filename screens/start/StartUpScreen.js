import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';

import Colors from '../../constants/Colors'
import * as authActions from '../../store/actions/auth';

const StartUpScreen = props => {

    const dispatch = useDispatch();

    //Checks whether or not user should be auto-logged in when component is mounted
    useEffect(() => { 
        const tryLogin = async () => { 
            const userData = await AsyncStorage.getItem('userData');
            //If token is not saved navigate to authscreen
            if (!userData) { 
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData); //turns string into JS object
            const { token, userId, expireDate } = transformedData;
            const expirationDate = new Date(expireDate);
            //token is invalid
            if (expirationDate <= new Date() || !token || !userId) { 
                props.navigation.navigate('Auth');
                return;
            }
            //if here we must have a valid token so we should go to the shop
            dispatch(authActions.authenticate(userId, token));
            props.navigation.navigate('Shop');

        };
        tryLogin();
    },[dispatch]);


    return (
        <View style={styles.screen}>
            <ActivityIndicator
                size='large'
                color={Colors.primary}
            />
        </View>
    );
 };

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartUpScreen;