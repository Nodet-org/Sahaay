import React, { Suspense, useEffect, useState } from "react";
import { Tabs } from "antd";
import ReactGA from "react-ga";

import CenteredSpinner from "./components/CenteredSpinner";
import Header from "./components/Header";
import AddResource from "./components/AddResource";
import Footer from "./components/Footer";
import HowToUse from "./components/HowToUse";

const Feed = React.lazy(() => import("./components/Feed"));
const Tweets = React.lazy(() => import("./components/Tweets"));

const { TabPane } = Tabs;

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [link, setLink] = useState();
  const [currentTab, setCurrentTab] = useState(null);
  const [query, setQuery] = useState({});
  const [askLocation, setAskLocation] = useState(false);

  useEffect(() => {
    ReactGA.initialize("G-9MQHCT81HD");
    if (!localStorage.getItem("isExperiencedUser")) {
      setCurrentTab("3");
      localStorage.setItem("isExperiencedUser", true);
    } else {
      setCurrentTab("1");
    }
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("isExperiencedUser") &&
      ["3", "1"].indexOf(currentTab) < 0
    ) {
      setAskLocation(true);
    }
  }, [currentTab]);

  return (
    <Suspense fallback={<CenteredSpinner text="Hold on.." />}>
      <div className="home__container relative">
        <Header setTweets={setTweets} setLink={setLink} setQuery={setQuery} />
        <AddResource />
        <Tabs
          defaultActiveKey={currentTab}
          activeKey={currentTab}
          onChange={(key) => setCurrentTab(key)}
          size="large"
          centered
        >
          <TabPane tab="Resource" key="1">
            <Suspense
              fallback={<CenteredSpinner text="We are fetching you data.." />}
            >
              <Feed
                query={query}
                setCurrentTab={setCurrentTab}
                askLocation={askLocation}
              />
            </Suspense>
          </TabPane>
          <TabPane tab="Tweets" key="2">
            <Suspense fallback="Loading...">
              <Tweets tweets={tweets} link={link} currentTab={currentTab} />
            </Suspense>
          </TabPane>
          <TabPane tab="Help" key="3">
            <HowToUse />
          </TabPane>
        </Tabs>
        <Footer />
      </div>
    </Suspense>
  );
};

export default App;
