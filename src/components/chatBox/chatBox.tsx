import { useEffect, useState, useContext, useId } from "react"
import Header from "../header/header"
import Input from "./input"
import MenuBtn from "./menu"
import styled from "styled-components"
import { AppState } from "../../App"
import Spinner from '../../assets/spinner.gif'
import axios from "axios"
import ColorPicker from "../colorPicker/colorPicker"

const ChatWrapper = styled.div`
    min-width: 70dvw;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    background-color:var(--background-light);
`
const FooterPanel = styled.div`
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    gap:9px;
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    background-color: var(--background);
`
const ChatVisual = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    height: calc(100% - 60px);
    flex-grow: 10;
`
const ChatVisualLC = styled.div`
    padding:0px 8px;
    display: flex;
    flex-direction: column-reverse;
    justify-content: end;
    gap:11px;
    flex-grow: 10;
    overflow-y: scroll;
    padding-bottom: 10px;
    scrollbar-color: var(--black-400) var(--black-500);
    scrollbar-width: thin;
`
const ChatVisualRC = styled.div`
    box-sizing:border-box;
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 10px 8px 0px 8px;
    min-width: 30%;
    overflow-y: scroll;
    scrollbar-color: var(--black-400) var(--black-500);
    scrollbar-width: thin;
`
const MessageElement = styled.div<{ state: boolean }>`
    word-wrap: anywhere;
    background-color: ${props => props.state ? "var(--gray-500)" : "inherit"};
    line-height: 15px;   
`
const UsersElement = styled.div<{ state?: string }>`
    text-wrap:nowrap;
    line-height: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    color:${props => props.state};
    cursor: pointer;    
    font-weight: 600;
`
const ImageWrapper = styled.img`
    max-width: 50%;
    border-radius: 8px;
    margin-top: 5px;
    @media screen and (max-width:450px) {
        max-width: 100%;
        width:70% ;
    }
`
const FooterRow = styled.div`
    width:100%;
    display: flex;
    gap: 9px;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;  
`
const FooterUserWrapper = styled.div`
    border-radius: 8px;
    padding: 4px 9px;
`
// const ToggleUsersList = styled.div`
//     position: fixed;
//     box-sizing: border-box;
//     display:flex;
//     align-items: center;
//     gap: 9px;
//     top:0px;
//     right:0px;
//     background-color:var(--black-400);
//     padding: 8px 12px;
//     font-size: 14px;
//     text-align:center;

//     &:hover {
//        cursor: pointer;
//     }
// `
// const UsersListHeader = styled.span`
//     margin-top: 40px
// `

type Message = {
    user_color: string,
    name: string,
    message: string,
    image_link: string | null,
    selected_users: null | Array<User>
    selected_id: null | Array<string>
}

type User = {
    user_color: string,
    user_name: string,
    user_id: string | number,
    expired?: string | number,
}

