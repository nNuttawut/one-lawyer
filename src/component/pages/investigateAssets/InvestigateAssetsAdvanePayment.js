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
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import DetailModal from "../detail/DetailModal";
import { PlusOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_EXPENSES_REFERENCE,
  GET_INVESTIGATE_LOANS_LIST,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import LoadCompanies from "../../../hook/LoadCompanies";
import CreateAdvanePaymentAssets from "./modal/CreateAdvanePaymentAssets";
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
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [isModal, setIsModal] = useState(false);
  const [
    isModalCreateAdvanePaymentAssets,
    setIsModalCreateAdvanePaymentAssets,
  ] = useState(false);
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
  const [checkClearAdvance, setCheckClearAdvance] = useState(null);
  const [companyCheck, setCompanyCheck] = useState(
    userCompany === 1 || userCompany === 1 ? 2 : 3
  );

  useEffect(() => {
    setLoadingDataCompany(true);
    loadData();
  }, [setLoadingDataCompany]);

  useEffect(() => {
    if (companiesListCompany) {
      setOptionCompany();
    }
  }, [companiesListCompany]);

  // const onExpand = (expanded, record) => {
  //   if (expanded) {
  //     // เมื่อแถวถูกขยาย, ให้เพิ่ม key ของแถวนั้นลงใน expandedRowKeys
  //     setExpandedRowKeys([record.key]);
  //   } else {
  //     // เมื่อแถวถูกยุบ, ให้ลบ key ของแถวนั้นออกจาก expandedRowKeys
  //     setExpandedRowKeys([]);
  //   }
  // };

  // const loadData = async (data) => {
  //   setLoading(true);
  //   console.log(data);
  //   try {
  //     const response = await axios.get(baseUrl + GET_INVESTIGATE_LOANS_LIST, {
  //       headers: HEADERS_EXPORT,
  //     });
  //     if (response.data) {
  //       let i = 1;
  //       if (response.data) {
  //         const newData = response.data.map((item) => ({
  //           ...item,
  //           key: i++,
  //         }));
  //         filterData(newData);
  //         console.log(newData);
  //         setSearchEdit(newData);
  //         setLoading(false);
  //       }
  //     } else {
  //       setArrayTable([]);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error posting data:",
  //       error.response ? error.response.data : error.message
  //     );
  //     setLoading(false);
  //     message.error(`ไม่พบข้อมูล: ${error.message}`);
  //   }
  // };

  // const filterData = (data) => {
  //   if (Array.isArray(data)) {
  //     let filteredData;

  //     if (userCompany === "3") {
  //       filteredData = data.filter((item) => {
  //         const branch = item.LOCAT;
  //         // ถ้า branch เป็น null หรือ undefined ให้ return true ไปเลย (หรือ false ก็ได้ ขึ้นกับความต้องการ)
  //         if (!branch) return true; // หรือ false ก็ได้ ถ้าอยาก "กรองออก"

  //         // ถ้า branch มีค่า → เช็กตามปกติ
  //         return (
  //           !optionsLocat.some((opt) => branch.includes(opt.label)) ||
  //           item.CONTNO.includes("UD")
  //         );
  //       });
  //     } else {
  //       filteredData = data.filter((item) => {
  //         const branch = item.LOCAT;
  //         if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

  //         return optionsLocat.some((opt) => branch.includes(opt.label));
  //       });
  //     }

  //     const newData = filteredData.filter((item) => item.investigation_log_id);

  //     let dataUse;
  //     if (userCompany === 3) {
  //       dataUse = newData.filter((item) => item.COMPANY_ID === 3);
  //       setDataArr(dataUse);
  //     } else {
  //       let dataFilter = filteredData.filter((item) => item.COMPANY_ID !== 3);
  //       dataUse = newData.filter((item) => item.COMPANY_ID === 2);
  //       setDataArr(dataFilter);
  //     }

  //     setArrayTable(dataUse);
  //     setTableLength(dataUse.length);
  //     console.log("newData", dataUse);
  //     console.log("Length of filtered data:", dataUse.length);
  //   } else {
  //     console.error("data is not an array or is undefined");
  //     setTableLength(0);
  //   }
  // };

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
      const checkResponse = await axios.get(baseUrl + GET_EXPENSES_REFERENCE, {
        headers: HEADERS_EXPORT,
      });
      console.log("checkResponse", checkResponse);

      if (checkResponse.data) {
        console.log("checkResponse.data", checkResponse.data);
        const userJob = checkResponse?.data?.filter(
          (item) => item.user_id === userId
        );
        console.log("userJob", userJob);

        setCheckClearAdvance(userJob);
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

    if (Array.isArray(data)) {
      const preData = data.filter((item) => item.COMPANY_ID);
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
      if (userCompany === 3) {
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
    setCompanyCheck(value);
    if (selectedOption) {
      console.log("Selected Option:", selectedOption); // แสดงข้อมูลทั้งหมด
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }

    const dataUse = dataArr.filter(
      (item) => item.COMPANY_ID === selectedOption.value
    );
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setDataModal([]);
    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    console.log(companieSelect);

    let result = dataArr.filter(
      (item) =>
        ((item.CONTNO && item.CONTNO.includes(value)) ||
          (item.customer_name && item.customer_name.includes(value)) ||
          (item.customer_lastname && item.customer_lastname.includes(value))) &&
        item.COMPANY_ID === companieSelect.value
    );

    console.log("result", result);
    console.log("selectedRows====>", selectedRows);

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
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1") &&
          item.black_case_number &&
          !item.fee_payment_status
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

  const renderCheckClearAdvance = () => {
    const checkBill = checkClearAdvance?.filter((item) => {
      return item.reference_no?.substring(0, 1) !== "7";
    });

    const checkBillAesset = checkClearAdvance?.filter((item) => {
      return item.reference_no?.substring(0, 1) === "7";
    });

    const checkBillClearMonney = checkBillAesset?.filter((item) => {
      return item.reference_no?.substring(1, 2) === "M";
    });

    const checkBillClearLeassing = checkBillAesset?.filter((item) => {
      return item.reference_no?.substring(1, 2) === "L";
    });

    console.log("checkBillAesset", checkBillAesset);
    console.log("checkBillClear", checkBillClearMonney);
    console.log("checkBillClearLeassing", checkBillClearLeassing);

    const checkUserClearAdvance = checkBill?.every(
      (item) =>
        item.pay_status_id === PAYADVANCE_STATUS_SUCCESS ||
        item.pay_status_id === PAYADVANCE_STATUS_NOT_APPROVED
    );

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

    console.log(
      "checkData",
      checkUserClearAdvance,
      checkUserClearAdvanceMoney,
      checkUserClearAdvanceLeasing
    );
    if (companyCheck === 1 || companyCheck === 4) {
      if (checkUserClearAdvance && checkUserClearAdvanceLeasing) {
        setIsModalCreateAdvanePaymentAssets(true);
      } else {
        message.error("ยังไม่เคลียร์รายการที่เบิก โปรดติดต่อการเงิน");
      }
    } else if (companyCheck === 2 || companyCheck === 5) {
      if (checkUserClearAdvance && checkUserClearAdvanceMoney) {
        setIsModalCreateAdvanePaymentAssets(true);
      } else {
        message.error("ยังไม่เคลียร์รายการที่เบิก โปรดติดต่อการเงิน");
      }
    } else {
      if (checkUserClearAdvance) {
        setIsModalCreateAdvanePaymentAssets(true);
      } else {
        message.error("ยังไม่เคลียร์รายการที่เบิก โปรดติดต่อการเงิน");
      }
    }
  };

  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.investigation_date) {
      return null;
    }
    let color;
    const recordDate = dayjs(record.investigation_date).startOf("day");
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

    // if (record.LOAN_TYPE_ID === 1) {
    //   color =
    //     remainingDays > 30 && record.PROCESS_ID === 1
    //       ? "green"
    //       : record.PROCESS_ID === 3
    //       ? "blue"
    //       : "red";
    // } else {
    //   color =
    //     remainingDays > 60 && record.PROCESS_ID === 1
    //       ? "green"
    //       : record.PROCESS_ID === 3
    //       ? "blue"
    //       : "red";
    // }

    color = remainingDays > 30 ? "red" : "green";

    const formattedDate = record.investigation_date
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
            {remainingDays > 30 ? "เกิน" : null}
            {remainingDays} วัน
          </span>
        }
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
      render: (text, record) => (
        <>
          {record.CUSTOMER_TNAME}
          {record.CUSTOMER_FNAME} {record.CUSTOMER_LNAME}
        </>
      ),
    },
    {
      title: "ผู้รับผิดชอบ",
      align: "center",
      render: (record) => <>{record.LAWYER_NNAME}</>,
    },
    {
      title: "หมายเหตุ",
      align: "center",
      render: (record) => <>{record.MEMO}</>,
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />} // ไอคอน
                  size="small" // ขนาดเล็ก
                  onClick={() => renderCheckClearAdvance()}
                  disabled={
                    selectedRowKeys.length <= 0 || selectedRowKeys.length > 10
                  }
                  loading={loading}
                >
                  สร้างรายการ
                </Button>
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
                // expandable={{
                //   expandedRowRender: (record) => (
                //     <p style={{ margin: 0 }}>
                //       {record.PROCESS_ID !== 3 &&
                //       record.MAIN_STATUS_ID === record.STATUS_ID ? (
                //         <Button
                //           name="create"
                //           style={{
                //             boxShadow: "0 4px 3px",
                //             marginRight: "10px",
                //           }}
                //           onClick={() => {
                //             setIsModalCreate(true);
                //             setDataModal(record);
                //           }}
                //         >
                //           <FormOutlined
                //             style={{ color: "blue", fontSize: "16px" }}
                //           />
                //         </Button>
                //       ) : record.PROCESS_ID === 3 &&
                //         record.MAIN_STATUS_ID === record.STATUS_ID ? (
                //         <>
                //           {/* <Button
                //           name="formPrint"
                //           style={{
                //             boxShadow: "0 4px 3px",
                //             marginRight: "10px",
                //           }}
                //           onClick={() => {
                //             setIsModalDocument(true);
                //           }}
                //         >
                //           <FileDoneOutlined
                //             style={{ color: "green", fontSize: "16px" }}
                //           />
                //         </Button> */}
                //           <Button
                //             name="edit"
                //             style={{
                //               boxShadow: "0 4px 3px",
                //               marginRight: "10px",
                //             }}
                //             onClick={() => {
                //               setIsModalEdit(true);
                //               setDataModal(record);
                //             }}
                //           >
                //             <EditOutlined
                //               style={{ color: "orange", fontSize: "16px" }}
                //             />
                //           </Button>
                //           <Button
                //             name="updateStatus"
                //             style={{ boxShadow: "0 4px 3px" }}
                //             onClick={() => {
                //               setIsModalUpdate(true);
                //               setDataModal(record);
                //             }}
                //           >
                //             <SyncOutlined
                //               style={{ color: "green", fontSize: "16px" }}
                //             />
                //           </Button>
                //         </>
                //       ) : null}
                //       {record.MAIN_STATUS_ID !== record.STATUS_ID ? (
                //         <Button
                //           name="EditupdateStatus"
                //           style={{ boxShadow: "0 4px 3px" }}
                //           onClick={() => {
                //             setIsModalEditUpdate(true);
                //             setDataModal(record);
                //           }}
                //         >
                //           <SyncOutlined
                //             style={{ color: "orange", fontSize: "16px" }}
                //           />
                //         </Button>
                //       ) : null}
                //     </p>
                //   ),
                //   rowExpandable: (record) => userId === record.LAWYER_ID,
                //   expandedRowKeys, // เก็บ state ของ row ที่ขยาย
                //   onExpand, // ฟังก์ชันที่ควบคุมการขยาย
                // }}
                // rowKey="key"
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalCreateAdvanePaymentAssets ? (
        <CreateAdvanePaymentAssets
          open={isModalCreateAdvanePaymentAssets}
          close={setIsModalCreateAdvanePaymentAssets}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
          company={companieSelect}
        />
      ) : null}
    </>
  );
};

const InvestigateAssetsAdvanePayment = MotionHoc(Main);
export default InvestigateAssetsAdvanePayment;
