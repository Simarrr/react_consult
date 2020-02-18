import React, { useEffect } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {connect} from "react-redux";

const leftContent = <Text />;
const rightContent = <Text />;
const { width, height } = Dimensions.get('window');

const ThingItem = ({ thing, navigation }) => {
    useEffect(() => console.log(thing));

    let activeQueryCounter = 0;

    return (
        <View style={{ paddingBottom: 5 }}>
            <TouchableOpacity onPress={() =>{ navigation('Thing', {name: thing.name,
                text: "Запрос товара",
                size: thing.size,
                ware: thing.ware,
                image: thing.image,
                barcode: thing.barcode,
                color: thing.color,
                price: thing.price,
                });
            }}>
                <View style={styles.listItem}>
                    <View style = {{flex: 1, flexDirection: "row" }}>
                    <View style={styles.vendorcode}>
                        <Text style={{ color: "white", fontSize: width*0.2 }}>
                            {thing.ware}
                        </Text>
                    </View>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={{ color: "white", fontSize: width*0.1}}>{thing.color}</Text>
                        <Text style={{ color: "white" }}>{thing.size}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
//



const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "red",
    },
    vendorcode: {
        height: height/7,
        width: width,
        alignItems: "center",
        justifyContent: "center",
    },
    infoBlock: {
        // alignItems: "center",
        color: "white",
        justifyContent: "center",
    }
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



export default connect(mapStateToProps, mapDispatchToProps)(ThingItem);
