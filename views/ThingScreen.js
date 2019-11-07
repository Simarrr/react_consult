import React from "react";
import {Button, ScrollView, Text, Image, View, StyleSheet} from "react-native";

class ThingScreen extends React.Component {


    render() {
        return (
            <View>
                <ScrollView>
                    <View style={styles.roomNumberBlock}>
                        <Text> {this.props.navigation.state.params.roomNumber}</Text>
                    </View>
                    <View>
                    <Image source={require(`./../assets/bg.jpg`)}
                        //source={{uri: `http://${this.props.server}:3123/images/${this.props.navigation.state.params.vendorcode}-01.jpg`}}
                           style={{width: 400, height: 300}}
                    />
                    </View>
                            <View style={styles.title}>
                                <Text> Название </Text>
                            <Text> {this.props.navigation.state.params.title}</Text>
                            </View>

                            <View style={styles.sizeAndColor}>
                                <Text style={{flex:1, textAlign: "center"}}> Размер </Text>
                                <Text style={{flex:1, textAlign: "center"}}> Цвет </Text>
                            </View>

                            <View style={styles.sizeAndColor}>
                                <Text style={{flex:1, textAlign: "center"}}> {this.props.navigation.state.params.size}</Text>
                                <Text style={{flex:1, textAlign: "center"}}> {this.props.navigation.state.params.color}</Text>
                            </View>

                            <View>
                            <Text> {this.props.navigation.state.params.vendorcode}</Text>
                            <Text> {this.props.navigation.state.params.price}</Text>
                            </View>

                            <Text> {this.props.navigation.state.params.barcode}</Text>
                            <Text> {this.props.navigation.state.params.name}</Text>
                            <Button
                                title={'Query'}
                                onPress={() => {alert(this.props.navigation.state.params.name)
                                }}
                            />

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        backgroundColor: 'powderblue',
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    roomNumberBlock: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'blue'
    },
    sizeAndColor: {
        // alignItems: "center",
        color: "white",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: 'red',

    }
});

export default ThingScreen;
