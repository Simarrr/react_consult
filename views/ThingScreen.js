import React from "react";
import {Button, ScrollView, Text, Image, View, StyleSheet, SafeAreaView, FlatList} from "react-native";
import {connect} from "react-redux";
import ThingItem from "../components/ThingItem";

class ThingScreen extends React.Component {

    onError(error){
        this.setState({ image: require('./../assets/sport-master-logo-png-transparent.png')})
        alert("Error");
    }

    render() {
        if (this.props.navigation.state.params.text === "Запрос товара") { // Different JSX for different request types
            return (
                <View>
                    <ScrollView>
                        <View style={styles.roomNumberBlock}>
                            <Text> {this.props.navigation.state.params.roomNumber}</Text>
                        </View>
                        <View>
                            <Image source={{uri: `${this.props.navigation.state.params.image}`}}
                                //source={{uri: `http://${this.props.server}:3123/images/${this.props.navigation.state.params.vendorcode}-01.jpg`}}
                                   style={{width: 400, height: 300}}
                                   onError={ this.onError.bind(this)}
                                   resizeMode="contain"
                            />
                        </View>
                        <View style={styles.title}>
                            <Text> Название </Text>
                            <Text> {this.props.navigation.state.params.name}</Text>
                        </View>

                        <View style={styles.sizeAndColor}>
                            <Text style={{flex: 1, textAlign: "center"}}> Размер </Text>
                            <Text style={{flex: 1, textAlign: "center"}}> Цвет </Text>
                        </View>

                        <View style={styles.sizeAndColor}>
                            <Text
                                style={{flex: 1, textAlign: "center"}}> {this.props.navigation.state.params.size}</Text>
                            {/*<Text style={{*/}
                            {/*    flex: 1,*/}
                            {/*    textAlign: "center"*/}
                            {/*}}> {this.props.navigation.state.params.color}</Text>*/}
                        </View>

                        <View>
                            <Text> {this.props.navigation.state.params.ware}</Text>
                            <Text> {this.props.navigation.state.params.price}</Text>
                        </View>

                        <Text> {this.props.navigation.state.params.barcode}</Text>

                    </ScrollView>
                </View>
            )
        } else if (this.props.navigation.state.params.text === "Подойти в комнату") {
            return (
                <View>
                    <View style={styles.roomNumberBlock}>
                        <Text> {this.props.navigation.state.params.roomNumber}</Text>
                    </View>
                    <View style={styles.title}>
                        <Text> {this.props.navigation.state.text} </Text>
                    </View>
                </View>
            )
        } else if (this.props.navigation.state.params.text === "Отнести на кассу") {

            const {navigate} = this.props.navigation;
            let things =  this.props.navigation.state.params.things;

            return (
                <ScrollView>
                    <SafeAreaView>
                        {/* Generates a list of things */}
                        <FlatList
                            style={styles.containter}
                            data={things}
                            renderItem={({ item, index, separators }) =>
                                <ThingItem thing={item} socket={this.props.socket} name={this.props.consultantName} navigation={navigate} />
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </SafeAreaView>
                </ScrollView>
            )
        }else return (<View>
            <Button
                title={'Consultant'}
                onPress={() => {
                    alert(this.props.consultantName)
                }}
            />
        </View>)
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

const mapStateToProps = state => ({
    socket: state.settings.socket,
    server: state.settings.server,
    consultantName: state.settings.consultantName,
});


export default connect(mapStateToProps)(ThingScreen);
