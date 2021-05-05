import { Spin } from "antd";

export default ({ text }) => {
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
