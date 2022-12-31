import { React, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import styles from "../Styles/EmailSignup.module.css";
import { GrFormClose } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import createUserDB from "../Utilities/createUserDB";
import LoadingButton from "./LoadingButton";
import { firebaseStorage } from "../Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default function EmailSignup({
  setSignedIn,
  setLoading,
  loading,
  setUserData,
}) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [modal, setModal] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  //handling email signup with Firebase
  async function handleEmailSignup(e) {
    e.preventDefault();
    setLoading(true);
    //creating new user in firebase auth
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //uploading image to firebase storage and getting url
      const storageRef = ref(
        firebaseStorage,
        `profileImages/${auth.currentUser?.uid}`
      );
      await uploadBytes(storageRef, file);
      const imageurl = await getDownloadURL(storageRef);

      //updating user auth profile with display name and image url
      await updateProfile(auth.currentUser, {
        photoURL: imageurl,
        displayName: displayName,
      });

      //creating new user in firestore
      await createUserDB(newUser.user);

      //get data from user document in firestore
      const docRef = doc(db, "Users", `${auth.currentUser.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        localStorage.setItem("localUser", JSON.stringify(docSnap.data()));
      } else {
        console.log("No such document!");
      }

      //store firestore user data in state
      const data = localStorage.getItem("localUser");
      setUserData(JSON.parse(data));

      setLoading(false);
      setSignedIn(true);
      navigate("/Home");
    } catch (error) {
      setAuthError(error.code);
      setLoading(false);
      console.log(authError);
      console.log(error);
    }
  }

  //reset email and password on modal close click
  function resetModal() {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setAuthError("");
    setErrorMessage("");
  }

  function toggleModal() {
    setModal(!modal);
    resetModal();
  }

  return (
    <div>
      <label
        onClick={toggleModal}
        className={styles.emailSignupBtn}
        htmlFor="signup-modal"
      >
        Sign up with email
      </label>
      <div className={"modal backdrop-blur-sm bord " + (modal && "modal-open")}>
        <div className="modal-box relative h-[480px] bg-black flex flex-col justify-center gap-8 items-center">
          <label
            onClick={toggleModal}
            htmlFor="signup-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            <GrFormClose fontSize="1.5em" />
          </label>
          <h2 className="w-full text-center text-base font-bold">
            Create your account
          </h2>
          <form onSubmit={handleEmailSignup} className={styles.form}>
            <input
              className={styles.input}
              onChange={(e) => setDisplayName(e.target.value)}
              type="text"
              placeholder="Username"
              minLength="4"
              value={displayName}
              required
            />
            <input
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              value={email}
              required
            />
            <input
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              minLength="8"
              value={password}
              required
            />
            <input
              id="file"
              type="file"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-xs text-[#8e8e8e]
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-stone-800 file:text-[#1c9bf0]
      file:hover:bg-stone-700 
      pl-0
      file:hover:cursor-pointer
    "
            />
            {loading ? (
              <LoadingButton bgcolor="#1c9bf0" color="white" />
            ) : (
              <button className={styles.button}>Sign Up</button>
            )}
            <ErrorMessage
              authError={authError}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </form>
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
    } else if (authError) {
      setErrorMessage("There was an error trying to signup. Please try again");
    }
  }, [authError, setErrorMessage]);

  return (
    <div className={styles.error}>
      {errorMessage && <p>⚠️&nbsp; {errorMessage}</p>}
    </div>
  );
}
