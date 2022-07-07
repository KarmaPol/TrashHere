import React, {useEffect, useLayoutEffect, useState} from 'react';
import { StatusBar, Dimensions, Alert } from 'react-native';
import { theme } from './theme';
import MapView from 'react-native-maps';
import { Callout, Marker } from 'react-native-maps';
import styled, {ThemeProvider} from 'styled-components/native';
import * as Location from "expo-location";
import AppLoading from 'expo-app-loading';
import 'react-native-gesture-handler';
import { images } from './component/Image';
import { getDatabase, ref, onValue, set, update, get, orderByKey } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';
import { CusCallout } from './component/CustomCallout';
import { getDistance} from 'geolib';
import { TrashButton } from './component/TrashButton';
import { UiComponents } from './component/UiComponents';
// import { storeLocalData, getLocalData } from './component/LocalData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


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
const db = getDatabase(); //firebase

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

    const [userScore, setScore] = useState(100); //유저 score 초기값
    const [userID, setID] = useState('default');

    const [isReady, setLoading] = useState(false); //어플이 준비되었는지
    const [location, setLocation] = useState(null); //add 화면에서 클릭한 좌표 
    const [locas, setLocations] = useState({}) //화면에 출력해줄 모든 마커들의 정보 
    const [currentLoc, setCurrentLoc] = useState(null); //현재 사용자 위치
    const [currentMarker, setCurrentMarker] = useState(null); //선택한 마커의 정보
    const [addMode, setAddMode] = useState(false); //add 모드인지?
    const [throwMode, setThrowMode] = useState(true); // 로대시로 쿨타임 조정
    const [throwPossible, setThrowPossible] = useState(false); //사용자가 현재 버리기 행동을 할수 있나? = 현재 활성화된 쓰레기통이 있나?
    const [activatedCan, setActivatedCan] = useState(null); //활성화된 쓰레기통의 정보

    useEffect(() =>{
      _getUserID();

    }, []);

    const preload = async() => {
        try {
            await Location.requestForegroundPermissionsAsync();
            let {coords} = await Location.getCurrentPositionAsync({});
            console.log(coords.latitude, coords.longitude);
            setCurrentLoc(coords);
            
        }
        catch (e) {
            console.log("오류발생,,");
            Alert.alert("위치정보를 가져올수 없습니다..");
        }
    };

    const _getUserID = async () => {
      let _userID, _isFirst;
      _isFirst = await AsyncStorage.getItem('isFirst'); // 실행한적 있는지 조회
      console.log(_isFirst);
      if(_isFirst != "false"){ //실행한적 없을 경우 아이디 발급 후 저장
        await AsyncStorage.setItem('isFirst', "false"); //처음 실행한뒤 false로 저장
        console.log('아이디 발급중');
        _userID = uuid.v4();
        setID(() => _userID);
        await AsyncStorage.setItem('userID', _userID);
        storeUserData(_userID);
      }
      else {
        _userID = await AsyncStorage.getItem('userID');
        if(_userID !== null){
            setID(_userID);
            console.log(userID);
            // AsyncStorage.clear(); //테스트용
        }
      }
    }

    useEffect(() => {
      console.log("유저 ID : " + userID);
      loadUserData();
    }, [userID]); //userID 동기 처리

// user Data firebase에 저장
    const storeUserData = (_userID) => {
      const reference = ref(db, 'users/' + _userID);
      set(reference, {
        score: userScore,
      });
    }

    const loadUserData = () => {
      const readRef = ref(db, 'users/' + userID);
      let temp;
      console.log("탐색중" + userID);
       onValue(readRef, (snapshot) => {
        if(snapshot.val() != null){
          temp = snapshot.val().score;
          setScore(temp);
        }
      });

      console.log("유저 스코어 로딩중.." + userScore);
    }

    useEffect(() => {
      console.log("유저 스코어를 불러옵니다.. : " + userScore);
    }, [userScore]); //userScore 동기처리

// 맵 데이터 저장 & 로드

    const storeData = () => {
      if(location){
      const ID = Date.now().toString();
      console.log(ID);
      
      const reference = ref(db, 'locations/' + ID);
      set(reference, {
        id: ID, latitude:location.marker.latitude, longitude:location.marker.longitude, weight : 10, creator : userID,
      });
      }
      setAddMode(false);
      setThrowMode(true); //for test
      loadData();
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
        });
        });
        setLocations(temp);
      });
    };

    const delData = (id) => {
      const reference = ref(db, 'locations/' + id);
      set(reference, null);
      throwReset;
    };

// weight 업데이트 함수
      const updateData = (id, v) => { 
        
        const reference = ref(db, 'locations/' + id);
        let tempWeight = null;
        
        onValue(reference, (snapshot) => {
          if(snapshot.val() != null){
          tempWeight = snapshot.val().weight;
          }
        });
        if(tempWeight != null){

          tempWeight = Number(tempWeight) + v;
          if(tempWeight < 0){
            delData(id);
          }
          else {
            update(ref(db, '/locations/' + id), {
              weight : tempWeight,
            })
          }
        }
      }

  // 쓰레기 버리기 함수
      const throwTrash = () => {
        console.log("trash Throw" + activatedCan.id );
        updateData(activatedCan.id, 1);
        throwReset();
      }
      
      const throwReset = () => {
        setActivatedCan(null);
        setThrowPossible(false);
        console.log(activatedCan);
      }

      const throwSetting = (trashCan) => {
        setActivatedCan({id : trashCan.id});
        setThrowPossible(true);
      }

  // 쓰레기통 dislike 함수
      const dislike = () => {
        if(currentMarker){
          updateData(currentMarker, -2);
        }
      }

  // 쓰레기통들과의 거리측정 함수
      const measureDistance = (a) => {
        getDistance({latitude : currentLoc.latitude, longitude : currentLoc.longitude},
          {latitude : a.latitude, longitude : a.longitude}) < 100 ?
          (activatedCan == null ? throwSetting(a) : null) : (activatedCan == a.id ? throwReset() : null);
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
              height: Dimensions.get('window').height * 1.2,
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
          <Callout tooltip onPress = {dislike}>
            <CusCallout />
          </Callout>
          {
            measureDistance(a)
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
      <UiComponents windowWidth={windowWidth} addMode = {addMode} storeData = {storeData} setAddMode = {setAddMode} userScore = {userScore}/>
    </ThemeProvider>

  ) : (

    <AppLoading
      startAsync={() => preload()}
      onFinish = {() => setLoading(true)}
      onError = {console.warn}
      />

  );
};
