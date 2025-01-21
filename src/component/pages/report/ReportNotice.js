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
  Select,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import DetailModal from "../detail/DetailModal";
import { FileExcelOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

import axios from "axios";
import {
  NOTICE,
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../utils/constant/StatusConstant";
import DateCustom from "../../../hook/DateCustom";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Main = () => {
  const [convertDateThai] = DateCustom();

  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [dataRecord, setDataRecord] = useState();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [selectedOption, setSelectedOption] = useState(1);
  const [dataSearchByDate, setDataSearchByDate] = useState(null);

  const [arrow, setArrow] = useState("Show");

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

  useEffect(() => {
    loadData();
  }, [selectedOption]);

  const options = [
    {
      value: 1,
      label: "เตรียมส่ง EMS",
    },
    {
      value: 2,
      label: "ยังไม่ได้ใบตอบกลับ",
    },
    {
      value: 3,
      label: "เตรียมส่งฟ้อง",
    },
  ];

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + NOTICE,
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
          setDataSearchByDate(newData);
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
    console.log("data", data);

    if (Array.isArray(data)) {
      const firstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
      let newData;
      if (selectedOption === 1) {
        newData = data.filter(
          (item) =>
            item.PROCESS_ID === STATUS_PROCESS_PROCESS &&
            firstDayOfMonth <= item.DATE
        );
      } else if (selectedOption === 2) {
        newData = data.filter(
          (item) =>
            item.PROCESS_ID === STATUS_PROCESS_UNSUCCESSFUL &&
            firstDayOfMonth <= item.DATE
        );
      } else if (selectedOption === 3) {
        newData = data.filter(
          (item) =>
            item.PROCESS_ID === STATUS_PROCESS_SUCCESSFUL &&
            firstDayOfMonth <= item.DATE
        );
      }
      console.log("newData", newData);

      function containsNumber(str) {
        return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
      }

      function isEnglishOnly(str) {
        return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
      }

      let filteredData;
      console.log("userCompany", userCompany);

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
      setDataArr(filteredData);
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
      const firstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD"); // วันที่แรกของเดือน
      const endDayOfMonth = dayjs(firstDayOfMonth)
        .add(value, "days")
        .format("YYYY-MM-DD");

      let result = dataArr.filter((item) => {
        const itemDate = dayjs(item.DATE).format("YYYY-MM-DD");
        return itemDate >= firstDayOfMonth && itemDate <= endDayOfMonth;
      });
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

    let newData;
    if (selectedOption === 1) {
      newData = dataSearchByDate.filter(
        (item) => item.PROCESS_ID === STATUS_PROCESS_PROCESS
      );
    } else if (selectedOption === 2) {
      newData = dataSearchByDate.filter(
        (item) => item.PROCESS_ID === STATUS_PROCESS_UNSUCCESSFUL
      );
    } else if (selectedOption === 3) {
      newData = dataSearchByDate.filter(
        (item) => item.PROCESS_ID === STATUS_PROCESS_SUCCESSFUL
      );
    }

    function containsNumber(str) {
      return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
    }

    function isEnglishOnly(str) {
      return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
    }

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

    if (startDate && endDate) {
      const selectSearch = filteredData.filter((item) => {
        const date = dayjs(item.DATE, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (itemDate >= timestampStart && itemDate <= timestampEnd) {
          console.log("item", item);
          return item;
        } else {
          return null;
        }
      });
      setArrayTable(selectSearch);
    } else {
      setArrayTable(filteredData);
    }
  };

  const handleUpdateData = (data) => {
    console.log("data---->update", data);
    console.log("dataArr", dataArr);
    if (data) {
      const result = dataArr.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      console.log("result", result);
      setDataArr(result);
      const arr = result.filter((item) => item.MAIN_STATUS_ID === NOTICE);
      console.log("arr", arr);
      setArrayTable(arr);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value} `);
    setSelectedOption(value);
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    // if (!record.DATE) {
    //   return null;
    // }
    const recordDate = dayjs(record.DATE).startOf("day");
    // console.log("recordDate", recordDate);

    const today = dayjs().add(1, "days").startOf("days");
    // console.log("today", today);

    const daysDifference = today.diff(recordDate, "days");
    // console.log("daysDifference", daysDifference);

    let color = daysDifference > 30 ? "red" : "green";
    const formattedDate = record.DATE ? convertDateThai(record.DATE) : null;

    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {daysDifference}
      </Tag>
    );
  };

  const calDate = (value) => {
    const recordDate = dayjs(value).startOf("day");
    console.log("valueDate", value);
    const today = dayjs().add(1, "days").startOf("days");
    console.log("today", today);

    const daysDifference = today.diff(recordDate, "days");
    console.log("daysDifference", daysDifference);

    let color = daysDifference > 30 ? "red" : "green";
    const formattedDate = value.DATE ? convertDateThai(value.DATE) : null;

    return daysDifference;
  };

  const rederDataStatus = (record) => {
    console.log(record);

    if (record === 1) {
      return <Tag color="orange">ส่ง NOTICE</Tag>;
    } else if (record === 2) {
      return <Tag color="orange">ส่งคำฟ้อง</Tag>;
    } else if (record === 3) {
      return <Tag color="violet">รอพิพากษา</Tag>;
    } else if (record === 4) {
      return <Tag color="blue">พิพากษา</Tag>;
    } else if (record === 5) {
      return <Tag color="violet">ทำยอม</Tag>;
    } else if (record === 6) {
      return <Tag color="violet">คดีถึงที่สุด</Tag>;
    } else if (record === 7) {
      return <Tag color="violet">สืบทรัพย์หลังฟ้อง</Tag>;
    } else if (record === 8) {
      return <Tag color="violet">บังคับคดี</Tag>;
    } else if (record === 9) {
      return <Tag color="violet">เจรจาทรัพย์</Tag>;
    } else if (record === 10) {
      return <Tag color="violet">ขายทรัพย์</Tag>;
    } else if (record === 11) {
      return <Tag color="violet">สิ้นสุด</Tag>;
    }
  };

  const createAndDownloadExcel = async () => {
    // สร้าง Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("notice");

    if (selectedOption === 1) {
      // การตั้งค่า column width อัตโนมัติ
      worksheet.columns = [
        {
          header: "เลขสัญญา",
          key: "contno",
          width: 20,
        },
        {
          header: "ประเภทสัญญา",
          key: "loanId",
          width: 20,
        },

        {
          header: "ชื่อ",
          key: "fullname",
          width: 20,
        },
        {
          header: "นามสกุล",
          key: "lastname",
          width: 20,
        },
        {
          header: "เลข EMS",
          key: "emsNo",
          width: 20,
        },
        {
          header: "วันที่ส่ง",
          key: "date",
          width: 20,
        },
        {
          header: "ระยะเวลา",
          key: "dateOver",
          width: 10,
        },
        {
          header: "การตอบกลับ",
          key: "reply",
          width: 20,
        },
        {
          header: "ที่เก็บไฟล์",
          key: "urlFile",
          width: 40,
        },
        {
          header: "หมายเหตุ",
          key: "memo",
          width: 30,
        },
      ];
      arrayTable.forEach((data, index) => {
        const rowIndex = index + 2; // ข้ามแถว Header
        worksheet.addRow([
          data.CONTNO,
          data.LOAN_TYPE_ID === 1 ? "เช่าซื้่อ" : "จำนอง",
          data.CUSTOMER_FNAME,
          data.CUSTOMER_LNAME,
          "-",
          convertDateThai(data.DATE), // วันที่ส่ง
          `${calDate(data.DATE)} วัน`, // ระยะเวลา
          "-",
          "-",
          data.MEMO, // หมายเหตุ
        ]);
        // ถ้า dateOver เกิน 30, ให้ทำการไฮไลท์เซลล์ในคอลัมน์ "ระยะเวลา"
        if (calDate(data.DATE) > 30) {
          const cell = worksheet.getCell(`H${rowIndex}`);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF0000" }, // พื้นหลังสีแดง
          };
          cell.font = {
            color: { argb: "FFFFFFFF" }, // ตัวอักษรสีขาว
          };
        }
      });
    } else {
      // การตั้งค่า column width อัตโนมัติ
      worksheet.columns = [
        {
          header: "เลขสัญญา",
          key: "contno",
          width: 20,
        },
        {
          header: "ประเภทสัญญา",
          key: "loanId",
          width: 20,
        },
        {
          header: "สถานะผู้กู้",
          key: "loanStatus",
          width: 20,
        },
        {
          header: "ชื่อ",
          key: "fullname",
          width: 20,
        },
        {
          header: "นามสกุล",
          key: "lastname",
          width: 20,
        },
        {
          header: "เลข EMS",
          key: "emsNo",
          width: 20,
        },
        {
          header: "วันที่ส่ง",
          key: "date",
          width: 20,
        },
        {
          header: "ระยะเวลา",
          key: "dateOver",
          width: 10,
        },
        {
          header: "การตอบกลับ",
          key: "reply",
          width: 20,
        },
        {
          header: "ที่เก็บไฟล์",
          key: "urlFile",
          width: 40,
        },
        {
          header: "หมายเหตุ",
          key: "memo",
          width: 30,
        },
      ];
      arrayTable.forEach((data, index) => {
        const rowIndex = index + 2; // ข้ามแถว Header
        data.parcel_list.forEach((parcel) => {
          worksheet.addRow([
            data.CONTNO,
            data.LOAN_TYPE_ID === 1 ? "เช่าซื้่อ" : "จำนอง",
            parcel.GARNO === 0 && data.LOAN_TYPE_ID === 1
              ? "ผู้เช่าซื้อ"
              : parcel.GARNO === 0 && data.LOAN_TYPE_ID === 2
              ? "ผู้กู้ยืม/จำนอง"
              : "ผู้ค้ำประกัน",
            `${parcel.SNAM} ${parcel.NAME1}`,
            parcel.NAME2,
            parcel.parcel_no,
            convertDateThai(data.DATE), // วันที่ส่ง
            `${calDate(data.DATE)} วัน`, // ระยะเวลา
            parcel.parcel_typ_id === 1 ? "ใบตอบกลับ" : "จากเว็บไปรษณีย์",
            parcel.url_path,
            parcel.mark, // หมายเหตุ
          ]);
        });
        // ถ้า dateOver เกิน 30, ให้ทำการไฮไลท์เซลล์ในคอลัมน์ "ระยะเวลา"
        if (calDate(data.DATE) > 30) {
          const cell = worksheet.getCell(`H${rowIndex}`);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF0000" }, // พื้นหลังสีแดง
          };
          cell.font = {
            color: { argb: "FFFFFFFF" }, // ตัวอักษรสีขาว
          };
        }
      });
    }

    // สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ดาวน์โหลดไฟล์
    saveAs(blob, dayjs().format("YYYY_MM_DD"));
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
      title: "วันที่ส่ง",
      dataIndex: "DATE",
      key: "DATE",
      align: "center",
      render: (text) => <>{convertDateThai(text)}</>,
      sorter: (a, b) => {
        // เปรียบเทียบวันที่ระหว่าง a.DATE และ b.DATE
        return dayjs(a.DATE).isBefore(dayjs(b.DATE)) ? -1 : 1;
      },
      defaultSortOrder: "ascend",
    },
    {
      title: "ระยะเวลา",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
    },
    // {
    //   title: "สถานะคดี",
    //   align: "center",
    //   render: (record) => <>{rederDataStatus(record.MAIN_STATUS_ID)}</>,
    // },
    //ทำ logic record

    {
      title: "ทนายที่รับผิดชอบ",
      align: "center",
      render: (record) => <>{record.LAWYER_NNAME}</>,
    },

    {
      title: "หมายเหตุ",
      align: "center",
      render: (record) => <>{record.MEMO}</>,
    },
  ];

  if (ROLE_ID === "1" || ROLE_ID === "5") {
    return (
      <>
        <Card>
          <Spin spinning={loading} size="large" tip=" Loading... ">
            <Row>
              <Col
                span={"4"}
                style={{ textAlign: "start", marginBottom: "10px" }}
              >
                <Select
                  showSearch
                  style={{
                    width: 150,
                  }}
                  optionFilterProp="value"
                  options={options}
                  onChange={(value) => onChangeSelect(value)}
                  defaultValue={selectedOption}
                  size="large"
                />
              </Col>
              <Col
                span={"20"}
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
                  type="number"
                  min="1" // กำหนดค่าต่ำสุดเป็น 1
                  max="31" // กำหนดค่ามากสุดเป็น 31
                  style={{
                    width: 120,
                  }}
                  size="large"
                />
              </Col>
            </Row>
            <Row>
              <Col
                span={"24"}
                style={{ textAlign: "start", marginBottom: "10px" }}
              >
                <Space direction="vertical" size={12}>
                  <Tooltip
                    placement="bottom"
                    title="บันทึกข้อมูล excel"
                    arrow={mergedArrow}
                  >
                    <FileExcelOutlined
                      style={{
                        fontSize: "40px",
                        color: "green",
                        cursor: "pointer",
                      }}
                      key="print"
                      onClick={createAndDownloadExcel}
                    />
                  </Tooltip>
                </Space>
              </Col>
              <Col span={"24"}>
                <Table
                  size="small"
                  columns={columns}
                  dataSource={arrayTable}
                  scroll={{ x: 850 }}
                  footer={() => <p>จำนวนสัญญาทั้งหมด {tableLength}</p>}
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
    return <b>ไม่มีสิทธ์เข้าถึง</b>;
  }
};

const ReportNotice = MotionHoc(Main);
export default ReportNotice;
