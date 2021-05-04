import { Divider } from "antd";

const Footer = () => {
  return (
    <footer className="pb-8 mx-5 text-center">
      <Divider type="horizontal" />
      <div className="flex justify-center items-center my-16">
        <p className="text-base font-medium">
          Found any bugs or issue? Report the issue at{" "}
          <a
            href="https://github.com/No-det/covid19-resources/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-color font-bold"
          >
            Github
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
