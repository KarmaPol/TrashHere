import React from "react";
import styled from "styled-components/native";

export const ScoreBoard = styled.View`
    width : 100px;
    height : 45px;
    margin : 10px;
    padding : 10px;
    background-color: #ffffff;
    border-color: #C4C4C4 ;
    border-width : 1px;
    border-radius : 20px;
    flex-direction : row;
    justify-content : flex-start;
    align-items : center;
    position : absolute;
    right : ${props => props.windowWidth};
`