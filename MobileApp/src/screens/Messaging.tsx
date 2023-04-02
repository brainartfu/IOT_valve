import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text , Image, Dimensions} from 'react-native';
import { Button } from 'native-base';
import { StyleSheet } from 'react-native';
const WIDTH = Math.floor(Dimensions.get('window').width);

import socket from '../utils/socket';
import axios from 'axios';
import env from '../env';

import BackScale180 from './../assets/vulveImg/new180.png';
import BackScale90 from './../assets/vulveImg/back90new.png';
import Iterator from './../assets/vulveImg/iterator1.png';
import AshaiImage from './../assets/vulveImg/1.png';
import GFImage from './../assets/vulveImg/2.png';
import SMImage from './../assets/vulveImg/3.png';

const ValueConvert = {
  'flow_0':0,
  'flow_2': 30,
  'flow_3':55,
  'flow_4' : 80,
  'flow_5' : 95,
  'flow_6' : 110,
  'flow_7' : 125,
  'flow_8' : 140,
  'flow_9' : 155,
  'flow_10' : 170,
  'flow_11' : 185,
  'flow_12' : 200
}
const ReverseConvert ={
  'flow_0':0,
  'flow_30':30,
  'flow_55':45,
  'flow_80':60,
  'flow_95':75,
  'flow_110':90,
  'flow_125':105,
  'flow_140':120,
  'flow_155':135,
  'flow_170':150,
  'flow_185':165,
  'flow_200':180
}

const buttons1 = [
  { key: 0, name: 'Off' },
  { key: 2, name: '1' },
  { key: 3, name: '1.5' },
  { key: 4, name: '2' },
];

const buttons2 = [
  { key: 5, name: '2.5' },
  { key: 6, name: '3' },
  { key: 7, name: '3.5' },
  { key: 8, name: '4' },
];

const buttons3 = [
  { key: 9, name: '4.5' },
  { key: 10, name: '5' },
  { key: 11, name: '5.5' },
  { key: 12, name: '6' }
];

const imageGroup = ['Asahi Valve', 'GF Valve', 'SM Valve'];

