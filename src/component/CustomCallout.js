import React from 'react';
import styled from 'styled-components/native';
import {images} from './Image';
import { Icon } from './Imagebutton';
import { Image } from 'react-native';

const Container = styled.View`
    flex-direction: row;
    justify-content:center;
    align-items:center;
    background-color: #ffffff;
    height: 40px;
    width: 80px;
    border-radius : 20px;
    opacity : 0.8;
    margin : 3px;
    padding : 3px;
`;

const Iconbox = styled.View`
    width : 75px;
    height : 35px;
    margin : 0px;
    padding : 0px;
    background-color: #ffffff;
    border-color: #C4C4C4 ;
    border-width : 1px;
    border-radius : 20px;
    /* flex-direction : row-reverse; */
    justify-content : center;
    align-items : center;
`

const Text = styled.Text`
    font-size : 20px;
    color : red;
`;

export const CusCallout = () => {
    return (
        <Container>
            <Iconbox>
                <Text>Dislike</Text>
            </Iconbox>
            
        </Container>
    );
} 