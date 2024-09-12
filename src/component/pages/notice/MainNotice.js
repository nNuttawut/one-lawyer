import {
  Col,
  Row,
  Space,
  Table,
  Tag,
  DatePicker,
  Card,
  Button,
  message,
  Spin,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import DetailModal from "../detailStatus/DetailModal";
import {
  FileDoneOutlined,
  EditOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";
import MotionHoc from "../../../utils/MotionHoc";
import CreateNotice from "./modal/CreateNotice";
import DocumentNotice from "./modal/DocumentNotice";
import { Link } from "react-router-dom";
import UpdateStatusNotice from "./modal/UpdateStatusNotice";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

//use redux
import { useSelector } from "react-redux";
import axios from "axios";
import { ASSIGN_LAWYERS, NOTICE } from "../../../utils/constant/StatusConstant";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalDocument, setIsModalDocument] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();

  console.log(profileRedux.id);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + ASSIGN_LAWYERS,
        {
          HEADERS_EXPORT,
        }
      );
      if (response.data) {
        let i = 1;
        if (response.data) {
          console.log(response.data);
          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));
          filterDataLawyer(newData);
          setLoading(false);
        }
      } else {
        setArrayTable([]);
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };

  const filterDataLawyer = (data) => {
    const newData = data.filter(
      (item) =>
        (item.LAWYER_ID === profileRedux.id &&
          item.STATUS_ID === ASSIGN_LAWYERS) ||
        item.MAIN_STATUS_ID === NOTICE
    );
    setArrayTable(newData);
    setDataArr(newData);
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      sorter: {
        compare: (a, b) => a.key - b.key,
        multiple: 5,
      },
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => <>{record.CONTNO ? record.CONTNO : null}</>,
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "CUSTOMER_TNAM",
      key: "CUSTOMER_TNAM",
      align: "center",
      render: (text, record) => (
        <>
          {record.CUSTOMER_TNAME ? record.CUSTOMER_TNAME : null}{" "}
          {record.CUSTOMER_FNAME ? record.CUSTOMER_FNAME : null}{" "}
          {record.CUSTOMER_LNAME ? record.CUSTOMER_LNAME : null}
        </>
      ),
    },
    {
      title: "วันส่ง notice",
      dataIndex: "",
      key: "",
      align: "center",
      render: (text, record) => (
        <>{/* {record.LOAN.SDATE ? record.LOAN.SDATE : null} */}</>
      ),
    },
    // {
    //   title: "สถานะ",
    //   key: "status",
    //   dataIndex: "tags",
    //   align: "center",
    //   render: ({ tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag !== "ครบกำหนดเมื่อ" ? "gray" : "green";
    //         if (tag === "เลยกำหนดเมื่อ") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag} style={{ textAlign: "center" }}>
    //             {tag.toUpperCase()}
    //             <br />
    //             {moment().format("DD/MM/YY")}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"24"} style={{ textAlign: "end" }}>
              <Space direction="vertical" size={12}>
                <RangePicker size="large" style={{ marginRight: "10px" }} />
              </Space>
              <Search
                placeholder="ค้นหาสัญญา"
                onChange={search}
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
                dataSource={arrayTable}
                scroll={{ x: 850 }}
                expandable={{
                  expandedRowRender: (record) => (
                    <p style={{ margin: 0 }}>
                      <Button
                        style={{
                          boxShadow: "0 4px 3px",
                          marginRight: "10px",
                        }}
                        onClick={() => {
                          setIsModalCreate(true);
                          setDataModal(record);
                        }}
                      >
                        <EditOutlined
                          style={{ color: "orange", fontSize: "16px" }}
                        />
                      </Button>
                      {record.MAIN_STATUS_ID === 2 ? (
                        <>
                          <Button
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setIsModalDocument(true);
                            }}
                          >
                            <FileDoneOutlined
                              style={{ color: "green", fontSize: "16px" }}
                            />
                          </Button>
                          <Button
                            style={{ boxShadow: "0 4px 3px" }}
                            onClick={() => {
                              setIsModalUpdate(true);
                              setDataModal(record);
                            }}
                          >
                            <SyncOutlined
                              style={{ color: "green", fontSize: "16px" }}
                            />
                          </Button>
                        </>
                      ) : null}
                    </p>
                  ),
                  rowExpandable: (record) => record.name !== "Not Expandable",
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
      {isModalCreate ? (
        <CreateNotice
          open={isModalCreate}
          close={setIsModalCreate}
          data={dataModal}
        />
      ) : null}
      {isModalDocument ? (
        <DocumentNotice open={isModalDocument} close={setIsModalDocument} />
      ) : null}
      {isModalUpdate ? (
        <UpdateStatusNotice
          open={isModalUpdate}
          close={setIsModalUpdate}
          data={dataModal}
        />
      ) : null}
    </>
  );
};

const Notice = MotionHoc(Main);
export default Notice;