export default function ChatBox() {
    const leftCol = useId()
    const rightCol = useId()
    const footer = useId()
    const context = useContext(AppState)
    const [userFont, setUserFont] = useState<string>("")
    const [userTheme, setUserTheme] = useState<string>("")
    const [chatMessages, setChatMessages] = useState<Array<Message> | null>(null)
    const [usersList, setUsersList] = useState<Array<User> | null>(null)
    const [selected_users, setSelectedUsers] = useState<Array<User> | null>(null)

    function addingUserToState(value: User) {
        context.dispatch({ type: "selecting_user_from_chat_list", payload: value })
    }

    // function settingUserTheme() {
    //     context.dispatch = { type: "change_theme", payload: "" }
    // }

    function checkFont(value: String | null) {
        switch (value) {
            case "option1":
                return "monst"
            case "option2":
                return "jost"
            case "option3":
                return "ancs"
            default:
                return ""
        }
    }

    //set users theme
    useEffect(() => {
        setUserTheme(context.data.userTheme)
    }, [context.data.userTheme])
    
    //set sse for messages and users
    useEffect(() => {
        const eventGetMessages = new EventSource(import.meta.env.VITE_SERVER + "chat-api/get-messages")
        const eventGetUsers = new EventSource(import.meta.env.VITE_SERVER + "chat-api/get-users")
        setUserFont(checkFont(context.data.userFont))

        eventGetMessages.onmessage = (event) => {
            context.dispatch({ type: "resive_messages", payload: JSON.parse(event.data) })
        }
        eventGetUsers.onmessage = (event) => {
            context.dispatch({ type: "resive_users", payload: JSON.parse(event.data) })
        }

        return (() => {
            eventGetMessages.close()
            eventGetUsers.close()
        })

    }, [context.data.userFont])

    //set states for messages and users
    useEffect(() => {
        if (context.data.usersList !== null) {
            setUsersList(context.data.usersList)
        }
        setChatMessages(context.data.messages)
    }, [context.data.messages, context.data.usersList])

    useEffect(() => {
        setSelectedUsers(context.data.selected_users_list)
    }, [context.data.selected_users_list])

    //let server know that user is steel online
    useEffect(() => {
        let sendInter = setInterval((value = context.data.userColor, name = context.data.user_name) => {
            axios.post(import.meta.env.VITE_SERVER + "chat-api/enter-chat",
                JSON.stringify({ user_name: name, user_id: context.data.user_id, user_color: value }), {
                headers: {
                    'Content-Type': 'text/json',
                }
            }
            ).then().catch(() => console.warn("Fail to connect to server"))
        }, 5000)
        sendInter
        return () => clearInterval(sendInter)
    }, [context.data.userColor, context.data.user_name])

    //let server know that user is enter a chat
    useEffect(() => {
        let tempData = localStorage.getItem("user_settings")
        if (tempData !== null) {
            axios.post(import.meta.env.VITE_SERVER + "chat-api/enter-chat",
                JSON.stringify({ user_name: JSON.parse(tempData).name, user_id: context.data.user_id, user_color: JSON.parse(tempData).color }),
                {
                    headers: {
                        'Content-Type': 'text/json',
                    }
                }
            ).then().catch(() => console.warn("Fail to connect to server"))
        } else {
            axios.post(import.meta.env.VITE_SERVER + "chat-api/enter-chat",
                JSON.stringify({ user_name: context.data.user_name, user_id: context.data.user_id, user_color: context.data.userColor }),
                {
                    headers: {
                        'Content-Type': 'text/json',
                    }
                }
            ).then().catch(() => console.warn("Fail to connect to server"))
        }
    }, [])

    return (
        <ChatWrapper className={userFont + " " + userTheme[0]}>
            <Header />
            <ChatVisual >
                <ChatVisualLC key={leftCol}>
                    {chatMessages !== null ? chatMessages.map((element, index) => {
                        let stateOfMsg = element.selected_id !== null ? element.selected_id?.includes(context.data.user_id) : false
                        if (element.image_link === null) {
                            return (
                                <MessageElement state={stateOfMsg}
                                    key={index}>
                                    <span style={{ color: `${element.user_color}` }}>{element.name}</span>
                                    : {element.selected_users?.map(sub_element => {
                                        return (<span style={{ color: `${sub_element.user_color}` }}>@{sub_element.user_name}, </span>)
                                    })}
                                    {element.message}
                                </MessageElement>
                            )

                        } else if (element.image_link !== null) {
                            return (
                                <MessageElement state={stateOfMsg} key={index}>
                                    <span style={{ color: `${element.user_color}` }}>{element.name}</span>
                                    : {element.selected_users?.map(sub_element => {
                                        return (<span style={{ color: `${sub_element.user_color}` }}>@{sub_element.user_name}, </span>)
                                    })}
                                    <br />
                                    <ImageWrapper src={element.image_link} onError={(event) => { event.currentTarget.src = Spinner }} />
                                </MessageElement>
                            )
                        }
                    }) :
                        <MessageElement state={false}>~~~~~~Loading messages, please wait ~~~~~~~</MessageElement>
                    }
                </ChatVisualLC>
                {context.data.users ?
                    <>
                        <ChatVisualRC key={rightCol}>
                            {usersList !== null ?
                                usersList.map((element, index) => {
                                    return <UsersElement key={index}
                                        state={element.user_color}
                                        onClick={() => addingUserToState(element)}
                                    >{element.user_name}</UsersElement>
                                }) : <UsersElement state={"#ffff"}>No users found</UsersElement>
                            }
                        </ChatVisualRC>
                    </>
                    : null}
            </ChatVisual>
            <FooterPanel key={footer}>
                {selected_users !== null ?
                    <FooterRow style={{ flexWrap: "wrap" }}>
                        {selected_users.map(element => {
                            return (
                                <FooterUserWrapper
                                    onClick={() => context.dispatch({ type: "delete_selected_user", payload: element.user_id })}
                                    style={{ color: `${element.user_color}` }}>{element.user_name}</FooterUserWrapper>
                            )
                        })}
                    </FooterRow>
                    : null}
                <FooterRow>
                    <Input />
                    <ColorPicker />
                    <MenuBtn />
                </FooterRow>
            </FooterPanel>
        </ChatWrapper >
    )
}