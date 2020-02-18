import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    SafeAreaView,
    Button,
    BackHandler,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import io from 'socket.io-client';
import {NavigationEvents} from 'react-navigation';

import { connect } from 'react-redux';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import ListItem from "../components/ListItem";



class MainScreen extends React.Component{

    constructor(props) {
        super(props);
    }

    state = {
        token: '',
        //token: 'ExponentPushToken[lBHA4PM6GldQTVnapO0xxH]',
        notification: null,
        title: 'Hello World',
        body: 'Say something!',
        queriesArray: [{title:"Hello",
        text: "Запрос товара"}, "World"],
    };

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Запросища",
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };
//
    sendPushNotification(token) {
        return fetch('https://exp.host/--/api/v2/push/send', {
            body: JSON.stringify({
                to: token,
                title: "Новый запрос",
                body: "Нужна помощь",
                data: { message: `Новый запрос - Нужна помощь` },
            }),
            android: {
                priority: 'max',
                vibrate: true,
                color: '#FF0000',
                sound: "default",
            },
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
    }



    onFocusFunction = ({sockets}) => {
        alert("Work");
        if (sockets !== undefined) {
            sockets.emit("giveMeQueries", () => {
                console.log("nav rerender")
            });
        }
        //this.forceUpdate();
    };



    componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    this.registerForPushNotifications().then(r => "");

        let socket = io(`http://${this.props.server}/consultants`,{
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        });


        // this.focusListener = this.props.navigation.addListener('didFocus', () => {
        //     socket.emit('giveMeQueries');
        //     this.forceUpdate();
        // });

            this.props.setSocket(socket);
            console.log(socket.connected);

        socket.emit('giveMeQueries', () =>{
            console.log("sdsd");
            alert("words");
        });
        setTimeout(() =>{
        let token = this.state.token;
            console.log(token);
        socket.emit('getAppToken', token);
        console.log("I am token" + token);}, 17000);



        socket.on('giveYouQueries', (queries) => {
            console.log("this is queries:\n" + queries);
            queries.sort(function(a, b) {
                return a.inProcessing - b.inProcessing;
            });


            // if(queries != this.state.queriesArray){
            //     this.sendPushNotification(this.state.token, this.state.title, "Priv").then(r => "")
            // }
            this.setState( { queriesArray: queries });
            console.log(this.state.queriesArray)
        });


        socket.on('disconnect', function(){
            alert("Disconnected");
        });

        socket.on('getQueries', (queries) => {
            queries.sort(function(a, b) {
                return a.inProcessing - b.inProcessing;
            });
            if(this.state.queriesArray.length !== queries.length)
            this.sendPushNotification(this.state.token).then(r => "");
            this.setState( { queriesArray: queries });
            console.log(this.state.queriesArray)

        })
           //
    }

    componentWillUnmount () {
        //this.focusListener.remove()
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {

        alert("Back");

        return true;
    };//

    async registerForPushNotifications() {
         const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

         if (status !== 'granted') {
             const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
             if (status !== 'granted') {
                 return;
             }
         }
         try {
             const token = await Notifications.getExpoPushTokenAsync();
             alert("ya est token" + token);
             this.setState({
                 token: token,
             });
         }catch (e) {
             console.log(e);
             alert("No internet")
         }
       // console.log(this.state.token);
     }







    render () {
        const {navigate} = this.props.navigation;
        let queries =  this.state.queriesArray;
        // alert("Array"+ queries);
        // alert("State"+this.state.queriesArray);
        //alert("I rerender"+queries.length);
       // this.forceUpdate(() => {alert("Updated");});
        //
        // if(this.props.socket != null) {
        //     alert("Update");
        //     this.props.socket.emit("giveMeQueries")
        // }
        //


        return (

            <View>
                <NavigationEvents onDidFocus={() => console.log('I am triggered')} />
            <ScrollView>

            <SafeAreaView>

                <FlatList
                    style={styles.conainer}
                    data={queries}
                    renderItem={({ item, index, separators }) =>
                            <ListItem query={item} socket={this.props.socket} name={this.props.consultantName} navigation={navigate} />
                        }
                    keyExtractor={(item, index) => index.toString()}
                />

               <Button
                                       title={'Socket'}

                onPress={() => {
                    if(this.props.socket.connected)
                    alert("Yup");
                    else alert("Nope");
                                             }}
                                     />
                <Button
                    title={'Token'}
                    onPress={() => {
                        alert(this.state.token);
                    }}
                />
                <Button
                    title={'Change queries'}
                    onPress={() => {
                        this.setState({queriesArray: ["h","s","s"],});
                    }}
                />


                <Button
                    title={'Notify'}
                    onPress={() => {
                        this.sendPushNotification(this.state.token).then(r => "");
                        alert("Notify");
                    }}
                />
                <Button
                    title={'Queries'}
                    onPress={() => {
                        alert(this.state.queriesArray);
                    }}
                />
            </SafeAreaView>

            </ScrollView>

            </View>
        )

    }

}
//
//setTimeout(() => this.forceUpdate(), 1000);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapStateToProps = state => ({
     socket: state.settings.socket,
    server: state.settings.server,
    consultantName: state.settings.consultantName,
});

const mapDispatchToProps = dispatch => ({
    setSocket: socket => {
        dispatch({ type: 'SET_SOCKET', payload: socket });
    }
});



export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
