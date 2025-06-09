import axios from "axios"
import ChatBox from "./components/chatBox/chatBox"
import { createContext, useEffect, useReducer } from "react"


type Action = {
  type: string,
  payload?: any
}

type Store = {
  selected_users_list: Array<{ user_name: string, user_id: number, expired: number, user_color: string }> | null
  messages: Array<{ name: string, message: string }> | null,
  user_name: string,
  usersList: Array<{ user_name: string, user_id: number, expired: number, user_color: string }> | null,
  user_id: number,
  userColor: string
}

const initData: {
  data?: any,
  dispatch?: any
} = {
}

const initStore: Store = {
  selected_users_list: null,
  userColor: "#ffffff",
  messages: null,
  user_name: "Гость",
  usersList: null,
  user_id: Math.ceil(Math.random() * 100000000)
}

function reducer(state: Store, action: Action): Store {
  switch (action.type) {
    case "resive_messages": {
      return { ...state, messages: action.payload }
    }
    case "resive_users": {
      return { ...state, usersList: action.payload }
    }
    case "change_color": {
      return { ...state, userColor: action.payload }
    }
    case "delete_all_selected_users": {
      return { ...state, selected_users_list: null }
    }
    case "delete_selected_user": {
      if (state.selected_users_list !== null) {
        return { ...state, selected_users_list: state.selected_users_list.filter(element => element.user_id !== action.payload) }
      } else {
        return { ...state }
      }

    }
    case "selecting_user_from_chat_list": {
      if (state.selected_users_list === null) {
        return { ...state, selected_users_list: [action.payload] }
      } else {
        if (state.selected_users_list.filter(element => element.user_id === action.payload.user_id).length < 1) {
          return { ...state, selected_users_list: [...state.selected_users_list, action.payload] }
        } else {
          return { ...state }
        }
      }

    }
    case "set_user": {
      return { ...state, user_name: action.payload.name, userColor: action.payload.color }
    }
    case "change_name": {
      let tempObject = localStorage.getItem("user_settings")
      if (tempObject !== null) {
        let parsedObject = JSON.parse(tempObject)
        parsedObject.name = action.payload
        localStorage.setItem("user_settings", JSON.stringify(parsedObject))
      }
      return { ...state, user_name: action.payload }
    }
    default:
      console.log("Error in reducer")
      return { ...state }
  }
}

export const AppState = createContext(initData)

function App() {
  const [AppData, dispatch] = useReducer(reducer, initStore)

  useEffect(() => {
    let tempData = localStorage.getItem("user_settings")
    if (tempData !== null) {
      dispatch({ type: "set_user", payload: JSON.parse(tempData) })
    }
  }, [])

  useEffect(() => {
    axios.get("http://109.226.196.146:391/chat-api/init-get-messages", {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      dispatch({ type: "resive_messages", payload: response.data })
    }).catch(() => console.warn("Error on getting init messages"))
  }, [])
  return (
    <AppState.Provider value={{ data: AppData, dispatch: dispatch }}>
      <ChatBox />
    </AppState.Provider>
  )
}

export default App
