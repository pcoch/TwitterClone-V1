import "./App.css";
import { React, useState, useEffect } from "react";
import AuthPage from "./Components/AuthPage";
import Home from "./Components/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Profile from "./Components/Profile";
import TweetPage from "./Components/TweetPage";
import { db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import Following from "./Components/Following";
import Followers from "./Components/Followers";
import Bookmarks from "./Components/Bookmarks";
import Messages from "./Components/Messages";
import Explore from "./Components/Explore";
import Notifications from "./Components/Notifications";
import NotFound from "./Components/NotFound";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [newModalTweet, setNewModalTweet] = useState(false);

  const Navigate = useNavigate();

  useEffect(() => {
    //check if local storage exists to determine if user is signed in, else check FB
    if (localStorage.getItem("localUser")) {
      setSignedIn(true);
    }

    if (!localStorage.getItem("localUser")) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setSignedIn(true);
        } else {
          setSignedIn(false);
        }
      });
    }
  }, [signedIn]);

  //update userData state on page refresh
  useEffect(() => {
    async function getUserData() {
      //check if userData exists in local storage if signed in
      if (localStorage.getItem("localUser")) {
        setUserData(JSON.parse(localStorage.getItem("localUser")));
      } else {
        //if userData does not exist in local storage, get it from the db
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", `${user.uid}`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            localStorage.setItem("localUser", JSON.stringify(docSnap.data()));
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      }
    }
    getUserData();
  }, []);

  //redirect to home page if signed in and on auth page
  useEffect(() => {
    if (signedIn && window.location.pathname === "/auth") {
      Navigate("/home");
    }
    //redirect to auth page if not signed in and on home page
    if (!signedIn && window.location.pathname !== "/auth") {
      Navigate("/auth");
    }
  }, [signedIn, Navigate]);

  return (
    <div className="bg-black min-h-screen">
      <Routes>
        <Route
          path="auth"
          element={
            <AuthPage setSignedIn={setSignedIn} setUserData={setUserData} />
          }
        />
        <Route
          path="home"
          element={
            <Home
              setSignedIn={setSignedIn}
              signedIn={signedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/"
          element={
            <Home
              setSignedIn={setSignedIn}
              signedIn={signedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="profile/:displayName"
          element={
            <Profile
              showNotification={showNotification}
              setShowNotification={setShowNotification}
              setSignedIn={setSignedIn}
              signedIn={signedIn}
              userData={userData}
              setUserData={setUserData}
              newModalTweet={newModalTweet}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/:userId/:tweetId"
          element={
            <TweetPage
              setShowNotification={setShowNotification}
              setSignedIn={setSignedIn}
              signedIn={signedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/following"
          element={
            <Following
              setSignedIn={setSignedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/followers"
          element={
            <Followers
              setSignedIn={setSignedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/bookmarks"
          element={
            <Bookmarks
              setSignedIn={setSignedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/notifications"
          element={
            <Notifications
              setSignedIn={setSignedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/messages"
          element={
            <Messages
              setSignedIn={setSignedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="/explore"
          element={
            <Explore
              setSignedIn={setSignedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
        <Route
          path="*"
          element={
            <NotFound
              setSignedIn={setSignedIn}
              userData={userData}
              setUserData={setUserData}
              setNewModalTweet={setNewModalTweet}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
