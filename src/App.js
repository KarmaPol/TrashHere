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
import { CusCallout } from './component/CustomCallout';

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
    flex: 10; 
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
    border-top-left-radius : 30px;
    border-top-right-radius : 30px;
`;

const Text = styled.Text`
  font-size:10px;
  text-align: center;
  color:${({theme}) => theme.text};
  font-weight : bold;
`;

export default function App() {

    const [isReady, setLoading] = useState(false);
    const [parentHeight, setParentHeight] = useState(0);
    const [location, setLocation] = useState(null);
    const [locas, setLocations] = useState({})
    const [currentLoc, setCurrentLoc] = useState(null);
    const [currentMarker, setCurrentMarker] = useState(null);
    const [addMode, setAddMode] = useState(false);

    const onLayout = event => {
      const {height} = event.nativeEvent.layout;
      setParentHeight(height);
    };

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

    const storeData = () => {
      if(location){
      const ID = Date.now().toString();
      console.log(ID);
      
      const reference = ref(db, 'locations/' + ID);
      set(reference, {
        id: ID, latitude:location.marker.latitude, longitude:location.marker.longitude, weight : 0,
      });
      }
      setAddMode(false);
      setLocation(null);
    };

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
    };

    const delData = () => {
      if(currentMarker){
      const reference = ref(db, 'locations/' + currentMarker);
      set(reference, null);
      }
    };

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
    {location&& addMode&&
        <Marker 
          coordinate = {location.marker}
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
        onPress = {() => {setCurrentMarker(a.id)}}>
        <Callout tooltip onPress = {delData}>
          <CusCallout />
        </Callout>
        </Marker>
      )
    }
    {currentMarker&&console.log("select : " + currentMarker)}
    </MapView>
    </Container>
    <UIBOX onLayout = {onLayout}>
       {(!addMode&&
       <IconButton type = {images.plus} onPressOut={() => setAddMode(true)} parentHeight = {parentHeight} />
       )
       ||
       (addMode&&
       <IconButton type = {images.done} onPressOut={storeData} parentHeight = {parentHeight} />)
       }
        {(!addMode&&<Text>Add</Text>) || addMode&&<Text>Done</Text>}
        {console.log("높이 : " + parentHeight)}
        {console.log("addmode : " + addMode)}
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
