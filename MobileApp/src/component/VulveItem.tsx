import { StyleSheet,Pressable,View,Text,Image,TouchableOpacity } from 'react-native';
import React,{useState,useEffect} from 'react';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import axios from 'axios';
import env from '../env';

import AshaiImage from './../assets/vulveImg/1.png';
import GFImage from './../assets/vulveImg/2.png';
import SMImage from './../assets/vulveImg/3.png';

import { useNavigation } from "@react-navigation/native";

const VulveItem = (data) => {
    const navigation = useNavigation();
    const imageGroup = [
        {
            type : 'Asahi Valve',
            img : <Image source = {AshaiImage} alt = '' style={styles.vulveImage}/>,

        },
        {
            type : 'GF Valve',
            img : <Image source = {GFImage} alt='' style={styles.vulveImage}/>
        },
        {
            type : 'SM Valve',
            img : <Image source = {SMImage} alt='' style={styles.vulveImage}/>
        }
    ];
    const DetailControl = (pro) => {
        if ( pro.is_online ){
            axios.get(env.dev.apiUrl + `/vulves/${pro.vulveName}`)
              .then(async (res) => {
                navigation.navigate('Status',res.data[0]);
              })
              .catch((error) => {
                const errnum = error.response.status;
                if (errnum == 400) {
                  return Toast.show({
                    type: 'error',
                    text1: 'Server Error'
                  });
                }
              });
        } else {
            return Toast.show({
                type:'error',
                text1:'not connected device'
            })
        }
    }
    const OnLongClick = (pro) => {
        data.setLongClickData(pro);
        data.setModalVisible(true);
    }
    return (
        <TouchableOpacity
            onPress={() => DetailControl(data.rowData)}
            onLongPress={() => OnLongClick(data.rowData)}
            style={data.rowData.type == 0?styles.item1:(data.rowData.type==1?styles.item2:styles.item3)}
        >
                {imageGroup[data.rowData.type].img}
                {data.rowData.is_online?
                    <FontAwesome5 style={styles.statusIconOnline} name='wifi' size={24} color='black' /> :
                    <MaterialIcons style={styles.statusIconOffline} name='wifi-off' size={24} color='black' />
                }
                <View style={styles.rightTextGroup}>   
                    <Text style={styles.title}>{data.rowData.nickName != ''?data.rowData.nickName : data.rowData.vulveName}</Text>
                    <Text style={styles.ipTitle}>{data.rowData.vulveIp ? `${data.rowData.vulveIp.split('ffff:')[1]}` : 'No Ip connection'}</Text>
                    <Text style = {styles.typeTitle}>{imageGroup[data.rowData.type].type}</Text>
                </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item1: {
        backgroundColor: '#e7ffdd',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection:'row',
        justifyContent:'space-between',
        boxShadow: 'rgb(189 188 188) 2px 2px 7px',
        borderRadius: 20
    },
    item2: {
        backgroundColor: '#fde7ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection:'row',
        justifyContent:'space-between',
        boxShadow: 'rgb(189 188 188) 2px 2px 7px',
        borderRadius: 20
    },
    item3: {
        backgroundColor: '#cbfbfb',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection:'row',
        justifyContent:'space-between',
        boxShadow: 'rgb(189 188 188) 2px 2px 7px',
        borderRadius: 20
    },
    title: {
        fontSize: 24,
        fontFamily:'Roboto',
        textAlign:'center',
        color:'black'
    },
    ipTitle:{
        textAlign: 'right',
        fontSize: 16,
        fontFamily:'Roboto',
        color:'black'
    },
    typeTitle:{
        textAlign: 'center',
        fontSize: 16,
        fontFamily:'Roboto',
        color:'black'
    },
    vulveImage:{
        width:140,
        height:150,
    },
    statusIconOnline:{
        position: 'absolute',
        right: 20,
        top: 10,
        color: '#06f506'
    },
    statusIconOffline:{
        position: 'absolute',
        right: 20,
        top: 10,
        color: 'red'
    },
    rightTextGroup:{
        marginTop:20,
    }
});

export default VulveItem ;