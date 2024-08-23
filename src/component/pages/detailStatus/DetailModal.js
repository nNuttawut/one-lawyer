import React, { useState } from "react";
import { Modal, Steps } from "antd";
import {
  SmileOutlined,
  FormOutlined,
  BellOutlined,
  AuditOutlined,
  SearchOutlined,
  NotificationOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

const DetailModal = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [status, setStatus] = useState({
    notic: "finish",
    investigateAssets: "finish",
    sendToEnforcement: "finish",
    enforcement: "finish",
    negotiate: "process",
    saleAnnoucement: "wait",
    pay: "wait",
  });

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

  const handleStatusChange = (current) => {
    const newStatus = { ...status };
    if (current) {
      newStatus.notic = newStatus.notic === "wait" ? "finish" : "wait";
      newStatus.investigateAssets =
        newStatus.investigateAssets === "wait" ? "finish" : "wait";
      newStatus.sendToEnforcement =
        newStatus.sendToEnforcement === "wait" ? "finish" : "wait";
      newStatus.enforcement =
        newStatus.enforcement === "wait" ? "finish" : "wait";
    }

    setStatus(newStatus);
  };

  const statusDetail = () => {
    return (
      <>
        <Steps
          responsive={true}
          percent={50}
          current={Object.values(status).indexOf("finish")}
          onChange={handleStatusChange}
          items={[
            {
              title: "เตือน",
              status: status.notic,
              icon: <BellOutlined />,
            },
            {
              title: "สืบทรัพย์",
              status: status.investigateAssets,
              icon: <SearchOutlined />,
            },
            {
              title: "ส่งฟ้อง",
              status: status.sendToEnforcement,
              icon: <FormOutlined />,
            },
            {
              title: "ส่งบังคับคดี",
              status: status.enforcement,
              icon: <AuditOutlined />,
            },

            {
              title: "เจรจาหนี้",
              status: status.negotiate,
              icon: <ScheduleOutlined />,
            },
            {
              title: "ประกาศขายทรัพย์",
              status: status.saleAnnoucement,
              icon: <NotificationOutlined />,
            },

            {
              title: "ชำระหนี้/ประนอมหนี้",
              status: status.pay,
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
