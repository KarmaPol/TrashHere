import React, { useRef, useEffect, useState} from 'react';
import { Animated, StatusBar, Dimensions, Alert, ToastAndroid } from 'react-native';
import { theme } from './theme';
import MapView from 'react-native-maps';
import { Callout, Marker } from 'react-native-maps';
import styled, {ThemeProvider} from 'styled-components/native';
import * as Location from "expo-location";
import AppLoading from 'expo-app-loading';
import 'react-native-gesture-handler';
import { images } from './component/Image';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';
import { CusCallout } from './component/CustomCallout';
import { getDistance} from 'geolib';
import { TrashButton } from './component/TrashButton';
import { UiComponents } from './component/UiComponents';
import { TrashTimer, useInterval } from './component/TrashTimer';
import { DailyQuestCells } from './component/Achievement';
import * as Font from 'expo-font';
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

    const [helpMode, setHelpMode] = useState(false); //도움말
    const [achiveMode, setAchiveMode] = useState(false); //도전과제

    const [todaysFirstAcess, setFirstAcess] = useState(false); //오늘의 첫 접속인지 
    const [achiveList, setAchiveList] = useState({quest1:{achived : null}, quest2:{achived : null}, quest3:{achived : null}})

    const [userDailyAccessTime, setDailyAccessTime] = useState(0); //유저 하루 접속 횟수
    const [userDailyThrowTime, setDailyThrowTime] = useState(0); //유저 하루 쓰레기 버린 횟수
    const [userDailyAddTime, setDailyAddTime] = useState(0); //유저 하루 쓰레기통 추가 횟수

    const [userTimer, setTimer] = useState(0);
    
    const [userScore, setScore] = useState(30); //유저 score 초기값
    const [userID, setID] = useState('default');

    const [isReady, setLoading] = useState(false); //어플이 준비되었는지
    const [location, setLocation] = useState(null); //add 화면에서 클릭한 좌표 
    const [locas, setLocations] = useState({}) //화면에 출력해줄 모든 마커들의 정보 
    const [currentLoc, setCurrentLoc] = useState(null); //현재 사용자 위치
    const [currentMarker, setCurrentMarker] = useState(null); //선택한 마커의 정보

    const [addPossible, setAddPossible] = useState(true); // add 가능한지?
    const [addMode, setAddMode] = useState(false); //add 모드인지?
    const [throwMode, setThrowMode] = useState(true); // 로대시로 쿨타임 조정
    const [throwPossible, setThrowPossible] = useState(false); //사용자가 현재 버리기 행동을 할수 있나? = 현재 활성화된 쓰레기통이 있나?
    const [activatedCan, setActivatedCan] = useState(null); //활성화된 쓰레기통의 정보

    useEffect(() =>{
      _getUserID();
      getFont();
    }, []);

    const preload = async() => {
        try {
            await Location.requestForegroundPermissionsAsync();
            let {coords} = await Location.getCurrentPositionAsync({});
            setCurrentLoc(coords);
        }
        catch (e) {
            console.log("오류발생,,");
            Alert.alert("위치정보를 가져올수 없습니다..");
        }
    };

    const getFont = async () => {
      await Font.loadAsync({
        'nanumSq' : require("./assets/fonts/NanumSquareRoundR.ttf"),
      });
    };

    const showToastWithGravity = (msg) => {
      ToastAndroid.showWithGravity(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }; //toast 메시지

    useInterval(() => {
      preload();
    }, 3000)

    const _getUserID = async () => {
      let _userID, _isFirst;
      _isFirst = await AsyncStorage.getItem('isFirst'); // 실행한적 있는지 조회
      if(_isFirst != "false"){ //실행한적 없을 경우 아이디 발급 후 저장
        await AsyncStorage.setItem('isFirst', "false"); //처음 실행한뒤 false로 저장
        console.log('아이디 발급중');
        _userID = uuid.v4();
        setID(_userID);
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

    useEffect(async () => {
      if(userID != 'default'){
      console.log("유저 ID : " + userID);
      loadUserData();
      TimerSetting();
      verifyDailyFirstAccess();
      loadUserAchiveState();
      await updateUserDailyStatus("dailyAccess", true);
      await updateUserDailyStatus("dailyThrow", false);
      }
    }, [userID]); //userID 동기 처리

// timerTime 받아와서 저장하기
    const storeUserTimerData = async (_userID) => {
      let today = new Date();
      console.log("유저 현재 시각 저장");
      console.log("현재 시각 : " + today.getTime());
      const reference = ref(db, 'users/' + _userID);
      update((reference), {
        timerTime : today.getTime(),
      });
    }

// user Data firebase에 저장
    const storeUserData = async (_userID) => {
      let today = new Date();
      const reference = ref(db, 'users/' + _userID);
      set(reference, {
        score: userScore,
        timerTime : 0,
        loginTime : today.getTime(),
        lastAcessDate : today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString(), 
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
    }
// 유저 오늘 첫 접속인지 확인
    const verifyDailyFirstAccess = () => {
      const reference = ref(db, 'users/' + userID);
      let today = new Date();
      let promise = new Promise(function(resolve, reject) {
        onValue(reference, (snapshot) => {
          if(snapshot.val() != null){
            tempDate = snapshot.val().lastAcessDate;
            console.log("onValue 함수 내에서 접속일 조회 : " + tempDate);
            resolve(tempDate);
          }
      }, {
        onlyOnce : true
      });});
      
      let tempDate;

      promise.then(
        result => {
          console.log("가장 최근 접속일 : " + result);
          tempDate = result.toString();
          let todayDate = today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString();
          console.log("오늘 날짜 : " + todayDate);
          if(todayDate != tempDate){
            console.log("오늘의 첫 접속입니다");
            showToastWithGravity("환영합니다!");

            update(ref(db, 'users/' + userID), {
              lastAcessDate : todayDate,
            })
            setFirstAcess(true);
          }
        }
       );
    }

    useEffect(() => {
      console.log("첫 접속? " + todaysFirstAcess);
      if(todaysFirstAcess == true){
        console.log("퀘스트 초기화");
        resetUserAchiveState();
        resetUserDailyStatus();
      }
    }, [todaysFirstAcess]); //첫 접속시 퀘스트 상태 초기화

// user 타이머 설정 firebase 에서 참조
    const TimerSetting = () => {

        console.log("TimerSetting 함수 시작");

        const readRef = ref(db, 'users/' + userID);
        console.log("타이머 세팅 불러오는 중.." + userID);
        let temp;
        let now = new Date();
        let correctionValue;
        onValue(readRef, (snapshot) => {
          if(snapshot.val() != null){
            console.log("test5");

            temp = snapshot.val().timerTime;
            console.log("타이머 타임 : " + temp);
            console.log("현재 타임 : " + now.getTime());
            correctionValue = Math.abs(Math.floor((temp - now.getTime())/1000));
            console.log("correctionV : " + correctionValue);
            console.log("마지막 타이머 호출로 부터 " + correctionValue + "초 지남");
            if(correctionValue < 300){
              setTimer(300-correctionValue);
              console.log("if 내부에서 timer값 : " + userTimer);
              setThrowMode(false);
              setTimeout(() => {
                setThrowMode(true);
              },(301-correctionValue)*1000); //쿨타임 
            }
          }
        }, {
          onlyOnce: true
        });
        console.log("test6");

        console.log("유저 타이머 로딩중.." + userTimer);
    }
    useEffect(() => {
      console.log(userTimer);
    }, [userTimer]);

    useEffect(() => {
      console.log(throwMode);
    }, [throwMode]);

// user score 업데이트
    const updateUserData = (_userID, v) => { 
      console.log("updateUserData 함수 시작");
      
      console.log("해당 유저 점수를 업데이트합니다" + _userID);
      const reference = ref(db, 'users/' + _userID);
      
      
      let promise = new Promise(function(resolve, reject) {
        onValue(reference, (snapshot) => {
          if(snapshot.val() != null){
            tempScore = snapshot.val().score;
            console.log("onValue 함수 내에서 스코어 조회 : " + tempScore);
            resolve(tempScore);
          }
      }, {
        onlyOnce : true
      });});
      
      let tempScore;

      promise.then(
        result => {
          console.log("updateUserData 함수에서" + _userID + "의 score 조회 : " + result);
          tempScore = result;
          if(tempScore != null){
            console.log(tempScore);
            tempScore = Number(tempScore) + v;
            if(tempScore < 0){
              delData(id);
            }
            else {
              update(ref(db, 'users/' + _userID), {
                score : tempScore,
              })
            }
          }
        }
       );
      
    }
// 유저 퀘스트 달성도 저장
    const updateUserAchiveState = (quest_input) => {
      update(ref(db, '/users/' + userID + '/achiveState/' + quest_input), {
        achived : true,
      })
    }

    const resetUserAchiveState = () => {
      update(ref(db, '/users/' + userID + '/achiveState/quest1'), {
        achived : false,
      })
      update(ref(db, '/users/' + userID + '/achiveState/quest2'), {
        achived : false,
      })
      update(ref(db, '/users/' + userID + '/achiveState/quest3'), {
        achived : false,
      })
    }

    const loadUserAchiveState = () => {
      onValue(ref(db, '/users/' + userID + '/achiveState'), (snapshot) => {
        if(snapshot.val() != null){
          setAchiveList({
            quest1 : { achived : snapshot.val().quest1.achived},
            quest2 : { achived : snapshot.val().quest2.achived},
            quest3 : { achived : snapshot.val().quest3.achived},
          })
        }
      }, {
        onlyOnce : true
      });
    };

    useEffect(() => {
      console.log("유저 성취 상황 : " + achiveList);
    }, [achiveList]);

// 유저 일일 로그 저장 & 로드
    const updateUserDailyStatus = async (status_name, v) => {
      let promise = new Promise(function(resolve, reject) {
        onValue(ref(db, '/users/' + userID + '/dailyStatus/' + status_name), (snapshot) => {
          if(snapshot.val() != null){
            tempTime = snapshot.val();
            console.log("onV 내부 :" + tempTime);
            resolve(tempTime);
          }
          else{
            resolve(0);
          }
      }, {
        onlyOnce : true
      });});
      
      let tempTime;

      promise.then(
        result => {
          console.log("updateUserDailyStatus 함수에서" + status_name + "의 횟수 조회 : " + result);
          tempTime = result;
          if(tempTime != null){
            console.log(tempTime);
            if(v == false){
              tempTime = Number(tempTime);
            }
            else {
              tempTime = Number(tempTime) + 1;
            }

            update(ref(db, '/users/' + userID + '/dailyStatus'), {
              [status_name] : tempTime,
            })
          }

          if(status_name == "dailyAccess"){
            setDailyAccessTime(tempTime);
          }
          else if (status_name == "dailyThrow"){
            setDailyThrowTime(tempTime);
          }
        }
       );
    }

    useEffect(() => {
      console.log("유저 일일 접속량" + userDailyAccessTime);
    }, [userDailyAccessTime])

    useEffect(() => {
      console.log("유저 일일 쓰레기통 이용량" + userDailyThrowTime);
    }, [userDailyThrowTime])

    const resetUserDailyStatus = () => {
      set(ref(db, '/users/' + userID + '/dailyStatus'), {
        dailyAccess : 0,
        dailyThrow : 0,
      })
    }

// 맵 데이터 저장 & 로드

    const storeData = () => {
      if(location){
      if(userScore >= 10){
        console.log(addPossible);
          if(addPossible == true){
            updateUserData(userID, -10);
            const ID = Date.now().toString();
            console.log(ID);
            
            const reference = ref(db, 'locations/' + ID);
            set(reference, {
              id: ID, latitude:location.marker.latitude, longitude:location.marker.longitude, weight : 10, creator : userID,
            });

            setAddMode(false);
            loadData();
            setLocation(null);
            showToastWithGravity("쓰레기통 추가 성공!");
          }
          else {
            console.log("해당 지점에 이미 쓰레기통이 있습니다!")
            showToastWithGravity("이미 쓰레기통이 있습니다!");
            setAddPossible(() => true);
          }
          }
        else {
          showToastWithGravity("점수가 부족합니다!");
        }
       
      }
      
    }; //맵 데이터 추가

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
    }; // 맵데이터 로드

    const cancel = () => {
      setAddMode(false);
      setLocation(null);
    } // 추가 모드에서 취소

    const delData = (id) => {
      const reference = ref(db, 'locations/' + id);
      set(reference, null);
      throwReset;
    }; // 맵 데이터 삭제

// weight 업데이트 함수
    const updateData = async (id, v) => { 
      let tempWeight = null;
      let creatorName = null;
      
      const reference = ref(db, 'locations/' + id);
      onValue(reference, (snapshot) => {
        if(snapshot.val() != null){
        tempWeight = snapshot.val().weight;
        creatorName = snapshot.val().creator;
        }
      },
      {
        onlyOnce : true
      });
      console.log("dislike 버튼의 가중치 값 : " + tempWeight);
      
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
      console.log("creator : " + creatorName);
      if(creatorName != null && v > 0 && creatorName != userID){
        updateUserData(creatorName, 1);
      }
    }

  // 쓰레기 버리기 함수
      const throwTrash = async () => {
        console.log("trash Throw" + activatedCan.id );
        updateData(activatedCan.id, 1);
        throwReset();
        updateUserData(userID, 5);
        loadData();
        setTimer(300);

        setThrowMode(false);

        
        setTimeout(() => {
          setThrowMode(true);
        },301*1000); //쿨타임 
        storeUserTimerData(userID);
        showToastWithGravity("쓰레기통 이용 성공!");
        updateUserDailyStatus("dailyThrow");
      }

      useEffect(() => {
        console.log("타이머 : " + userTimer);
      }
      ,[userTimer]);

      useEffect(() => {
        console.log("throw Mode : " + throwMode);
      }, [throwMode]);
      
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
          showToastWithGravity("비추천 성공");
        }
        loadData;
      }

  // 쓰레기통들과의 거리측정 함수
      const measureDistance_trash = (b, a) => {
        if(throwPossible != true){
        getDistance({latitude : b.latitude, longitude : b.longitude},
          {latitude : a.latitude, longitude : a.longitude}) < 7 ?
          (activatedCan == null ? throwSetting(a) : null) : (activatedCan == a.id ? throwReset() : null);
        }
      }

      const measureDistance_add = (b, a) => {
        if(b != null){
          getDistance({latitude : b.marker.latitude, longitude : b.marker.longitude},
            {latitude : a.latitude, longitude : a.longitude}) < 7 ?
            (addPossible == true ? setAddPossible(() => false) : () => {}) : (() => {});
        }
      }

     
      useEffect(loadData, []);

// 도움말 설정

      const changeHelpMode = () => {
        return setHelpMode((ex) => !ex);
      }

      const HelpBox = styled.Image`
        width : ${props => props.windowWidth}px;
        height : ${props => props.windowWidth*(16/10)}px;
        z-index : 100;
        background-color: #ffffff;
        border-top-left-radius : 30px;
        border-top-right-radius : 30px;
        position : absolute;
        opacity : 0.8;
        border-width : 0.5px;
        border-color : black;
      `
      const AnimatedHelpBox = Animated.createAnimatedComponent(HelpBox);

      const helpValue = useRef(new Animated.Value(-1000)).current;

      useEffect(() => {
        console.log("도움말 : " + helpMode);
        getUP();
      }, [helpMode])

      const getUP = () => {
        Animated.timing(helpValue, {
          toValue: helpMode? windowHeight*0.08:windowHeight,
          duration : 300,
          useNativeDriver: true,
        }).start(()=>{
          changeHelpMode;
        });
      };

// 도전과제창 설정
      const changeAchiveMode = () => {
        return setAchiveMode((ex) => !ex);
      }

      const AchiveBox = styled.View`
          flex : 1;
          width : ${props => props.windowWidth}px;
          height : ${props => props.windowWidth*(16/10)}px;
          z-index : 100;
          align-items : center;
          background-color: #99ffcc;
          border-top-left-radius : 30px;
          border-top-right-radius : 30px;
          position : absolute;
          opacity : 1;
          border-width : 0.5px;
          border-color : black;
      `
      const AnimatedAchiveBox = Animated.createAnimatedComponent(AchiveBox);

      const achiveAnimationValue = useRef(new Animated.Value(-1000)).current;

      const AchiveGetUP = () => {
      Animated.timing(achiveAnimationValue, {
          toValue: achiveMode? windowHeight*0.08:windowHeight,
          duration : 300,
          useNativeDriver: true,
      }).start(()=>{
          changeHelpMode;
      });
      };
      const QuestText = styled.Text`
      font-size : 30px;
      color : white;
      `;

      useEffect(() => {
        console.log("도전과제 : " + achiveMode);
        AchiveGetUP();
      }, [achiveMode]);

  return isReady?(
    <ThemeProvider theme = {theme}>
      <Animated.View style = {{flex : 1}}>
      <Container>
      <StatusBar
      barStyle='dark-content'
      backgroundColor={theme.background}/>
{/* 도전과제 */}
      <AnimatedAchiveBox style= {{transform : [{translateY : achiveAnimationValue}]}}  windowWidth = {windowWidth} >
        <DailyQuestCells userAchiveList = {achiveList} achiveMatter1 = {userDailyAccessTime} achiveMatter2 = {userDailyThrowTime} achiveMatter3 = {userScore} 
        updateUserAchiveState = {updateUserAchiveState} loadUserAchiveState = {loadUserAchiveState} showToastWithGravity = {showToastWithGravity} updateUserScore = {updateUserData} userID = {userID}/>
      </AnimatedAchiveBox>

{/* 도움말 */}
      <AnimatedHelpBox style= {{transform : [{translateY : helpValue}]}} source = {images.helpPage} windowWidth = {windowWidth}>
      </AnimatedHelpBox>
{/* 버리기 쿨타임 */}
      {!throwMode&&<TrashTimer _time = {userTimer}/>}
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
            measureDistance_trash(currentLoc, a)
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
          {
            measureDistance_add(location, a)
          }
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
      <UiComponents windowWidth={windowWidth} addMode = {addMode} storeData = {storeData} setAddPossible = {setAddPossible} setAddMode = {setAddMode} userScore = {userScore} 
      cancel = {cancel} changeHelpMode = {changeHelpMode} changeAchiveMode = {changeAchiveMode}/>
      </Animated.View>
    </ThemeProvider>

  ) : (

    <AppLoading
      startAsync={() => preload()}
      onFinish = {() => setLoading(true)}
      onError = {console.warn}
      />

  );
};
