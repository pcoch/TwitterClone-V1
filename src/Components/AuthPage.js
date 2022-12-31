import { React, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import EmailSignup from "./EmailSignup";
import SignIn from "./SignIn.js";
import GoogleSignup from "./GoogleSignup";
import logo from "../Assets/twitter.png";
import styles from "../Styles/HomeAuth.module.css";

export default function AuthPage({ signedIn, setSignedIn, setUserData }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <img className={styles.logo} src={logo} alt="logo"></img>
      </div>
      <div className={styles.rightContainer}>
        <BsTwitter className={styles.logoSmall} />
        <h1 className="my-10 text-5xl font-bold">Happening Now</h1>
        <h2 className="mb-10 font-bold">Join Twitter Today.</h2>
        <div className={styles.signupContainer}>
          <GoogleSignup
            text="Sign up with Google"
            setSignedIn={setSignedIn}
            signedIn={signedIn}
            loading={loading}
            setLoading={setLoading}
            setUserData={setUserData}
          />
          <EmailSignup
            setSignedIn={setSignedIn}
            signedIn={signedIn}
            setLoading={setLoading}
            loading={loading}
            setUserData={setUserData}
          />
        </div>
        <div className={styles.authContainer}>
          <p>
            By signing up, you agree to the
            <span style={{ color: "#1c9bf0" }}> Terms of Service</span> and
            <span style={{ color: "#1c9bf0" }}> Privacy Policy</span>, including
            Cookie Use.
          </p>
          <h3>Already have an account?</h3>
          <SignIn
            setSignedIn={setSignedIn}
            setLoading={setLoading}
            loading={loading}
            setUserData={setUserData}
          />
        </div>
      </div>
    </div>
  );
}
