import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {connect} from "react-redux";


class ConnectionComponent extends React.Component {

    render() {
        let text;
        if (this.props.socket != null) {
            if (this.props.socket.connected) {
                text = "Установлено";
            } else text = "Нет соединения";
        }
        return (
            <View style={{
                width: 200,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: 'space-around',
            }}>
                <Text>{text}</Text>
                <TouchableOpacity onPress={() => {
                    this.props.socket.emit('giveMeQueries');
                    this.forceUpdate();
                }}>
                    <Ionicons name={`md-refresh`} size={40} color={'tomato'}/>
                </TouchableOpacity>
                <Text>  </Text>
                <TouchableOpacity onPress = {() => {this.props.navigate.navigate("Set")}}>
                    <Ionicons name={`ios-settings`} size={40} color={'tomato'} />
                </TouchableOpacity>
                <Text>  </Text>
            </View>
        )
    }
}

//Get store socket, server and consultantName
const mapStateToProps = state => ({
    socket: state.settings.socket,
    server: state.settings.server,
    consultantName: state.settings.consultantName,
});



export default connect(mapStateToProps)(ConnectionComponent);
