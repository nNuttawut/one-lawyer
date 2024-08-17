import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer } from "antd";
import { COLOR } from "../../utils/theme";
import { Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Router from "./Router";

const { Header: AntHeader, Content, Sider } = Layout;

function Main() {
  const [visible, setVisible] = useState(false);

  const openDrawer = () => setVisible(!visible);

  let { pathname } = useLocation();
  // pathname = pathname.replace("/", "");

  const [titleName, setTitleName] = useState("หน้าแรก");

  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Layout className={`layout-dashboard`}>
        <Drawer
          title={false}
          placement="left"
          closable={false}
          onClose={() => setVisible(false)}
          open={visible}
          key="left"
          width={280}
          className={`drawer-sidebar`}
        >
          <Layout className={`layout-dashboard`}>
            <Sider
              trigger={null}
              width={280}
              theme="light"
              className={`sider-primary ant-layout-sider-primary`}
              style={{ background: "transparent" }}
            >
              <Sidenav color={COLOR.primary} onClick={setTitleName} />
            </Sider>
          </Layout>
        </Drawer>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          trigger={null}
          width={280}
          theme="light"
          className={`sider-primary ant-layout-sider-primary`}
          style={{ background: "transparent" }}
        >
          <Sidenav color={COLOR.primary} onClick={setTitleName} />
        </Sider>
        <Layout>
          <AntHeader>
            <Header onPress={openDrawer} title={titleName} />
          </AntHeader>

          <Content style={{ padding: 24 }} className="content-ant">
            {isMediumUp ? (
              <Container>
                <Router />
              </Container>
            ) : (
              <Router />
            )}
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    </>
  );
}

export default Main;
