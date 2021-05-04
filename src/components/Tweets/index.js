import { useEffect, useState } from "react";
import { Tweet } from "react-twitter-widgets";

const Tweets = ({ tweets, link, currentTab }) => {
  const [limit, setLimit] = useState(9);
  const [toggleShow, setToggleShow] = useState(true);

  useEffect(() => {
    if (tweets?.length !== 0) {
      if (limit + 10 > tweets?.length) {
        setLimit(tweets?.length);
      } else {
        setLimit((prev) => prev + 10);
      }
    }
  }, [toggleShow]);

  if (!link) return <p className="text-center my-4">Search to fetch tweets</p>;
  return (
    <div className="mx-5">
      <div className="w-full flex flex-col items-center">
        {link && (
          <div className="mb-4 flex flex-col items-center">
            {tweets?.length === 0 && (
              <p className="my-4 font-bold text-lg">Fetching tweets...</p>
            )}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-red-400 text-white rounded font-bold text-base hover:text-white hover:bg-danger-red transition-colors delay-75 ease-in"
            >
              Twitter Link
            </a>
          </div>
        )}
        {tweets &&
          tweets.slice(0, limit).map((tweet, i) => (
            <div
              className="w-full flex justify-center my-4 tweetWrapper"
              key={i}
            >
              <Tweet tweetId={tweet} />
            </div>
          ))}
        {tweets && limit < tweets.length && (
          <button
            onClick={() => setToggleShow((prev) => !prev)}
            className="py-2 px-4 bg-theme-color text-white rounded font-bold text-base"
          >
            Load More tweets
          </button>
        )}
      </div>
    </div>
  );
};

export default Tweets;
