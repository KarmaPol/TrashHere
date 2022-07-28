import styled from "styled-components/native";
import { images } from '../component/Image';
import { TextImage } from '../component/Imagebutton';
import React, {useEffect, useRef, useState} from 'react';
import { bool } from "prop-types";

// const AchiveBox = styled.View`
//     width : ${props => props.windowWidth}px;
//     height : ${props => props.windowWidth*(16/10)}px;
//     z-index : 100;
//     background-color: #99ffcc;
//     border-top-left-radius : 30px;
//     border-top-right-radius : 30px;
//     position : absolute;
//     opacity : 1;
//     border-width : 0.5px;
//     border-color : black;
// `
// const AnimatedAchiveBox = Animated.createAnimatedComponent(AchiveBox);

// const achiveAnimationValue = useRef(new Animated.Value(-1000)).current;

// export const AchiveGetUP = () => {
// Animated.timing(achiveAnimationValue, {
//     toValue: ahciveMode? windowHeight*0.08:windowHeight,
//     duration : 300,
//     useNativeDriver: true,
// }).start(()=>{
//     changeHelpMode;
// });
// };

// export const Achivements = (ahciveMode) => {
    
//     return (
//         <AnimatedAchiveBox style= {{transform : [{translateY : AnimatedAchiveBox}]}}>
            
//         </AnimatedAchiveBox>
//     )
// }

const InnerBox = styled.View`
    flex : 9;
    width : 90%;
    height : 100%;
    z-index : 100;
    background-color: #ffffff;
    border-top-left-radius : 30px;
    border-top-right-radius : 30px;
    opacity : 1;
    align-items : center;
    border-color : black;
    border-width : 0.7px;
`

const AchiveCell = styled.View`
    width : 90%;
    height : 15%;
    z-index : 100;
    margin : 2.5%;
    justify-content: center;
    align-items : center;
    background-color: ${props => props.isUserAchived?'#E0E0E0':'#ffffff'};
    border-radius : 30px;
    opacity : 1;
    border-width : 0.7px;
    border-color : black;
`

const QuestCell = styled.View`
    width : 90%;
    height : 18%;
    z-index : 100;
    flex-direction: row;
    margin-top: 5%;
    justify-content: center;
    align-items : center;
    background-color: ${props => props.isUserAchived?'#E0E0E0':'#ffffff'};
    border-radius : 30px;
    opacity : 1;
    border-width : 6px;
    border-color : #99ffcc;
`
const IconFrame = styled.View`
    width : 20%;
    height : 90%;
    justify-content: center;
    align-self: center;
    position : absolute;
    left : 6%;
`
const TextFrame = styled.View`
    justify-content: center;
    align-items : center;
`

const TextFrame0 = styled.View`
    flex : 1;
    padding : 1px;
    margin : 2%;
    flex-direction: row;
    justify-content: center;
    align-items : center;
    border-radius : 30px;
    opacity : 1;
    border-width : 6px;
    border-color : #ffffff;
`

const TextFrame1 = styled.View`
    flex-direction: row;
    justify-content: center;
    background-color: white;
    align-items : center;
    border-radius : 30px;
    opacity : 1;
    border-width : 6px;
    border-color : black;
`

const Text0 = styled.Text`
    font-size : 40px;
    color : black;
    `;

const Text = styled.Text`
    font-size : 18px;
    color : black;
`;

const Text2 = styled.Text`
    font-size : 15px;
    color : black;
`;
const Text3 = styled.Text`
    font-size : 15px;
    color : gray;
`;

export const DailyQuestCells = ({userAchiveList, achiveMatter1, achiveMatter2, achiveMatter3, updateUserAchiveState, loadUserAchiveState, showToastWithGravity, updateUserScore, userID}) => {

    let achiveLists = {quest1 : {text : "접속하기", achiveMax : 1 , reward : 5},
    quest2 : {text : "쓰레기통 2번 사용하기", achiveMax : 2, reward : 5}, quest3 : {text : "쓰레기통 1번 추가하기", achiveMax : 1 , reward : 10}}

    useEffect(() => {
        if(userAchiveList.quest1.achived === false){
            if(achiveMatter1 >= achiveLists.quest1.achiveMax){
                updateUserAchiveState("quest1")
                showToastWithGravity("퀘스트 완료!\n" + achiveLists.quest1.text);
                console.log("유저 진행상황1 :" + userAchiveList.quest1.achived);
                loadUserAchiveState();
                updateUserScore(userID, achiveLists.quest1.reward);
            }
        }
    },[achiveMatter1])

    useEffect(() => {
        if(userAchiveList.quest2.achived === false){
            if(achiveMatter2 >= achiveLists.quest2.achiveMax){
                updateUserAchiveState("quest2")
                showToastWithGravity("퀘스트 완료!\n" + achiveLists.quest2.text);
                console.log("유저 진행상황2 :" + userAchiveList.quest2.achived);
                loadUserAchiveState();
                updateUserScore(userID, achiveLists.quest2.reward);
            }
        }
    },[achiveMatter2])

    // useEffect(() => {
    //     if(userAchiveList.quest3.achived === false){
    //         if(achiveMatter3 >= achiveLists.quest3.achiveMax){
    //             updateUserAchiveState("quest3")
    //             showToastWithGravity("퀘스트 완료!\n" + achiveLists.quest3.text);
    //             console.log("유저 진행상황3 :" + userAchiveList.quest3.achived);
    //             loadUserAchiveState();
    //             updateUserScore(userID, achiveLists.quest3.reward);
    //         }
    //     }
    // },[achiveMatter3])

    return (
        <>
        <Text0> 퀘스트 </Text0>
        <InnerBox>
        <QuestCell isUserAchived = {userAchiveList.quest1.achived}>
            <TextFrame>
                <Text>{achiveLists.quest1.text}</Text>
                <Text2>{achiveMatter1===false?0:achiveMatter1===true?1:achiveMatter1} / {achiveLists.quest1.achiveMax===false?0:achiveLists.quest1.achiveMax===true?1:achiveLists.quest1.achiveMax}</Text2>
                <Text3>보상 : {achiveLists.quest1.reward}점</Text3>
            </TextFrame>
        </QuestCell>
        <QuestCell isUserAchived = {userAchiveList.quest2.achived}>
            <TextFrame>
                <Text>{achiveLists.quest2.text}</Text>
                <Text2>{achiveMatter2===false?0:achiveMatter2===true?1:achiveMatter2} / {achiveLists.quest2.achiveMax===false?0:achiveLists.quest2.achiveMax===true?1:achiveLists.quest2.achiveMax}</Text2>
                <Text3>보상 : {achiveLists.quest2.reward}점</Text3>
            </TextFrame>
        </QuestCell>
        </InnerBox>
        </>
    )
}