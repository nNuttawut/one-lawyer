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
  notification,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import DetailModal from "../detail/DetailModal";
import { PlusOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_EXPENSES_REFERENCE,
  GET_INVESTIGATE_LIST,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import LoadCompanies from "../../../hook/LoadCompanies";
import CreateAdvanePaymentEnforce from "./modal/CreateAdvanePaymentEnforce";
import { optionsLone } from "../../../utils/constant/LoanTypeConstant";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import {
  PAYADVANCE_STATUS_NOT_APPROVED,
  PAYADVANCE_STATUS_SUCCESS,
} from "../../../utils/constant/ExpenseType";

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
  const [checkClearAdvance, setCheckClearAdvance] = useState(null);

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
      const response = await axios.get(baseUrl + GET_INVESTIGATE_LIST, {
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
      const checkResponse = await axios.get(baseUrl + GET_EXPENSES_REFERENCE, {
        headers: HEADERS_EXPORT,
      });
      if (checkResponse.data) {
        console.log("checkResponse.data", checkResponse.data);
        const userJob = checkResponse.data.filter(
          (item) => item.user_id === userId
        );
        console.log("userJob", userJob, userId);

        setCheckClearAdvance(userJob);
        setLoading(false);
      } else {
        setCheckClearAdvance(null);
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
      const preData = data.filter(
        (item) => item.seize_status === 1 && item.lawyer_seize_id === userId
      );
      let filteredData;

      if (userCompany === "3") {
        filteredData = preData.filter((item) => {
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
        filteredData = preData.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      let dataUse;
      if (userCompany === "3") {
        dataUse = filteredData.filter((item) => item.COMPANY_ID === 3);
        setDataArr(dataUse);
      } else {
        let dataCheck = filteredData.filter((item) => item.COMPANY_ID !== 3);
        dataUse = filteredData.filter((item) => item.COMPANY_ID === 2);
        setDataArr(dataCheck);
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
    let options;
    if (userCompany === "3") {
      options = companiesListCompany
        .filter((item) => item.id === 3)
        .map((item) => ({
          value: item.id,
          label: item.company_name,
          address: item.address,
        }));
    } else {
      options = companiesListCompany
        .filter((item) => item.id === 1 || item.id === 2)
        .map((item) => ({
          value: item.id,
          label: item.company_name,
          address: item.address,
        }));
    }

    console.log("options", options);
    setCompaniesOption(options);
    loadSelectCompany(options);
  };

  const loadSelectCompany = (value) => {
    let userCompany;
    if (userCompany === "3") {
      userCompany = 3;
    } else {
      userCompany = 2;
    }
    const selectedOption = value.find((option) => option.value === userCompany);

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
    console.log(companieSelect);

    let result = arrayTable.filter(
      (item) =>
        ((item.CONTNO && item.CONTNO.includes(value)) ||
          (item.NAME1 && item.NAME1.includes(value)) ||
          (item.NAME2 && item.NAME2.includes(value)) ||
          (item.possessor && item.possessor.includes(value))) &&
        item.COMPANY_ID === companieSelect.value &&
        item.seize_status === 1 &&
        item.lawyer_seize_id === userId
    );

    console.log("result", result);

    if (value) {
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
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

  const handleUpdateData = (data, company) => {
    console.log("data---->update", data);

    if (data && data.id) {
      // ตรวจสอบว่า data มีค่าและมี id
      const updatedDataArr = dataArr.map((item) =>
        item.id === data.id ? { ...data } : { ...item }
      );
      console.log("updatedDataArr", updatedDataArr);
      setDataArr(updatedDataArr);

      const arr = updatedDataArr.filter(
        (item) =>
          item.seize_status === 1 &&
          item.lawyer_seize_id === userId &&
          item.COMPANY_ID === company
      );
      console.log("arr", arr);
      setArrayTable(arr);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  const onSelectChange = (selectedRowKeysData, selectedRowsData) => {
    // อัปเดต key ที่ถูกเลือกไว้ทั้งหมด
    setSelectedRowKeys(selectedRowKeysData);
    console.log("selectedRowKeysData", selectedRowKeysData);
    setSelectedRows(selectedRowsData);
    console.log("selectedRowsData", selectedRowsData);
    setDataModal(selectedRowsData);
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

  // const renderCheckClearAdvance = () => {
  //   const checkBill = checkClearAdvance?.filter((item) => {
  //     return item.reference_no?.substring(0, 1) !== "3";
  //   });

  //   console.log(checkBill);

  //   const checkUserClearAdvance = checkBill?.every(
  //     (item) =>
  //       item.pay_status_id === PAYADVANCE_STATUS_SUCCESS ||
  //       item.pay_status_id === PAYADVANCE_STATUS_NOT_APPROVED
  //   );

  //   console.log("checkData", checkUserClearAdvance);
  //   if (checkUserClearAdvance) {
  //     setIsModalCreateAdvanePaymentCourt(true);
  //   } else {
  //     message.error("ยังไม่เคลียร์รายการที่เบิก โปรดติดต่อการเงิน");
  //   }
  // };

  const renderCheckClearAdvance = () => {
    const checkBillClearMonney = checkClearAdvance?.filter((item) => {
      return item.reference_no?.substring(1, 2) === "M";
    });

    const checkBillClearLeassing = checkClearAdvance?.filter((item) => {
      return item.reference_no?.substring(1, 2) === "L";
    });

    const checkBillClearKSM = checkClearAdvance?.filter((item) => {
      return item.reference_no?.substring(1, 2) === "K";
    });

    const checkUserClearAdvanceMoney = checkBillClearMonney?.every(
      (item) =>
        item.pay_status_id === PAYADVANCE_STATUS_SUCCESS ||
        item.pay_status_id === PAYADVANCE_STATUS_NOT_APPROVED
    );

    const checkUserClearAdvanceLeasing = checkBillClearLeassing?.every(
      (item) =>
        item.pay_status_id === PAYADVANCE_STATUS_SUCCESS ||
        item.pay_status_id === PAYADVANCE_STATUS_NOT_APPROVED
    );

    const checkUserClearAdvanceKSM = checkBillClearKSM?.every(
      (item) =>
        item.pay_status_id === PAYADVANCE_STATUS_SUCCESS ||
        item.pay_status_id === PAYADVANCE_STATUS_NOT_APPROVED
    );

    const checkUserBill = checkClearAdvance?.filter(
      (item) =>
        item.pay_status_id !== PAYADVANCE_STATUS_SUCCESS &&
        item.pay_status_id !== PAYADVANCE_STATUS_NOT_APPROVED &&
        item.reference_no?.substring(0, 1) !== "8"
    );

    if (companieSelect.value === 1) {
      if (checkUserClearAdvanceLeasing) {
        console.log("1");

        setIsModalCreateAdvanePaymentCourt(true);
      } else {
        if (checkUserBill?.length > 0) {
          notification.error({
            message: "ยังไม่เคลียร์รายการที่เบิก !",
            description: (
              <div>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  {checkUserBill.map((item, index) => (
                    <li key={index}>{item.reference_no}</li>
                  ))}
                </ul>
              </div>
            ),

            duration: 5,
          });
        }
      }
    } else if (companieSelect.value === 2) {
      console.log("2");
      if (checkUserClearAdvanceMoney) {
        setIsModalCreateAdvanePaymentCourt(true);
      } else {
        if (checkUserBill?.length > 0) {
          notification.error({
            message: "ยังไม่เคลียร์รายการที่เบิก !",
            description: (
              <div>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  {checkUserBill.map((item, index) => (
                    <li key={index}>{item.reference_no}</li>
                  ))}
                </ul>
              </div>
            ),

            duration: 5,
          });
        }
      }
    } else {
      if (checkUserClearAdvanceKSM) {
        console.log("3");
        setIsModalCreateAdvanePaymentCourt(true);
      } else {
        if (checkUserBill?.length > 0) {
          notification.error({
            message: "ยังไม่เคลียร์รายการที่เบิก !",
            description: (
              <div>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  {checkUserBill.map((item, index) => (
                    <li key={index}>{item.reference_no}</li>
                  ))}
                </ul>
              </div>
            ),

            duration: 5,
          });
        }
      }
    }
  };

  const handleCheckContno = () => {
    let checkContno = selectedRows.every((item) => item.legal_execution_office);

    if (checkContno) {
      setIsModalCreateAdvanePaymentCourt(true);
      // renderCheckClearAdvance();
    } else {
      // message.error("กรุณาเลือกเลขสัญญาและกรมบังคับคดีให้เหมือนกัน");
      notification.error({
        message: "กรุณาเลือกเลขสัญญาและกรมบังคับคดีให้เหมือนกัน !",
        duration: 5,
      });
    }
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
                  title="เลือกทำรายการได้ไม่เกิน 10 สัญญา !"
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
                      // display: "flex",
                      // justifyContent: "space-between", // จัดข้อความให้อยู่ซ้ายและขวา
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      เลือก {selectedRowKeys.length} สัญญา
                    </p>

                    <p style={{ margin: 0 }}>จำนวนสัญญาทั้งหมด {tableLength}</p>
                  </div>
                )}
                rowSelection={{
                  selectedRowKeys,
                  onChange: onSelectChange,
                  preserveSelectedRowKeys: true,
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalCreateAdvanePaymentCourt ? (
        <CreateAdvanePaymentEnforce
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

const EnforcementAdvanePayment = MotionHoc(Main);
export default EnforcementAdvanePayment;
