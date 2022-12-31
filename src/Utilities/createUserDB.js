import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default async function createUserDB(data) {
  // Add a new user in collection "users"
  try {
    await setDoc(doc(db, "Users", `${data.uid}`), {
      email: data.email,
      uid: data.uid,
      displayName: data.displayName,
      creationTime: data.metadata.creationTime,
      photoURL: data.photoURL,
      website: "",
      location: "",
      bio: "",
      bannerURL: "",
      name: "",
      followers: [],
      following: [],
      bookmarks: [],
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
