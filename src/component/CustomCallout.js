import React from 'react';
import styled from 'styled-components/native';
import {images} from './Image';

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

const Text = styled.Text`
    font-size : 20px;
    color : red;
`;

export const CusCallout = () => {
    return (
        <Container>
            <Text>Dislike</Text>
        </Container>
    );
} 