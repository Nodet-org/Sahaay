import Header from "./components/Header";
import AddResource from "./components/AddResource";
import ResourceCard from "./components/ResourceCard";

function App() {
  return (
    <div className="relative min-h-screen home__container">
      <Header />
      <AddResource />
      <ResourceCard />
    </div>
  );
}

export default App;
