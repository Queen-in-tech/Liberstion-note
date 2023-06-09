import { useReducer, createContext } from "react";
import { useState } from "react";

const AuthContext = createContext();

const initialState = {
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    error: false,
    errorMsg: ""
  }
  
  const reducer = (state, action) => {
  
    switch (action.type) {
      case"setEmail":
        return {...state, email: action.payload}
      case"setUsername":
        return {...state, username: action.payload}
      case"setPassword":
        return {...state, password: action.payload}
      case"setConfirmPassword":
        return {...state, confirmPassword: action.payload}  
      case "passwordValidation":
       if(state.password.length < 5){
          return {...state, error: true, errorMsg: "Password must be at least 6 characters long."}
        } else {
          return {...state, error: false};
        }
      case "confirmPasswordValidation":
       if(state.password !== state.confirmPassword){
          return {...state, error: true, errorMsg: "Passwords does not match."}
        } else {
          return {...state, error: false};
        }
      case "setError":
          return {...state, error: true, errorMsg: action.payload}
      case "clearErrorMsg":
          return {...state, errorMsg: action.payload}  
      case "clearField":
          return {...state, email: "", password: "", confirmPassword: "", username: ""};
      case "wrongCredential": 
        return {...state, error: true, errorMsg: action.payload};
      default:
        return state;
    }
  }

const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [dashboard, setDashboard] = useState(false)
  const [mood, setMood] = useState("")
  const [moodColor, setMoodColor] = useState("")
  const [moodOfTheDay, setMoodOfTheDay] = useState("")
  const [allMoodOfDay, setAllMoodOfDay] = useState([])


  return(
    <AuthContext.Provider value={{state, dispatch, dashboard, setDashboard, mood, setMood, moodColor, setMoodColor, moodOfTheDay, setMoodOfTheDay, allMoodOfDay, setAllMoodOfDay}}>
        {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext}