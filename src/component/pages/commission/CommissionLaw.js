import {
  Col,
  Row,
  Space,
  Table,
  Tag,
  DatePicker,
  Card,
  message,
  Spin,
  Radio,
  Button,
  Popconfirm,
  Select,
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import DetailModal from "../detail/DetailModal";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_LAWSUIT_LIST,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
} from "../../API/apiUrls";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import LoadLawyers from "../../../hook/LoadLawyers";
import { Option } from "antd/es/mentions";

const Main = () => {
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataStore, setDataStore] = useState(null);
  const [dataRecord, setDataRecord] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [lawyerId, setLawyerId] = useState(null);
  const [lawyersOption, setLawyersOption] = useState();
  const [statusId, setStatusId] = useState(0);
  const [selectPrint, setSelectPrint] = useState(1);
  const { Option } = Select;

  const printOption = [
    {
      value: 1,
      label: "PDF",
    },
    {
      value: 2,
      label: "EXCEL",
    },
  ];

  useEffect(() => {
    loadData();
    setLoadingData(true);
  }, [setLoadingData]);

  useEffect(() => {
    if (lawyersList && dataArr) {
      setOption();
    }
  }, [lawyersList, dataArr]);

  const setOption = () => {
    let companySelect = null;

    if (dataArr.COMPANY_ID === 3) {
      companySelect = lawyersList.filter(
        (item) => item.COMPANY_ID === 3 && item.ROLE_ID === 3
      );
    } else {
      companySelect = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) && item.ROLE_ID === 3
      );
    }
    const options = companySelect.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));

    options.unshift({
      value: "all", // ค่าที่แทน "ทั้งหมด"
      label: "ทั้งหมด", // ข้อความที่แสดงใน dropdown
    });
    setLawyersOption(options);
  };

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(baseUrl + GET_LAWSUIT_LIST, {
        headers: HEADERS_EXPORT,
      });
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

  const sendStatus = async (dataLawsuit) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, dataLawsuit, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      if (dataLawsuit.attorney_fees_payment_datetime === 1) {
        message.success(`อนุมัติสัญญาเลขท่ี ${dataLawsuit.CONTNO}`);
      } else {
        message.error(`ไม่อนุมัติสัญญาเลขที่ ${dataLawsuit.CONTNO}`);
      }
      handleUpdate(dataLawsuit);
    }
  };

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const preData = data.filter((item) => item.black_case_number);

      const newData = preData.filter(
        (item) => !item.attorney_fees_payment_datetime
      );

      function containsNumber(str) {
        return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
      }

      function isEnglishOnly(str) {
        return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
      }

      console.log("list lawsuit--->", newData);

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
          // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
          if (isEnglishOnly(item.CONTNO.substring(0, 2))) {
            return item;
          } else {
            return false;
          }
        });
      } else {
        filteredData = newData.filter((item) => {
          const test = containsNumber(item.CONTNO.substring(0, 2)); // ตรวจสอบว่า 2 ตัวแรกมีตัวเลขไหม
          console.log("test12", test);

          // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
          if (test || !isEnglishOnly(item.CONTNO.substring(0, 2))) {
            return item; // เก็บ item นี้ไว้
          } else {
            return false; // ไม่เก็บ item นี้ (กรณีเป็นภาษาอังกฤษทั้งหมด หรือมีตัวเลขใน 2 ตัวแรก)
          }
        });
      }

      setArrayTable(filteredData);
      setDataArr(preData);
      setTableLength(filteredData.length);
      console.log("newData", filteredData);
      console.log("Length of filtered data:", filteredData.length);
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
    if (value) {
      let result = dataArr.filter(
        (item) => item.CONTNO.includes(value) || item.NNAME.includes(value)
      );
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
    }
  };

  const onSearchLawyers = (value) => {
    if (value === "all") {
      let result = dataArr.filter((item) => item);
      setArrayTable(result);
      setTableLength(result.length);
    } else {
      let result = dataArr.filter((item) => item.USER_ID === value);
      setArrayTable(result);
      setTableLength(result.length);
    }
  };

  const onSearchStatus = (value) => {
    let result;
    if (lawyerId && lawyerId !== "all") {
      result = dataArr.filter(
        (item) =>
          item.attorney_fees_payment_datetime === value &&
          item.USER_ID === lawyerId
      );
      console.log("if", result);
    } else {
      if (!value) {
        result = dataArr.filter((item) => !item.attorney_fees_payment_datetime);
      } else {
        result = dataArr.filter(
          (item) => item.attorney_fees_payment_datetime === value
        );
      }
      console.log("else", result);
    }
    setArrayTable(result);
    setTableLength(result.length);
  };

  const onChangeSelectLawyer = (value) => {
    console.log("onChangeSelectLawyer-->", value);
    onSearchLawyers(value);
    setLawyerId(value);
  };

  const onChangeSelectStatus = (value) => {
    console.log("onChangeSelectStatus-->", value);
    onSearchStatus(value);
    setStatusId(value);
  };

  const onSearchByDate = (startDate, endDate) => {
    console.log(endDate[0]);
    console.log(endDate[1]);

    const start = dayjs(endDate[0], "YYYY-MM-DD");
    const end = dayjs(endDate[1], "YYYY-MM-DD");

    const timestampStart = start.valueOf();
    const timestampEnd = end.valueOf();

    if (startDate && endDate) {
      const selectSearch = dataArr.filter((item) => {
        const date = dayjs(item.DATE, "YYYY-MM-DD");
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

  const renderStatus = (record) => {
    let color =
      record.attorney_fees_payment_datetime === 1
        ? "green"
        : record.attorney_fees_payment_datetime === 2
        ? "red"
        : "silver";

    return (
      <Tag color={color} key={record} style={{ textAlign: "center" }}>
        {record.attorney_fees_payment_datetime === 1
          ? "อนุมัติ"
          : record.attorney_fees_payment_datetime === 2
          ? "ไม่อนุมัติ"
          : "รอดำเนินการ"}
      </Tag>
    );
  };

  const renderOpteionStatus = () => {
    return (
      <>
        <Option value={0}>
          <span style={{ marginRight: 8 }}>🕒</span>
          รอดำเนินการ
        </Option>
        <Option value={1}>
          <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
          อนุมัติ
        </Option>
        <Option value={2}>
          <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
          ไม่อนุมัติ
        </Option>
      </>
    );
  };

  const confirmInsertOne = (data) => {
    const dataLawsuit = {
      ...data,
      attorney_fees_payment_datetime: 1,
      attorney_fees_payment_datetime: dayjs().format(),
    };

    console.log(dataLawsuit);
    sendStatus(dataLawsuit);
  };

  const cancel = (data) => {
    const dataLawsuit = {
      ...data,
      attorney_fees_payment_datetime: 2,
      tracking_fee_payment_datetime: dayjs().format(),
    };
    console.log(dataLawsuit);
    sendStatus(dataLawsuit);
  };

  const handleUpdate = (data) => {
    const result = dataArr.map((item) => {
      if (item.id === data.id) {
        return { ...data };
      } else {
        return { ...item };
      }
    });
    let newData;
    if (lawyerId !== "all" && statusId) {
      newData = result.filter(
        (item) =>
          item.attorney_fees_payment_datetime === statusId &&
          item.USER_ID === lawyerId
      );
    } else {
      newData = result.filter(
        (item) => item.attorney_fees_payment_datetime === statusId
      );
    }

    setDataArr(result);
    setArrayTable(newData);
    setTableLength(newData.length);
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
      render: (text, record) => (
        <Link
          onClick={() => {
            setIsModal(true);
            setDataRecord(record);
          }}
        >
          {record.CONTNO ? record.CONTNO : null}
        </Link>
      ),
    },
    {
      title: "จำนวนเงิน",
      align: "center",
      // render: (record) => <>{currencyFormatNoPoint(record.attorney_fees)}</>,
      render: (record) => (
        <>
          {record.LOAN_TYPE_ID === 1
            ? "3,500"
            : record.LOAN_TYPE_ID === 2
            ? "2,500"
            : null}
        </>
      ),
    },
    {
      title: "ผู้รับผิดชอบคดี",
      align: "center",
      render: (record) => <>{record.NNAME ? record.NNAME : null}</>,
    },
    {
      title: "วันที่อนุมัติ",
      align: "center",
      render: (record) => (
        <>
          {record.attorney_fees_payment_datetime
            ? convertDateThai(record.attorney_fees_payment_datetime)
            : null}
        </>
      ),
    },
    {
      title: "สถานะการอนุมัติ",
      align: "center",
      render: (record) => <>{renderStatus(record)}</>,
    },
    {
      title: "การจัดการ",
      align: "center",
      render: (record) => (
        <>
          <Popconfirm
            placement="topLeft"
            title="อัพเดทสถานะ"
            description="คุณต้องการอัพเดทสถานะให้ทนายใช่หรือไม่ ?"
            onConfirm={() => confirmInsertOne(record)}
            onCancel={() => cancel(record)}
            okText="อนุมัติ"
            cancelText="ไม่อนุมัติ"
          >
            <Button style={{ fontSize: "20px", color: "green" }}>
              <DollarOutlined />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "5") {
    return (
      <>
        <Card>
          <Spin spinning={loading} size="large" tip=" Loading... ">
            <Row>
              <Col
                span={"24"}
                style={{ textAlign: "end", marginBottom: "10px" }}
              >
                <Space direction="vertical" size={12}>
                  <Select
                    placeholder="เลือกทนาย"
                    optionFilterProp="value"
                    onChange={(value) => onChangeSelectLawyer(value)}
                    options={lawyersOption}
                    style={{
                      width: 150,
                      marginRight: "10px",
                    }}
                    size="large"
                  />
                </Space>
                <Select
                  placeholder="เลือกสถานะ"
                  optionFilterProp="value"
                  onChange={(value) => onChangeSelectStatus(value)}
                  style={{
                    width: 200,
                  }}
                  size="large"
                >
                  {renderOpteionStatus()}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col
                span={"24"}
                style={{ textAlign: "end", marginBottom: "10px" }}
              >
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
                  footer={() => (
                    <>
                      <p>จำนวนสัญญาทั้งหมด {tableLength}</p>
                    </>
                  )}
                  expandable={{
                    expandedRowRender: (record) => (
                      <p style={{ margin: 0 }}>
                        {/* {!record.DATE ? (
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
                      ) : null} */}
                      </p>
                    ),
                    rowExpandable: (record) => !record,
                  }}
                />
              </Col>
            </Row>
          </Spin>
        </Card>
        {isModal ? (
          <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
        ) : null}
      </>
    );
  } else {
    return <>ไม่มีสิทธ์เข้าถึงข้อมูล</>;
  }
};

const CommissionLaw = MotionHoc(Main);
export default CommissionLaw;
