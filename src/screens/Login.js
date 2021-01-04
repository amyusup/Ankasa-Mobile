import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
  ToastAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/actions/login';
import {signup} from '../redux/actions/register';
import Back from '../assets/icons/btnback.svg';
import Input from '../components/input';
import {RectButton, TouchableOpacity} from 'react-native-gesture-handler';
import style from '../helpers';
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import TouchIcon from '../assets/icons/touch.svg';
import Eye from '../assets/icons/view 1.svg';
import {URI} from '../utils';
import {WebView} from 'react-native-webview';

import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [eye, setEye] = useState(true);
  const {device_token, error} = useSelector((state) => state.auth);
  const register = useSelector((state) => state.register);
  const dispatch = useDispatch();

  const onSubmit = () => {
    if (email && password && device_token) {
      dispatch(login({email, password, device_token}));
    }
  };

  logoutWithFacebook = () => {
    LoginManager.logOut();
    // this.setState({userInfo: {}});
    setUserInfo({});
  };

  getInfoFromToken = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        // string: 'id,name,first_name,last_name',
        string: 'id,name,email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      async (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          // this.setState({userInfo: user});
          setUserInfo({
            name: user.name,
            email: `${user.id}@facebook.com`,
            password: `${user.id}`,
          });
          // console.log(user);

          await dispatch(
            signup({
              name: user.name,
              email: `${user.id}@facebook.com`,
              password: `${user.id}`,
            }),
          );
          // console.log('aaaaaaaaaaaaaa lanjut');
          dispatch(
            login({
              email: user.id + '@facebook.com',
              password: user.id,
              device_token,
            }),
          );

          // console.log(register.error)
          // if(register.message.response.status == 403){

          //   console.log('masuk login')
          // }else{
          //   console.log('gamasuk login')
          // }
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      (login) => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });
        }
      },
      (error) => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userGoogle = await GoogleSignin.signIn();
      // console.log(userGoogle);
      setUserInfo(userGoogle);
      await dispatch(
        signup({
          name: userGoogle.user.name,
          email: userGoogle.user.email,
          password: userGoogle.user.id,
        }),
      );
      // console.log('aaaaaaaaaaaaaa lanjut');
      dispatch(
        login({
          email: userGoogle.user.email,
          password: userGoogle.user.id,
          device_token,
        }),
      );
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userGoogle = await GoogleSignin.signInSilently();
      setUserInfo(userGoogle);
    
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  const logoutWithGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo({}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
    GoogleSignin.configure({
      webClientId: '',
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    isSignedIn();
  }, [dispatch, error]);

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <ScrollView style={{height: '100%', backgroundColor: style.white}}>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Back width={29} height={29} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 36,
                  color: '#000',
                  fontWeight: 'bold',
                  marginTop: 70,
                }}>
                Login
              </Text>
              <View style={{marginTop: 40}}>
                <Input
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Username"
                  returnKeyType="next"
                  autoCapitalize="none"
                />
                <View style={{position: 'relative'}}>
                  <Input
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Password"
                    returnKeyType="next"
                    autoCapitalize="none"
                    secureTextEntry={eye}
                  />
                  <View style={{position: 'absolute', right: 0, top: 10}}>
                    <TouchableOpacity onPress={() => setEye(!eye)}>
                      <Eye width={24} height={24} />
                    </TouchableOpacity>
                  </View>
                </View>
                <RectButton
                  onPress={onSubmit}
                  style={
                    email < 1 || password < 1
                      ? styles.buttonDisabled
                      : styles.button
                  }
                  enabled={email < 1 || password < 1 ? false : true}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color:
                        email < 1 || password < 1 ? style.dark : style.white,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Sign In
                  </Text>
                </RectButton>
                <Text
                  style={{textAlign: 'center', fontSize: 16, marginBottom: 15}}>
                  Did you forgot your password?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Forgot')}
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: style.primary,
                    marginBottom: 40,
                    width: 150,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: style.primary,
                      fontSize: 16,
                    }}>
                    Tap here for reset
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: '80%',
                    borderBottomWidth: 0.5,
                    borderBottomColor: style.darkMed,
                    alignSelf: 'center',
                    marginBottom: 15,
                  }}></View>
                <Text style={{textAlign: 'center'}}>or sign in with</Text>
                <View style={styles.containerLogo}>
                  <TouchableOpacity style={styles.logo} onPress={loginWithGoogle}>
                    {/* <WebView source={{uri: 'http://192.168.1.4:8000/google'}} /> */}
                    <GoogleIcon width={24} height={24} />
                  </TouchableOpacity>
                 
                  <TouchableOpacity
                    onPress={() =>
                      // Linking.openURL('http://192.168.1.4/facebook')
                      loginWithFacebook()
                    }
                    style={styles.logo}>
                    <FacebookIcon width={24} height={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Fingerprint')}
                    style={styles.logo}>
                    <TouchIcon width={24} height={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
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
  containerLogo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  logo: {
    paddingHorizontal: 35,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
    borderColor: style.primary,
    borderWidth: 1,
  },
});
