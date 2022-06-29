import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../theme';
import {images} from './Image';
import { Image, StyleSheet} from 'react-native';

const Container = styled.View`
    flex-direction: row;
    justify-content:center;
    align-items:center;
    background-color: #ffffff;
    border-radius : 10px;
    opacity : 0.7;
    margin : 3px;
    padding : 3px;
`;

const Button = styled.View`
    border-color : #C4C4C4;
    border-width : 1px;
    justify-content:center;
    align-items:center;
    background-color: #ffffff;
    border-radius : 10px;
    opacity : 1;
    margin : 3px;
`

const Text1 = styled.Text`
    font-size : 20px;
    color : red;
`;

const Text2 = styled.Text`
    font-size : 20px;
    color : green;
`;

const Text3 = styled.Text`
    font-size : 20px;
    color : blue;
`;

export const CusCallout = () => {
    return (
        <Container>
            <Button>
                <Text1>Delete</Text1>
            </Button>
            <Button>
                <Text2>Like</Text2>
            </Button>
            <Button>
                <Text3>Dislike</Text3>
            </Button>
        </Container>
    );
} 