const Messaging = ({ route, navigation }) => {
  const [rowData, setRowData] = useState('');
  const [iterate, setIterate] = useState(0);
  const [asahiIterate, setAsahiIterate] = useState(45);
  

  useLayoutEffect(() => {
    setRowData(route.params);
    console.log(route.params);
    if ( route.params.type == 0 ){
      setAsahiIterate(route.params.flowValue+45);
    } else {
      setIterate(route.params.flowValue );
    }
  }, []);
  useEffect(() => {
    socket.on('from_server_iterate',(value) => {
      // console.log(ReverseConvert['flow_'+value]);
        setIterate(value);
    });
    socket.on('change_flow_error',(valve) => {
        return Toast.show({
          type: "error",
          text1 : "There are some problem in server side."
        });
    });
  },[iterate,socket]);

  const handleButton = (e) => {
    if ( rowData.type == 0 ){
        setAsahiIterate(e*7.5 + 45) ;
        const sendData = {
            vulveName:rowData.vulveName,
            s_device_id: rowData.s_device_id,
            flowValue: e*7.5
        }
        socket.emit('changeFlow_from_front', sendData);
    }
    else {
      // console.log(ValueConvert['flow_'+e]);
      console.log(e);
        setIterate(e*15);
        const sendData = {
            vulveName:rowData.vulveName,
            s_device_id: rowData.s_device_id,
            flowValue: e*15
        }
        socket.emit('changeFlow_from_front', sendData);
    }
  };

  return (
    <View style={styles.messagingscreen}>
      <View style={styles.imageView}>
        {rowData.type == 0 ? (
          <Image source={AshaiImage} alt='' style={styles.UpImage} />
        ) : rowData.type == 1 ? (
          <Image source={GFImage} alt='' style={styles.UpImage} />
        ) : (
          <Image source={SMImage} alt='' style={styles.UpImage} />
        )}
        <View style={styles.TextGroup}>
            <View style={styles.textSubGroup}>
                <Text style={styles.textSubText}>Valve ID:</Text>
                <Text style = {styles.textSubValueText}>{rowData.nickName != ''?rowData.nickName : rowData.vulveName}</Text>
            </View>
            <View style={styles.textSubGroup}>
                <Text style={styles.textSubText}>Valve Type:</Text>
                <Text style = {styles.textSubValueText}>{imageGroup[rowData.type]}</Text>
            </View>
            
        </View>
      </View>
      <View style={styles.ScaleImageGroup}>
        {rowData.type == 0 ? (
          <Image source={BackScale90} alt='' style={{
            width:'100%'
          }} />
        ) : (
          <Image source={BackScale180} alt='' style={{
            width:'100%',
          }} />
        )}
        {
            rowData.type == 0 ? <Image
                source={Iterator}
                alt=''
                style={{
                    position: 'absolute',
                    bottom: 7,
                    left:'5%',
                    width: '49%',
                    transform: [
                        {   
                            translateX: 90
                        },
                        {
                            rotate: `${asahiIterate}deg`
                        },
                        {   
                            translateX: -90

                        }
                    ]
                    
                }}
            />: <Image
                source={Iterator}
                alt=''
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '4%',
                    width: '46%',
                    transform: [
                        {   
                            translateX: 90
                        },
                        {
                            rotate: `${iterate}deg`
                        },
                        {   
                            translateX: -90

                        }
                    ]
                }}
            />
        }
        
      </View>
      <View style={styles.messaginginputContainer}>
        <View style={styles.buttonGroup}>
          {buttons1.map((el) => (
            <Button
              onPress={() => handleButton(el.key)}
              key = {el.key}
              style={rowData.type == 0 ? ((asahiIterate-45)/7.5 == el.key ? styles.pressBtn : styles.percentBtn)
                                       : (iterate/15 == el.key ? styles.pressBtn : styles.percentBtn)}
            >
              <Text style={styles.buttonText}>{el.name}</Text>
            </Button>
          ))}
        </View>
        <View style={styles.buttonGroup}>
          {buttons2.map((el) => {
            return (
              <Button
                onPress={() => handleButton(el.key)}
                key = {el.key}
                style={rowData.type == 0 ? ((asahiIterate-45)/7.5 == el.key ? styles.pressBtn : styles.percentBtn)
                                         : (iterate/15 == el.key ? styles.pressBtn : styles.percentBtn)}
              >
                <Text style={styles.buttonText}>{el.name}</Text>
              </Button>
            );
          })}
        </View>
        <View style={styles.buttonGroup}>
          {buttons3.map((el) => {
            return (
              <Button
                onPress={() => handleButton(el.key)}
                key={el.key}
                style={rowData.type == 0 ? ((asahiIterate-45)/7.5 == el.key ? styles.pressBtn : styles.percentBtn)
                                         : (iterate/15 == el.key ? styles.pressBtn : styles.percentBtn)}
              >
                <Text style={styles.buttonText}>{el.name}</Text>
              </Button>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    TextGroup:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-evenly'
    },
    textSubGroup:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-evenly'
    },
    textSubText:{
        color: 'white',
        fontSize: 20,
        fontFamily: 'monospace',
        fontWeight: 900
    },
    textSubValueText:{
        color:'#9aff9d',
        fontSize: 20,
        fontFamily: 'monospace',
        fontWeight: 900
    },
  imageView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  UpImage: {
    backgroundColor: 'white',
    borderRadius: 20,
    width:140,
    height:140,
    marginTop: 15,
    marginBottom: 15,
  },
  messagingscreen: {
    flex: 1,
    backgroundColor: 'black',
  },
  ScaleImageGroup: {
    width:WIDTH
  },
  ScaleImageIterator: {},
  messaginginputContainer: {
    width: '100%',
  },
  messaginginput: {
    borderWidth: 1,
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
  },
  messagingbuttonContainer: {
    width: '30%',
    backgroundColor: 'green',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  button: {
    color: 'white',
  },
  text: {
    borderWidth: 1,
    padding: 25,
    borderColor: 'black',
    backgroundColor: 'red',
  },
  percentBtn: {
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 5,
    width: 70,
    backgroundColor: '#8af795',
    height:50,
  },
  pressBtn:{
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 5,
    width: 70,
    backgroundColor: 'red',
    height:50,
  },
  buttonText: {
    color: 'black',
    fontSize:28,
    fontFamily:'sans-serif',
  },
  buttonGroup: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Messaging;
