import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Modal,
  Image
} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { Input, Icon } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';

import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';
/*******************************Component and Assets Definition******************************* */
import VulveItem from '../component/VulveItem';
import Dropdown from '../component/Dropdown';
import ModalImg from '../assets/vulveImg/modal_img1.jpg';


/*************************************** env and socket **************************************/
import env from '../env';
import socket from '../utils/socket';

const imageGroup = [
  {
    key: 0,
    type: 'Asahi Valve',
  },
  {
    key: 1,
    type: 'GF Valve',
  },
  {
    key: 2,
    type: 'SM Valve',
  },
];

const Vulve = ({ route} : any) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [modalVisible,setModalVisible] = useState<boolean>(false);
  const [longClickData,setLongClickData] = useState<any>({});
  const [dropdownNumber, setDropdownNumber] = useState<number>(-1);
  //const [ipvalue, setIpvalue] = useState('');

  const [title, setTitle] = useState<string>('');
  const [userInfo, setUserInfo] = useState<object>({});
  const [vulveName, setVulvename] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [machineName, setMachineName] = useState<string>('');
  const [vulveList, setVulveList] = useState<any>([]);
  const [globalVulves, setGlobalVulves] = useState<any>([]);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       // Do something here when the back button is pressed
  //        axios
  //         .put(env.dev.apiUrl + `/vulves/${route.params._id}`)
  //         .then(async (res) => {
  //           return Toast.show({
  //             type: 'success',
  //             text1: 'Initialized successfully',
  //           });
  //         })
  //         .catch((error) => {
  //           const errnum = error.response.status;
  //           if (errnum == 400) {
  //             return Toast.show({
  //               type: 'error',
  //               text1: "Not Initialized all, please check valve's stata"
  //             });
  //           }
  //           setModalVisible(!modalVisible);
  //         });
  //       return true; // Return true to prevent default behavior (i.e. go back)
  //     };
  //     navigation.addListener('beforeRemove', (e) => {
  //       if (!onBackPress()) {
  //         e.preventDefault();
  //       }
  //     });
  //     return () => {
  //       navigation.removeListener('beforeRemove');
  //     };
  //   }, [navigation])
  // );
  useEffect(() => {
    setLoading(true);
    setUserInfo(route.params);
    setTitle(route.params.username);
    // console.log(navigation);
    axios
      .get(env.dev.apiUrl + `/vulves/${route.params._id}/${socket.id}`)
      .then(async (res) => {
        setGlobalVulves(res.data);
        if ( res.data.length > 0 ) return ;
        setVisible(true);
      })
      .catch((error) => {
        const errnum = error.response.status;
        if (errnum == 400) {
          return Toast.show({
            type: 'error',
            text1: 'Server Error, Can not get vulve lists',
          });
        }
      });
  }, []);
  useEffect(() => {
    console.log(dropdownNumber);
  },[dropdownNumber]);
  const getAllvulves = () => {
    return globalVulves ;
  }
  useEffect(() => {
    socket.on('connected_device',async(value) => {
        axios
          .get(env.dev.apiUrl + `/vulves/${route.params._id}/${socket.id}`)
          .then(async (res) => {
            setGlobalVulves(res.data);
            return Toast.show({
              type: "success",
              text1 : "connected your device. Device Name is "+value.vulveName
            });
          })
          .catch((error) => {
            const errnum = error.response.status;
            if (errnum == 400) {
              return Toast.show({
                type: 'error',
                text1: 'Device connected, but there is some problem in server side'
              });
            }
          });
    }),
    socket.on('disconnected_device',(value) => {
      axios
        .get(env.dev.apiUrl + `/vulves/${route.params._id}/${socket.id}`)
        .then(async (res) => {
          setGlobalVulves(res.data);
          return Toast.show({
            type: "success",
            text1 : "disconnected your device. Device Name is" + value.vulveName
          });
        })
        .catch((error) => {
          const errnum = error.response.status;
          if (errnum == 400) {
            return Toast.show({
              type: 'error',
              text1: 'Device disconnected, but there is some problem in server side'
            });
          }
        });
    })
  },[socket]);

  useEffect(() => {
    setVulveList(globalVulves);
  },[globalVulves]);

  useEffect(() => {
    setVulveList(globalVulves.filter(item => {
        return (item.vulveName !== '' && item.vulveName.search(vulveName) >= 0) || (item.nickName !== '' && item.nickName.search(vulveName) >= 0) ;
    }))
  },[vulveName]);

  const addVulve = () => {
    if (machineName == '' || dropdownNumber == -1) {
      return Toast.show({
        type: 'error',
        text1: 'Missing values',
      });
    }
    const data = {
      userId: userInfo._id,
      vulveName: machineName,
      nickName: nickName,
      type: dropdownNumber,
      s_user_id : socket.id
    };
    axios
      .post(env.dev.apiUrl + '/vulves', data)
      .then((res) => {
        console.log(res);
        if ( res.data.result == 'existdevice')
          return Toast.show({
            type : 'error',
            text1 : 'The device is in use by another user'
          });
        else if ( res.data.result == 'nodevice')
          return Toast.show({
            type: 'error',
            text1: 'There is no registered device'
          });
        setGlobalVulves([...globalVulves,res.data]);
        setMachineName('');
        setDropdownNumber(-1);
        setVulvename('');
        setVisible(false);
        return Toast.show({
          type: 'success',
          text1: 'added valve successfully',
        });
      }).catch((error) => {
        const errnum = error.response.status;
        if (errnum == 400) {
          return Toast.show({
            type: 'error',
            text1: 'Server Error, please try it later',
          });
        }
      });
  };
  const formatValues = () => {
    setMachineName('');
    setDropdownNumber(-1);
    setVulvename('');
    if ( globalVulves.length > 0 ){
      setVisible(false);
    } else {
      return Toast.show({
        type: 'success',
        text1:'First of all, please add your device'
      })
    }
  };
  const deleteDevice = () => {
    axios
      .delete(env.dev.apiUrl + `/vulves/${longClickData.vulveName}`)
      .then(async (res) => {
        var newVulves = globalVulves;
        const Index = newVulves.findIndex(obj => obj.vulveName === longClickData.vulveName);
        newVulves = newVulves.filter(obj => obj.vulveName !== longClickData.vulveName);
        setGlobalVulves(newVulves);
        setModalVisible(!modalVisible);
        return Toast.show({
          type: 'success',
          text1: 'deleted successfully',
        });
        if ( globalVulves.length > 0 ) return ;
        setVisible(true);
      })
      .catch((error) => {
        const errnum = error.response.status;
        if (errnum == 400) {
          return Toast.show({
            type: 'error',
            text1: 'Server Error, Can not delete vulve',
          });
        }
        setModalVisible(!modalVisible);
      });
  }
  const toggleModal = () => {
      setModalVisible(!modalVisible);
  };
  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <Toast />
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>{title}</Text>

          <Pressable onPress={() => setVisible(true)}>
            <AntDesign name='pluscircleo' size={24} color='#cbfbfb' />
          </Pressable>
        </View>
      </View>
      <View style={styles.searchView}>
        <View style={styles.emailInput}>
          <Input
            InputLeftElement={
              <Icon
                as={<Fontisto name='search' />}
                size='sm'
                m={2}
                _light={{
                  color: 'white',
                }}
                _dark={{
                  color: 'gray.300',
                }}
              />
            }
            variant='outline'
            placeholder='valve name'
            _light={{
              placeholderTextColor: 'blueGray.400',
            }}
            _dark={{
              placeholderTextColor: 'blueGray.50',
            }}
            style={{
                fontFamily: 'sans-serif',
                fontSize: 16,
                color:'white'
            }}
            value={vulveName}
            onChangeText={(value) => setVulvename(value)}
          />
        </View>
      </View>
      {
        vulveList.length > 0 ? <FlatList
            data={vulveList}
            renderItem={({item}) => <VulveItem rowData={item} setModalVisible={setModalVisible} setLongClickData = {setLongClickData}/>}
            keyExtractor={(item) => item._id}
        />:<View>
            <Text style={{
                textAlign: 'center',
                fontSize: 24,
                fontFamily: 'Roboto',
                color: '#c4fbc4'
            }}>There is no valve</Text>
        </View>
      }  
      
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
          }}
        >
            <View>
                <Image source={ModalImg} alt='' style={styles.modalImg} />
            </View>
            <View style={{ position: 'relative' }}>
                <View style={styles.searchView}>
                    <View style={styles.buttonStyleX}>
                      <Text style={styles.modalText}>Valve Name</Text>
                      <Input
                        variant='outline'
                        placeholder='valve name'
                        onChangeText={(value) => setMachineName(value)}
                        style={{
                            height: 50,
                            fontSize: 20,
                            color: 'white',
                            fontFamily: 'sans-serif',
                        }}
                      />
                    </View>
                    <View style={styles.buttonStyleX}>
                      <Text style={styles.modalText}>NickName</Text>
                      <Input
                        variant='outline'
                        placeholder='nickname'
                        onChangeText={(value) => setNickName(value)}
                        style={{
                            height: 50,
                            fontSize: 20,
                            color: 'white',
                            fontFamily: 'sans-serif',
                        }}
                      />
                    </View>
                    <Dropdown
                      items={imageGroup}
                      setDropdownNumber={setDropdownNumber}
                    />
                </View>
            </View>
            <View style={styles.CaptionText}>
                <View
                    style={{
                        marginTop: 20,
                        marginLeft: 30,
                        marginRight: 30,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 100,
                    }}
                    >
                    <Pressable onPress={addVulve}>
                        <Text style={styles.buttonStyle}>Add</Text>
                    </Pressable>
                    <Pressable onPress={formatValues}>
                        <Text style={styles.buttonStyle}>Close</Text>
                    </Pressable>
                </View>
                <View style={{
                  paddingVertical : 10,
                  paddingHorizontal:30,
                  backgroundColor:"#132412",
                  borderRadius : 20,
                  marginLeft : 10,
                  marginRight : 10
                }}>
                    <Text style={{
                        color: 'red',
                        fontSize: 17,
                        fontFamily: 'sans-serif',
                    }}>
                      Please choose your correct valve type. 
                    </Text>
                    <Text style={{
                        color: 'red',
                        fontSize: 17,
                        fontFamily: 'sans-serif',
                    }}> 
                      Choosing the incorrect type of valve could damage or destroy your new (product name not chosen yet), your valve, or both!
                    </Text>
                </View>
            </View>
            <Toast />
        </View>
      </Modal>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
    >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: '#cbfbfb', 
            padding: 20,
            borderRadius:20
          }}>
            <Pressable onPress={deleteDevice}>
              <View style ={styles.contextModalViewTop}>
                <Text style={styles.contextDeleteText}>Delete Device</Text>
              </View>
            </Pressable>
            
              <Pressable onPress={toggleModal}>
                <View style ={styles.contextModalViewBottom}>
                  <Text style={styles.contextCloseText}>Cancel</Text>
                </View>
              </Pressable>
            
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Vulve;

