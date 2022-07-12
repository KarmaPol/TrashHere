import styled from "styled-components/native";

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
`;

export const TrashButton = ({type, windowWidth, windowHeight, throwTrash}) => {
    return (
        <Button top = {windowHeight*0.75} left = {windowWidth*0.5 - windowWidth*0.15} 
        width = {windowWidth*0.3} onPressOut = {()=> {throwTrash()}}>
            <Icon source = {type} width = {windowWidth*0.3}/>
        </Button>
    );
};

