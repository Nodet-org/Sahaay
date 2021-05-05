import { Divider } from "antd";

const Footer = () => {
  return (
    <footer className="pb-8 mx-5 text-center">
      <Divider type="horizontal" />
      <div className="flex flex-col justify-center items-center my-16">
        <p className="text-base font-medium">
          Found any bugs or issue? Report the issue at{" "}
          <a
            href="https://github.com/Nodet-org/Sahaay/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-color font-bold"
          >
            Github
          </a>
        </p>
        <a href="https://www.buymeacoffee.com/nodet.org" target="_blank">
          <img
            src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png"
            alt="Buy Me A Coffee"
            className="my-5"
            style={{
              height: "41px !important",
              width: "174px !important",
              boxShadow: "0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important",
              WebkitBoxShadow:
                "0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important",
            }}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
