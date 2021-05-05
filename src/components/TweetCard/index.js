import { Skeleton } from "antd";
import { useState } from "react";
import { Tweet } from "react-twitter-widgets";

const TweetCard = ({ tweetId }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton active />}
      <div className={loaded ? "" : "fixed"}>
        <Tweet tweetId={tweetId} onLoad={() => setLoaded(true)} />
      </div>
    </>
  );
};

export default TweetCard;
