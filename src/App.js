import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs } from "antd";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AddResource from "./components/AddResource";
import Tweets from "./components/Tweets";
import Feed from "./components/Feed";
import HowToUse from "./components/HowToUse";

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
        <TabPane tab="Feed" key="1">
          <Feed query={query} setCurrentTab={setCurrentTab} city={city} />
        </TabPane>
        <TabPane tab="Tweets" key="2">
          <Tweets tweets={tweets} link={link} currentTab={currentTab} />
        </TabPane>
        <TabPane tab="Help" key="3">
          <HowToUse />
        </TabPane>
      </Tabs>
      <Footer />
    </div>
  );
};

export default App;
