import { Col, Row, Space, Table, Tag, DatePicker, Card, Button } from "antd";
import Search from "antd/es/input/Search";
import React, { useState } from "react";
import DetailModal from "../detailStatus/DetailModal";
import {
  SyncOutlined,
  FileDoneOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import CreateDocument from "./modal/CreateDocument";
import DocumentEnforce from "./modal/DocumentEnforce";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import UpdateStatusBlackNumber from "./modal/UpdateStatusBlackNumber";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  const [isModalUpdateStatus, setIsModalUpdateStatus] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalDocument, setIsModalDocument] = useState(false);

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
            let color = tag !== "ยื่นฟ้อง" ? "volcano" : "green";
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
  ];

  const data = [
    {
      key: "1",
      contno: "8-00001",
      age: 12345,
      address: "New York No. 1 Lake Park",
      tags: ["ยื่นฟ้อง"],
    },
    {
      key: "2",
      contno: "8-00002",
      age: 122355,
      address: "London No. 1 Lake Park",
      tags: ["ยื่นฟ้อง"],
    },
    {
      key: "3",
      contno: "8-00003",
      age: 123455,
      address: "Sydney No. 1 Lake Park",
      tags: ["ยื่นฟ้อง"],
    },
    {
      key: "4",
      contno: "8-00004",
      age: 12399,
      address: "New York No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
    },
    {
      key: "2",
      contno: "8-00005",
      age: 123155,
      address: "London No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
    },
    {
      key: "5",
      contno: "8-00006",
      age: 345523,
      address: "Sydney No. 1 Lake Park",
      tags: ["ยื่นฟ้อง"],
    },
    {
      key: "6",
      contno: "8-00007",
      age: 32435,
      address: "New York No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
    },
    {
      key: "7",
      contno: "8-00008",
      age: 32145,
      address: "London No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
    },
    {
      key: "8",
      contno: "8-00009",
      age: 32145,
      address: "Sydney No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
    },
    {
      key: "9",
      contno: "8-00010",
      age: 22356,
      address: "New York No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
    },
    {
      key: "10",
      contno: "8-00011",
      age: 235662,
      address: "London No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
    },
    {
      key: "11",
      contno: "8-000012",
      age: 3293482,
      address: "Sydney No. 1 Lake Park",
      tags: ["ยังไม่ส่งฟ้อง"],
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
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>
                    <Button
                      style={{ boxShadow: "0 4px 3px", marginRight: "10px" }}
                      onClick={() => {
                        setIsModalCreate(true);
                      }}
                    >
                      <EditOutlined
                        style={{ color: "orange", fontSize: "16px" }}
                      />
                    </Button>
                    <Button
                      style={{ boxShadow: "0 4px 3px", marginRight: "10px" }}
                      onClick={() => {
                        setIsModalDocument(true);
                      }}
                    >
                      <FileDoneOutlined
                        style={{ color: "orange", fontSize: "16px" }}
                      />
                    </Button>
                    <Button
                      style={{ boxShadow: "0 4px 3px" }}
                      onClick={() => {
                        setIsModalUpdateStatus(true);
                      }}
                    >
                      <SyncOutlined
                        style={{ color: "green", fontSize: "16px" }}
                      />
                    </Button>
                  </p>
                ),
                rowExpandable: (record) => record.name !== "Not Expandable",
              }}
            />
          </Col>
        </Row>
      </Card>
      {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
      {isModalCreate ? (
        <CreateDocument open={isModalCreate} close={setIsModalCreate} />
      ) : null}
      {isModalDocument ? (
        <DocumentEnforce open={isModalDocument} close={setIsModalDocument} />
      ) : null}
      {isModalUpdateStatus ? (
        <UpdateStatusBlackNumber
          open={isModalUpdateStatus}
          close={setIsModalUpdateStatus}
        />
      ) : null}
    </>
  );
};

const PreLawsuitFiled = MotionHoc(Main);
export default PreLawsuitFiled;
