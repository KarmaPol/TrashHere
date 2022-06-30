import React, { useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Animated } from "react-native";

const Icon = styled.Image`
    height : ${props => props.width}px;
    width : ${props => props.width}px;
    top : ${props => props.top}px;
    left : ${props => props.left}px;
    z-index : 10;
    position : absolute;
`;

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TrashButton = ({type, windowWidth, windowHeight}) => {
    return (
        <TouchableOpacity onPressout = {()=> {console.log("test11")}}>
            <Icon source = {type} top = {windowHeight*0.75} left = {windowWidth*-0.125} width = {windowWidth*0.25}/>
        </TouchableOpacity>
    );
};

