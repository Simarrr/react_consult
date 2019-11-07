// //
// // import React from 'react';
// // import { StyleSheet, Text, View, Button, FlatList, SafeAreaView } from 'react-native';
// // import { Notifications } from 'expo';
// // import * as Permissions from 'expo-permissions';
// // import Constants from 'expo-constants';
// //
// // const YOUR_PUSH_TOKEN = 'ExponentPushToken[lBHA4PM6GldQTVnapO0xxH]';
// //
// // export default class Notifier extends React.Component {
// //     state = {
// //         notification: {
// //             title: 'Hi there!',
// //             body: 'Tap me to open the app.',
// //             android: { sound: true }, // Make a sound on Android
// //             ios: { sound: true },
// //         },
// //     };
// //
// //     registerForPushNotificationsAsync = async () => {
// //         if (Constants.isDevice) {
// //             const { status: existingStatus } = await Permissions.getAsync(
// //                 Permissions.NOTIFICATIONS
// //             );
// //             let finalStatus = existingStatus;
// //             if (existingStatus !== 'granted') {
// //                 const { status } = await Permissions.askAsync(
// //                     Permissions.NOTIFICATIONS
// //                 );
// //                 finalStatus = status;
// //             }
// //             if (finalStatus !== 'granted') {
// //                 alert('Failed to get push token for push notification!');
// //                 return;
// //             }
// //             let token = await Notifications.getExpoPushTokenAsync();
// //             console.log(token);
// //         } else {
// //             alert('Must use physical device for Push Notifications');
// //         }
// //     };
// //
// //     componentDidMount() {
// //         this.registerForPushNotificationsAsync();
// //
// //         // Handle notifications that are received or selected while the app
// //         // is open. If the app was closed and then opened by tapping the
// //         // notification (rather than just tapping the app icon to open it),
// //         // this function will fire on the next tick after the app starts
// //         // with the notification data.
// //         this._notificationSubscription = Notifications.addListener(
// //             this._handleNotification
// //         );
// //     }
// //
// //     _handleNotification = notification => {
// //         this.setState({ notification: notification });
// //     };
// //
// //     // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
// //     sendPushNotification = async (YOUR_PUSH_TOKEN) => {
// //         const message = {
// //             to: YOUR_PUSH_TOKEN,
// //             android: { sound: true }, // Make a sound on Android
// //             ios: { sound: true },
// //             title: 'Original Title',
// //             body: 'And here is the body!',
// //             data: { data: 'goes here' },
// //         };
// //         const response = await fetch('https://exp.host/--/api/v2/push/send', {
// //             method: 'POST',
// //             headers: {
// //                 Accept: 'application/json',
// //                 'Accept-encoding': 'gzip, deflate',
// //                 'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify(message),
// //         });
// //         const data = response._bodyInit;
// //         console.log(`Status & Response ID-> ${data}`);
// //     };
// //
// //     render() {
// //         Notifications.addListener(console.log("notification"))
// //         return (
// //                 <View style={{padding: 60,
// //                     flex: 2,
// //                     backgroundColor: '#eba',
// //                     alignItems: 'center',
// //                     justifyContent: 'center', }}>
// //                     <Button
// //                         title={'Press to Send Notification'}
// //                         onPress={() => this.sendPushNotification()}
// //                     />
// //                 </View>
// //         );
// //     }
// //     sendPushNotifications = props => {
// //         return (<Button
// //             title={'Press to Send Notification'}
// //             onPress={() => this.sendPushNotification()}
// //         />)
// //     }
// // }
// //
// //
//
//
//
 import React from 'react';
 import {
     StyleSheet,
     TextInput,
     TouchableOpacity,
     Text,
     KeyboardAvoidingView,
     View,
 } from 'react-native';
 import { Notifications } from 'expo';
 import * as Permissions from 'expo-permissions';
 export default class Notifier extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             token: null,
             notification: null,
             title: 'Hello World',
             body: 'Say something!',
         };
         this.registerForPushNotifications = this.registerForPushNotifications.bind(this);
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

         this.subscription = Notifications.addListener(this.handleNotification);

         this.setState({
             token,
         });
     }

     sendPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
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

     handleNotification = notification => {
         this.setState({
             notification,
         });
     };

     render() {
         return (
             <KeyboardAvoidingView style={styles.container} behavior="position">
                 <Text style={styles.title}>Expo Sample Notifications App</Text>
                 <Text style={styles.text}>Title</Text>/                 <TextInput
                     style={styles.input}
                     onChangeText={title => this.setState({ title })}
                     maxLength={100}
                     value={this.state.title}
                 />
                 <Text style={styles.text}>Message</Text>
                 <TextInput
                     style={styles.input}
                     onChangeText={body => this.setState({ body })}
                     maxLength={100}
                     value={this.state.body}
                 />
                 <TouchableOpacity
                     onPress={() => this.registerForPushNotifications()}
                     style={styles.touchable}>
                     <Text>Register me for notifications!</Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={() => this.sendPushNotification()} style={styles.touchable}>
                     <Text>Send me a notification!</Text>
                 </TouchableOpacity>
                 {this.state.token ? (
                     <View>
                         <Text style={styles.text}>Token</Text>
                         <TextInput
                             style={styles.input}
                             onChangeText={token => this.setState({ token })}
                             value={this.state.token}
                         />
                     </View>
                 ) : null}
                 {this.state.notification ? (
                     <View>
                         <Text style={styles.text}>Last Notification:</Text>
                         <Text style={styles.text}>{JSON.stringify(this.state.notification.data.message)}</Text>
                     </View>
                 ) : null}
             </KeyboardAvoidingView>
         );
     }
 }

 const styles = StyleSheet.create({
     title: {
         fontSize: 18,
         padding: 8,
     },
     text: {
         paddingBottom: 2,
         padding: 8,
     },
     container: {
         flex: 1,
         paddingTop: 40,
     },
     touchable: {
         borderWidth: 1,
         borderRadius: 4,
         margin: 8,
         padding: 8,
         width: '95%',
     },
     input: {
         height: 40,
         borderWidth: 1,
         margin: 8,
         padding: 8,
         width: '95%',
     },
 });

