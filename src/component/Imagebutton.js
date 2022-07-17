import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from 'prop-types';
import {images} from './Image';

export const Icon = styled.Image`
    height : ${props => props.parentHeight}px;
    width : ${props => props.parentHeight}px;
    margin : ${props => props.margin}px;
`;

export const TextImage = styled.Image`
    height : ${props => props.parentHeight}px;
    margin : ${props => props.margin}px;
`;

export const IconButton = ({type, onPressOut ,parentHeight}) => {
    
    const iconSize = parentHeight*0.7;
    const marginSize = parentHeight*0.05;
    return (
        <TouchableOpacity onPressOut ={onPressOut}>
            <Icon source = {type} onPressOut = {()=> {}} parentHeight = {iconSize} margin = {marginSize}></Icon>
        </TouchableOpacity>
    );
};

IconButton.propTypes = {
    type: PropTypes.oneOf(Object.values(images)).isRequired,
}