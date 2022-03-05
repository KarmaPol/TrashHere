import React, {useEffect, useState} from 'react';
import { StatusBar } from 'react-native';
import { theme } from './theme';
import CustomMap from './component/Mapview';
import MapView from 'react-native-maps';
import styled, {ThemeProvider} from 'styled-components/native';
import * as Location from "expo-location";
import AppLoading from 'expo-app-loading';
import { Dimensions } from 'react-native';
import { Callout, Marker, ProviderPropType } from 'react-native-maps';
import IconButton from './component/Imagebutton';
import { images } from './component/Image';


const Container = styled.View`
    flex: 13;
    background-color: ${({theme})=> theme.background};
    align-items: center;
    justify-content: flex-start;
`;
const UIBOX = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    text-align:center;
`;

const Text = styled.Text`
  font-size:10px;
  text-align: center;
  color:${({theme}) => theme.text};
  font-weight : bold;
`;



export default function App() {

    const [isReady, setLoading] = useState(false);

    const [location, setLocation] = useState({marker: null});
    const [locas, setLocations] = useState({
      1 : {id: '1', latitude : 37.4978, longitude: 127.07},
      2 : {id: '2', latitude : 37.4968, longitude: 127.07},
      3 : {id: '3', latitude : 37.4958, longitude: 127.07},})
    const [currentLoc, setCurrentLoc] = useState(null);

    const getLoaction = async() => {
        try {
            await Location.requestForegroundPermissionsAsync();
            let {coords} = await Location.getCurrentPositionAsync({});
            console.log(coords.latitude, coords.longitude);
            setLocation(coords);
        }
        catch (e) {
            console.log("오류발생,,");
        }
    };

  return isReady?(
    <ThemeProvider theme = {theme}>
    <Container>
    <StatusBar
    barStyle='dark-content'
    backgroundColor={theme.background}/>
    <MapView style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,}} 
            initialRegion={{ 
      latitude: location.latitude, 
      longitude: location.longitude, 
      latitudeDelta: 0.015, longitudeDelta: 0.005 }}
      showsUserLocation = {true}
      showsMyLocationButton = {true}
      onPress = {(e) => setCurrentLoc({ marker: e.nativeEvent.coordinate })}>
    {currentLoc&&
        <Marker 
          coordinate = {currentLoc.marker}
          image = {images.cusMark}
        />
    }
    {
      Object.values(locas).map(
        a => <Marker 
          key = {a.id}
          coordinate={{
          latitude : a.latitude,
          longitude : a.longitude,
        }}
        image = {images.cusMark}
        />
      )
    }
    </MapView>
    </Container>
    <UIBOX>
       <IconButton type = {images.plus} />
        <Text>Add</Text>
    </UIBOX>
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={getLoaction}
      onFinish = {() => setLoading(true)}
      onError = {console.warn}
      />
  );
};
