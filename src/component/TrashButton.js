import styled from "styled-components/native";
import { Animated } from "react-native";
import React, {useEffect, useRef} from 'react';

const Button = styled.TouchableOpacity`
    height : ${props => props.width}px;
    width : ${props => props.width}px;
    top : 80%;
    left : ${props => props.left}px;
    position : absolute;
    z-index : 20;
`

const Icon = styled.Image`
    height : ${props => props.width}px;
    width : ${props => props.width}px;
`



export const TrashButton = ({type, windowWidth, windowHeight, throwTrash}) => {

    const AnimatedButton = Animated.createAnimatedComponent(Icon);

    const aniValue = useRef(new Animated.Value(0.6)).current;

    const withSpirng_start = () => {
        Animated.spring(aniValue,{ 
            toValue: 1,
            duration : 500,
            bounciness : 20,
            useNativeDriver : true,
        }).start();
    }

    const withSpirng_end = () => {
        Animated.timing(aniValue,{ 
            toValue: 1.2,
            duration : 100,
            speed : 100,
            bounciness : 0,
            useNativeDriver : true,
        }).start(() => {
            Animated.timing(aniValue,{ 
            toValue: 1,
            duration : 50,
            speed : 100,
            bounciness : 0,
            useNativeDriver : true,
        }).start(throwTrash)});
    }


    useEffect(() => {
        withSpirng_start()
    },[])

    return (
        <Button top = {windowHeight*0.75} left = {windowWidth*0.5 - windowWidth*0.15} 
        width = {windowWidth*0.3} onPress = {() => {withSpirng_end()}}>
            <AnimatedButton style = {{transform: [{scale : aniValue}]}} source = {type} width = {windowWidth*0.3} />
        </Button>
    );
};

