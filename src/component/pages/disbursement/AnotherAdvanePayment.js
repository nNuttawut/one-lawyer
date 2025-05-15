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
  Select,
  Flex,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import DetailModal from "../detail/DetailModal";
import { PlusOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_INVESTIGATE_LIST,
  GET_INVESTIGATE_LOANS_LIST,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import LoadCompanies from "../../../hook/LoadCompanies";
import CreateAdvanePaymentAnother from "./modal/CreateAdvanePaymentAnother";
import { optionsLone } from "../../../utils/constant/LoanTypeConstant";
import { optionsLocat } from "../../../utils/constant/LocatOption";

const Main = () => {
  const [convertDateThai] = DateCustom();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userName = localStorage.getItem("FNAME");
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [isModal, setIsModal] = useState(false);
  const [isModalCreateAdvanePaymentCourt, setIsModalCreateAdvanePaymentCourt] =
    useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState([]);
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const [searchEdit, setSearchEdit] = useState(null);
  // const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [companiesOption, setCompaniesOption] = useState(null);
  const [companieSelect, setCompanieSelect] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [arrow, setArrow] = useState("Show");

  useEffect(() => {
    setLoadingDataCompany(true);
    loadData();
  }, [setLoadingDataCompany]);

  useEffect(() => {
    if (companiesListCompany) {
      setOptionCompany();
    }
  }, [companiesListCompany]);

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_INVESTIGATE_LOANS_LIST, {
        headers: HEADERS_EXPORT,
      });

      const responseData = response.data;

      if (Array.isArray(responseData) && responseData.length > 0) {
        const newData = responseData.map((item, index) => ({
          ...item,
          key: index + 1,
        }));

        filterData(newData);
        setSearchEdit(newData);
      } else {
        setArrayTable([]);
        message.info("ไม่พบข้อมูล");
      }
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    console.log("data", data);

    console.log("userId", userId);

    if (Array.isArray(data)) {
      let filteredData;

      if (userCompany === "3") {
        filteredData = data.filter((item) => {
          const branch = item.LOCAT;
          // ถ้า branch เป็น null หรือ undefined ให้ return true ไปเลย (หรือ false ก็ได้ ขึ้นกับความต้องการ)
          if (!branch) return true; // หรือ false ก็ได้ ถ้าอยาก "กรองออก"

          // ถ้า branch มีค่า → เช็กตามปกติ
          return (
            !optionsLocat.some((opt) => branch.includes(opt.label)) ||
            item.CONTNO.includes("UD")
          );
        });
      } else {
        filteredData = data.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      let dataUse;
      if (userCompany === 3) {
        dataUse = filteredData.filter((item) => item.COMPANY_ID === 3);
        setDataArr(dataUse);
      } else {
        dataUse = filteredData.filter((item) => item.COMPANY_ID === 2);
        setDataArr(filteredData);
      }

      setArrayTable(dataUse);
      setTableLength(dataUse.length);
      console.log("newData", dataUse);
      console.log("Length of filtered data:", dataUse.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const setOptionCompany = () => {
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));

    console.log("options", options);
    setCompaniesOption(options);
    loadSelectCompany(options);
  };

  const loadSelectCompany = (value) => {
    const selectedOption = value.find((option) => option.value === 2);
    if (selectedOption) {
      console.log("Selected Option:", selectedOption); // แสดงข้อมูลทั้งหมด
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value} `);

    const selectedOption = companiesOption.find(
      (option) => option.value === value
    );

    if (selectedOption) {
      console.log("Selected Option:", selectedOption); // แสดงข้อมูลทั้งหมด
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }

    const dataUse = dataArr.filter(
      (item) => item.COMPANY_ID === selectedOption.value
    );
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = arrayTable.filter(
      (item) =>
        ((item.CONTNO && item.CONTNO.includes(value)) ||
          (item.CUSTOMER_FNAME && item.CUSTOMER_FNAME.includes(value)) ||
          (item.CUSTOMER_LNAME && item.CUSTOMER_LNAME.includes(value))) &&
        item.LAWYER_ID === userId
    );

    console.log("result", result);

    if (value) {
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
      // loadData();
    }
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
        const date = dayjs(item.date_of_plaint, "YYYY-MM-DD");
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

  const handleUpdateData = (data) => {
    console.log("data---->update", data);

    if (data && data.id) {
      // ตรวจสอบว่า data มีค่าและมี id
      const updatedDataArr = dataArr.map((item) =>
        item.id === data.id ? { ...data } : { ...item }
      );
      console.log("updatedDataArr", updatedDataArr);
      setDataArr(updatedDataArr);

      const arr = updatedDataArr.filter(
        (item) => item.seize_status === 1 && item.lawyer_seize_id === userId
      );
      console.log("arr", arr);
      setArrayTable(arr);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
    setDataModal(selectedRows);
    if (selectedRowKeys?.length > 4) {
      message.warning("กรุณาเลือกทำรายการไม่เกิน 4 สัญญา");
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
  };

  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.seize_date) {
      return null;
    }
    let color;
    const recordDate = dayjs(record.seize_date).startOf("day");
    const today = dayjs().startOf("day");

    // คำนวณความแตกต่างในหน่วยปี
    const yearsDifference = today.diff(recordDate, "year");

    // คำนวณความแตกต่างในหน่วยเดือน
    const monthsDifference = today.diff(recordDate, "month");

    // คำนวณความแตกต่างในหน่วยวัน
    const daysDifference = today.diff(recordDate, "day");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีแล้ว (คำนวณเดือนที่เหลือ)
    const remainingMonths = today
      .subtract(yearsDifference, "year")
      .diff(recordDate, "month");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีและเดือนแล้ว (คำนวณวันที่เหลือ)
    const remainingDays = today.diff(recordDate, "day");

    color = "blue";

    const formattedDate = record.seize_date
      ? convertDateThai(recordDate)
      : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {
          <span>
            {/* {record.LOAN_TYPE_ID === 1 && remainingDays > 30
                ? "เกิน"
                : record.LOAN_TYPE_ID === 2 && remainingDays > 60
                ? "เกิน"
                : null}{" "} */}
            {/* {remainingDays > 30 ? "เกิน" : null} */}
            {/* {remainingDays} วัน */}
          </span>
        }
      </Tag>
    );
  };

  const handleCheckContno = () => {
    let checkContno = selectedRows.every(
      (item) =>
        selectedRows[0]?.CONTNO === item.CONTNO &&
        selectedRows[0]?.legal_execution_office === item.legal_execution_office
    );

    if (checkContno) {
      setIsModalCreateAdvanePaymentCourt(true);
    } else {
      message.error("กรุณาเลือกเลขสัญญาและกรมบังคับคดีให้เหมือนกัน");
    }

    console.log("checkContno", checkContno);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      // sorter: {
      //   compare: (a, b) => a.key - b.key,
      //   multiple: 5,
      // },
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
      title: "ชื่อ-นามสกุล",
      align: "center",
      render: (text, record) => <>{record.possessor}</>,
    },
    {
      title: "รายละเอียด",
      align: "center",
      render: (record) => (
        <>
          <p>เลขโฉนด {record.deed_number}</p>
          <p>{record.dist_desc}</p>
          <p>จังหวัด {record.prov_desc}</p>
        </>
      ),
    },
    {
      title: "บังคับคดี",
      align: "center",
      render: (record) => <p> {record.legal_execution_office}</p>,
    },
    {
      title: "วันที่ยึด",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
    },
    {
      title: "หมายเหตุ",
      align: "center",
      render: (record) => <>{record.mark}</>,
    },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"24"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Select
                placeholder="เลือกบริษัท"
                showSearch
                optionFilterProp="label"
                options={companiesOption}
                onChange={(value) => onChangeSelect(value)}
                defaultValue={userCompany === "3" ? 3 : 2}
                popupMatchSelectWidth={false}
                style={{
                  width: "auto", // ทำให้ Select ขยายตามเนื้อหา
                  // maxWidth: 200, // จำกัดความกว้างสูงสุด
                }}
                size="large"
              />
            </Col>
            <Col
              span={"6"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
              <Flex align="center" gap="middle">
                <Tooltip
                  placement="bottom"
                  title="เลือกทำรายการได้ไม่เกิน 3 สัญญา !"
                  arrow={mergedArrow}
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />} // ไอคอน
                    size="small" // ขนาดเล็ก
                    onClick={handleCheckContno}
                    disabled={selectedRowKeys.length === 0}
                    loading={loading}
                  >
                    สร้างรายการ
                  </Button>
                </Tooltip>
              </Flex>
            </Col>
            <Col span={"18"} style={{ textAlign: "end", marginBottom: "10px" }}>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between", // จัดข้อความให้อยู่ซ้ายและขวา
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      เลือก {selectedRowKeys.length} สัญญา
                    </p>

                    <p style={{ margin: 0 }}>จำนวนสัญญาทั้งหมด {tableLength}</p>
                  </div>
                )}
                rowSelection={rowSelection}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalCreateAdvanePaymentCourt ? (
        <CreateAdvanePaymentAnother
          open={isModalCreateAdvanePaymentCourt}
          close={setIsModalCreateAdvanePaymentCourt}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
          company={companieSelect}
        />
      ) : null}
    </>
  );
};

const AnotherAdvanePayment = MotionHoc(Main);
export default AnotherAdvanePayment;
