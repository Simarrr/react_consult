import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    SafeAreaView,
    BackHandler,
    TextInput
} from 'react-native';
import io from 'socket.io-client';
import {NavigationEvents} from 'react-navigation';
import { connect } from 'react-redux';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import ListItem from "../components/ListItem";
import {HubConnection, HubConnectionBuilder, signalR} from '@microsoft/signalr';




class MainScreen extends React.Component{

    constructor(props) {
        super(props);
    }

    state = {
        token: '',
        notification: null,
        title: 'Hello World',
        body: 'Say something!',
        queriesArray: [{
            "userid": "8D1D8C64-F88D-4B8F-9FD8-779248544F00",
            "consultantName": "",
            "roomNumber": "2",
            "status": true,
            "title": "Запрос товара",
            "type": 1,
            "products": [{
                "name": "Кроссовки ZENDEN active",
                "price": 2499,
                "vendorcode": "189-01MV-002TT",
                "brand": "ZENDEN active",
                "sizes": [
                    { "name": "40", "EU": "40" },
                    { "name": "41", "EU": "41" },
                    { "name": "42", "EU": "42" },
                    { "name": "43", "EU": "43" },
                    { "name": "44", "EU": "44" },
                    { "name": "45", "EU": "45" }
                ],
                "barcode": "2345678754567",
                "gender": 0,
                "category": {
                    "name": "Кроссовки"
                },
                "images": [{"url": "njjj"},
                    {"url": "nnjj"}]
            }]
        }],
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
        alert("hellhho");
        console.log(this.state.queriesArray);

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);


    this.registerForPushNotifications().then(r => "");
    this.getQueries();
    this.interval = setInterval(() => {
        this.getQueries();
    }, 10000);

    }

    getQueries(){

        fetch("https://api.chucknorris.io/jokes/random")
            .then(res => {
                return res.json();
            })
            .then(res => {
                this.setState( { queriesArray: res.value});
            });

    }

    componentWillUnmount () {
        clearInterval(this.interval);
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
                    renderItem={({item}) =><ListItem query={item} name={this.props.consultantName} navigation={navigate} />}
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
