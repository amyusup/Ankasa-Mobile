import React from 'react';
import {View, Text, TextInput, StyleSheet, ToastAndroid} from 'react-native';
import {RectButton, TouchableOpacity} from 'react-native-gesture-handler';
import style from '../helpers';
import Back from '../assets/icons/btnback.svg';
import { reset, clearForgot } from '../redux/actions/forgot';
import { useDispatch, useSelector } from 'react-redux';

const ResetPassword = ({navigation}) => {
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [verification, setVerification] = React.useState('');
  const dispatch = useDispatch()
  const { verificationCode, email, isSuccess } = useSelector((state)=>state.forgot)

  React.useEffect(()=>{
    if(isSuccess){
      navigation.navigate('Login')
    }
    return function cleanup() {
      dispatch(clearForgot())
    }
  },[isSuccess])

  const onSubmit = () =>{
    console.log('ada')
    if (password != password2){
      ToastAndroid.show("Password does not match", ToastAndroid.SHORT)
    } else if(verificationCode != verification){
      ToastAndroid.show("Verification code does not match", ToastAndroid.SHORT)
    }else{
      dispatch(reset({email, password}))
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Back width={29} height={29} />
      </TouchableOpacity>

      <View style={{paddingTop: 80}}>
        <View>
          <Text style={{fontSize: 40, fontWeight: 'bold', textAlign: 'center'}}>
            Forgot Password
          </Text>
          <TextInput
            style={{marginTop: 30}}
            placeholder="New Password"
            underlineColorAndroid="#9B96AB"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={{marginTop: 30}}
            placeholder="Repeat Password"
            underlineColorAndroid="#9B96AB"
            secureTextEntry={true}
            onChangeText={(text) => setPassword2(text)}
          />
          <TextInput
            style={{marginTop: 30}}
            placeholder="Verification code"
            underlineColorAndroid="#9B96AB"
            onChangeText={(text) => setVerification(text)}
          />
        </View>

        <View style={{marginTop: 20}}>
          <RectButton
            style={
              password || password2 || verification
                ? styles.button
                : styles.buttonDisabled
            }
            enabled={password || password2 || verification ? true : false}
            onPress={onSubmit}
            >
            <Text
              style={{
                textAlign: 'center',
                color: password || password2 || verification ?style.white:style.dark,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Send
            </Text>
          </RectButton>

          <Text style={{textAlign: 'center', marginTop: 20, color: '#595959'}}>
            Reset your password
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  button: {
    backgroundColor: style.primary,
    borderRadius: 10,
    paddingVertical: 15,
    elevation: 2,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: style.grey,
    borderRadius: 10,
    paddingVertical: 15,
    elevation: 2,
    marginBottom: 10,
  },
  button2: {
    backgroundColor: style.white,
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    borderColor: 'red',
  },
});
