import { useState, useEffect } from "react";
import { Badge, Button, Modal } from "antd";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { IconButton, Menu, MenuItem } from "@mui/material";
import "../../assets/styles/Sidenav.css";

function Header({ title, onPress, onClick }) {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  useEffect(() => window.scrollTo(0, 0));

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenuItem = Boolean(anchorEl);
  const handleClickMenuItem = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenuItem = () => {
    setAnchorEl(null);
  };

  const handleSelectedMenuItem = (event) => {
    console.log(event.target.value);
    switch (event.target.value) {
      case 1:
        // navigate("/myorders");
        break;
      case 2:
        Modal.confirm({
          title: "ออกจากระบบ",
          content: "คุณต้องการออกจากระบบหรือไม่?",
          centered: true,
          onOk() {
            // dispatch(addToken(null));
            // navigate("/login");
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
          <div
            className="menu-start"
            style={{
              lineHeight: "32px",
              color: "white",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            <h5 style={{ color: "white" }}>LAWYER JOB V. 0.1 {title}</h5>
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
              color="inherit"
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
              <MenuItem value={1} onClick={handleCloseMenuItem}>
                <SettingOutlined style={{ marginRight: "5px" }} />
                เปลี่ยนรหัสผ่าน
              </MenuItem>

              <MenuItem value={2} onClick={handleCloseMenuItem}>
                <LogoutOutlined style={{ marginRight: "5px" }} /> ออกจากระบบ
              </MenuItem>
            </Menu>
          </div>
          {/* <Link to="/myorders" className="btn-sign-in">
            <ShoppingOutlined />
          </Link> */}
        </div>
      </div>
    </>
  );
}

export default Header;
