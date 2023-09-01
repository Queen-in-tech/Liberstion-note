import "../css/login.css";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiFillFacebook } from "react-icons/ai";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { setDoc, collection, serverTimestamp, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "../../context";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
  const googleProvider = new GoogleAuthProvider();
  const navigation = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const redirectPath = location.state?.path || "/";

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.password === state.confirmPassword) {
      setPassword(state.confirmPassword);
    }
  }, [state.confirmPassword]);

  const emailLogin = async (e) => {
    e.preventDefault();
    if (state.email && state.password) {
      dispatch({ type: "passwordValidation" });
      dispatch({ type: "confirmPasswordValidation" });
      dispatch({ type: "clearField" });

      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          state.email,
          password
        );

        await sendEmailVerification(result.user).then(() => {
          updateProfile(result.user, {
            displayName: `${state.username}`,
          });
        });

        return result;
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch({
        type: "setError",
        payload: "Please fill in all fields",
      });
    }
  };

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const confirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const createUsersDoc = async () => {
      if (user && user.uid) {
        toast.success(
          "Account created successfully, Please click on the link sent to your email for account verification."
        );
        navigation(redirectPath, { replace: true });

        const usersRef = doc(collection(db, "users"), user.uid);
        await setDoc(usersRef, {
          createdAccountOn: serverTimestamp(),
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
          .then(() => {
            console.log("User document created successfully!");
          })
          .catch((error) => {
            console.error("Error creating user document:", error);
          });
      }
    };

    createUsersDoc();
  }, [user]);

  return (
    <div className="login flex justify-center item-center h-screen">
      <div className="login-container w-[90%] md:w-[60%] lg:w-[40%]">
        <h1 className="text-2xl font-semibold text-[#292b4c] mb-6 text-center">
          Create an account
        </h1>
        <div className="log-in-btn mb-5 mx-auto">
          <div className="py-3 px-1 sm:px-5 lg:px-10 shadow-md mb-1 flex gap-5 items-center justify-between rounded-md">
            <FcGoogle className="text-2xl" />
            <button className="text-[#292b4c]" onClick={googleLogin}>
              {" "}
              Sign up with google
            </button>
            <div></div>
          </div>
        </div>

        <p className="text-center mb-3 text-[#292b4c]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold">
            {" "}
            Log in{" "}
          </Link>
        </p>

        <form
          onSubmit={(e) => {
            emailLogin(e);
          }}
          className="flex flex-col text-[#292b4c] px-2">
          <label>Email Address</label>
          <input
            type="email"
            value={state.email}
            onChange={(e) => {
              dispatch({ type: "setEmail", payload: e.target.value });
              dispatch({ type: "clearErrorMsg" });
            }}
            className="bg-gray-200 p-2 my-2 outline-none"
          />

          <label>Username</label>
          <input
            type="type"
            value={state.username}
            onChange={(e) => {
              dispatch({ type: "setUsername", payload: e.target.value });
            }}
            className="bg-gray-200 p-2 my-2 outline-none"
          />

          <label>Password</label>
          <div className="bg-gray-200 mb-5 flex justify-between items-center py-1 px-2">
            <input
              type={showPassword ? "text" : "password"}
              value={state.password}
              onChange={(e) =>
                dispatch({ type: "setPassword", payload: e.target.value })
              }
              className="bg-gray-200 px-2 mt-2 outline-none"
            />{" "}
            <span onClick={passwordVisibility} className="text-lg">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>Confirm password</label>
          <div className="bg-gray-200 mb-5 flex justify-between items-center py-1 px-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={state.confirmPassword}
              onChange={(e) =>
                dispatch({
                  type: "setConfirmPassword",
                  payload: e.target.value,
                })
              }
              className="bg-gray-200 px-2 mt-2 outline-none"
            />{" "}
            <span onClick={confirmPasswordVisibility} className="text-lg">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {state.error && <p>{state.errorMsg}</p>}

          <button className="text-white bg-[#292b4c] p-2 rounded-md">
            Create Account
          </button>
          <ToastContainer
            position="top-right"
            autoClose={7000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </form>
      </div>
    </div>
  );
};

export default Signin;
