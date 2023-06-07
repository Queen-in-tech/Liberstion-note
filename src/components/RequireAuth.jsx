import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../utils/firebase";
import { Navigate } from "react-router-dom";

const RequireAuth = ({children}) => {
  const [user, loading] = useAuthState(auth)
  

  if(!user){
    return <Navigate to='/login' state={{ path: location.pathname }} />
  }
    
  return children
}

export default RequireAuth
