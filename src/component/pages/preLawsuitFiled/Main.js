import { Col, Row, Space, Table, Tag, DatePicker, Card, Button } from "antd";
import Search from "antd/es/input/Search";
import React, { useState } from "react";
import DetailModal from "../detailStatus/DetailModal";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

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
        <a
          onClick={() => {
            setIsModal(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      align: "center",
    },
    {
      title: "Address",
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
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
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
      contno: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      contno: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      contno: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "4",
      contno: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      contno: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "5",
      contno: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "6",
      contno: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "7",
      contno: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "8",
      contno: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "9",
      contno: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "10",
      contno: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "11",
      contno: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
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
            <Table columns={columns} dataSource={data} scroll={{ x: 850 }} />
          </Col>
        </Row>
      </Card>
      {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
    </>
  );
};

export default Main;
