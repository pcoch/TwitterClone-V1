//this is a utility function for development to delete all documents in a collection, it is not used in the app
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default async function deleteDocuments() {
  const querySnapshot = await getDocs(collection(db, "Threads"));
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
}
