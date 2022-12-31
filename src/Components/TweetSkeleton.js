import React from "react";
import Skeleton from "react-loading-skeleton";

export function TweetSkeleton() {
  return (
    <div className="w-full flex flex-row p-4 h-auto border-b border-[#434343c4] border-solid">
      <div className="flex items-start min-h-full mr-3 w-12 min-w-[48px]">
        <Skeleton circle={true} height={40} width={40} />
      </div>
      <div className="w-full">
        <div className="mt-3 mb-3">
          <Skeleton />
        </div>
        <div className="mt-3 mb-3">
          <Skeleton />
        </div>
        <div className="mt-3 mb-3">
          <Skeleton />
        </div>
      </div>
    </div>
  );
}

export function TweetPageSkeleton() {
  return (
    <div id="tweetPageTweet" className="w-full h-auto p-4">
      <div className="flex flex-row justify-start items-center gap-6 min-h-16">
        <Skeleton circle={true} height={40} width={40} />
        <div className="w-[120px]">
          <Skeleton height={20} count={2} className="pt-2" />
        </div>
      </div>
      <Skeleton height={20} count={2} className="pt-2 w-full" />
      <div className="w-1/2 pt-1">
        <Skeleton height={20} />
      </div>
      <div className="w-2/3 pt-4">
        <Skeleton height={20} />
      </div>
      <div className="w-full pt-4">
        <Skeleton height={40} />
      </div>
    </div>
  );
}
