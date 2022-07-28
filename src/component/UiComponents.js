import React, {  useEffect, useState, useRef} from "react";
import styled from "styled-components/native";
import { TextImage, IconButton } from '../component/Imagebutton';
import { images } from '../component/Image';
import { Animated, ProgressViewIOSComponent } from "react-native";

const UIBOX = styled.View`
    flex: 1;
    background-color: #ffffff;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-width : 0.5px;
    border-top-left-radius : 30px;
    border-top-right-radius : 30px;
    z-index : 15;
`;

const ScoreBoard = styled.TouchableOpacity`
    width : 110px;
    height : 40px;
    margin : 0px;
    padding : 0px;
    background-color: #ffffff;
    border-color: #C4C4C4 ;
    border-width : 1px;
    border-radius : 20px;
    flex-direction : row-reverse;
    justify-content : flex-start;
    align-items : center;
    position : absolute;
    right : ${props => props.windowWidth}px;
`

const LeafBox = styled.View`
  width : 50px;
  height : 50px;
  position : absolute;
  left : 55%;
  justify-content : center;
  align-items : center;
`

const IconBoX = styled.View`
  flex-direction : column;
  align-items: center;
  justify-content : center;
  position : absolute;
`;

const IconBoX2 = styled.View`
  flex-direction : column;
  align-items: center;
  justify-content : flex-start;
  position : absolute;
  left : 43%;
  top : 15%;
`

const IconBoX3 = styled.View`
  flex-direction : column;
  align-items: center;
  position : absolute;
  left : 260%;
  top : 15%;
`

const Text = styled.Text`
  font-size: 20px;
  text-align: center;
  color: #000000;
`;

const AnimatedLeaf = Animated.createAnimatedComponent(TextImage);

export const UiComponents = ( {windowWidth, addMode, storeData, setAddPossible, setAddMode, userScore, cancel, changeHelpMode, changeAchiveMode} ) => {

    const [parentHeight, setParentHeight] = useState(0); //하단 uibox 높이

    const onLayout = event => {
        const {height} = event.nativeEvent.layout;
        setParentHeight(height);
      };

    const leafAnimationValue = (new Animated.Value(1));

    const withSpirng_end = () => {
      Animated.timing(leafAnimationValue,{ 
          toValue: 1.5,
          duration : 150,
          speed : 100,
          bounciness : 0,
          useNativeDriver : true,
      }).start(() => {
          Animated.timing(leafAnimationValue,{ 
          toValue: 1,
          duration : 150,
          speed : 100,
          bounciness : 0,
          useNativeDriver : true,
      }).start()});
    }

    useEffect(() => {
      withSpirng_end();
    }, [userScore]);

    return (
        <UIBOX onLayout = {onLayout}>
            <ScoreBoard onPressOut = {() => changeAchiveMode()} windowWidth = {windowWidth - 110 - (parentHeight-40)/2}>
              <LeafBox>
                <AnimatedLeaf style = {{transform: [{scale : leafAnimationValue}]}} source = {images.leafs} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.55*parentHeight} margin = {0}/>
              </LeafBox>
            <Text>{userScore}  </Text>
            </ScoreBoard>
            <IconBoX >
            {(!addMode&& 
            <IconButton type = {images.plus} onPressOut={() => {setAddPossible(true); setAddMode(true)}} parentHeight = {parentHeight} />
            )
            ||
            (addMode&&
            <>
            <IconButton type = {images.done} onPressOut={storeData} parentHeight = {parentHeight} />
            <IconBoX2>
              <IconButton type = {images.cancel} onPressOut={cancel} parentHeight = {0.8*parentHeight} />
              <TextImage source = {images.cancelText} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.15*0.8*parentHeight} margin = {0.01*parentHeight}/>
            </IconBoX2>
            </>
            )
            }
            {(!addMode&&<TextImage source = {images.addText} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.15*parentHeight} margin = {0.01*parentHeight}/>) || 
            (addMode&&<TextImage source = {images.doneText} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.15*parentHeight} margin = {0.01*parentHeight}/>)}
            {!addMode&&
            <IconBoX3>
              <IconButton type = {images.help} onPressOut={() => {changeHelpMode()}} parentHeight = {0.8*parentHeight} />
            </IconBoX3>}
            </IconBoX>
        </UIBOX>
        
    );
};
