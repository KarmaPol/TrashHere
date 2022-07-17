import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components/native";
import { TextImage, IconButton } from '../component/Imagebutton';
import { images } from '../component/Image';

const HelpBox = styled.TouchableOpacity`
  width : ${props => props.windowWidth}px;
  height : ${props => props.windowWidth}px;
  z-index : 100;
  background-color: #ffffff;
  border-radius : 20px;
  position : absolute;
`

export const HelpB = (windowWidth) => {
    return (
        <HelpBox windowWidth = {windowWidth}/>
    )
};