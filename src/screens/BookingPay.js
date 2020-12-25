import React from 'react'
import { View, Text } from 'react-native'
import WebView from 'react-native-webview'
import { useSelector, useDispatch } from 'react-redux'
import { getBookingById} from '../redux/actions/booking';
export default function BookingPay({navigation, route}) {
    const { pay} = useSelector((state) => state.booking);
    const [webview, setWebview] = React.useState(null)
    const dispatch = useDispatch();
    const { id, token } = route.params
    handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        if (!url) return;
        if (url.includes('google.com')) {
            webview.stopLoading();
            // navigation.navigate('MyBooking');
            
            dispatch(getBookingById(id, token));
            navigation.navigate('BookingDetail');
        }
    }
    return (
        <>
        <WebView
        ref={(ref) => setWebview(ref)}
        source={{ uri: pay.redirect_url }}
        style={{ marginTop: 20 }}
        onNavigationStateChange={this.handleWebViewNavigationStateChange}
      />
        </>
    )
}
