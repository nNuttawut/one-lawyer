import { Col, Row, Space, Table, Tag, DatePicker, Card, Button } from "antd";
import Search from "antd/es/input/Search";
import React, { useState } from "react";
import DetailModal from "../detailStatus/DetailModal";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  console.log(isModal);
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
      key: "action",
      dataIndex: "tags",
      align: "center",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag !== "ทำยอม" ? "geekblue" : "green";
            if (tag === "ส่งฟ้อง") {
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
      render: (_, { tags }) => (
        <>
          <Button>
            <EditOutlined style={{ color: "orange", fontSize: "16px" }} />
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
      tags: ["ทำยอม"],
    },
    {
      key: "2",
      contno: "8-00002",
      age: 122355,
      address: "London No. 1 Lake Park",
      tags: ["ทำยอม"],
    },
    {
      key: "3",
      contno: "8-00003",
      age: 123455,
      address: "Sydney No. 1 Lake Park",
      tags: ["ทำยอม"],
    },
    {
      key: "4",
      contno: "8-00004",
      age: 12399,
      address: "New York No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
    },
    {
      key: "2",
      contno: "8-00005",
      age: 123455,
      address: "London No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
    },
    {
      key: "5",
      contno: "8-00006",
      age: 345523,
      address: "Sydney No. 1 Lake Park",
      tags: ["ทำยอม"],
    },
    {
      key: "6",
      contno: "8-00007",
      age: 32435,
      address: "New York No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
    },
    {
      key: "7",
      contno: "8-00008",
      age: 32145,
      address: "London No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
    },
    {
      key: "8",
      contno: "8-00009",
      age: 32145,
      address: "Sydney No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
    },
    {
      key: "9",
      contno: "8-00010",
      age: 22356,
      address: "New York No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
    },
    {
      key: "10",
      contno: "8-00011",
      age: 235662,
      address: "London No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
    },
    {
      key: "11",
      contno: "8-000012",
      age: 3293482,
      address: "Sydney No. 1 Lake Park",
      tags: ["ส่งฟ้อง"],
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
    </>
  );
};

export default Main;
