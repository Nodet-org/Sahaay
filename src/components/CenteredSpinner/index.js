import { Spin } from "antd";

const CenteredSpinner = ({ text }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        width: "100%",
      }}
    >
      <Spin tip={text} />
    </div>
  );
};

export default CenteredSpinner;
