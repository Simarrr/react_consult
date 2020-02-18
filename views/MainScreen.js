import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    SafeAreaView,
    BackHandler,
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
        notification: null,
        title: 'Hello World',
        body: 'Say something!',
        queriesArray: [],
    };

    static navigationOptions = ({  }) => {
        return {
            title: "Запросы",
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

    componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    this.registerForPushNotifications().then(r => "");

        let socket = io(`http://${this.props.server}/consultants`,{
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        });

            this.props.setSocket(socket);
            console.log(socket.connected);

        socket.emit('giveMeQueries'); // Asks to get array of requests
        setTimeout(() =>{
        let token = this.state.token;
        socket.emit('getAppToken', token); // Send push token to server for handling notification in background mode
        console.log("I am token" + token);}, 17000); // Wait until get push notification token


        // Getting array from server
        socket.on('giveYouQueries', (queries) => {
            console.log("this is queries:\n" + queries);
            queries.sort(function(a, b) {
                return a.inProcessing - b.inProcessing; // sorts requests (firstly not accepted)
            });
            this.setState( { queriesArray: queries });
            console.log(this.state.queriesArray)
        });


        socket.on('disconnect', function(){
            alert("Disconnected");
        });

        // Get updated array of requests
        socket.on('getQueries', (queries) => {
            queries.sort(function(a, b) {
                return a.inProcessing - b.inProcessing;
            });
            if(this.state.queriesArray.length !== queries.length)
            this.sendPushNotification(this.state.token).then(r => "");
            this.setState( { queriesArray: queries });
            console.log(this.state.queriesArray)

        })
    }

    componentWillUnmount () {
        // removes back button
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
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
             this.setState({
                 token: token,
             });
         }catch (e) {
             console.log(e);
             alert("No internet")
         }
     }







    render () {
        const {navigate} = this.props.navigation;
        let queries =  this.state.queriesArray;

        return (

            <View>
                <NavigationEvents onDidFocus={() => console.log('I am triggered')} />
            <ScrollView>
            <SafeAreaView>
                <FlatList
                    style={styles.container}
                    data={queries}
                    renderItem={({ item}) =>
                            // Displays the list of requests
                            <ListItem query={item} socket={this.props.socket} name={this.props.consultantName} navigation={navigate} />
                        }
                    keyExtractor={(item, index) => index.toString()}
                />
            </SafeAreaView>
            </ScrollView>

            </View>
        )

    }

}

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
