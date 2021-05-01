import Header from "./components/Header";
import AddResource from "./components/AddResource";

function App() {
  return (
    <div className="relative min-h-screen home__container">
      <Header />
      <AddResource />
      <div className="App">COVID19 Resources</div>
    </div>
  );
}

export default App;
