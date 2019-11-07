import React, { useEffect } from 'react';
import Swipeable from 'react-native-swipeable';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const leftContent = <Text />;
const rightContent = <Text />;


const ListItem = ({ query, socket, name, navigation }) => {
    useEffect(() => console.log(query));

    function queryColor(inProcessing) {
        if (inProcessing) {
            return {
                backgroundColor: "blue"
            };
        }
        return {
            backgroundColor: "red"
        };
    }


    return (

        <Swipeable
            leftContent={leftContent}
            onLeftActionActivate={() => {
                if (name !== '') {
                    query.consultantName = name;
                    console.log(query);
                    socket.emit('takeInWork', query);
                } else {
                    alert ('Введите свое имя!')
                }

            }}
            rightContent={rightContent}
            onRightActionActivate={() => {
                if (query.inProcessing) {
                    if (query.consultantName === name) {
                        socket.emit('completed', query);
                    } else {
                        alert('Заявку выполняет другой сотрудник');
                    }
                } else{
                    alert('Сначала выполни заявку!');
                }
            }}
            style={{ paddingBottom: 5 }}
        >

            <TouchableOpacity onPress={() =>{ navigation('Thing', {name: query.consultantName,
            roomNumber: query.roomNumber,
            vendorCode: query.vendorCode,
            size: query.size,
            title: query.title,
            barcode: query.barcode,
            color: query.color,
            price: query.price});
            alert(navigation)}}>
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
        // alignItems: "center",
        color: "white",
        justifyContent: "center",
    }
});

export default ListItem;
