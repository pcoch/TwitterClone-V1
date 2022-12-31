import { React } from "react";
import { TbCameraPlus } from "react-icons/tb";

export default function ChangeImgBtn({
  stateType,
  setPlaceholderImg,
  setPlaceholderAvatar,
}) {
  function handleFile(e) {
    const file = e.target.files[0];
    stateType(file);

    if (setPlaceholderImg) {
      const img = URL.createObjectURL(file);
      setPlaceholderImg(img);
    }

    if (setPlaceholderAvatar) {
      const img = URL.createObjectURL(file);
      setPlaceholderAvatar(img);
    }
  }

  return (
    <>
      <label
        className="btn btn-circle absolute opacity-70 border-none outline-none z-10"
        htmlFor="changeImg"
      >
        <TbCameraPlus className="text-white text-xl z-20" />
      </label>
      <input
        id="changeImg"
        type="file"
        className="z-10 btn btn-circle opacity-0 absolute cursor-pointer"
        onChange={handleFile}
        onClick={stateType}
      />
    </>
  );
}
