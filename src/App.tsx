import axios from "axios"
import ChatBox from "./components/chatBox/chatBox"
import { createContext, useEffect, useReducer } from "react"


type Action = {
  type: string,
  payload?: any
}

type userTheme = Array<string>

type Store = {
  selected_users_list: Array<{ user_name: string, user_id: number, expired: number, user_color: string }> | null
  messages: Array<{ name: string, message: string }> | null,
  user_name: string,
  usersList: Array<{ user_name: string, user_id: number, expired: number, user_color: string }> | null,
  user_id: number,
  userColor: string,
  userTheme: userTheme,
  activeWindow: null | string,
  userFont: string | null,
  users: boolean
}

export const userTheme = ["regular", "acid", "mams", "dark"]

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
  userFont: "regular",
  userTheme: userTheme,
  user_id: Math.ceil(Math.random() * 100000000),
  activeWindow: null,
  users: true
}

function reducer(state: Store, action: Action): Store {
  switch (action.type) {
    case "set_active_window": {
      return { ...state, activeWindow: action.payload }
    }
    case "resive_messages": {
      return { ...state, messages: action.payload }
    }
    case "resive_users": {
      return { ...state, usersList: action.payload }
    }
    case "toggle_users": {
      return { ...state, users: !state.users }
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
    case "change_font":
      let tempObject = localStorage.getItem("user_settings")
      console.log(action.payload)
      if (tempObject !== null) {
        let parsedObject = JSON.parse(tempObject)
        parsedObject.fontName = action.payload
        localStorage.setItem("user_settings", JSON.stringify(parsedObject))
      }
      return { ...state, userFont: action.payload }
    case "set_user": {
      return {
        ...state,
        user_name: action.payload.name,
        userColor: action.payload.color,
        userFont: action.payload.fontName,
        userTheme: action.payload.theme
      }
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
    case "change_theme":
      let tempObjectTheme = localStorage.getItem("user_settings")
      let tempValue = state.userTheme[0]
      let tempArray = [...state.userTheme.slice(1)]
      tempArray.push(tempValue)
      if (tempObjectTheme !== null) {
        let parsedObject = JSON.parse(tempObjectTheme)
        parsedObject.theme = tempArray
        localStorage.setItem("user_settings", JSON.stringify(parsedObject))
      }
      return { ...state, userTheme: [...tempArray] }
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
    axios.get(import.meta.env.VITE_SERVER + "chat-api/init-get-messages", {
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
