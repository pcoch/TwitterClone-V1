import { React, useState } from "react";
import AvatarLarge from "./AvatarLarge";
import EditProfileForm from "./EditProfileForm";
import BannerImage from "./BannerImage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../Firebase";

export default function EditProfile({ userData, setUserData, profileData }) {
  const [name, setName] = useState(userData.name || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [location, setLocation] = useState(userData.location || "");
  const [website, setWebsite] = useState(userData.website || "");
  const [photoURL, setPhotoURL] = useState(userData.photoURL || "");
  const [bannerURL, setBannerURL] = useState(userData.bannerURL || "");

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEditProfileSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // update firestore user data if a field has changed
      if (userData.name !== name) {
        await updateDoc(doc(db, "Users", `${userData.uid}`), {
          name: name,
        });
      }

      if (userData.bio !== bio) {
        await updateDoc(doc(db, "Users", `${userData.uid}`), {
          bio: bio,
        });
      }

      if (userData.location !== location) {
        await updateDoc(doc(db, "Users", `${userData.uid}`), {
          location: location,
        });
      }

      if (userData.website !== website) {
        await updateDoc(doc(db, "Users", `${userData.uid}`), {
          website: website,
        });
      }

      if (userData.photoURL !== photoURL) {
        const storageRef = ref(
          firebaseStorage,
          `profileImages/${userData.uid}`
        );
        await uploadBytes(storageRef, photoURL);
        const imageurl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "Users", `${userData.uid}`), {
          photoURL: imageurl,
        });
      }

      if (userData?.bannerURL !== bannerURL) {
        const storageRef = ref(firebaseStorage, `bannerImages/${userData.uid}`);
        await uploadBytes(storageRef, bannerURL);
        const imageurl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "Users", `${userData.uid}`), {
          bannerURL: imageurl,
        });
      }

      //get data from firestore user document and store in state and local storage
      const docRef = doc(db, "Users", `${userData.uid}`);
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
      toggleModal();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  //reset state on modal close without save
  function exitModal() {
    toggleModal();
    setName(userData.name);
    setBio(userData.bio || "");
    setLocation(userData.location || "");
    setWebsite(userData.website || "");
  }

  //handling modal open and close
  function toggleModal() {
    setModal(!modal);
  }

  return (
    <div>
      <label
        onClick={toggleModal}
        htmlFor="my-modal-3"
        className="text-white text-sm font-bold flex justify-center items-center mr-4 rounded-full h-[36px] w-[110px] hover:bg-gray-900 cursor-pointer outline-1 outline pt-[2px] outline-gray-600"
      >
        Edit Profile
      </label>
      <div className={"modal bg-slate-700/50 " + (modal && "modal-open")}>
        <div className="modal-box bg-black p-0 overflow-scroll ">
          <div className="sticky z-10 top-0 flex flex-row w-full gap-10 items-center px-6 min-h-[58px] bg-black bg-opacity-75">
            <label
              htmlFor="my-modal-3"
              className="text-lg font-extrabold cursor-pointer text-white"
              onClick={exitModal}
            >
              ✕
            </label>
            <h3 className="font-bold text-lg text-white">Edit Profile</h3>
            <button
              type="button"
              className="text-black bg-white hover:brightness-90 font-medium rounded-full text-sm px-4 py-1.5 text-center absolute right-6"
              onClick={handleEditProfileSubmit}
            >
              {loading ? "Saving" : "Save"}
            </button>
          </div>
          <div className="w-full max-h-[200px] min-h-[200px] bg-gray-500 relative">
            <BannerImage
              editBtn={true}
              bannerURL={bannerURL}
              setBannerURL={setBannerURL}
              profileData={profileData}
              userData={userData}
            />
            <AvatarLarge
              userData={userData}
              editBtn={true}
              setPhotoURL={setPhotoURL}
              photoURL={photoURL}
              profileData={profileData}
            />
          </div>
          <EditProfileForm
            userData={userData}
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
            location={location}
            setLocation={setLocation}
            website={website}
            setWebsite={setWebsite}
          />
        </div>
      </div>
    </div>
  );
}
