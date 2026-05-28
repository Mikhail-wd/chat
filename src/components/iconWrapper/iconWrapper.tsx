import React from "react";
import styled from "styled-components";

type compPropsType = {
    children?: React.ReactNode,
    click?: () => void
}

const IconWrapperElem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap:nowrap;
    padding: 4px;
    border-radius: 8px;
    transition: background-color 0.3s, easy-in;
    &:hover {
        background-color: var(--background-alt);
        cursor: pointer;        
    }
`

function IconWrapper(props:compPropsType) {
    return ( 
        <IconWrapperElem onClick={props.click}>
            {props.children}
        </IconWrapperElem>
     );
}

export default IconWrapper;