import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components/native";

const TimerBox = styled.View`
top : 85%;
opacity : 0.7;
width : 120px;
height : 50px;
margin : 10px;
padding : 10px;
border-radius : 20px;
position : absolute;
z-index : 40;
background-color: #606060;
align-items: center;
justify-content : center;
`;

const TimerText = styled.Text`
font-size: 20px;
text-align: center;
color: #ff8000;
`; 

export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

export const TrashTimer = ({_time}) => {
const [time, setTime] = useState(_time*1000);

useEffect(() => {
    setTime(() => _time*1000);
    console.log("타이어 모듈내 입력 타임 : " + time);
}, []);

useInterval(() => {
  setTime((ltime) => ltime - 1000);
//   console.log("타이어 모듈내 입력 타임 : " + time);
},1000)
return(
  <TimerBox>
    <TimerText>{parseInt((time/1000)) + ' sec'}</TimerText>
  </TimerBox>
);
};