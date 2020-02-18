import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Asset } from "expo-asset";
import { AppLoading } from "expo";
import Svg, {Image, Circle, ClipPath} from 'react-native-svg';
import Animated, {Easing} from 'react-native-reanimated';
import {TapGestureHandler, State} from "react-native-gesture-handler";
import { connect } from 'react-redux';
import firebase from "firebase";



const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat,
} = Animated;

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}

const { width, height } = Dimensions.get('window');

class AuthScreen extends React.Component{

    constructor(props) {
        super(props);

        const firebaseConfig = {
            apiKey: "AIzaSyBTgezGAUPxYfENNQRsunGxyvG8LeBo-Ls",
            authDomain: "react-consult.firebaseapp.com",
            databaseURL: "" +
                "",
            projectId: "react-consult",
            storageBucket: "react-consult.appspot.com",
            messagingSenderId: "860818084999",
            appId: "1:860818084999:web:393bad11037763fef61422",
            measurementId: "G-QBDFPYYN4R"
        };  // apiKey, authDomain, etc. (see above)
        // initialize firebase database according configs
        firebase.initializeApp(firebaseConfig);
        let database = firebase.database();
        this.props.setDatabase(database); // Store database

        this.state = {
            isReady: false,
            name: '',
            password: '',
            truePassword: '',
            isFocused: false,
        };

        this.buttonOpacity = new Value(1);
        this.onStateChange = event([
            {
                nativeEvent: ({ state }) =>
                    block([
                        cond(
                            eq(state, State.END),
                            set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
                        )
                    ])
            }
        ]);

        this.onCloseState = event([
            {
                nativeEvent: ({ state }) =>
                    block([
                        cond(
                            eq(state, State.END),
                            set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
                        )
                    ])
            }
        ]);

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 3 - 50, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        });

        this.nameInputHandler = name => {
            this.setState({name: name });
            let thisRef = this;
            let pass = "";
            if(name !== "" && isNameCorrect(name)) {
                database.ref('users/' + name).on('value', function (snapshot) {
                    // Checks login(name) existance
                    if (snapshot.exists()) {
                        pass = snapshot.val().password;
                        thisRef.setState({truePassword: pass});
                    }//
                }).bind(this);
            }
        };

        this.passwordInputHandler = password => {
            this.setState({password: password });
        }
    }



    async _loadAssetsAsync() {
        const imageAssets = cacheImages([require('../../assets/sport-master-logo-png-transparent.png')]);

        await Promise.all([...imageAssets]);
    }

    render () {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this._loadAssetsAsync}
                    onFinish={() => this.setState({ isReady: true })}
                    onError={console.warn}
                />
            );
        }//

        return (
            <KeyboardAvoidingView behavior = "padding" style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'flex-end'
            }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'flex-end'
                }}
            >
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFill,
                        transform: [{ translateY: this.bgY }]
                    }}
                >
                    <Svg height={height+50} width={width}>
                        <ClipPath id="clip">
                            <Circle r={height+50} cx={width/2}/>
                        </ClipPath>
                        <Image
                            href={require('../../assets/sport-master-logo-png-transparent.jpg')}
                            width={width}
                            heigth={height+50}
                            preserveAspectRatio='xMidYMid slice'
                            clipPath='url(#clip)'
                            resizeMode="contain"
                        />
                    </Svg>
                </Animated.View>
                <View style={{ height: height / 3, justifyContent: 'center' }}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View
                            style={{
                                ...styles.button,
                                opacity: this.buttonOpacity,
                                transform: [{ translateY: this.buttonY }]
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: "white" }}>Войти</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <Animated.View style={{
                        zIndex: this.textInputZindex,
                        opacity: this.textInputOpacity,
                        transform: [{ translateY: this.textInputY }],
                        height: height/3,
                        ...StyleSheet.absoluteFill,
                        top: null,
                        justifyContent: 'center'
                    }}>
                        <TapGestureHandler onHandlerStateChange={this.onCloseState} >
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{fontSize: 15, transform: [{rotate: concat(this.rotateCross, 'deg')}]}}>X</Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <ScrollView>
                        <TextInput
                            placeholder="Логин"
                            style={styles.textInput}
                            onFocus = {() => this.setState({isFocused: true})}
                            onChangeText={this.nameInputHandler}
                        />
                        <TextInput
                            placeholder= "Пароль"
                            style={styles.textInput}
                            onChangeText={this.passwordInputHandler}
                        />

                        </ScrollView>
                        <Animated.View style={styles.button}>
                            <Text
                                style={{fontSize: 20, fontWeight: 'bold', color: "white"}}
                                // Validating name and password
                                onPress={() => {
                                    // Admin Panel login and password
                                    if(this.state.name === "" && this.state.password === "" ) {
                                        this.props.navigation.navigate('Admin'); // Navigates to Admin Panel
                                    } else if ((this.state.truePassword !== "") && (this.state.password === this.state.truePassword)) {
                                            this.props.setName(this.state.name, this.props.navigation.navigate)
                                        } else if (this.state.truePassword === "") {
                                            alert("Неверный логин");
                                        } else if (this.state.password !== this.state.truePassword) {
                                            alert("Неверный пароль");
                                        }

                                }}
                            >Войти</Text>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View>
            </KeyboardAvoidingView>
        )
    }
}

const isNameCorrect = name => {
    const nameRegex = /^[а-яё a-z]+$/i ; // Reqular expression for non digit symbols
    return nameRegex.test(name);
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#1C7BF9',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: '#1C7BF9',
        borderRadius: 20,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -50,
        left: width/2 - 20 ,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowColor: 'black',
        shadowOpacity: 0.8,

    },
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

const mapDispatchToProps = dispatch => ({
    setName: (name, navigate) => {
        if (name) {
            dispatch({ type: 'SET_NAME', payload: name});
            navigate('Main');
        }
    },
    setSocket: socket => {
        dispatch({ type: 'SET_SOCKET', payload: socket });
    },
    setDatabase: database => {
        dispatch({ type: 'SET_DATABASE', payload: database });
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
