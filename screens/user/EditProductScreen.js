import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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

const EditProductScreen = props => { 

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    });

    useEffect(() => {
        if (error) { 
            Alert.alert('An Error Occured', error, [{ text: 'Okay' }]);
        }
     }, [error]);

    const dispatch = useDispatch();
    
    //useCallback makes sure the function isn't run infinitly (due to its dependencies)
    const handleSubmit = useCallback(async () => {
        if (!formState.formIsValid) { 
            Alert.alert('Wrong Input', 'Please Check the Errors in the Form', [{text:'Okay'}]);
            return;
        }
        setIsLoading(true);
        setError(null);
        const { title, imageUrl, description, price } = formState.inputValues;
        try {
            if (editedProduct) {
                await dispatch(productsActions.updateProduct(prodId, title, description, imageUrl));
            }
            else {
                await dispatch(productsActions.createProduct(title, description, imageUrl, +price));
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
         }
        setIsLoading(false);
    }, [dispatch, prodId, formState]);

    //passes param to be used in navigationOptions below
    useEffect(() => {
        props.navigation.setParams({ submit: handleSubmit })
    }, [handleSubmit]);

    const handleInputChange = useCallback((inputIdentifier, inputValue, inputValidity) => { 
        //This is dispatching an action to the reducer above
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    if (isLoading) { 
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.keyboardContainer} behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please Enter a Valid Title'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        onInputChange={handleInputChange}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='imageUrl'
                        label='Image Url'
                        errorText='Please Enter a Valid Image Url'
                        keyboardType='default'
                        returnKeyType='next'
                        onInputChange={handleInputChange}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {editedProduct? null : 
                        <Input
                        id='price'
                        label='Price'
                        errorText='Please Enter a Valid Price'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={handleInputChange}
                        min={0.01}                    
                    />
                    }
                    <Input
                        id='description'
                        label='Description'
                        errorText='Please Enter a Valid Description'
                        keyboardType='default'
                        multiLine
                        onInputChange={handleInputChange}
                        numberOfLines={3}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditProductScreen.navigationOptions = navigationData => { 

    const submitFunc = navigationData.navigation.getParam('submit');

    return {
        headerTitle: navigationData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Save'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFunc}
                />
            </HeaderButtons>
        ) 
    }
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    keyboardContainer: {
        flex: 1
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;