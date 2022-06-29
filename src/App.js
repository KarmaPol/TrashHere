import React, {useEffect, useState} from 'react';
import { StatusBar } from 'react-native';
import { theme } from './theme';
import MapView, { Overlay } from 'react-native-maps';
import styled, {ThemeProvider} from 'styled-components/native';
import * as Location from "expo-location";
import AppLoading from 'expo-app-loading';
import { Dimensions } from 'react-native';
import { Callout, Marker, ProviderPropType } from 'react-native-maps';
import IconButton from './component/Imagebutton';
import 'react-native-gesture-handler';
import { images } from './component/Image';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';
import { CusCallout } from './component/CustomCallout';
import {TextImage} from './component/Imagebutton';
import {ScoreBoard} from './component/UiComponents';
import { getDistance} from 'geolib';
import { TrashButton } from './component/TrashButton';

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
    justify-content: center;
    flex-direction: column;
`;
const UIBOX = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-top-left-radius : 30px;
    border-top-right-radius : 30px;
`;

const IconBoX = styled.View`
  flex-direction : column;
  align-items: center;
  justify-content : center;
  position : absolute;
`;

const Text = styled.Text`
  font-size:15px;
  text-align: center;
  color:${({theme}) => theme.text};
`;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {

    const [isReady, setLoading] = useState(false);
    const [parentHeight, setParentHeight] = useState(0); //하단 uibox 높이
    const [location, setLocation] = useState(null); //add 화면에서 클릭한 좌표 
    const [locas, setLocations] = useState({}) //화면에 출력해줄 모든 마커들의 정보 
    const [currentLoc, setCurrentLoc] = useState(null); //현재 사용자 위치
    const [currentMarker, setCurrentMarker] = useState(null); //선택한 마커의 정보
    const [addMode, setAddMode] = useState(false); //add 모드인지?
    const [throwMode, setThrowMode] = useState(true);
    const [throwPossible, setThrowPossible] = useState(false); //사용자가 현재 버리기 행동을 할수 있나? = 현재 활성화된 쓰레기통이 있나?
    const [activatedCan, setActivatedCan] = useState(null); //활성화된 쓰레기통의 정보
    const [playerScore, setScore] = useState(0);
 
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
            getFonts;
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
        id: ID, latitude:location.marker.latitude, longitude:location.marker.longitude, weight : 10,
      });
      }
      setAddMode(false);
      setThrowMode(true); //for test
      loadData;
    };

    const loadData = () => {

      const readRef = ref(db, 'locations');
      const temp = [];
      
      onValue(readRef, (snapshot) => {
        temp.length = 0;
        snapshot.forEach((child) => {
          temp.push({
          id : child.val().id,
          latitude : child.val().latitude,
          longitude : child.val().longitude,
          weight : child.val().weight,
        });
        });
        setLocations(temp);
      });
    };

    const delData = () => {
      if(currentMarker){
      const reference = ref(db, 'locations/' + currentMarker);
      set(reference, null);

      loadData;
      setCurrentMarker(null);
      }
    };

    const updateData = (id, k, v) => {
      if(v < 0){
        delData
      }
      update(ref(db, '/locations/' + id), {
        weight : v,
      })
    }

    const throwTrash = () => {
      console.log("trash Throw" + activatedCan.id + ":" + activatedCan.weight);
      updateData(activatedCan.id, "weight", getRandom(1, 100));
      loadData;
      throwReset;
      console.log("초기화" + activatedCan.id + " : " + activatedCan.weight); //변경된 정보 반영이 안됨
      setThrowMode(false)
    }

    const throwSetting = (trashCan) => {
      setActivatedCan({id : trashCan.id, weight : trashCan.weight});
      console.log(trashCan.id + " : " + trashCan.weight);
      setThrowPossible(true);
    }

    const throwReset = () => {
      setActivatedCan({});
      setThrowPossible(false);
    }

    const getRandom = (min, max) => Math.random() * (max - min) + min;

    useEffect(loadData, []);

  return isReady?(
    <ThemeProvider theme = {theme}>
    <Container>
    <StatusBar
    barStyle='dark-content'
    backgroundColor={theme.background}/>
    {throwMode&&!addMode&&throwPossible&&<TrashButton type ={images.trashClick} onPressOut = {throwTrash} windowWidth = {windowWidth} windowHeight ={windowHeight}/>}
    {/* {throwPossible&&<IconButton type ={images.trashClick} onPressOut = {() => console.log("11111")} parentHeight = {parentHeight}/>} */}
    <MapView style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            zIndex : -1,}} 
            initialRegion={{ 
              latitude: currentLoc.latitude, 
              longitude: currentLoc.longitude, 
              latitudeDelta: 0.015, longitudeDelta: 0.005 }
            }
      showsUserLocation = {true}
      showsMyLocationButton = {true}
      onPress = {(e) => {if(addMode){setLocation({ marker: e.nativeEvent.coordinate })}}}>
    {location&& addMode&&
        <Marker 
          coordinate = {location.marker}
          image = {images.cusMark}
        />
    }
    { !addMode&&
      Object.values(locas).map(
        a => 
        <Marker 
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
        {
        getDistance({latitude : currentLoc.latitude, longitude : currentLoc.longitude},
          {latitude : a.latitude, longitude : a.longitude}) < 100 ?
          (activatedCan == null ? throwSetting(a) : null) : (activatedCan == a.id ? throwReset() : null)
        }
        </Marker>)
    }
    { addMode&&
      Object.values(locas).map(
        a => 
        <Marker 
          key = {a.id}
          coordinate={{
          latitude : a.latitude,
          longitude : a.longitude,
        }}
        image = {images.grayMark}
        onPress = {() => {setCurrentMarker(a.id)}}>
        </Marker>)
    }
    </MapView>
    { console.log("locas 출력 : ")}
    { console.log(locas)}
    </Container>
    <UIBOX onLayout = {onLayout}>
      <ScoreBoard windowWidth = {windowWidth - 120}>
        {/* <TextImage source = {images.leafs} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.3*parentHeight} margin = {0.01*parentHeight}/> */}
        <Text>{playerScore}</Text>
      </ScoreBoard>
      <IconBoX >
       {(!addMode&&
       <IconButton type = {images.plus} onPressOut={() => setAddMode(true)} parentHeight = {parentHeight} />
       )
       ||
       (addMode&&
       <IconButton type = {images.done} onPressOut={storeData} parentHeight = {parentHeight} />)
       }
        {(!addMode&&<TextImage source = {images.addText} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.15*parentHeight} margin = {0.01*parentHeight}/>) || 
        (addMode&&<TextImage source = {images.doneText} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.15*parentHeight} margin = {0.01*parentHeight}/>)}
      </IconBoX>
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
