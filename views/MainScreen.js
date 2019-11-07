import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    SafeAreaView,
    Button,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import io from 'socket.io-client';

import { connect } from 'react-redux';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import ListItem from "../components/ListItem";
import BottomNavigation from "../components/BottomNavigation";



class MainScreen extends React.Component{

    state = {
        token: '',
        //token: 'ExponentPushToken[lBHA4PM6GldQTVnapO0xxH]',
        notification: null,
        title: 'Hello World',
        body: 'Say something!',
        queriesArray: [],
    };

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate({routeName: 'Scan'})}>
                    <Text> Сканировать -> </Text>
                </TouchableOpacity>
            ),
        }
    };

    componentDidMount() {
        this.registerForPushNotifications().then(r => "")
        const socket = io(`http://${this.props.server}/consultants`);
        this.props.setSocket(socket);
        socket.emit('giveMeQueries');

        socket.on('giveYouQueries', (queries) => {
            if(queries != this.state.queriesArray){
                this.sendPushNotification(this.state.token, this.state.title, "Priv").then(r => "")
            }
            this.setState( { queriesArray: queries });
            console.log(this.state.queriesArray)
        });

        socket.on('getQueries', (queries) => {
            if(queries != this.state.queriesArray){
                this.sendPushNotification(this.state.token, this.state.title, "Priv").then(r => "")
            }
            this.setState( { queriesArray: queries });
            console.log(this.state.queriesArray)
            console.log("try")
        })
           //
    }



     async registerForPushNotifications() {
         const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

         if (status !== 'granted') {
             const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
             if (status !== 'granted') {
                 return;
             }
         }

         const token = await Notifications.getExpoPushTokenAsync();

         this.setState({
                  token,
     }
         );
     }

    sendPushNotification(token, title, body) {
        return fetch('https://exp.host/--/api/v2/push/send', {
            body: JSON.stringify({
                to: token,
                title: title,
                body: body,
                data: { message: `${title} - ${body}` },
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
    }



    // componentDidUpdate(prevProps, prevState, snapshot) {
    //
    //     //if(prevState.queriesArray != this.state.queriesArray) {
    //         this.sendPushNotification(this.state.token, this.state.title, "Priv").then(r => "")
    //         alert(prevState.queriesArray)
    //     //}
    //  }



    render () {
        const {navigate} = this.props.navigation;


        return (

            <View>
            <ScrollView>

            <SafeAreaView>

                <FlatList
                    style={styles.containter}
                    data={this.state.queriesArray}
                    renderItem={({ item, index, separators }) =>
                            <ListItem query={item} socket={this.props.socket} name={this.props.consultantName} navigation={navigate} />
                        }
                    keyExtractor={(item, index) => index.toString()}
                />
                {/*<BottomNavigation navigation={navigate} />*/}
               <Button
                                       title={'Query'}

                onPress={() => {const queriesArray =[{text: 'Otnesi',
                    title: 'Vesh',
                        barcode: '93283293203',
                        vendorcode: 'kr334f',
                    color: 'Green',
                    size: 'XS',
                    price: '9900',
                    roomNumber: '1',
                    inProcessing: false
                },"Hello"];
                    console.log(this.state.token);
                    alert({navigate})
                this.setState({
                    queriesArray,
                });


                                             }}
                                     />


            </SafeAreaView>
            </ScrollView>
                <View>
                <BottomNavigation />
                </View>
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
