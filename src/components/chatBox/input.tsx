import styled from "styled-components"
import axios from "axios"
import { useContext, useState } from "react"
import ArrowEnter from "../arrowEnter/arrowEnter"
import { AppState } from "../../App"

export const FooterPanelInput = styled.input`
    width: 100%;
    padding: 8px;
     box-sizing: border-box;
    border-radius: 4px;
    background-color: var(--black-400);
`
const Form = styled.form`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 7px;
    flex-grow: 10;
    box-sizing: border-box;
`

export default function Input() {
    const context = useContext(AppState)
    const [chatMsg, setChatMsg] = useState<string>("")

    function changeMessage(event: React.ChangeEvent<HTMLInputElement>) {
        setChatMsg(event.currentTarget.value)
    }

    function assisInput() {
        if (chatMsg.length !== 0 && !chatMsg.startsWith("https://")) {
            setChatMsg("")

            axios.post(import.meta.env.VITE_SERVER+"chat-api/message",
                JSON.stringify({ name: context.data.user_name, message: chatMsg, image_link: null, user_color: context.data.userColor, selected_users: context.data.selected_users_list }),
                {
                    headers: {
                        'Content-Type': 'text/json'
                    }
                }
            ).then(() => context.dispatch({ type: "delete_all_selected_users" })
            ).catch(() => console.warn("ServerError"))
        } else if (chatMsg.startsWith("https://") && chatMsg.length !== 0) {
            setChatMsg("")
            if (chatMsg.endsWith(".jpeg") || chatMsg.endsWith(".jpg") || chatMsg.endsWith(".png") || chatMsg.endsWith(".gif") || chatMsg.endsWith(".webp") || chatMsg.endsWith(".svg")) {
                axios.post(import.meta.env.VITE_SERVER+"chat-api/message",
                    JSON.stringify({ name: context.data.user_name, message: "images", image_link: chatMsg, selected_users: context.data.selected_users_list }),
                    {
                        headers: {
                            'Content-Type': 'text/json'
                        }
                    }
                ).then(() => context.dispatch({ type: "delete_all_selected_users" })
                ).catch(() => console.warn("ServerError"))
            }
        }
    }
    function sendMessage(value: React.FormEvent) {
        value.preventDefault()
        if (chatMsg.length !== 0 && !chatMsg.startsWith("https://")) {
            setChatMsg("")
            axios.post(import.meta.env.VITE_SERVER+"chat-api/message",
                JSON.stringify({ name: context.data.user_name, message: chatMsg, image_link: null, user_color: context.data.userColor, selected_users: context.data.selected_users_list }),
                {
                    headers: {
                        'Content-Type': 'text/json'
                    }
                }
            ).then(() => context.dispatch({ type: "delete_all_selected_users" })
            ).catch(() => console.warn("ServerError"))
        } else if (chatMsg.startsWith("https://") && chatMsg.length !== 0) {
            setChatMsg("")
            if (chatMsg.endsWith(".jpeg") || chatMsg.endsWith(".jpg") || chatMsg.endsWith(".png") || chatMsg.endsWith(".gif") || chatMsg.endsWith(".webp") || chatMsg.endsWith(".svg")) {
                axios.post(import.meta.env.VITE_SERVER+"chat-api/message",
                    JSON.stringify({ name: context.data.user_name, message: "images", image_link: chatMsg, user_color: context.data.userColor, selected_users: context.data.selected_users_list }),
                    {
                        headers: {
                            'Content-Type': 'text/json'
                        }
                    }
                ).then(() => context.dispatch({ type: "delete_all_selected_users" })
                ).catch(() => console.warn("ServerError"))
            }
        }
    }
    return (
        <Form onSubmit={(event) => sendMessage(event)}>
            <FooterPanelInput value={chatMsg} onChange={(event) => changeMessage(event)} maxLength={250} />
            <ArrowEnter click={assisInput} />
        </Form>
    )
} 