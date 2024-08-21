import React, { useState } from "react";
import { Button, Modal, Steps } from "antd";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  FormOutlined,
  UserOutlined,
  ShoppingOutlined,
  AuditOutlined,
  SearchOutlined,
  NotificationOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

const DetailModal = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const showModal = () => {};
  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const statusDetail = () => {
    return (
      <>
        <Steps
          responsive={true}
          percent={50}
          items={[
            {
              title: "ส่งฟ้อง",
              status: "finish",
              icon: <FormOutlined />,
            },
            {
              title: "ส่งบังคับคดี",
              status: "finish",
              icon: <AuditOutlined />,
            },
            {
              title: "สืบทรัพย์",
              status: "finish",
              icon: <SearchOutlined />,
            },
            {
              title: "ประกาศขายทรัพย์",
              status: "process",
              icon: <NotificationOutlined />,
            },
            {
              title: "เจรจาหนี้",
              status: "wait",
              icon: <ScheduleOutlined />,
            },
            {
              title: "ชำระหนี้/ประนอมหนี้",
              status: "wait",
              icon: <SmileOutlined />,
            },
          ]}
        />
      </>
    );
  };

  return (
    <>
      <Modal
        title="รายละเอียดข้อมูล"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={"80%"}
      >
        {statusDetail()}
      </Modal>
    </>
  );
};
export default DetailModal;
