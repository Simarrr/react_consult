import React, { useEffect } from 'react';
import Swipeable from 'react-native-swipeable';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {connect} from "react-redux";

const leftContent = <Text />;
const rightContent = <Text />;


const ListItem = ({ query, socket, name, navigation }) => {
    useEffect(() => console.log(query));

    let activeQueryCounter = 0;



    function queryColor(inProcessing) {
        if (inProcessing) {
            return {
                backgroundColor: "blue" //if request is in work
            };
        }
        return {
            backgroundColor: "red" //if request is not in work
        };
    }


    return (

            <Swipeable
            leftContent={leftContent}
            onLeftActionActivate={() => {
                if (name !== '') {
                    query.consultantName = name;
                    console.log(query);
                    socket.emit('takeInWork', query); //Calls action to change state in array object
                    activeQueryCounter++;
                } else {
                    alert ('Введите свое имя!')
                }

            }}
            rightContent={rightContent}
            onRightActionActivate={() => {
                if (query.inProcessing) {
                    if (query.consultantName === name) {
                        socket.emit('completed', query); // Removes object query from array
                    } else {
                        alert('Заявку выполняет другой сотрудник');
                    }
                } else{
                    alert('Сначала выполни заявку!');
                }
            }}
            style={{ paddingBottom: 5 }}
        >
            // OnPress sends to ThingScreen View with given parametrs
            <TouchableOpacity onPress={() =>{ navigation('Thing', {consultantName: query.consultantName,
            roomNumber: query.roomNumber,
            name: query.name,
            size: query.size,
            ware: query.ware,
            image: query.images,
            things: query.things,
            text: query.text,
            title: query.title,
            barcode: query.barcode,
            color: query.color,
            price: query.price});
            }}>
            <View style={[styles.listItem, queryColor(query.inProcessing)]}>
                <View style={styles.roomNumberBlock}>
                    <Text style={{ color: "white", fontSize: 50 }}>
                        {query.roomNumber}
                    </Text>
                </View>
                <View style={styles.infoBlock}>
                    <Text style={{ color: "white", fontSize: 30}}>{query.text}</Text>
                    <Text style={{ color: "white" }}>{query.time}</Text>
                    { query.type === 'BRING_THING'
                        ? <>
                            <Text style={{ color: "white" }}>{query.vendorCode}</Text>
                            <Text style={{ color: "white" }}>{query.size}</Text>
                        </>
                        : null
                    }
                    <Text style={{ color: "white" }}>{query.consultantName}</Text>
                </View>
            </View>
            </TouchableOpacity>

            </Swipeable>

    );
}
//
const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    roomNumberBlock: {
        height: 100,
        width: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    infoBlock: {
        color: "white",
        justifyContent: "center",
    }
});

//Get store socket, server and consultantName
const mapStateToProps = state => ({
    socket: state.settings.socket,
    server: state.settings.server,
    consultantName: state.settings.consultantName,
});


export default connect(mapStateToProps)(ListItem);
