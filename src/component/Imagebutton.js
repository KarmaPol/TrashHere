import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from 'prop-types';
import {images} from './Image';

const Icon = styled.Image`
    tint-color : ${({theme}) => theme.main};
    width : 40px;
    height : 40px;
    margin : 1px;
`;

const IconButton = ({type}) => {
    return (
        <TouchableOpacity>
            <Icon source = {type}></Icon>
        </TouchableOpacity>
    );
};

IconButton.propTypes = {
    type: PropTypes.oneOf(Object.values(images)).isRequired,
}

export default IconButton;