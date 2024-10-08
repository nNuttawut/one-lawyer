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
import DetailModal from "../detail/DetailModal";
import {
  FileDoneOutlined,
  EditOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

//use redux
import { useSelector } from "react-redux";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";

const Main = () => {
  const [convertDateThai] = DateCustom();

  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataStore, setDataStore] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS,
        {
          HEADERS_EXPORT,
        }
      );
      if (response.data) {
        let i = 1;
        if (response.data) {
          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));
          filterDataLawyer(newData);
          console.log(newData);

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
    if (Array.isArray(data)) {
      const newData = data.filter((item) => item);
      setArrayTable(newData);
      setDataArr(newData);
      setTableLength(newData.length);
      console.log(newData);
      console.log("Length of filtered data:", newData.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
  };

  const onSearchByDate = (startDate, endDate) => {
    console.log(endDate[0]);
    console.log(endDate[1]);

    const start = moment(endDate[0], "YYYY-MM-DD");
    const end = moment(endDate[1], "YYYY-MM-DD");

    const timestampStart = start.valueOf();
    const timestampEnd = end.valueOf();

    if (startDate && endDate) {
      const selectSearch = dataArr.filter((item) => {
        const date = moment(item.DATE, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (itemDate >= timestampStart && itemDate <= timestampEnd) {
          return item;
        } else {
          return null;
        }
      });
      setArrayTable(selectSearch);
    } else {
      setArrayTable(dataArr);
    }
  };

  // const handleUpdateData = (data) => {
  //   console.log("data---->update", data);
  //   if (data !== 0) {
  //     const result = dataArr.map((item) => {
  //       if (item.id === data.id) {
  //         return { ...data };
  //       } else {
  //         return { ...item };
  //       }
  //     });
  //     console.log(result);
  //     setDataArr(result);
  //     const arr = result.filter(
  //       (item) => item.MAIN_STATUS_ID === CASE_IS_FINAL
  //     );
  //     console.log("arr", arr);
  //     setArrayTable(arr);
  //   } else {
  //     loadData();
  //     console.log("handleUpdateData loadData");
  //   }
  // };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.DATE) {
      return null;
    }
    const recordDate = moment(record.DATE);
    const today = moment().startOf("day");
    const daysDifference = today.diff(recordDate, "days");
    const formattedDate = record.DATE ? convertDateThai(record.DATE) : null;
    return (
      <Tag color="orange" key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
      </Tag>
    );
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
      title: "วันที่สำเร็จ",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
    },
    {
      title: "จำนวนเงิน",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
    },
    {
      title: "ทนายที่รับผิดชอบ",
      align: "center",
      render: (record) => <>{record.LAWYER_NNAME}</>,
    },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"24"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Space direction="vertical" size={12}>
                <RangePicker
                  size="large"
                  style={{ marginRight: "10px" }}
                  onChange={onSearchByDate}
                />
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
                footer={() => <p>จำนวนสัญญาทั้งหมด {tableLength}</p>}
                expandable={{
                  expandedRowRender: (record) => (
                    <p style={{ margin: 0 }}>
                      {!record.DATE ? (
                        <Button
                          name="create"
                          style={{
                            boxShadow: "0 4px 3px",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setDataModal(record);
                          }}
                        >
                          <EditOutlined
                            style={{ color: "orange", fontSize: "16px" }}
                          />
                        </Button>
                      ) : null}
                      {record.DATE ? (
                        <>
                          <Button
                            name="formPrint"
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                            }}
                            onClick={() => {}}
                          >
                            <FileDoneOutlined
                              style={{ color: "green", fontSize: "16px" }}
                            />
                          </Button>
                          <Button
                            name="updateStatus"
                            style={{ boxShadow: "0 4px 3px" }}
                            onClick={() => {
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
    </>
  );
};

const CommissionInvestigate = MotionHoc(Main);
export default CommissionInvestigate;
