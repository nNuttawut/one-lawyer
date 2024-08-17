import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IconButton, Menu, MenuItem } from "@mui/material";

const profile = [
  <svg
    width="30"
    height="30"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
      fill="#111827"
    ></path>
  </svg>,
];

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

function Header({ title, onPress }) {
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
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>{title}</h3>
        <div className="header-control">
          <Button
            type="link"
            className="sidebar-toggler"
            onClick={() => onPress()}
          >
            {toggler}
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
            {/* {user.role === "seller" && (
              <MenuItem value={1} onClick={handleCloseMenuItem}>
                รายการขายของฉัน
              </MenuItem>
            )} */}

            <MenuItem value={2} onClick={handleCloseMenuItem}>
              ออกจากระบบ
            </MenuItem>
          </Menu>
        </div>
        {/* <Link to="/myorders" className="btn-sign-in">
            <ShoppingOutlined />
          </Link> */}
      </div>
    </>
  );
}

export default Header;
