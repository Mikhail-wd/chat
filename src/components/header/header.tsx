import styled from "styled-components";
import ThemeChanger from "../themChanger/themChanger";
import UsersToggle from "../userToggle/usersToggle";

const HeaderRow = styled.header`
    width:100%;
    padding: 6px 21px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:space-between;
    background-color: var(--background);    
    border-radius: 0px 0px 6px 6px;
`
const HeaderColmn = styled.div`
    display: flex;
    flex-wrap: nowrap;
    gap: 15px
`

function Header() {
    return (
        <HeaderRow>
            <HeaderColmn>
                Average chat
            </HeaderColmn>
            <HeaderColmn>
                <ThemeChanger />
                <UsersToggle />
            </HeaderColmn>
        </HeaderRow>
    );
}

export default Header;