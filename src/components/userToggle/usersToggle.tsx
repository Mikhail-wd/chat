import IconWrapper from "../iconWrapper/iconWrapper";
import { AppState } from "../../App";
import { useContext } from "react";

const UsersShow = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
    )
}

const UsersHide = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
            <path d="M20 21l2 -2l-2 -2" />
            <path d="M17 17l-2 2l2 2" />
        </svg>
    )
}


function UsersToggle() {
    const context = useContext(AppState)

    function toggleUsersList() {
        context.dispatch({ type: "toggle_users" })
    }
    return (
        <IconWrapper click={()=>toggleUsersList()}>
            {context.data?.users ? <UsersShow /> : <UsersHide />}
            In chat : {context.data?.usersList !== null ? context.data?.usersList.length : 0}
        </IconWrapper>
    );
}

export default UsersToggle;