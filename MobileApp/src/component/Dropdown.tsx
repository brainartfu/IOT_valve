import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

import AshaiImage from './../assets/vulveImg/1.png';
import GFImage from './../assets/vulveImg/2.png';
import SMImage from './../assets/vulveImg/3.png';

const Dropdown = (props:any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [items, setItems] = useState<object>({});
  const [dropdownText, setDropdownText] = useState<string>('valve types');
  const toggleDropdown = () => {
    setVisible(!visible);
  };
  const selectlists = (e) => {
    setDropdownText(e.type);
    setVisible(false);
    props.setDropdownNumber(e.key);
  };
  useEffect(() => {
    setItems(props.items);
  }, []);
  return (
    <View style={styles.buttonStyleX}>
      <Text style={styles.modalText}>Type</Text>
      <View>
        <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
          <Text style={styles.buttonText}>{dropdownText}</Text>
          {visible ? (
            <Fontisto
              type='angle-up'
              name='angle-up'
              style={{
                fontSize: 15,
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: 'white',
              }}
            />
          ) : (
            <Fontisto
              type='angle-down'
              name='angle-down'
              style={{
                fontSize: 15,
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: 'white',
              }}
            />
          )}
        </TouchableOpacity>
        {visible && (
          <View style={styles.dropdown}>
            {items.map((el, index) => {
              return (
                <Pressable
                  key={el.key}
                  onPress={() => selectlists(el)}
                  style={{
                    padding: 5,
                    borderTop: '1px solid #dadcdd',
                  }}
                >
                  <View style={styles.dropdownArea}>
                    {el.key == 0 ? (
                      <Image source={AshaiImage} alt='' style={styles.dropdownImg} />
                    ) : el.key == 1 ? (
                      <Image source={GFImage} alt='' style={styles.dropdownImg} />
                    ) : (
                      <Image source={SMImage} alt='' style={styles.dropdownImg} />
                    )}
                    <Text style={styles.dropdownText}>{el.type}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  buttonStyleX: {
    marginTop: 20,
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 1,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor:'white',
    width: '100%',
    borderRadius: 6,
    height: 50,
    position: 'relative',
  },
  buttonText: {
    flex: 1,
    color: 'white',
    fontSize: 20,
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: 0,
    backgroundColor: '#556472',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  dropdownArea: {
    height: 50,
    marginLeft: 30,
    marginRight: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownImg: {
    backgroundColor: '#ffffc4',
    borderRadius: 50,
    height:50,
    width:50
  },
  dropdownText: {
    color: 'white',
    fontSize: 24,
    marginTop: 10,
  },
  modalText: {
    fontFamily: 'Cubano',
    color: 'white',
    fontSize: 18,
  },
});
