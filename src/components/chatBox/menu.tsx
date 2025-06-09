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
    padding: 0px 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:30px;
    cursor: default;
    width: 200px;
    height: 250px;
    border-radius: 8px;
    background-color: var(--gray-500);
    border: solid 1px white;
    bottom: 50px;
    right: 5%;
    position: absolute;
`
const Button = styled.div`
    padding: 16px 50px;
    border-radius: 8px;
    background-color: var(--black-400);
    margin-top: 10px;
    cursor: pointer;
`
const Header = styled.h5`
    font-size: 12px;
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

    useEffect(() => {
        let storageData = localStorage.getItem("user_settings")
        if (storageData === null) {
            let userData = {
                name: "Гость",
                color: "#fff",
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
                color: JSON.parse(storageData).color
            }
            localStorage.setItem("user_settings", JSON.stringify(userData))
        }
    }, [context.data])
    return (
        <MenuWrapper>
            {showMenu ?
                <Menu>
                    <Header>Enter name:</Header>
                    <FooterPanelInput minLength={5} placeholder="Name" onChange={(event) => changeName(event)} />
                    <Button onClick={() => sendName()}>
                        Done
                    </Button>
                </Menu> : null
            }
            <p onClick={() => setShowMenu(!showMenu)}>Меню</p>
        </MenuWrapper>
    )
}