import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../theme';
import {images} from './Image';
import { Image, StyleSheet} from 'react-native';

const Container = styled.View`
    justify-content:center;
    align-items:center;
    background-color: #111111;
    border-radius : 5px;
    opacity : 0.7;
`;

const Text = styled.Text`
    font-size : 20px;
    color : red;
`;

const styles = StyleSheet.create({
    Icon : {
        width : 40,
        height : 40,
    },
})

export const CusCallout = () => {
    return (
        <Container>
            <Text>Delete?</Text>
            {/* <Image style = {styles.Icon} source = {require('../assets/done.png')} /> */}
        </Container>
    );
} 