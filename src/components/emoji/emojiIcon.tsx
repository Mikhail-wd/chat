import { useContext, type ReactNode } from "react"
import styled from "styled-components"
import { AppState } from "../../App"

const SVGIcon = styled.svg`
    &:hover {
        cursor: pointer;
    }
`
const EmojiWrapper = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    z-index:999
`
type compPropsType = {
    children: ReactNode,
    click?: () => void
}

export default function EmojiIcon(props: compPropsType) {
    const context = useContext(AppState)
    return (
        <EmojiWrapper>
            <SVGIcon onClick={()=>context.dispatch({ type: "set_active_window", payload: context.data?.activeWindow == "emoji" ? null : "emoji" })} viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="9" cy="10" r="1" fill="#ffffff" stroke="none"></circle>
                <circle cx="15" cy="10" r="1" fill="#ffffff" stroke="none"></circle>
                <path d="M8 14.5c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5"></path>
            </SVGIcon>
            {context.data?.activeWindow == "emoji" ? props.children : null}
        </EmojiWrapper>
    )
}