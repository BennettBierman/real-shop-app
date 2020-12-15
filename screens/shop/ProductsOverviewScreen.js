import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Button, Platform, ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

const ProductsOverviewScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch (error) { 
            setError(error.message);
        }
        setIsRefreshing(false)
    },[dispatch, setIsLoading, setError]);

    //useEffect runs every time component is rendered
    //useEffect can also return a cleanup function (which runs when component is destroyed 
    //or when effect is about to rerun )
    //Listener makes it so this will run everytime user re-enters ProductsOverview screen
    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadProducts
        );
        return () => {
            willFocusSub.remove();
        };

    }, [loadProducts]);
    
    //Becuase dispatch is the only dependency, this will only run when component is loaded
    useEffect(() => { 
        setIsLoading(true);
        loadProducts().then(() => setIsLoading(false));
    }, [dispatch, loadProducts]);

    const handleSelectItem = (id, title) => {
        props.navigation.navigate(
            'ProductDetail',
            {
                productId: id,
                productTitle: title
            });
    };

    if (error) { 
        return (
            <View style={styles.centered}>
                <Text>An Error Occured</Text>
                <Button title='Try Again' onPress={loadProducts} color={Colors.primary}/>
            </View>
        );
    }

    if (isLoading) { 
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        );
    }

    if (!isLoading && products.length === 0) { 
        return (
            <View style={styles.centered}>
                <Text>No Products Found. Maybe Start Adding Some!</Text>
            </View>
        );
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => {
                return (
                    <ProductItem
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}
                        onSelect={() => handleSelectItem(itemData.item.id, itemData.item.title)}
                    >
                        <Button
                            color={Colors.primary}
                            title='View Details'
                            onPress={() => handleSelectItem(itemData.item.id, itemData.item.title)}
                        />
                        <Button
                            color={Colors.primary}
                            title='To Cart'
                            onPress={() => dispatch(cartActions.addToCart(itemData.item))}
                        />
                    </ProductItem>
                )
            }}
        />
    );
}

ProductsOverviewScreen.navigationOptions = navigationData => {
    return {
        headerTitle: 'All Products',
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
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => { 
                        navigationData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductsOverviewScreen;