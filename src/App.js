import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { Tabs } from "antd";
import CenteredSpinner from "./components/CenteredSpinner";
import Header from "./components/Header";
import AddResource from "./components/AddResource";
import Footer from "./components/Footer";
import HowToUse from "./components/HowToUse";

// const Header = React.lazy(() => import("./components/Header"));
// const Footer = React.lazy(() => import("./components/Footer"));
// const AddResource = React.lazy(() => import("./components/AddResource"));
const Feed = React.lazy(() => import("./components/Feed"));
const Tweets = React.lazy(() => import("./components/Tweets"));
// const HowToUse = React.lazy(() => import("./components/HowToUse"));

const { TabPane } = Tabs;

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [link, setLink] = useState();
  const [currentTab, setCurrentTab] = useState("1");
  const [query, setQuery] = useState({});
  const [city, setCity] = useState();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        axios
          .get(
            `https://us1.locationiq.com/v1/reverse.php?key=80c6277b4fd80d&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          )
          .then(function (response) {
            setCity(response.data.address.state.toLowerCase());
          });
      });
    } else {
      console.log("Location fetching not suppprted");
    }
  }, []);

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
              <Feed query={query} setCurrentTab={setCurrentTab} city={city} />
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
