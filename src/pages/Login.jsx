import "../css/login.css"
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiFillFacebook } from 'react-icons/ai';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { AuthContext } from "../../context";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";

const Login = () => {
  const googleProvider = new GoogleAuthProvider();
  const navigation = useNavigate();
  const location = useLocation();
  const [user, loading] = useAuthState(auth);
  const { state, dispatch, moodOfTheDay} = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = location.state?.path || '/';

  const googleLogin = async () => {
    try {
       const result = await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error)
    }
  }

  const emailLogin = async (e) => {
    e.preventDefault();
    
    if (state.email && state.password) {
       dispatch({ type: "passwordValidation" });
  
       try {
          const result = await signInWithEmailAndPassword(
            auth,
            state.email,
            state.password
          ).then(
            dispatch({
              type: "clearField",
            })
          );
      }catch (error) {
        if (error.code === 'auth/user-not-found') {
          dispatch({ type: 'wrongCredential', payload: 'Invalid email address. Please try again.' });
        }
        else if (error.code === 'auth/wrong-password') {
          dispatch({ type: 'wrongCredential', payload: 'Invalid password. Please try again.' });
        } else {
          dispatch({ type: 'wrongCredential', payload: 'An error occurred. Please try again.' });
        }
      }
      }else {
        dispatch({
          type: "setError",
          payload: "Please fill in all fields",
        });
    } 
  };

  const toogleEyeIcon = () => {
   return setShowPassword(!showPassword)
  }

  useEffect(() => {
    if(user && moodOfTheDay !== ""){
      navigation(redirectPath, { replace: true })
    }
    if(user && moodOfTheDay === ""){
      navigation("/mood")
    }
  }, [user])

  return (
    <div className='login flex justify-center item-center h-screen'>
      <div className="login-container w-[90%] md:w-[60%] lg:w-[40%]">
      <h1 className="text-3xl font-semibold text-[#292b4c] mb-6 text-center">Welcome back</h1>
      <div className="log-in-btn mb-5 mx-auto">
        <div className="py-3 px-1 sm:px-5 lg:px-10 shadow-md mb-1 flex gap-5 items-center justify-between rounded-md">
        <FcGoogle className="text-2xl"/>
        <button className="text-[#292b4c]" onClick={googleLogin}> Log in with google</button>
        <div></div>
        </div>
      </div>

      <p className="text-center mb-3 text-[#292b4c]">Don't have an account? <Link to="/signin" className="font-semibold"> Sign up </Link></p>


      <form 
      onSubmit={(e) => {emailLogin(e)}} className="flex flex-col text-[#292b4c] px-2">
        <label>Email Address</label>
        <input type="email" value={state.email} 
        onChange={(e) => { 
          dispatch({type: "setEmail", payload: e.target.value})
          dispatch({type: "clearErrorMsg"})
        }} 
        className="bg-gray-200 p-2 my-2 outline-none"/>

        <label>Password</label>
        <div className="bg-gray-200 mb-5 flex justify-between items-center py-1 px-2">
        <input type={showPassword ? "text" : "password"} value={state.password} onChange={(e) => dispatch({type: "setPassword", payload: e.target.value})} className="bg-gray-200  mt-2 outline-none"/> <span onClick={toogleEyeIcon} className="text-lg">{showPassword ? <FaEyeSlash /> : <FaEye />}</span></div>

        { state.error && <p>{state.errorMsg}</p> }

        <button className="text-white bg-[#292b4c] p-2 rounded-md">Log In</button>
        <p className="text-center text-sm mt-2 cursor-pointer">Forgot Password?</p>
      </form>
      </div>
    </div>
  )
}

export default Login
