import { useState, useEffect } from "react";
import axios from "axios";
import { fetchTweetAst } from "static-tweets";
import { Tweet } from "react-static-tweets";
import { message } from "antd";

const Tweets = ({ tweets, link, currentTab }) => {
  const [tweetsJSON, setTweetsJSON] = useState([]);
  const [offset, setOffset] = useState();
  const [limit, setLimit] = useState();
  const [loadMore, setLoadMore] = useState(true); // Toggle between true and false to fetch

  useEffect(() => {
    if (tweets?.length > 0) {
      getTweets();
    }
  }, [tweets, loadMore]);

  const getTweetJSON = async ({ tweets }) => {
    const tweetsId = tweets;
    for (let i = 0; i < tweetsId.length; i++) {
      const tweetJSON = await fetchTweetAst(tweetsId[i]);
      tweetsJSON.push(tweetJSON);
    }
    return {
      tweets: tweetsJSON,
    };
  };

  const getTweets = async () => {
    try {
      const data = await getTweetJSON({
        tweets: tweets.slice(
          offset || 0,
          limit || tweets?.length < 20 ? 20 : tweets?.length
        ),
      });
      if (tweets) {
        if (limit + 10 > tweets) {
          setOffset(limit);
          setLimit(tweets.length);
        } else {
          setOffset(limit);
          setLimit((d) => d + 10);
        }
        setTweetsJSON((prev) => [...prev, ...data.tweets]);
      }
    } catch (err) {
      message.error("Some error occured. Please try after few mins");
      console.log(err);
    }
  };

  if (!link) return <p className="text-center my-4">Search to fetch tweets</p>;
  return (
    <div className="mx-5">
      <div className="w-full flex flex-col items-center">
        {link && (
          <div className="mb-4 flex flex-col items-center">
            {tweetsJSON.length === 0 && (
              <p className="my-4 font-bold text-lg">Fetching tweets...</p>
            )}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-red-400 text-white rounded font-bold text-base"
            >
              Twitter Link
            </a>
          </div>
        )}
        {tweetsJSON.map((tweet, i) => (
          <div className="w-full flex justify-center my-4" key={i}>
            <Tweet id={i} ast={tweet} />
          </div>
        ))}
        {tweets && limit < tweets.length && (
          <button
            onClick={() => setLoadMore((prev) => !prev)}
            className="py-2 px-4 bg-green-500 text-white rounded font-bold text-base"
          >
            Load More tweets
          </button>
        )}
      </div>
    </div>
  );
};

export default Tweets;
