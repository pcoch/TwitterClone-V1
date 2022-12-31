import { React } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import styles from "../Styles/GoogleSignup.module.css";
import { useNavigate } from "react-router-dom";
import createUserDB from "../Utilities/createUserDB";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default function GoogleSignup({
  setUserData,
  setLoading,
  setSignedIn,
  text,
}) {
  const navigate = useNavigate();

  async function handleGoogleSignup() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const newUser = await signInWithPopup(auth, provider);

      const docRef = doc(db, "Users", `${auth.currentUser.uid}`);
      const docSnap = await getDoc(docRef);

      //if user exists, get data from firestore and login
      if (docSnap.exists()) {
        localStorage.setItem("localUser", JSON.stringify(docSnap.data()));
      } else {
        //if user doesn't exist, create user in firestore and set local storage
        await createUserDB(newUser.user);
        localStorage.setItem("localUser", JSON.stringify(newUser.user));
      }

      //store firestore user data in state
      const data = localStorage.getItem("localUser");
      setUserData(JSON.parse(data));

      setLoading(false);
      setSignedIn(true);
      navigate("/Home");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <button onClick={handleGoogleSignup} className={styles.googleSignupBtn}>
      <FcGoogle className="h-6 w-auto pr-3" />
      {text}
    </button>
  );
}

// //creating new user in firestore
// await createUserDB(newUser.user);

// //setting user in local storage
// localStorage.setItem("localUser", JSON.stringify(newUser.user));

// //getting user from local storage and setting state
// const data = localStorage.getItem("localUser");
// setUserData(JSON.parse(data));

// setLoading(false);
// setSignedIn(true);
// navigate("/Home");
