import { AiFillCheckCircle } from "react-icons/ai";
import { React } from "react";

export default function Notification({ showNotification }) {
  return (
    <div
      className={
        showNotification
          ? "z-10 fixed bottom-4 rounded-md bg-sky-50 p-4 transition-all duration-1000 ease-in-out"
          : "fixed -bottom-full rounded-md bg-sky-50 p-4 transition-all duration-1000 ease-in-out"
      }
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AiFillCheckCircle
            className="h-5 w-5 text-sky-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-sky-800">
            Successfully deleted
          </p>
        </div>
        <div className="ml-auto pl-3"></div>
      </div>
    </div>
  );
}