const styles = StyleSheet.create({
  contextModalViewTop:{
    borderBottomWidth:1, 
    borderColor:'black', 
    paddingHorizontal:100,
    paddingVertical:20
  },
  contextModalViewBottom :{
    paddingHorizontal:100,
    paddingVertical:20
  },
  contextDeleteText:{
    fontSize:20,
    color:'red',
    textAlign:'center'
  },
  contextCloseText:{
    textAlign:'center',
    fontSize:20,
    color:'black'
  },
  buttonStyleX: {
    marginTop: 20,
  },
  chatscreen: {
    backgroundColor: '#000000',
    flex: 1,
    padding: 10,
    position: 'relative',
  },
  chattopContainer: {
    backgroundColor: '#000000',
    height: 70,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  chatheading: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily:'Cubano',
    color: '#cbfbfb',
  },
  chatheader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'black',
    justifyContent: 'space-between',
  },
  searchView: {
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15
  },
  modalImg: {
    height:100,
    width:'100%'
  },
  modalText: {
    fontFamily: 'Cubano',
    color: 'white',
    fontSize: 18,
  },
  buttonStyle: {
    color: 'white',
    backgroundColor: '#50eb9c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 21,
    borderRadius: 7,
  },
  CaptionText:{
    position:'absolute',
    top: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 60,
    zIndex:-1
  }
});
