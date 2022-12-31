import { React, useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import GoogleSignup from "./GoogleSignup";
import styles from "../Styles/Signin.module.css";
import LoadingButton from "./LoadingButton";
import { GrFormClose } from "react-icons/gr";
import { BsTwitter } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function SignIn({
  setSignedIn,
  loading,
  setLoading,
  setUserData,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  async function handleEmailSignin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      //sign into firebase auth
      await signInWithEmailAndPassword(auth, email, password);

      //get data from user document in firestore which has more data, not from firebase auth
      const docRef = doc(db, "Users", `${auth.currentUser.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        localStorage.setItem("localUser", JSON.stringify(docSnap.data()));
      } else {
        console.log("No such document!");
      }

      // //store user data in state
      const data = localStorage.getItem("localUser");
      setUserData(JSON.parse(data));

      setLoading(false);
      setSignedIn(true);
      navigate("/home");
    } catch (error) {
      setAuthError(error.code);
      setLoading(false);
    }
  }

  //reset email and password on modal close click
  function resetModal() {
    setEmail("");
    setPassword("");
    setAuthError(null);
    setErrorMessage("");
  }

  //toggle modal
  function toggleModal() {
    setModal(!modal);
    resetModal();
  }

  return (
    <div>
      <label
        onClick={toggleModal}
        htmlFor="signin-modal"
        className={styles.button}
      >
        Sign In
      </label>
      <div className={"modal backdrop-blur-sm bord " + (modal && "modal-open")}>
        <div className="modal-box relative h-[38rem] bg-black flex flex-col justify-center gap-12 items-center">
          <label
            onClick={toggleModal}
            htmlFor="signin-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            <GrFormClose fontSize="1.5em" />
          </label>
          <div className="h-full flex items-center flex-col">
            <BsTwitter fontSize="2em" />
            <h2 className="mt-5 mb-5">Sign in to Twitter</h2>
            <GoogleSignup
              text="Sign in with Google"
              setUserData={setUserData}
              setLoading={setLoading}
              setSignedIn={setSignedIn}
            />
            <div className="divider text-s">or</div>
            <form onSubmit={handleEmailSignin} className={styles.form}>
              <input
                className={styles.input}
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                minLength="8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loading ? (
                <LoadingButton bgcolor="white" color="black" />
              ) : (
                <button className={styles.signinButton}>Sign In</button>
              )}
              <ErrorMessage
                authError={authError}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            </form>
            <button
              onClick={() => alert("Under Construction 🚧")}
              className={styles.forgotButton}
            >
              Forgot Password?
            </button>
            <p onClick={toggleModal} className="mt-5 text-sm text-zinc-400 ">
              Don't have an account?{" "}
              <span className="hover:cursor-pointer text-sky-500">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ authError, errorMessage, setErrorMessage }) {
  useEffect(() => {
    if (authError === "auth/invalid-email") {
      setErrorMessage("Please enter a valid email address");
    } else if (authError === "auth/weak-password") {
      setErrorMessage("Password must be at least 8 characters");
    } else if (authError === "auth/email-already-in-use") {
      setErrorMessage("Email already in use");
    } else if (authError === "auth/wrong-password") {
      setErrorMessage("Incorrect password. Please try again");
    } else if (authError === "auth/user-not-found") {
      setErrorMessage("No account exists with this email");
    } else if (authError) {
      setErrorMessage("There was an error trying to signin. Please try again");
    }
  }, [authError, setErrorMessage]);

  return (
    <div className=" text-xs text-slate-400">
      {errorMessage && <p>⚠️&nbsp; {errorMessage}</p>}
    </div>
  );
}
