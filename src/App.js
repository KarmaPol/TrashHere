import React, {useEffect, useState} from 'react';
import { StatusBar } from 'react-native';
import { theme } from './theme';
import MapView from 'react-native-maps';
import styled, {ThemeProvider} from 'styled-components/native';
import * as Location from "expo-location";
import AppLoading from 'expo-app-loading';
import { Dimensions } from 'react-native';
import { Callout, Marker, ProviderPropType } from 'react-native-maps';
import 'react-native-gesture-handler';
import { images } from './component/Image';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';
import { CusCallout } from './component/CustomCallout';
import { getDistance} from 'geolib';
import { TrashButton } from './component/TrashButton';
import { UiComponents } from './component/UiComponents';

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
    z-index : 10;
`;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {

    const [isReady, setLoading] = useState(false);
    const [location, setLocation] = useState(null); //add 화면에서 클릭한 좌표 
    const [locas, setLocations] = useState({}) //화면에 출력해줄 모든 마커들의 정보 
    const [currentLoc, setCurrentLoc] = useState(null); //현재 사용자 위치
    const [currentMarker, setCurrentMarker] = useState(null); //선택한 마커의 정보
    const [addMode, setAddMode] = useState(false); //add 모드인지?
    const [throwMode, setThrowMode] = useState(true);
    const [throwPossible, setThrowPossible] = useState(false); //사용자가 현재 버리기 행동을 할수 있나? = 현재 활성화된 쓰레기통이 있나?
    const [activatedCan, setActivatedCan] = useState(null); //활성화된 쓰레기통의 정보
    const [playerScore, setScore] = useState(0);

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
        id: ID, latitude:location.marker.latitude, longitude:location.marker.longitude, weight : 10,
      });
      }
      setAddMode(false);
      setThrowMode(true); //for test
      loadData;
      setLocation(null);
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
// weight만 업데이트 함수
    const updateData = (id, v) => { 
      
      const reference = ref(db, 'locations/' + id);
      let tempWeight = 0;
      
      onValue(reference, (snapshot) => {
        tempWeight = snapshot.val().weight;
      });

      tempWeight = Number(tempWeight) + v;
      if(tempWeight < 0){
        delData
      }
      else {
        update(ref(db, '/locations/' + id), {
          weight : tempWeight,
        })
      }
    }

// 쓰레기 버리기 함수
    const throwTrash = () => {
      console.log("trash Throw" + activatedCan.id );
      updateData(activatedCan.id, 1);
      loadData;
      throwSetting
      setThrowMode(false)
    }

    const throwSetting = (trashCan) => {
      setActivatedCan({id : trashCan.id});
      setThrowPossible(true);
    }

    useEffect(loadData, []);

  return isReady?(
    <ThemeProvider theme = {theme}>
      <Container>
      <StatusBar
      barStyle='dark-content'
      backgroundColor={theme.background}/>

{/* 버리기 버튼 출력 */}
      {throwMode&&!addMode&&throwPossible&&<TrashButton type ={images.trashClick} windowWidth = {windowWidth} windowHeight ={windowHeight} throwTrash = {throwTrash}/>}

{/* 맵 출력 */}
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

{/* 사용 모드일때만 거리 계산 & 쓰레기 버리기 가능 */}
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

{/* 추가모드 */}
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
{/* 추가 모드에서 찍는 위치 마커로 표시 */}
      {location&& addMode&&
          <Marker 
            coordinate = {location.marker}
            image = {images.cusMark}
          />
      }
      </MapView>
      </Container>

{/* 하단부 UI단 */}
      <UiComponents windowWidth={windowWidth} addMode = {addMode} storeData = {storeData} setAddMode = {setAddMode}/>
    </ThemeProvider>

  ) : (

    <AppLoading
      startAsync={getLoaction}
      onFinish = {() => setLoading(true)}
      onError = {console.warn}
      />

  );
};
