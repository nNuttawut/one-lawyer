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
  Tooltip,
  Select,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import DetailModal from "../detail/DetailModal";
import {
  EditOutlined,
  FormOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import {
  ENFORCEMENT,
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_PROGRESS,
} from "../../../utils/constant/StatusConstant";
import dayjs from "dayjs";
import ReportSeize from "./modal/ReportSeize";
import EditJudgement from "./modal/EditJudgement";
import { optionsLocat } from "../../../utils/constant/LocatOption";

const Main = () => {
  const [
    convertDateThai,
    convertDateThaiShort,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
    dateNow,
  ] = DateCustom();
  const { Option } = Select;
  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [arrow, setArrow] = useState("Show");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [statusId, setStatusId] = useState();
  const [statusAction, setStatusAction] = useState();

  const renderOpteionStatus = () => {
    return (
      <>
        <Option value={1}>
          <span style={{ marginRight: 8 }}>🗂️</span>
          ทั้งหมด
        </Option>
        <Option value={2}>
          <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
          ไม่เจอทรัพย์
        </Option>
        <Option value={3}>
          <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />{" "}
          เจอทรัพย์
        </Option>
      </>
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + ENFORCEMENT,
        {
          headers: HEADERS_EXPORT,
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

  const onExpand = (expanded, record) => {
    if (expanded) {
      // เมื่อแถวถูกขยาย, ให้เพิ่ม key ของแถวนั้นลงใน expandedRowKeys
      setExpandedRowKeys([record.key]);
    } else {
      // เมื่อแถวถูกยุบ, ให้ลบ key ของแถวนั้นออกจาก expandedRowKeys
      setExpandedRowKeys([]);
    }
  };

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
  }, [arrow]);

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (ROLE_ID === "3" ||
            ROLE_ID === "4" ||
            ROLE_ID === "1" ||
            ROLE_ID === "2" ||
            ROLE_ID === "9") &&
          (item.PROCESS_ID === STATUS_PROCESS_PROGRESS ||
            item.PROCESS_ID === STATUS_PROCESS_PROCESS) &&
          // &&
          // (item?.customer_property_list?.length > 0 ||
          //   item?.guarantor_property_list?.length > 0)
          item.judge_date
      );

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
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
        filteredData = newData.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      const sortedData = filteredData.sort((a, b) => {
        // ถ้า a ไม่มี judge_date ให้เอาไว้ล่าง
        if (!a.judge_date && b.judge_date) return 1;
        // ถ้า b ไม่มี judge_date ให้เอาไว้ล่าง
        if (a.judge_date && !b.judge_date) return -1;
        // ถ้าทั้งคู่มี judge_date ให้เปรียบเทียบปกติ (ล่าสุดก่อน)
        if (a.judge_date && b.judge_date) {
          return new Date(a.judge_date) - new Date(b.judge_date);
        }
        return 0; // ถ้าทั้งคู่เป็น null
      });

      setArrayTable(sortedData);
      setDataArr(filteredData);
      setTableLength(sortedData.length);
      console.log("filteredData", sortedData);
      console.log("Length of filtered data:", sortedData.length);
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
    let result = dataArr.filter(
      (item) =>
        item.CONTNO.includes(value) &&
        (ROLE_ID === "3" ||
          ROLE_ID === "4" ||
          ROLE_ID === "1" ||
          ROLE_ID === "2" ||
          ROLE_ID === "9")
    );
    setArrayTable(result);
    setTableLength(result?.length);
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
        const date = dayjs(item.judge_date, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (
          itemDate >= timestampStart &&
          itemDate <= timestampEnd &&
          (ROLE_ID === "3" ||
            ROLE_ID === "4" ||
            ROLE_ID === "1" ||
            ROLE_ID === "2" ||
            ROLE_ID === "9")
        ) {
          return item;
        } else {
          return null;
        }
      });
      setArrayTable(selectSearch);
      setTableLength(selectSearch?.length);
    } else {
      setArrayTable(dataArr);
      setTableLength(dataArr?.length);
    }
  };

  const onSearchStatus = (value) => {
    console.log(value);
    let dataUse;

    if (value === 3) {
      dataUse = dataArr.filter(
        (item) =>
          (item.customer_property_list?.length > 0 ||
            item.guarantor_property_list?.length > 0) &&
          (ROLE_ID === "3" ||
            ROLE_ID === "4" ||
            ROLE_ID === "1" ||
            ROLE_ID === "2" ||
            ROLE_ID === "9")
      );
      setStatusId(3);
    } else if (value === 2) {
      console.log("onSearchStatus 4 ------->");
      dataUse = dataArr.filter(
        (item) =>
          item.customer_property_list?.length === 0 &&
          item.guarantor_property_list?.length === 0 &&
          (ROLE_ID === "3" ||
            ROLE_ID === "4" ||
            ROLE_ID === "1" ||
            ROLE_ID === "2" ||
            ROLE_ID === "9")
      );
      setStatusId(2);
    } else {
      dataUse = dataArr;
      setStatusId(1);
    }
    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const handleUpdateData = (data) => {
    console.log("data---->update", data);
    if (data !== 0) {
      const result = dataArr.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      console.log(result);
      setDataArr(result);
      const arr = result.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID
      );
      console.log("arr", arr);
      onSearchStatus();
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  const createAndDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const currentYear = dayjs().year();

    // แยกข้อมูลตามปีของ judge_date
    const groupedByYear = {};

    (arrayTable || []).forEach((data) => {
      const year = dayjs(data.judge_date).year(); // แยกปี
      if (!groupedByYear[year]) groupedByYear[year] = [];
      groupedByYear[year].push(data);
    });

    Object.entries(groupedByYear).forEach(([year, records]) => {
      const yearDiff = currentYear - parseInt(year, 10);
      const worksheet = workbook.addWorksheet(
        `ปี ${year} (${yearDiff} ปีที่แล้ว)`
      );

      worksheet.columns = [
        { header: "ลำดับ", key: "no", width: 10 },
        { header: "เลขสัญญา", key: "contno", width: 15 },
        { header: "ชื่อ-นามสกุล", key: "fullname", width: 30 },
        { header: "วันที่พิพากษา", key: "judge_date", width: 15 },
        { header: "จำนวนวัน", key: "days", width: 20 },
        { header: "เลขคดีแดง", key: "red_case_number", width: 20 },
        { header: "เจ้าของคดี", key: "lawyer", width: 20 },
      ];

      records.forEach((data, index) => {
        worksheet.addRow([
          index + 1,
          data.CONTNO,
          `${data.CUSTOMER_TNAME} ${data.CUSTOMER_FNAME} ${data.CUSTOMER_LNAME}`,
          convertDateThai(data.judge_date),
          renderDate(data.judge_date),
          data.red_case_number || "-",
          data.LAWYER_NNAME,
        ]);
      });

      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
      });
    });

    // สร้างไฟล์ Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `รายงานอายุความแยกตามปี_${dayjs().format("YYYY_MM_DD")}.xlsx`);
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record) {
      return null;
    }
    const recordDate = dayjs(record);
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
    const remainingDays = today
      .subtract(yearsDifference, "year")
      .subtract(remainingMonths, "month")
      .diff(recordDate, "day");

    return `${yearsDifference} ปี ${remainingMonths} เดือน ${remainingDays} วัน`;
  };

  const renderDateJudge = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.judge_date) {
      return null;
    }
    let color;
    const recordDate = dayjs(record.judge_date);
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
    const remainingDays = today
      .subtract(yearsDifference, "year")
      .subtract(remainingMonths, "month")
      .diff(recordDate, "day");

    if (remainingMonths >= 1 || yearsDifference > 0) {
      color = "orange";
    } else if (remainingMonths < 1) {
      color = "blue";
    } else if (remainingMonths > 12) {
      color = "red";
    }

    const formattedDate = record.judge_date
      ? convertDateThai(recordDate)
      : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {
          <span>
            {yearsDifference} ปี {remainingMonths} เดือน {remainingDays} วัน
          </span>
        }
        {<p style={{ color: "red" }}>{record.red_case_number}</p>}
      </Tag>
    );
  };

  const renderInvestigate = (record) => {
    let color;
    if (
      record.customer_property_list?.length > 0 ||
      record.guarantor_property_list?.length > 0
    ) {
      color = "green";
    } else {
      color = "red";
    }

    return (
      <Tag color={color} style={{ textAlign: "center" }}>
        {record.customer_property_list?.length > 0 ||
        record.guarantor_property_list?.length > 0
          ? "เจอทรัพย์"
          : "ไม่เจอทรัพย์"}
        <br />
      </Tag>
    );
  };

  const onChangeSelectStatus = (value) => {
    console.log("onChangeSelectStatus-->", value);
    onSearchStatus(value);
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
      title: "สถานะสืบทรัพย์",
      align: "center",
      render: (record) => <>{renderInvestigate(record)}</>,
    },
    {
      title: "วันที่พิพากษา",
      align: "center",
      render: (record) => <>{renderDateJudge(record)}</>,
    },
    ...(ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? [
          {
            title: "เจ้าของคดี",
            align: "center",
            render: (record) => <>{record?.LAWYER_NNAME}</>,
          },
        ]
      : []),
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col
              span={"8"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
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
            <Col span={"16"} style={{ textAlign: "end", marginBottom: "10px" }}>
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
            <Col span={"24"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <PrinterOutlined
                style={{
                  fontSize: "40px",
                  color: "blue",
                  cursor: "pointer",
                }}
                key="print"
                onClick={() => {
                  createAndDownloadExcel();
                }}
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
                      {(ROLE_ID === "1" ||
                        ROLE_ID === "3" ||
                        ROLE_ID === "4") &&
                      record.PROCESS_ID === STATUS_PROCESS_PROGRESS ? (
                        <Tooltip
                          placement="bottom"
                          title="คลิกเพื่อสร้างบันทึกการยึด !"
                          arrow={mergedArrow}
                        >
                          <Button
                            name="create"
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                              fontSize: "14px",
                              color: "blue",
                            }}
                            onClick={() => {
                              setIsModalCreate(true);
                              setDataRecord(record);
                              setStatusAction(STATUS_PROCESS_PROGRESS);
                            }}
                          >
                            <FormOutlined
                              style={{ color: "blue", fontSize: "16px" }}
                            />
                            สร้างรายงานการยึด
                          </Button>
                        </Tooltip>
                      ) : (ROLE_ID === "1" ||
                          ROLE_ID === "3" ||
                          ROLE_ID === "4") &&
                        record.PROCESS_ID === STATUS_PROCESS_PROCESS ? (
                        <Tooltip
                          placement="bottom"
                          title="คลิกเพื่อเพิ่มรายงานบันทึกการยึด !"
                          arrow={mergedArrow}
                        >
                          <Button
                            name="create"
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                              fontSize: "14px",
                              color: "green",
                            }}
                            onClick={() => {
                              setIsModalCreate(true);
                              setDataRecord(record);
                              setStatusAction(STATUS_PROCESS_PROCESS);
                            }}
                          >
                            <SyncOutlined
                              style={{ color: "green", fontSize: "16px" }}
                            />
                            อัพไฟล์บักทึกการยึด
                          </Button>
                        </Tooltip>
                      ) : null}
                      <Tooltip
                        placement="bottom"
                        title="คลิกเพื่อแก้ไขคำพิพากษา !"
                        arrow={mergedArrow}
                      >
                        <Button
                          name="edit"
                          style={{
                            boxShadow: "0 4px 3px",
                            marginRight: "10px",
                            fontSize: "14px",
                            color: "orange",
                          }}
                          onClick={() => {
                            setIsModalEdit(true);
                            setDataRecord(record);
                          }}
                        >
                          <EditOutlined
                            style={{ color: "orange", fontSize: "16px" }}
                          />
                          แก้ไขคำพิพากษา
                        </Button>
                      </Tooltip>
                    </p>
                  ),
                  rowExpandable: (record) => record,
                  // userId === record.LAWYER_ID,
                  expandedRowKeys, // เก็บ state ของ row ที่ขยาย
                  onExpand, // ฟังก์ชันที่ควบคุมการขยาย
                }}
                rowKey="key"
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalCreate ? (
        <ReportSeize
          open={isModalCreate}
          close={setIsModalCreate}
          dataDefualt={dataRecord}
          funcUpdateStatus={handleUpdateData}
          status={statusAction}
        />
      ) : null}
      {isModalEdit ? (
        <EditJudgement
          open={isModalEdit}
          close={setIsModalEdit}
          dataDefualt={dataRecord}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const MainEnforcement = MotionHoc(Main);
export default MainEnforcement;
