import { Card, Col, DatePicker, Row, Space, Table, Tag } from "antd";
import Search from "antd/es/transfer/search";
import React from "react";

const Main = () => {
  const { RangePicker } = DatePicker;
  const columns = [
    {
      title: "เลขสัญญา",
      dataIndex: "contno",
      key: "key",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "การจัดการ",
      key: "action",
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
      tags: ["พิมพ์"],
    },
    {
      key: "2",
      contno: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["พิมพ์"],
    },
    {
      key: "3",
      contno: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["พิมพ์"],
    },
  ];
  return (
    <div>
      <Card>
        <Row>
          <Col span={"24"} style={{ textAlign: "end" }}>
            <Space direction="vertical" size={12}>
              <RangePicker size="large" />
            </Space>
          </Col>
          <Col span={"24"}>
            <Table columns={columns} dataSource={data} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Main;
