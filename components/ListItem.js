import React, { useEffect } from 'react';
import Swipeable from 'react-native-swipeable';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {connect} from "react-redux";
import createApi from "./api";

const leftContent = <Text />;
const rightContent = <Text />;


const ListItem = ({ query, name, navigation }) => {
    useEffect(() => console.log(query));

    let activeQueryCounter = 0;

    const requestStatus ={
        OPEN: 0,
        IN_PROCESS: 1,
        CLOSE: 2
    }


    function queryColor(status) {
        if (status === requestStatus.IN_PROCESS) {
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

                    if(this.props.consultantId && query.id) {
                        const api = createApi(this.props.serverApi);
                        api.queries.takeInWork(this.props.consultantId, query.id);
                    }
                    activeQueryCounter++;


            }}
            rightContent={rightContent}
            onRightActionActivate={() => {
                if (query.status) {

                        if(this.props.consultantId && query.id){
                            const api = createApi(this.props.serverApi);
                            api.queries.completeWork(this.props.consultantId, query.id);
                        }

                } else{
                    alert('Сначала выполни заявку!');
                }
            }}
            style={{ paddingBottom: 5 }}
        >

            <TouchableOpacity onPress={() =>{ navigation('Thing', {
                consultantName: name,
                name: query.products[0].name,
                size: query.products[0].sizes[0].name,
                ware: query.products[0].vendorcode === undefined ? query.products[0].vendorCode : query.products[0].vendorcode,
                image: query.products[0].images[0].url,
                things: query.products,
                type: query.type,
                barcode: query.products[0].barcode,
                price: query.products[0].price
            });
            }}>
            <View style={[styles.listItem, queryColor(query.status)]}>
                <View style={styles.roomNumberBlock}>
                    <Text style={{ color: "white", fontSize: 50 }}>
                        1
                    </Text>
                </View>
                <View style={styles.infoBlock}>
                    <Text style={{ color: "white", fontSize: 30}}>{query.title}</Text>
                    <Text style={{ color: "white" }}>{query.time}</Text>
                    { query.type === 1
                        ? <>
                            <Text style={{ color: "white" }}>{query.products[0].vendorCode}</Text>
                            <Text style={{ color: "white" }}>{query.products[0].sizes[0].name}</Text>
                        </>
                        : null
                    }
                    <Text style={{ color: "white" }}>{name}</Text>
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
    server: state.settings.server,
    consultantName: state.settings.consultantName,
    consultantId: state.settings.consultantId
});


export default connect(mapStateToProps)(ListItem);
