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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TrashButton = ({type, onPressOut, windowWidth, windowHeight}) => {
    const spring = useRef(new
     Animated.Value(1)).current;

    const pressIn = () => {
        Animated.spring(spring, {
            toValue: 100,
            useNativeDriver: true,
        }).start();
    }
    
    // useEffect(() => {
    //     Animated.spring(spring, {
    //         toValue: 100,
    //         useNativeDriver: true,
    //     })
    // }, []);

    return (
        <AnimatedTouchable onPressIn = {pressIn} onPressOut = {onPressOut}>
            <Icon source = {type} onPressout = {() => {}} top = {windowHeight*0.75} left = {windowWidth*-0.125} width = {windowWidth*0.25}/>
        </AnimatedTouchable>
    );
};

