import { Col, Row, Space, Table, Tag, DatePicker, Card, Button } from "antd";
import Search from "antd/es/input/Search";
import React, { useState } from "react";
import DetailModal from "../detailStatus/DetailModal";
import {
  FileDoneOutlined,
  EditOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";
import MotionHoc from "../../../utils/MotionHoc";
import CreateNotice from "./modal/CreateNotice";
import DocumentNotice from "./modal/DocumentEnforce";
import { Link } from "react-router-dom";
import UpdateStatusNotice from "./modal/UpdateStatusNotice";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalDocument, setIsModalDocument] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);

  const { RangePicker } = DatePicker;

  const columns = [
    {
      title: "เลขสัญญา",
      dataIndex: "contno",
      key: "key",
      align: "center",
      render: (text) => (
        <Link
          onClick={() => {
            setIsModal(true);
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "เลขคดี",
      dataIndex: "age",
      key: "age",
      align: "center",
    },
    {
      title: "สถานที่ฟ้อง",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "สถานะ",
      key: "status",
      dataIndex: "tags",
      align: "center",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag !== "ครบกำหนดเมื่อ" ? "gray" : "green";
            if (tag === "เลยกำหนดเมื่อ") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag} style={{ textAlign: "center" }}>
                {tag.toUpperCase()}
                <br />
                {moment().format("DD/MM/YY")}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "tags",
      key: "acction",
      align: "center",

      render: () => (
        <>
          <Button
            style={{ boxShadow: "0 4px 3px", marginRight: "10px" }}
            onClick={() => {
              setIsModalCreate(true);
            }}
          >
            <EditOutlined style={{ color: "orange", fontSize: "16px" }} />
          </Button>
          <Button
            style={{ boxShadow: "0 4px 3px", marginRight: "10px" }}
            onClick={() => {
              setIsModalDocument(true);
            }}
          >
            <FileDoneOutlined style={{ color: "green", fontSize: "16px" }} />
          </Button>
          <Button
            style={{ boxShadow: "0 4px 3px" }}
            onClick={() => {
              setIsModalUpdate(true);
            }}
          >
            <SyncOutlined style={{ color: "green", fontSize: "16px" }} />
          </Button>
        </>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      contno: "8-00001",
      age: 12345,
      address: "New York No. 1 Lake Park",
      tags: ["เลยกำหนดเมื่อ"],
    },
    {
      key: "2",
      contno: "8-00002",
      age: 122355,
      address: "London No. 1 Lake Park",
      tags: ["ครบกำหนดเมื่อ"],
    },
    {
      key: "3",
      contno: "8-00003",
      age: 123455,
      address: "Sydney No. 1 Lake Park",
      tags: ["เลยกำหนดเมื่อ"],
    },
    {
      key: "4",
      contno: "8-00004",
      age: 12399,
      address: "New York No. 1 Lake Park",
      tags: ["เลยกำหนดเมื่อ"],
    },
    {
      key: "2",
      contno: "8-00005",
      age: 123455,
      address: "London No. 1 Lake Park",
      tags: ["ครบกำหนดเมื่อ"],
    },
    {
      key: "5",
      contno: "8-00006",
      age: 345523,
      address: "Sydney No. 1 Lake Park",
      tags: ["ครบกำหนดเมื่อ"],
    },
    {
      key: "6",
      contno: "8-00007",
      age: 32435,
      address: "New York No. 1 Lake Park",
      tags: ["ครบกำหนดเมื่อ"],
    },
    {
      key: "7",
      contno: "8-00008",
      age: 32145,
      address: "London No. 1 Lake Park",
      tags: ["เลยกำหนดเมื่อ"],
    },
    {
      key: "8",
      contno: "8-00009",
      age: 32145,
      address: "Sydney No. 1 Lake Park",
      tags: ["ครบกำหนดเมื่อ"],
    },
    {
      key: "9",
      contno: "8-00010",
      age: 22356,
      address: "New York No. 1 Lake Park",
      tags: ["ครบกำหนดเมื่อ"],
    },
    {
      key: "10",
      contno: "8-00011",
      age: 235662,
      address: "London No. 1 Lake Park",
      tags: ["เลยกำหนด"],
    },
    {
      key: "11",
      contno: "8-000012",
      age: 3293482,
      address: "Sydney No. 1 Lake Park",
      tags: ["ครบกำหนดเมื่อ"],
    },
  ];
  return (
    <>
      <Card>
        <Row>
          <Col span={"24"} style={{ textAlign: "end" }}>
            <Space direction="vertical" size={12}>
              <RangePicker size="large" style={{ marginRight: "10px" }} />
            </Space>
            <Search
              placeholder="ค้นหาสัญญา"
              onSearch={"onSearch"}
              enterButton
              style={{
                width: 200,
              }}
              size="large"
            />
          </Col>
          <Col span={"24"}>
            <Table
              size="small"
              columns={columns}
              dataSource={data}
              scroll={{ x: 850 }}
            />
          </Col>
        </Row>
      </Card>
      {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
      {isModalCreate ? (
        <CreateNotice open={isModalCreate} close={setIsModalCreate} />
      ) : null}
      {isModalDocument ? (
        <DocumentNotice open={isModalDocument} close={setIsModalDocument} />
      ) : null}
      {isModalUpdate ? (
        <UpdateStatusNotice open={isModalUpdate} close={setIsModalUpdate} />
      ) : null}
    </>
  );
};

const Notice = MotionHoc(Main);
export default Notice;
