import React, { useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Animated } from "react-native";

const Button = styled.TouchableOpacity`
    height : ${props => props.width}px;
    width : ${props => props.width}px;
    top : 75%;
    left : ${props => props.left}px;
    position : absolute;
    z-index : 20;
`

const Icon = styled.Image`
    height : ${props => props.width}px;
    width : ${props => props.width}px;
`;

export const TrashButton = ({type, windowWidth, windowHeight}) => {
    return (
        <Button top = {windowHeight*0.75} left = {windowWidth*0.5 - windowWidth*0.15} 
        width = {windowWidth*0.3} onPressOut = {()=> {console.log("test12455")}}>
            <Icon source = {type} width = {windowWidth*0.3}/>
        </Button>
    );
};
