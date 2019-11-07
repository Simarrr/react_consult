import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';


const BottomNavigation = (navigation) => {

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    <TouchableOpacity onPress={() =>{ navigation('Thing', {name: "pidor"});}}>
                            <Text>Settings!</Text>
                        </TouchableOpacity>
                <Button
                    title="Go to Details"
                    onPress={() => alert(navigation)}
                />
            </View>
        );

}

export default BottomNavigation;
