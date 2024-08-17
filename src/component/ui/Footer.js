import { Layout } from "antd";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter
      style={{
        background: "#DCDCDC",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <p className="copyright">
        Copyright ©{" "}
        <a href="https://www.facebook.com/calleasing.kkn">One Leasing 2024</a>
      </p>
    </AntFooter>
  );
}

export default Footer;
