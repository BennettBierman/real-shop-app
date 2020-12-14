import React from 'react';
import { FlatList, View, Platform, Button, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductScreen = props => {

    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch(); 
 
    const handleDelete = id => { 
        Alert.alert('Warning', 'Are you sure you wish to delete this item?', [
            { text: 'No', style: 'default' },
            {text: 'Yes', style: 'destructive', onPress: () => dispatch(productsActions.deleteProduct(id))}
        ]);
    };

    const handleEditProduct = id => { 
        props.navigation.navigate('EditProduct', {productId: id});
    };
    
    return (
        <View>
            <FlatList
                data={userProducts}
                keyExtractor={item => item.id}
                renderItem={itemData =>
                    <ProductItem
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}
                        onSelect={() => handleEditProduct(itemData.item.id)}
                    >
                         <Button
                            color={Colors.primary}
                            title='Edit'
                            onPress={() => handleEditProduct(itemData.item.id)}
                        />
                        <Button
                            color={Colors.primary}
                            title='Delete'
                            onPress={() => handleDelete(itemData.item.id)}
                        />
                    </ProductItem>
                }
            />
        </View>
    );
}

UserProductScreen.navigationOptions = navigationData => {
    return {
        headerTitle: 'Your Products',
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
                    title='Add'
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => { 
                        navigationData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        )
    }
}

export default UserProductScreen;