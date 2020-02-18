import React from "react";
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import io from "socket.io-client";
import {Ionicons} from "@expo/vector-icons";

class SettingsScreen extends React.Component {


    constructor(props) {
        super(props);

        this.nameInputHandler = name => {
            this.props.setServer(name);

            setTimeout(() => {
                console.log(this.props.server);
                // Updates socket connection
                let socket = io(`http://${this.props.server}/consultants`

                    , {
                        reconnection: true,
                        reconnectionDelay: 1000,
                        reconnectionDelayMax: 5000,
                        reconnectionAttempts: Infinity
                    }
                );
                this.props.setSocket(socket);
            }, 200);

        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'space-around',
                }}>
                    <Text>     </Text>
                    {/* Navigate back to Main Screen*/}
                    <TouchableOpacity onPress = {() => {navigation.navigate("Main")}}>
                        <Ionicons name={`md-arrow-back`} size={27} color={'black'} />
                    </TouchableOpacity>

                </View>
            ),
        }
    };


    render() {

        return (
            <View>
                <Text> Settings </Text>
                <TextInput
                    placeholder="Введите ip-адрес"
                    style={styles.textInput}
                    onChangeText={this.nameInputHandler}
                />
                <Button
                    title={'Выход'}
                    onPress={() => {
                        this.props.navigation.navigate("Auth"); // Navigate to Auth Screen
                        this.props.socket.disconnect();
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0, 0, 0, 0.2)'
    },
});

const mapStateToProps = state => ({
    socket: state.settings.socket,
    server: state.settings.server,
    consultantName: state.settings.consultantName,
});

const mapDispatchToProps = dispatch => ({
    setServer: server => {
        dispatch({ type: 'SET_SERVER', payload: server });
    },
    setSocket: socket => {
        dispatch({ type: 'SET_SOCKET', payload: socket });
    }
});



export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
