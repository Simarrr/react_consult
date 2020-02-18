import * as React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {connect} from "react-redux";

class BarcodeScanner extends React.Component {

    constructor(props){
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Сканировать",
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };



    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    };

    render() {

        const { hasCameraPermission, scanned } = this.state;

        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        }
        return (
            <BarCodeScanner
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code128]}
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={[StyleSheet.absoluteFill, styles.container]}
            >
                <View style={styles.layerTop} />
                <View style={styles.layerCenter}>
                    <View style={styles.layerLeft} />
                    <View style={styles.focused} />
                    <View style={styles.layerRight} />
                </View>
                <View style={styles.layerBottom} />
            </BarCodeScanner>
        );
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({ scanned: false });
        let ScannedThing;
        this.props.socket.emit('sendScannedWare', data);
        this.props.socket.on('receiveScannedThing', (thing) =>{
            ScannedThing = thing;
        });
        this.props.navigation.navigate('Thing', {barcode: ScannedThing})
    };
}//

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 0, marginLeft: 0, marginStart: 0,
        paddingHorizontal: 0, paddingLeft: 0, paddingStart: 0,
        height: '125 %',
        padding: 0
    },
    layerTop: {
        flex: 1,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 1,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity
    },
});

const mapStateToProps = state => ({
    socket: state.settings.socket,
    server: state.settings.server,
    consultantName: state.settings.consultantName,
});

export default connect(mapStateToProps)(BarcodeScanner);
