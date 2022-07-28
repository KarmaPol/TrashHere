import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components/native";
import { TextImage, IconButton } from '../component/Imagebutton';
import { images } from '../component/Image';

const HelpBox = styled.Image`
  width : ${props => props.windowWidth}px;
  height : ${props => props.windowWidth*(16/11)}px;
  z-index : 100;
  background-color: #ffffff;
  border-radius : 20px;
  position : absolute;
  opacity : 0.85;
`

export const HelpB = (windowWidth, source, _onPress) => {
    return (
        <HelpBox source = {images.helpPage} windowWidth = {windowWidth} onPress = {() => _onPress}/>
    )
};