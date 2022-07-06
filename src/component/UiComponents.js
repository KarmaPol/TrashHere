import React, {useState} from "react";
import styled from "styled-components/native";
import { TextImage, IconButton } from '../component/Imagebutton';
import { images } from '../component/Image';


const UIBOX = styled.View`
    flex: 1;
    background-color: #ffffff;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-top-left-radius : 30px;
    border-top-right-radius : 30px;
    z-index : 15;
`;

const ScoreBoard = styled.View`
    width : 100px;
    height : 45px;
    margin : 10px;
    padding : 10px;
    background-color: #ffffff;
    border-color: #C4C4C4 ;
    border-width : 1px;
    border-radius : 20px;
    flex-direction : row-reverse;
    justify-content : flex-start;
    align-items : flex-start;
    position : absolute;
    right : ${props => props.windowWidth}px;
`

const IconBoX = styled.View`
  flex-direction : column;
  align-items: center;
  justify-content : center;
  position : absolute;
`;

const Text = styled.Text`
  font-size:15px;
  text-align: center;
  color: #000000;
`;

export const UiComponents = ( {windowWidth, addMode, storeData, setAddMode} ) => {

    const [parentHeight, setParentHeight] = useState(0); //하단 uibox 높이

    const onLayout = event => {
        const {height} = event.nativeEvent.layout;
        setParentHeight(height);
      };

    return (
        <UIBOX onLayout = {onLayout}>
            <ScoreBoard windowWidth = {windowWidth - 120}>
            {/* <TextImage source = {images.leafs} resizeMode = 'contain' onPressOut = {()=> {}} parentHeight = {0.6*parentHeight} margin = {0.001*parentHeight}/> */}
            <Text>123</Text>
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
    );
};