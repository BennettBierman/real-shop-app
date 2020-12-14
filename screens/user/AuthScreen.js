import React, { useReducer, useCallback} from 'react';
import { ScrollView, KeyboardAvoidingView, StyleSheet, Button, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

//generic input form reducer ... works for many situations
const formReducer = (state, action) => { 
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues, [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities, [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) { 
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            ...state,
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        }
    }
    return state;
};

const AuthScreen = props => {

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    })

    const handleSignUp = () => {
        dispatch(
            authActions.signup(
                formState.inputValues.email,
                formState.inputValues.password
            )
        )
    };

    //this is the same exact function from the EditProductScreen
    const handleInputChange = useCallback((inputIdentifier, inputValue, inputValidity) => { 
        //This is dispatching an action to the reducer above
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);
    
    return (
        <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id='email'
                            label='E-mail'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize='none'
                            errorText='Please Enter a Valid Email Address'
                            onInputChange={handleInputChange}
                            initialValue=''
                        />
                        <Input
                            id='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize='none'
                            errorText='Please Enter a Valid Password'
                            onInputChange={handleInputChange}
                            initialValue=''
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title='Login'
                                color={Colors.primary}
                                onPress={handleSignUp}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title='Switch to Sign Up'
                                color={Colors.accent}
                                onPress={() => { }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};
 
AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        
    }

});

export default AuthScreen;