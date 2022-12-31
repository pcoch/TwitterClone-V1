import { React } from "react";

export default function EditProfileForm({
  name,
  setName,
  bio,
  setBio,
  location,
  setLocation,
  website,
  setWebsite,
}) {
  return (
    <div className="w-full h-full p-4 mt-16">
      <form>
        <EditProfileInput
          type="text"
          stateType={setName}
          state={name}
          span="Name"
          maxLength={"50"}
        />
        <EditProfileInput
          type="text"
          stateType={setBio}
          state={bio}
          span="Bio"
          maxLength={"160"}
        />
        <EditProfileInput
          type="text"
          stateType={setLocation}
          state={location}
          span="Location"
          maxLength={"30"}
        />
        {/* <EditProfileInput
          type="text"
          stateType={setWebsite}
          state={website}
          span="Website"
          maxLength={"30"}
        /> */}
      </form>
    </div>
  );
}

function EditProfileInput({ type, stateType, state, span, maxLength }) {
  return (
    <div className="relative mb-6">
      <input
        type={type}
        maxLength={maxLength}
        className="relative w-full rounded min-h-[65px] text-base pt-4 focus:outline-none focus:border-sky-500 border-1 peer"
        onChange={(e) => stateType(e.target.value)}
        value={state}
        autoFocus
      ></input>
      <span className="absolute top-3 left-3 text-xs peer-focus:text-sky-500">
        {span}
      </span>
      <span className="absolute right-3 top-3 text-xs peer-focus:block hidden">
        {state?.length}/{maxLength}
      </span>
    </div>
  );
}
