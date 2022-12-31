import React, { useRef, useEffect, useState } from "react";
import Picker from "emoji-picker-react";
import ProfileAvatar from "./ProfileAvatar";
import TextareaAutosize from "react-textarea-autosize";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import createTweetDB from "../Utilities/createTweetDB";
import createReplyTweetDB from "../Utilities/createReplyTweetDB";
import { useNavigate } from "react-router-dom";

export default function Tweetbox({
  userData,
  reply,
  tweetData,
  noBorder,
  modal,
  setOpen,
  setNewReply,
  setNewModalTweet,
}) {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState(null);
  const [placeholderImg, setPlaceholderImg] = useState(null);
  const [caretPosition, setCaretPosition] = useState(0);
  const [caretPositionEnd, setCaretPositionEnd] = useState(0);
  const [tweetLoading, setTweetLoading] = useState(false);

  const navigate = useNavigate();

  const inputRef = useRef();

  function updateCaretPosition(e) {
    setCaretPosition(e.target.selectionStart);
    setCaretPositionEnd(e.target.selectionEnd);
  }

  //handle tweet btn on click
  async function handleTweet() {
    try {
      setTweetLoading(true);
      modal && setNewModalTweet(true);
      await createTweetDB(tweetMessage, tweetImage, userData);

      setTimeout(() => {
        setTweetLoading(false);
        setTweetMessage("");
        setTweetImage(null);
        setPlaceholderImg(null);

        modal && setOpen(false);
        modal && setNewModalTweet(false);
      }, 250);
    } catch (error) {
      console.log(error);
    }
  }

  //handle tweet reply btn on click
  async function handleReplyTweet() {
    try {
      setTweetLoading(true);
      setNewReply(true);
      await createReplyTweetDB(tweetMessage, userData, tweetData);
      setTimeout(() => {
        setTweetLoading(false);
        setTweetMessage("");
        setNewReply(false);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`flex flex-col p-4 w-full ${
        !noBorder && "border-b border-[#434343c4] border-solid"
      }`}
    >
      {reply && (
        <div className="pl-20 pt-4 flex justify-start items-center text-sm">
          <p className="text-gray-500">
            Replying to{" "}
            <span className="font-semibold text-sky-500 cursor-pointer hover:underline">
              {tweetData.displayName ? (
                <span
                  onClick={() => navigate(`/profile/${tweetData?.displayName}`)}
                >
                  @{tweetData?.displayName}
                </span>
              ) : null}
            </span>
          </p>
        </div>
      )}
      <div
        className={`pb-4 flex flex-row gap-6 w-full h-auto ${!reply && "pt-4"}`}
      >
        <ProfileAvatar userData={userData} nav />
        <div className="flex flex-col w-full">
          <TextareaAutosize
            id="tweetbox"
            ref={inputRef}
            maxLength="120"
            className="textarea bg-black w-full overflow-y-auto resize-none h-auto min-h-[50px] text-white text-lg focus:outline-none"
            placeholder={reply ? "Tweet your reply" : "What's Happening?"}
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            onClick={updateCaretPosition}
            onKeyUp={updateCaretPosition}
          />
          {placeholderImg && (
            <div>
              <CloseBtn
                setPlaceholderImg={setPlaceholderImg}
                setTweetImage={setTweetImage}
                placeholderImg={placeholderImg}
              />
              <img
                className=" rounded-xl max-h-[90%] max-w-auto"
                src={placeholderImg}
                alt={placeholderImg}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="ml-20 flex flex-row w-full items-center gap-3">
          {!reply && (
            <ImageSelector
              setTweetImage={setTweetImage}
              setPlaceholderImg={setPlaceholderImg}
            />
          )}
          <EmojiSelector
            setTweetMessage={setTweetMessage}
            inputRef={inputRef}
            tweetMessage={tweetMessage}
            caretPosition={caretPosition}
            setCaretPosition={setCaretPosition}
            caretPositionEnd={caretPositionEnd}
            setCaretPositionEnd={setCaretPositionEnd}
          />
        </div>

        {tweetLoading ? (
          <LoadingTweetBtn />
        ) : reply ? (
          <button
            disabled={tweetMessage.length === 0}
            type="button"
            className={
              "hover:brightness-90 font-medium text-white bg-[#1c9bf0] rounded-full text-sm flex justify-center items-center min-h-[40px] h-[40px] min-w-[84px] w-[84px] text-center" +
              (tweetMessage.length === 0
                ? " opacity-50 hover:brightness-100"
                : "")
            }
            onClick={() => handleReplyTweet()}
          >
            Reply
          </button>
        ) : (
          <button
            disabled={tweetMessage.length === 0}
            type="button"
            className={
              "hover:brightness-90 font-medium text-white bg-[#1c9bf0] rounded-full text-sm flex justify-center items-center min-h-[40px] h-[40px] min-w-[84px] w-[84px] text-center" +
              (tweetMessage.length === 0
                ? " opacity-50 hover:brightness-100"
                : "")
            }
            onClick={() => handleTweet()}
          >
            Tweet
          </button>
        )}
      </div>
    </div>
  );
}

//handles adding emojis to tweet
function EmojiSelector({
  caretPosition,
  setCaretPosition,
  caretPositionEnd,
  setCaretPositionEnd,
  tweetMessage,
  setTweetMessage,
  inputRef,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();
  const emojiBtnRef = useRef();

  //handle click on emoji seleciton in picker
  const onEmojiClick = (event, emojiObject) => {
    setTweetMessage((prevInput) =>
      [
        tweetMessage.slice(0, caretPosition),
        emojiObject.emoji,
        tweetMessage.slice(caretPosition),
      ].join("")
    );
    setShowEmojiPicker(false);
    setCaretPosition(caretPosition + 1);
    setCaretPositionEnd(caretPositionEnd + 1);
    inputRef.current.focus();
  };

  //handle caret position after emoji is added
  useEffect(() => {
    inputRef.current.selectionStart = caretPosition;
    inputRef.current.selectionEnd = caretPositionEnd;
  }, [caretPosition, caretPositionEnd, inputRef]);

  //handle click outside emojiPicker to close + emoji btn to open
  useEffect(() => {
    function handler(event) {
      if (
        !emojiPickerRef.current.contains(event.target) &&
        !emojiBtnRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (event.target === emojiBtnRef.current) {
        setShowEmojiPicker(!showEmojiPicker);
      }
    }
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showEmojiPicker]);

  return (
    <div className="relative">
      <div ref={emojiBtnRef} className="cursor-pointer">
        <HiOutlineEmojiHappy className="stroke-[#1c9bf0] h-6 w-auto pointer-events-none" />
      </div>
      <div
        ref={emojiPickerRef}
        className={`${
          showEmojiPicker ? "absolute left-3" : "absolute left-3 hidden"
        }`}
      >
        <Picker
          onEmojiClick={onEmojiClick}
          pickerStyle={{
            boxShadow: "none",
            backgroundColor: "white",
          }}
          disableSkinTonePicker={true}
          disableSearchBar={true}
        />
      </div>
    </div>
  );
}

function ImageSelector({ setTweetImage, setPlaceholderImg }) {
  function handleFile(e) {
    const file = e.target.files[0];
    setTweetImage(file);
    const img = URL.createObjectURL(file);
    setPlaceholderImg(img);
  }
  return (
    <>
      <label
        className="z-10 relative h-[24px] w-[24px] cursor-pointer"
        htmlFor="tweetImgBtn"
      >
        <IoImageOutline className="stroke-[#1c9bf0] h-6 w-auto cursor-pointer" />
      </label>
      <input
        id="tweetImgBtn"
        type="file"
        className="h-[24px] w-[24px] p-0 cursor-pointer opacity-0 fixed"
        onChange={handleFile}
        onClick={setTweetImage}
      />
    </>
  );
}

function LoadingTweetBtn() {
  return (
    <button
      disabled
      type="button"
      className="text-white bg-[#1c9bf0] rounded-full text-sm flex justify-center items-center min-h-[40px] h-[40px] min-w-[84px] w-[84px] text-center"
    >
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </button>
  );
}

function CloseBtn({ setPlaceholderImg, setTweetImage, placeholderImg }) {
  const onClose = () => {
    URL.revokeObjectURL(placeholderImg);
    setPlaceholderImg(null);
    setTweetImage(null);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      onClick={onClose}
      className="w-auto h-8 p-1 hover:bg-gray-900 text-gray-400 hover:text-gray-200 cursor-pointer rounded-full transition-all duration-200 ease-in-out"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
