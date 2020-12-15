import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors'
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {

    const productId = props.navigation.getParam('productId');
    const selectedProduct = useSelector(state => state.products.availableProducts.find(item => item.id === productId));

    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image
                source={{ uri: selectedProduct.imageUrl }}
                style={styles.image}
            />
            <View style={styles.buttonContainer}>
                <Button
                    color={Colors.primary}
                    title='Add to Cart'
                    onPress={() => {
                        dispatch(cartActions.addToCart(selectedProduct));
                    }}
                />
            </View>
            <Text style={styles.price }>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
       </ScrollView>
    );
}

ProductDetailScreen.navigationOptions = navigationData => {
    return {
        headerTitle: navigationData.navigation.getParam('productTitle')
    };
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily: 'open-sans'
    },
    buttonContainer: {
        marginVertical: 10,
        alignItems: 'center'
    }
});

export default ProductDetailScreen;