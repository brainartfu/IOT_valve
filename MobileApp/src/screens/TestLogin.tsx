import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Input, Button, Icon,BackHandler } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import env from '../env';
const TestLogin = ({navigation}:{navigation : any}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    AsyncStorage.getItem('email').then(async (val) => {
      if (await val) {
        // navigation.navigate('Vulve');
      }
    });
  }, []);
  const storeUsername = async (e) => {
    try {
      await AsyncStorage.setItem('login_user', JSON.stringify(e));
      navigation.navigate('Vulve', e);
    } catch (e) {
      return Toast.show({
        type: 'error',
        text1: 'what happened? please try it again.',
      });
    }
  };
  const handleSignIn = () => {
    if (email.trim() !== '' && password.trim() !== '') {
      //👇🏻 Logs the email to the console
      axios
        .get(env.dev.apiUrl + `/login/${email}/${password}`)
        .then(async (res) => {
          storeUsername(res.data.states[0]);
        })
        .catch((error) => {
          const errnum = error.response.status;
          if (errnum == 400) {
            return Toast.show({
              type: 'error',
              text1: 'Server Error, Try it later',
            });
          } else if (errnum == 502) {
            return Toast.show({
              type: 'error',
              text1: 'You are not registered.',
            });
          }
        });
    } else {
      return Toast.show({
        type: 'error',
        text1: 'Email is required.',
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Log in</Text>
      </View>
      <View style={styles.text2}>
        <Text style={{ color: 'white', fontSize: 15, marginTop: 2 }}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}> Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Username or Email Input Field */}
      <View style={styles.buttonStyleX}>
        <View style={styles.emailInput}>
          <Input
            InputLeftElement={
              <Icon
                as={<FontAwesome5 name='google-plus' />}
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
            placeholder='Email'
            style={styles.inputback}
            _light={{
              placeholderTextColor: 'blueGray.400',
            }}
            _dark={{
              placeholderTextColor: 'blueGray.50',
            }}
            onChangeText={(value) => setEmail(value)}
          />
        </View>
      </View>

      {/* Password Input Field */}
      <View style={styles.buttonStyleX}>
        <View style={styles.emailInput}>
          <Input
            InputLeftElement={
              <Icon
                as={<FontAwesome5 name='key' />}
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
            secureTextEntry={true}
            placeholder='Password'
            style={styles.inputback}
            _light={{
              placeholderTextColor: 'blueGray.400',
            }}
            _dark={{
              placeholderTextColor: 'blueGray.50',
            }}
            onChangeText={(value) => setPassword(value)}
          />
        </View>
      </View>

      {/* Button */}
      <Button onPress={handleSignIn} style={styles.buttonStyle}>
        Log In
      </Button>
      <Toast />
    </View>
  );
};

export default TestLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  LoginText: {
    marginTop: 100,
    fontSize: 50,
    fontFamily: 'Cubano',
    fontWeight: 'bold',
    color: '#40f79a',
  },
  inputback:{
    backgroundColor:'white'
  },
  Middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text2: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 15,
  },
  signupText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Cubano',
  },
  emailField: {
    marginTop: 30,
    marginLeft: 15,
  },
  emailInput: {
    marginTop: 10,
    marginRight: 5,
  },
  buttonStyle: {
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 40,
    backgroundColor: '#50eb9c',
  },
  buttonStyleX: {
    marginTop: 12,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonDesign: {
    backgroundColor: '#026efd',
  },
  lineStyle: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  imageStyle: {
    width: 80,
    height: 80,
    marginLeft: 20,
  },
  boxStyle: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-around',
  },
});
