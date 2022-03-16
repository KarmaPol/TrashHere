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
import 'react-native-gesture-handler';
import { images } from './component/Image';
import { getDatabase, ref, onValue, set, get, child} from 'firebase/database';
import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

const firebaseConfig = {
  apiKey: "AIzaSyAAziApy6slnzkT5rZHXJUmB8DTN9cRlSw",
  authDomain: "tcfmap-c127c.firebaseapp.com",
  databaseURL: "https://tcfmap-c127c-default-rtdb.firebaseio.com",
  projectId: "tcfmap-c127c",
  storageBucket: "tcfmap-c127c.appspot.com",
  messagingSenderId: "1085900420280",
  appId: "1:1085900420280:web:69253dce4c9ea7c58ab04d",
  measurementId: "G-SSYM3EYH26"
};

initializeApp(firebaseConfig);
const db = getDatabase();

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

    const [location, setLocation] = useState(null);
    const [locas, setLocations] = useState({})
    const [currentLoc, setCurrentLoc] = useState(null);

    const getLoaction = async() => {
        try {
            await Location.requestForegroundPermissionsAsync();
            let {coords} = await Location.getCurrentPositionAsync({});
            console.log(coords.latitude, coords.longitude);
            setCurrentLoc(coords);
        }
        catch (e) {
            console.log("오류발생,,");
        }
    };

    // const _addLoc = () =>{
    //   const ID = Date.now().toString();
    //   console.log(ID);
    //   const newLoc = {
    //     [ID] : {id: ID, latitude:location.marker.latitude, longitude:location.marker.longitude},
    //   };
    //   setLocations({...locas, ...newLoc});
    //   storeData();
    // };

    const storeData = () => {

      const ID = Date.now().toString();
      console.log(ID);

      const reference = ref(db, 'locations/' + ID);
      set(reference, {
        id: ID, latitude:location.marker.latitude, longitude:location.marker.longitude, weight : 0,
      });
    }

    const loadData = () => {
      const readRef = ref(db, 'locations');
      const temp = [];
      onValue(readRef, (snapshot) => {
        
        snapshot.forEach((child) => {
          temp.push({
          id : child.key,
          latitude : child.val().latitude,
          longitude : child.val().longitude,
          weight : child.val().weight,
        });
        });
        console.log(temp);
        setLocations(temp);
      });
    }

    useEffect(loadData, []);

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
      latitude: currentLoc.latitude, 
      longitude: currentLoc.longitude, 
      latitudeDelta: 0.015, longitudeDelta: 0.005 }}
      showsUserLocation = {true}
      showsMyLocationButton = {true}
      onPress = {(e) => setLocation({ marker: e.nativeEvent.coordinate })}>
    {location&& 
        <Marker 
          coordinate = {location.marker}
          image = {images.cusMark}
        />
    }
    {/* {location&& console.log(location.id)} */}
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
       <IconButton type = {images.plus} onPressOut={storeData}/>
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
