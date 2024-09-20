import { Col, Row, Space, Table, Tag, DatePicker, Card, Button } from "antd";
import Search from "antd/es/input/Search";
import React, { useState } from "react";
import DetailModal from "../detail/DetailModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddDisbursement from "./modal/AddDisbursement";
import { Link } from "react-router-dom";

const Main = () => {
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(false);
  console.log(isModalDetail);
  const { RangePicker } = DatePicker;
  const columns = [
    {
      title: "เลขที่ใบเสร็จ",
      dataIndex: "age",
      align: "center",
      key: "key",
      render: (text) => (
        <Link
          onClick={() => {
            setIsModalDetail(true);
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "contno",
      key: "age",
      align: "center",
    },
    {
      title: "รายการ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "ยอด",
      dataIndex: "age",
      key: "age",
      align: "center",
    },
    {
      title: "วันที่ใช้จ่าย",
      dataIndex: "age",
      key: "age",
      align: "center",
    },
    {
      title: "การจัดการ",
      key: "action",
      align: "center",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag !== "อนุมัติ" ? "geekblue" : "green";
            if (tag === "ไม่อนุมัติ") {
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
      tags: ["อนุมัติ", "สำรองจ่าย"],
    },
    {
      key: "2",
      contno: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["ไม่อนุมัติ"],
    },
    {
      key: "3",
      contno: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["รออนุมัติ", "สำรองจ่าย"],
    },
  ];
  return (
    <>
      <Card>
        <Row>
          <Button
            onClick={() => {
              setIsModalAdd(true);
            }}
          >
            <PlusCircleOutlined
              style={{
                color: "green",
                fontSize: "24px",
              }}
            />
          </Button>
          <Col span={"24"} style={{ textAlign: "end", marginBottom: "5px" }}>
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
      {isModalDetail ? (
        <DetailModal open={isModalDetail} close={setIsModalDetail} />
      ) : null}
      {isModalAdd ? (
        <AddDisbursement open={isModalAdd} close={setIsModalAdd} />
      ) : null}
    </>
  );
};

export default Main;
