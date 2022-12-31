import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function TweetPageBar() {
  const navigate = useNavigate();
  return (
    <div className="min-w-full max-w-full flex justify-start min-h-auto z-10 bg-black pt-4 box-content sticky top-0 backdrop-blur-lg bg-black/60">
      <div className="flex justify-start items-center w-16 min-h-full pl-4">
        <span
          className="cursor-pointer hover:bg-[#1c1c1cc7] w-10 h-10 flex justify-center items-center rounded-3xl transition-all"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack color="white" fontSize="1.25em" />
        </span>
      </div>
      <div className="w-full h-full">
        <h3 className="text-lg text-gray-100 font-bold">Tweet</h3>
      </div>
    </div>
  );
}
