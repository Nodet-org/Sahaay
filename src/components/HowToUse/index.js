const HowToUse = () => {
  return (
    <div className="flex flex-col items-center mx-5">
      <div className="flex flex-col my-4 w-full">
        <h2 className="text-xl font-bold underline">If you need something</h2>
        <ul>
          <li className="mx-4 py-1 px-2 text-base">
            If you are looking for something,{" "}
            <b>select the State and District</b> and the required resource from
            the dropdown.
          </li>
          <h3 className="text-base font-semibold underline">
            What if there is no feed? (Do not panic)
          </h3>
          <li className="mx-4 py-1 px-2 text-base">
            Checkout the tweets section, it would get the latest tweets from
            twitter and display the required details
          </li>
        </ul>
      </div>
      <div className="flex flex-col my-4 w-full">
        <h2 className="text-xl font-bold underline">
          Found some feed with unavailable item?
        </h2>
        <ul>
          <li className="mx-4 py-1 px-2 text-base">
            Report the item so that others who see this can move on to next
            feed.
            <br />
            <span className="text-gray-500 font-semibold">
              Once an item gets 5 reports it would be verified by our team and
              would be removed from the list accordingly
            </span>
          </li>
        </ul>
      </div>
      <div className="flex flex-col my-4 w-full">
        <h2 className="text-xl font-bold underline">If you have something</h2>
        <ul>
          <li className="mx-4 py-1 px-2 text-base">
            In the bottom right corner of the page there is a button with a "+"
            sign, click on that and a modal will open up. Enter the details
            accordingly and post it
          </li>
        </ul>
      </div>
      <div className="flex flex-col my-4 w-full">
        <h2 className="text-xl font-bold underline">Privacy and Disclaimer</h2>
        <ul>
          <li className="mx-4 py-1 px-2 text-base">
            We disclaim any liability or responsibility that may arise from use
            of the Information by any User or that may arise upon any User
            contacting any vendor, supplier or person mentioned in the
            Information
          </li>
          <li className="mx-4 py-1 px-2 text-base">
            We disclaim any liability or responsibility for any transaction that
            the User of the Information may undertake with any Person mentioned
            in the Information.
          </li>
          <li className="mx-4 py-1 px-2 text-base">
            We do not claim authorship or any ownership rights in the
            Information.
          </li>
          <li className="mx-4 py-1 px-2 text-base">
            The User agrees to use the Information only for bona fide personal
            purposes and not to use the Information for commercial purposes or
            in any manner commercially exploit the data in the Information.
          </li>
          <li className="mx-4 py-1 px-2 text-base">
            Whatever you see in a post, can be seen by everyone else. So please
            be careful when providing contact information in posts.
          </li>
        </ul>
      </div>
      <div className="flex flex-col my-4 w-full">
        <h2 className="text-xl font-bold underline">
          Found some bugs? Or want new features?
        </h2>
        <ul>
          <li className="mx-4 py-1 px-2 text-base">
            Let us know in the Github issues section. This app was created with{" "}
            <a
              href="https://reactjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-color font-bold"
            >
              ReactJS
            </a>{" "}
            and{" "}
            <a
              href="https://firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-color font-bold"
            >
              Firebase
            </a>{" "}
            RealtimeDB to ensure the user gets the latest information
          </li>
        </ul>
        <div className="flex flex-col items-center my-4 text-lg">
          <a
            href="https://github.com/Nodet-org/Sahaay"
            rel="noopener noreferrer"
            target="_blank"
            className="text-theme-color font-bold"
          >
            Reach us at Github
          </a>
          <span>Or</span>
          <a
            href="https://twitter.com/NodetOrg"
            rel="noopener noreferrer"
            target="_blank"
            className="text-theme-color font-bold"
          >
            Reach us at twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
