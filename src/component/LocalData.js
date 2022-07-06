import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const storeLocalData = async ({userID, userScore}) => {
    try {
      await AsyncStorage.setItem(userID, JSON.stringfy({'userID' : [userID], 'score' : [userScore]}));
    }
    catch (e) {
      console.log("유저 ID를 저장할 수 없습니다");
    }
  }
  
export const getLocalData = async ( {userID, setID, setScore} ) => {
    try{
        if(userID !== null){
            console.log('test1');

            const userData = await AsyncStorage.getItem(userID);
            if(userData !== null){
                console.log('test2');
                setID(userData.userID);
                setScore(userData.userData);
            }
            else {
                const _userID = uuid.v4();
                console.log(_userID);
                () => setID(_userID);
                () => setScore(10);
                storeLocalData(_userID, 10);
            }
        }
        else {
            console.log('test3');

            const _userID = uuid.v4();
            console.log(_userID);
            () => setID(_userID);
            () => setScore(10);
            storeLocalData(_userID, 10);
        }
    }
    catch (e){
        console.log("유저 ID를 불러올 수 없습니다")
    }
  }