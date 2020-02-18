 import React from 'react';

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
         // Get permissions for sending push notification
         const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

         if (status !== 'granted') {
             const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
             if (status !== 'granted') {
                 return;
             }
         }
         // Get notification token
         const token = await Notifications.getExpoPushTokenAsync();

         this.subscription = Notifications.addListener(this.handleNotification);

         this.setState({
             token,
         });
     }

     /**
      *@param {string} token - Expo push notification token
      *@param {string} title - Message title
      *@param {string} body - Message body
      **/
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
     }
 }


