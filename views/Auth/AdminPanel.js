import React from "react";
import {Button, View, StyleSheet, TextInput} from "react-native";
import {connect} from "react-redux";

class AdminPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            login: '',
            password: '',
        };

        this.nameInputHandler = name => {
            this.state.login = name;
        };

        this.passwordInputHandler = password => {
            this.state.password = password;
        };
    }

     render() {
        return (
            <View>
                    <TextInput
                        placeholder="Введите логин пользователя"
                        style={styles.textInput}
                        onChangeText={this.nameInputHandler}
                    />
                    <TextInput
                        placeholder="Введите пароль пользователя"
                        style={styles.textInput}
                        onChangeText={this.passwordInputHandler}
                    />
                    <Button
                        title={'Добавить консультанта'}
                        onPress={() => {
                            this.props.database.ref('users/' + this.state.login).set({
                                name: this.state.login,
                                password: this.state.password,
                            });
                            alert("Консультант подключен");//
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
    database: state.settings.database,
    server: state.settings.server,
    consultantName: state.settings.consultantName,
});





export default connect(mapStateToProps)(AdminPanel);
