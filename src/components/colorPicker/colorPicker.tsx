import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import { HexColorPicker } from "react-colorful";
import { AppState } from '../../App';

const SelectColor = styled.div<{ state: string }>`
    box-sizing: border-box;
    background-color: ${props => props.state};
    border: solid 0.5px #fff;
    border-radius: 6px;
    width: 20px;
    height: 20px;
    cursor: pointer;
`
const ExternTheme = styled.div`
    position: absolute;
    margin-bottom: 250px;
    right: 5%;
    bottom: auto;
    display: block;

`
export default function ColorPicker() {
    const context = useContext(AppState)
    const [color, setColor] = useState('#fff');
    const [popupState, setPopupState] = useState<boolean>(false);


    function colorSending() {
        let userData = localStorage.getItem("user_settings")
        setPopupState(!popupState)
        context.dispatch({ type: "change_color", payload: color })
        console.log(color, context.data.userColor)
        if (userData !== null) {
            let tempData = JSON.parse(userData)
            tempData.color = color
            localStorage.setItem("user_settings", JSON.stringify(tempData))
            setColor(tempData.color)
        }
    }

    useEffect(() => {
        let userData = localStorage.getItem("user_settings")
        if (userData !== null) {
            setColor(JSON.parse(userData).color)
        }
    }, [])
    return (<>
        <SelectColor onClick={() => colorSending()} state={color} />
        {popupState ?
            <ExternTheme >
                <HexColorPicker color={color} onChange={setColor} />
            </ExternTheme>
            : null}
    </>
    );
}