import { useState, useEffect } from "react";
import "../../../css/Sidenav.css";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Drawer,
  Dropdown,
  Form,
  List,
  Row,
} from "antd";
import {
  MenuUnfoldOutlined,
  AppleOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  ChromeOutlined,
  GithubOutlined,
} from "@ant-design/icons";

function Header() {
  useEffect(() => window.scrollTo(0, 0));
  const [openSideNav, setOpenSideNav] = useState(false);
  const { openSetting, setOpenSetting } = useState(false);

  const showDrawerNav = () => {
    setOpenSideNav(true);
  };
  const onCloseNav = () => {
    setOpenSideNav(false);
  };
  const showDrawerSetting = () => {
    setOpenSideNav(true);
  };
  const onCloseSetting = () => {
    setOpenSideNav(false);
  };

  const data = [
    {
      title: "New message from Sophie",
      description: (
        <>
          <ClockCircleOutlined /> 2 days ago
        </>
      ),

      avatar: (
        <Avatar shape="square">
          <AppleOutlined />
        </Avatar>
      ),
    },
    {
      title: "New album by Travis Scott",
      description: (
        <>
          <ClockCircleOutlined /> 2 days ago
        </>
      ),

      avatar: (
        <Avatar shape="square">
          <ChromeOutlined />
        </Avatar>
      ),
    },
    {
      title: "Payment completed",
      description: (
        <>
          <ClockCircleOutlined /> 2 days ago
        </>
      ),
      avatar: (
        <Avatar shape="square">
          <GithubOutlined />
        </Avatar>
      ),
    },
  ];

  const menu = (
    <List
      min-width="100%"
      className="header-notifications-dropdown "
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar shape="square" src={item.avatar} />}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );

  return (
    <>
      <div className="main5">
        <div className="start">
          <div
            className="menu-start"
            style={{
              lineHeight: "32px",
              color: "white",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          ></div>
          <div
            className="menu-start"
            style={{
              lineHeight: "32px",
              color: "white",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          ></div>
          {/* แก้ไขเวอร์ชั่นตรงนี้ */}
          <div className="setting-drwer" onClick={showDrawerNav}>
            <MenuUnfoldOutlined />
          </div>
          <div
            className="menu-start"
            style={{
              lineHeight: "32px",
              color: "white",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            <b>LAWYER JOB </b>
            <b>
              <u>V. 0.1</u>
            </b>
          </div>
          <Drawer
            placement="left"
            title="Basic Drawer"
            onClose={onCloseNav}
            open={openSideNav}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
        </div>
        <Row gutter={[24, 0]}>
          <Col span={24} md={18} className="header-control">
            <Badge size="small" count={4}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <a
                  href="#pablo"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <SettingOutlined size="medium" />
                </a>
              </Dropdown>
            </Badge>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Header;
