import { Button } from "antd";
import { useEffect, useState } from "react";
import TweetCard from "../TweetCard";

const Tweets = ({ tweets, link, currentTab }) => {
  const [limit, setLimit] = useState(0);
  const [toggleShow, setToggleShow] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tweets?.length !== 0) {
      setLoading(true);
      if (limit + 5 > tweets?.length) {
        setLimit(tweets?.length);
      } else {
        setLimit((prev) => prev + 5);
      }
      setLoading(false);
    }
  }, [toggleShow]);

  if (!link)
    return <p className="text-center my-4 w-full">Search to fetch tweets</p>;
  return (
    <div className="mx-5">
      <div className="w-full flex flex-col items-center">
        {link && (
          <div className="mb-4 flex flex-col items-center">
            {tweets?.length === 0 && (
              <p className="my-4 font-bold text-lg text-center">
                Fetching tweets...
              </p>
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
        {tweets && tweets.length > 0 ? (
          tweets.slice(0, limit).map((tweet, i) => (
            <div
              className="w-full flex justify-center my-4 tweetWrapper"
              key={i}
            >
              <TweetCard tweetId={tweet} />
            </div>
          ))
        ) : (
          <div className="my-4 font-bold text-lg">
            No tweets found. Try clicking the link
          </div>
        )}
        {tweets && limit < tweets.length && (
          <Button
            onClick={() => setToggleShow((prev) => !prev)}
            className="py-2 my-4 px-4 bg-theme-color text-white rounded font-bold text-base focus:bg-theme-color focus:text-white hover:bg-theme-color hover:text-white"
            loading={loading}
            size="large"
          >
            Load More tweets
          </Button>
        )}
      </div>
    </div>
  );
};

export default Tweets;
