import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import Card from '../UI/Card';

const ProductItem = props => {

    let TouchComp = (Platform.OS === 'android' && Platform.Version >= 21) ? TouchableNativeFeedback : TouchableOpacity; 

    return (
    <Card style={styles.product}>
        <View style={styles.touchable}>
            <TouchComp onPress={props.onSelect} useForeground>
                <View> 
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: props.image }} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.price}>${props.price.toFixed(2)}</Text> 
                    </View>
                    <View style={styles.buttonsContainer}>
                        {props.children}
                    </View>
                </View>
            </TouchComp>
        </View>
    </Card>
    );
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 18,
        
    },
    image: {
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'

    },
    title: {
        fontSize: 18,
        marginVertical: 1,
        fontFamily: 'open-sans-bold'
    },
    price: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'open-sans'

    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
        paddingHorizontal: 20
    },
    textContainer: {
        alignItems: 'center',
        height: '15%',
        padding: 10
    },
    touchable: {
        overflow: 'hidden'
    }

});

export default ProductItem; 