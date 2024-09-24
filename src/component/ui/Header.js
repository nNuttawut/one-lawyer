import { useState, useEffect } from "react";
import { Badge, Button, message, Modal } from "antd";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { IconButton, Menu, MenuItem } from "@mui/material";
import "../../assets/styles/Sidenav.css";

//use redux
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header({ title, onPress, onClick }) {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  useEffect(() => window.scrollTo(0, 0));
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenuItem = Boolean(anchorEl);
  const navigate = useNavigate();

  //use redux
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const userName = localStorage.getItem("USERNAME");

  const handleClickMenuItem = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenuItem = () => {
    setAnchorEl(null);
  };

  const signOut = () => {
    console.log("signOut on-->");
    localStorage.removeItem("USER_ID");
    localStorage.removeItem("USERNAME");
    localStorage.removeItem("TNAME");
    localStorage.removeItem("FNAME");
    localStorage.removeItem("LNAME");
    localStorage.removeItem("NNAME");
    localStorage.removeItem("LICENCE_NO_LAWYERS");
    localStorage.removeItem("COMPANY_ID");
    localStorage.removeItem("ROLE_ID");
    localStorage.removeItem("ACTIVE_STATUS");
    localStorage.removeItem("TOKEN");
    window.location.reload();
    message.success("ออกจากระบบสำเร็จ");
  };

  const handleSelectedMenuItem = (event) => {
    console.log(event.target.value);
    switch (event.target.value) {
      case 1:
        navigate("/profile");
        break;
      case 2:
        navigate("/chang-password");
        break;
      case 3:
        Modal.confirm({
          title: "ออกจากระบบ",
          content: "คุณต้องการออกจากระบบหรือไม่?",
          centered: true,
          okText: "ตกลง",
          cancelText: "ยกเลิก",
          onOk() {
            signOut();
          },
          onCancel() {
            console.log("Cancel");
          },
        });

        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="main5">
        {/* <aside className="sum"> */}
        <div className="start">
          <div
            className="menu-start"
            style={{
              lineHeight: "32px",
              color: "black",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          ></div>
          <div
            className="menu-start"
            style={{
              lineHeight: "32px",
              color: "black",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          ></div>
          {/* แก้ไขเวอร์ชั่นตรงนี้ */}
          <div
            className="menu-start"
            style={{
              lineHeight: "32px",
              color: "black",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            <h5 style={{ color: "white" }}>{title}</h5>
          </div>
        </div>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="header-control">
            <Button
              type="link"
              className="sidebar-toggler"
              onClick={() => {
                onPress();
              }}
            >
              <MenuUnfoldOutlined fontSize="large" />
            </Button>

            <IconButton
              id="basic-button"
              // aria-controls={openMenuItem ? "basic-menu" : undefined}
              // aria-haspopup="true"
              // aria-expanded={openMenuItem ? "true" : undefined}
              onClick={handleClickMenuItem}
            >
              <UserOutlined fontSize="large" />
            </IconButton>
            <a href="#/notifications">
              <Badge count={5}>
                <BellOutlined />
              </Badge>
            </a>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenuItem}
              onClick={handleSelectedMenuItem}
              onClose={handleCloseMenuItem}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {" "}
              <MenuItem value={1} onClick={handleCloseMenuItem}>
                <UserOutlined style={{ marginRight: "5px" }} />
                {userName}
              </MenuItem>
              <MenuItem value={2} onClick={handleCloseMenuItem}>
                <SettingOutlined style={{ marginRight: "5px" }} />
                เปลี่ยนรหัสผ่าน
              </MenuItem>
              <MenuItem value={3} onClick={handleCloseMenuItem}>
                <LogoutOutlined style={{ marginRight: "5px" }} /> ออกจากระบบ
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
