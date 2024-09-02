import { Col, Row, Space, Table, Tag, DatePicker, Card } from "antd";
import Search from "antd/es/input/Search";
import React, { useState } from "react";
import DetailModal from "../detailStatus/DetailModal";
import { Link } from "react-router-dom";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  console.log(isModal);
  const { RangePicker } = DatePicker;
  const columns = [
    {
      title: "เลขสัญญา",
      dataIndex: "contno",
      align: "center",
      key: "key",
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
      title: "Age",
      dataIndex: "age",
      align: "center",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      align: "center",
      key: "address",
    },
    {
      title: "การจัดการ",
      key: "action",
      align: "center",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
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
            <Table columns={columns} dataSource={data} />
          </Col>
        </Row>
      </Card>
      {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
    </>
  );
};

export default Main;
