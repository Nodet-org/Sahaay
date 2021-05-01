import { useState } from "react";

import filterIcon from "../../assets/filter.svg";
import searchIcon from "../../assets/search.svg";

const Header = () => {
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("PINCODE", search);
  };

  return (
    <div className="flex flex-col py-4">
      <div className="flex justify-between mx-5">
        <div className="font-semibold text-2xl">Resources</div>
        <img src={filterIcon} alt="Filter" className="h-6 w-6 cursor-pointer" />
      </div>
      <form
        className="bg-white mx-5 rounded-full h-9 flex items-center justify-between px-4 my-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none"
          placeholder="Search by Pincode"
        />
        <button type="submit" className="outline-none">
          <img src={searchIcon} alt="Search" />
        </button>
      </form>
      <div className="mb-2 flex justify-center">
        <h2 className="font-semibold text-lg border-b-4 border-gray-300">
          Resources near 682000
        </h2>
      </div>
    </div>
  );
};

export default Header;
