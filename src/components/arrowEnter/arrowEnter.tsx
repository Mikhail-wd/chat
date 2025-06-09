import styled from "styled-components"

const SVGIcon = styled.svg`
    &:hover {
        cursor: pointer;
    }
`

export default function ArrowEnter({click}:any) {
    return (
        <SVGIcon id="svg" fill="#CCCCCC" stroke="#CCCCCC" onClick={click}
            width="30" height="30" version="1.1" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)">
            <g id="IconSvg_bgCarrier" strokeWidth="0"></g>
            <g id="IconSvg_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0">
                <path xmlns="http://www.w3.org/2000/svg" transform="matrix(5.0381 0 0 5.0381 148.09 148.09)"
                    d="m77.071 65.858-14.142-14.141v9.1793h-30v-40.896h-9.9996v51.717h40v8.283zm0 0"
                    fill="none" stroke="#CCCCCC" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10">
                </path>
            </g>
            <g id="IconSvg_iconCarrier">
                <path xmlns="http://www.w3.org/2000/svg"
                    transform="matrix(5.0381 0 0 5.0381 148.09 148.09)"
                    d="m77.071 65.858-14.142-14.141v9.1793h-30v-40.896h-9.9996v51.717h40v8.283zm0 0"
                    fill="#ffffff" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10">
                </path>
            </g>
        </SVGIcon>
    )
}