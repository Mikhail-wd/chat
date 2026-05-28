import { useContext, useEffect, useState } from "react"
import { FooterPanelInput } from "./input"
import styled from "styled-components"
import { AppState } from "../../App"

const MenuWrapper = styled.div`
    &:hover {
        cursor: pointer;
    }
`
const Menu = styled.div`
    z-index: 100;
    padding: 10px 35px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    cursor: default;
    width: 200px;
    height: 250px;
    border-radius: 8px;
    background-color: var(--background);
    border: solid 1px white;
    bottom: 50px;
    right: 5%;
    position: absolute;
`
const Button = styled.div`
    padding: 16px 50px;
    border-radius: 8px;
    background-color: var(--background-alt);
    margin-top: 10px;
    cursor: pointer;
`
const Header = styled.h5`
    font-size: 12px;
`
const NameWrapper = styled.div`
    display:flex;
    flex-wrap:nowrap;
    gap:9px;
    align-items:center
`

export default function MenuBtn() {
    const context = useContext(AppState)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [user_name, setUserName] = useState<string>("")


    function changeName(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setUserName(event.currentTarget.value)
    }

    function sendName() {
        if (user_name.length >= 5) {
            context.dispatch({ type: "change_name", payload: user_name })
            setShowMenu(false)
        }
    }
    function selectingFont(value: string) {
        context.dispatch({ type: "change_font", payload: value })
    }

    useEffect(() => {
        let storageData = localStorage.getItem("user_settings")
        if (storageData === null) {
            let userData = {
                name: "Гость",
                color: "#fff",
                fontName: "regular"
            }
            localStorage.setItem("user_settings", JSON.stringify(userData))
            context.dispatch({ type: "set_user", payload: userData })
        }
    }, [])

    useEffect(() => {
        let storageData = localStorage.getItem("user_settings")
        if (storageData !== null) {
            let userData = {
                name: JSON.parse(storageData).name,
                color: JSON.parse(storageData).color,
                fontName: JSON.parse(storageData).fontName
            }
            localStorage.setItem("user_settings", JSON.stringify(userData))
        }
    }, [context.data])
    return (
        <MenuWrapper>
            {context.data?.activeWindow == "menu" ?
                <Menu>
                    <Header>Enter name:</Header>
                    <NameWrapper>
                        <FooterPanelInput minLength={5} placeholder="Name" onChange={(event) => changeName(event)} />
                    </NameWrapper>
                    <label>Select font : </label>
                    <select name="fontOption" value={context.data.userFont} onChange={(event) => selectingFont(event.target.value)}>
                        <option value="regular">Regular</option>
                        <option value="option1">Montserrat</option>
                        <option value="option2">Jost</option>
                        <option value="option3">Ancizar</option>
                    </select>
                    <Button onClick={() => sendName()}>
                        Done
                    </Button>
                </Menu> : null
            }
            <p onClick={() => context.dispatch({ type: "set_active_window", payload: context.data?.activeWindow == "menu" ? null : "menu" })}>Menu</p>
        </MenuWrapper>
    )
}