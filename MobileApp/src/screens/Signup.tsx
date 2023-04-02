import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Input, Button, Icon } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import axios from 'axios';
import env from '../env';

const Signup = ({navigation}:{navigation:any}) => {

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');

  const handleSignup = () => {
    if (username.trim() == '' || email.trim() == '' || password.trim() == '') {
      return Toast.show({
        type: 'error',
        text1:'Please input your all informations'
      });
    } else if (password !== confirm) {
      return Toast.show({
        type:'error',
        text1:'Confirm is not same password.'
      })
    } else {
      axios
        .post(env.dev.apiUrl + '/login', {
          username: username,
          email: email,
          password: password,
        })
        .then(async (res) => {
          navigation.navigate('Login');
          return Toast.show({
            type: 'success',
            text1:'Sign up successfully'
          })
        })
        .catch((error) => {
          const errnum = error.response.status;
          if (errnum == 502) {
            return Toast.show({
              type: 'error',
              text1:'Your email exist already. please login'
            })
          } else if (errnum == 400) {
            return Toast.show({
              type:'error',
              text1: 'Server Error, please try again later'
            })
          }
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Signup</Text>
      </View>
      <View style={styles.text2}>
        <Text style={{ color: 'white', fontSize: 15, marginTop: 2 }}>Already have account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupText}> Login </Text>
        </Pressable>
      </View>

      <View style={styles.buttonStyleX}>
        <View style={styles.emailInput}>
          <Input
            InputLeftElement={
              <Icon
                as={<FontAwesome5 name='user' />}
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
            style={styles.inputback}
            variant='outline'
            placeholder='Username'
            _light={{
              placeholderTextColor: 'blueGray.400',
            }}
            _dark={{
              placeholderTextColor: 'blueGray.50',
            }}
            onChangeText={(value) => setUsername(value)}
          />
        </View>
      </View>

      {/* Username or Email Input Field */}
      <View style={styles.buttonStyleX}>
        <View style={styles.emailInput}>
          <Input
            InputLeftElement={
              <Icon
                as={<MaterialCommunityIcons name='email' />}
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
            placeholder='Confirm Password'
            style={styles.inputback}
            _light={{
              placeholderTextColor: 'blueGray.400',
            }}
            _dark={{
              placeholderTextColor: 'blueGray.50',
            }}
            onChangeText={(value) => setConfirm(value)}
          />
        </View>
      </View>

      <Button onPress={handleSignup} style={styles.buttonStyle}>
        REGISTER NOW
      </Button>
      <Toast />
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    fontFamily: 'sans-serif',
  },
  inputback:{
    backgroundColor:'white'
  },
  LoginText: {
    marginTop: 100,
    fontSize: 50,
    fontFamily: 'Cubano',
    fontWeight: 'bold',
    color: '#40f79a',
  },
  Middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text2: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
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
