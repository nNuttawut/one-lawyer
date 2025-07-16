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
  Button,
  Popconfirm,
  Select,
  Tooltip,
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { optionsLone } from "../../../utils/constant/LoanTypeConstant";
import { optionsLocat } from "../../../utils/constant/LocatOption";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
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
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [lawyerId, setLawyerId] = useState(userCompany === "3" ? 10 : 3);
  const [lawyersOption, setLawyersOption] = useState();
  const [statusId, setStatusId] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState([
    dayjs().startOf("month").subtract(1, "month"),
    dayjs().date(5),
  ]);
  const [arrow, setArrow] = useState("Show");
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

    if (userCompany === "3") {
      companySelect = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          item.ROLE_ID === 3 &&
          item.ACTIVE_STATUS === 1
      );
    } else {
      companySelect = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          item.ROLE_ID === 3 &&
          item.ACTIVE_STATUS === 1
      );
    }
    const options = companySelect.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));

    // options.unshift({
    //   value: "all", // ค่าที่แทน "ทั้งหมด"
    //   label: "ทั้งหมด", // ข้อความที่แสดงใน dropdown
    // });
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
          const useData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));

          filterDataLawyer(useData);
          console.log(response.data);

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
      const preData = data.filter(
        (item) =>
          item.attorney_fees &&
          item.trial_money_cleared_datetime &&
          item.trial_money_cleared_status
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

      let newData = filteredData
        .filter((item) => {
          const itemDate = dayjs(item.trial_money_cleared_datetime);

          return (
            item.USER_ID === lawyerId &&
            itemDate.isAfter(selectedDate[0]?.subtract(1, "second")) && // รวมวันแรก
            itemDate.isBefore(selectedDate[1]?.add(1, "day")) // รวมวันสุดท้าย
          );
        })
        .sort((a, b) =>
          dayjs(a.trial_money_cleared_datetime).diff(
            dayjs(b.trial_money_cleared_datetime)
          )
        );

      setArrayTable(newData);
      setDataArr(filteredData);
      setTableLength(newData.length);
      console.log("newData", newData);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
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
      if (dataLawsuit.attorney_fees_payment_status === 1) {
        message.success(`อนุมัติสัญญาเลขท่ี ${dataLawsuit.CONTNO}`);
      } else {
        message.error(`ไม่อนุมัติสัญญาเลขที่ ${dataLawsuit.CONTNO}`);
      }
      handleUpdate(dataLawsuit);
    }
  };

  const sendStatusAll = async (rows, status) => {
    if (rows.length === 0) {
      message.error("ไม่มีข้อมูล");
      return;
    }

    setLoading(true);

    try {
      const responses = await Promise.all(
        rows.map((dataLawsuit) =>
          axios.put(baseUrl + PUT_LAWSUIT_DETAIL, dataLawsuit, {
            headers: HEADERS_EXPORT,
          })
        )
      );

      // ตรวจสอบผลลัพธ์ของทุก request
      console.log(
        "Updated Data:",
        responses.map((res) => res.data)
      );
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      if (status === 1) {
        message.success(`อนุมัติสัญญาจำนวน ${rows.length}`);
      } else {
        message.error(`ไม่อนุมัติสัญญาจำนวน ${rows.length}`);
      }
      handleUpdateAll(rows);
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
    let dataUse = dataArr.filter((item) => {
      const itemDate = dayjs(item.trial_money_cleared_datetime);
      if (statusId === "all") {
        console.log("statusId all", statusId);

        return (
          itemDate.isAfter(selectedDate[0]) &&
          itemDate.isBefore(selectedDate[1]) &&
          item.USER_ID === value
        );
      } else {
        console.log("statusId", statusId);

        let statusCheck;
        if (statusId === 0) {
          statusCheck = null;
        } else {
          statusCheck = statusId;
        }

        return (
          itemDate.isAfter(selectedDate[0]) &&
          itemDate.isBefore(selectedDate[1]) &&
          item.USER_ID === value &&
          item.attorney_fees_payment_status === statusCheck
        );
      }
    });
    console.log("dataUse", dataUse);
    console.log("dataArr", dataArr);

    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const onSearchStatus = (value) => {
    let dataUse = dataArr.filter((item) => {
      const itemDate = dayjs(item.trial_money_cleared_datetime);
      if (value === "all") {
        console.log("statusId all", statusId);

        return (
          itemDate.isAfter(selectedDate[0]) &&
          itemDate.isBefore(selectedDate[1]) &&
          item.USER_ID === lawyerId
        );
      } else {
        console.log("statusId", statusId);

        let statusCheck;
        if (value === 0) {
          statusCheck = null;
        } else {
          statusCheck = value;
        }

        return (
          itemDate.isAfter(selectedDate[0]) &&
          itemDate.isBefore(selectedDate[1]) &&
          item.USER_ID === lawyerId &&
          item.attorney_fees_payment_status === statusCheck
        );
      }
    });
    console.log("dataUse", dataUse);
    console.log("dataArr", dataArr);

    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const onChangeSelectLawyer = (value) => {
    console.log("onChangeSelectLawyer-->", value);
    setLawyerId(value);
    onSearchLawyers(value);
  };

  const onChangeSelectStatus = (value) => {
    console.log("onChangeSelectStatus-->", value);
    setStatusId(value);
    onSearchStatus(value);
  };

  const onSearchByDate = (dates) => {
    if (!dates || dates.length < 2) return;
    console.log("dates", dates);

    const start = dayjs(dates[0]);
    const end = dayjs(dates[1]);

    if (!start.isValid() || !end.isValid()) {
      console.error("Invalid dates selected!");
      return;
    }

    setSelectedDate([start, end]); // อัปเดต state

    let dataUse = dataArr.filter((item) => {
      const itemDate = dayjs(item.trial_money_cleared_datetime);
      if (statusId === "all") {
        console.log("statusId all", statusId);

        return (
          itemDate.isAfter(start) &&
          itemDate.isBefore(end) &&
          item.USER_ID === lawyerId
        );
      } else {
        console.log("statusId", statusId);

        let statusCheck;
        if (statusId === 0) {
          statusCheck = null;
        } else {
          statusCheck = statusId;
        }

        return (
          itemDate.isAfter(start) &&
          itemDate.isBefore(end) &&
          item.USER_ID === lawyerId &&
          item.attorney_fees_payment_status === statusCheck
        );
      }
    });
    console.log("dataUse", dataUse);
    console.log("dataArr", dataArr);

    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const renderStatus = (record) => {
    let color =
      record.attorney_fees_payment_status === 1
        ? "green"
        : record.attorney_fees_payment_status === 2
        ? "red"
        : "silver";

    return (
      <Tag color={color} key={record} style={{ textAlign: "center" }}>
        {record.attorney_fees_payment_status === 1
          ? "อนุมัติ"
          : record.attorney_fees_payment_status === 2
          ? "ไม่อนุมัติ"
          : "รอดำเนินการ"}
      </Tag>
    );
  };

  const renderOpteionStatus = () => {
    return (
      <>
        <Option value={"all"}>
          <span style={{ marginRight: 8 }}>🗂️</span>
          ทั้งหมด
        </Option>
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
      attorney_fees_payment_status: 1,
      attorney_fees_payment_datetime: dayjs().format(),
    };

    console.log(dataLawsuit);
    sendStatus(dataLawsuit);
  };

  const cancel = (data) => {
    const dataLawsuit = {
      ...data,
      attorney_fees_payment_status: 2,
      attorney_fees_payment_datetime: dayjs().format(),
    };
    console.log(dataLawsuit);
    sendStatus(dataLawsuit);
  };

  const confirmInsertAll = () => {
    if (selectedRows.length > 0) {
      let rows = selectedRows.map((item) => ({
        ...item, // ใช้ item ไม่ใช่ selectedRows ทั้งหมด
        attorney_fees_payment_status: 1,
        attorney_fees_payment_datetime: dayjs().format(),
      }));
      let status = 1;
      console.log(rows); // ตรวจสอบค่าที่ได้
      sendStatusAll(rows, status); // ถ้าต้องการส่งข้อมูลไปยัง API
    } else {
      message.error("กรุณาเลือกสัญญาที่จะอนุมัติก่อน");
    }
  };

  const cancelAll = () => {
    if (selectedRows.length > 0) {
      let rows = selectedRows.map((item) => ({
        ...item, // ใช้ item ไม่ใช่ selectedRows ทั้งหมด
        attorney_fees_payment_status: 2,
        attorney_fees_payment_datetime: dayjs().format(),
      }));
      let status = 2;
      console.log(rows); // ตรวจสอบค่าที่ได้
      sendStatusAll(rows, status); // ถ้าต้องการส่งข้อมูลไปยัง API
    } else {
      message.error("กรุณาเลือกสัญญาที่จะไม่อนุมัติก่อน");
    }
  };

  const handleUpdate = (data) => {
    console.log(data);

    const result = dataArr.map((item) => {
      if (item.id === data.id) {
        return { ...data };
      } else {
        return { ...item };
      }
    });

    let dataUse = result.filter((item) => {
      const itemDate = dayjs(item.trial_money_cleared_datetime);
      if (statusId === "all") {
        console.log("statusId all", statusId);

        return (
          itemDate.isAfter(selectedDate[0]) &&
          itemDate.isBefore(selectedDate[1]) &&
          item.USER_ID === lawyerId
        );
      } else {
        console.log("statusId", statusId);

        let statusCheck;
        if (statusId === 0) {
          statusCheck = null;
        } else {
          statusCheck = statusId;
        }

        return (
          itemDate.isAfter(selectedDate[0]) &&
          itemDate.isBefore(selectedDate[1]) &&
          item.USER_ID === lawyerId &&
          item.attorney_fees_payment_status === statusCheck
        );
      }
    });
    setDataArr(result);
    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const handleUpdateAll = (data) => {
    const result = dataArr.map((item) => {
      // ค้นหา data ที่มี id ตรงกับ item.id
      const updatedItem = data.find((d) => d.id === item.id);

      return updatedItem ? { ...updatedItem } : { ...item };
    });

    let newData;
    if (lawyerId !== "all" && statusId) {
      newData = result.filter(
        (item) =>
          item.attorney_fees_payment_status === statusId &&
          item.USER_ID === lawyerId
      );
    } else {
      newData = result;
    }

    setDataArr(result);
    setArrayTable(newData);
    setTableLength(newData.length);
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      onSelectChange(rowKeys, selectedRows);
    },
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

  const renderLoanType = (value) => {
    return (
      optionsLone.find((item) => item.value === value)?.label || "ไม่พบชื่อ"
    );
  };

  const createAndDownloadExcel = async () => {
    let lawyerName =
      lawyersOption.find((item) => item.value === lawyerId)?.label ||
      "ไม่พบชื่อ";

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(lawyerName);

    // กำหนดชื่อคอลัมน์
    worksheet.columns = [
      { header: "ลำดับ", key: "no", width: 5 },
      { header: "สัญญา", key: "contno", width: 10 },
      { header: "ชื่อลูกค้า", key: "cusName", width: 25 },
      { header: "วันที่พิพากษา", key: "judgeDate", width: 15 },
      { header: "วันที่ดำเนินการ", key: "actionDate", width: 15 },
      { header: "พิพากษา", key: "judgement", width: 10 },
      { header: "ทำยอม", key: "judgementAgreement", width: 10 },
      { header: "ถอนฟ้อง", key: "withdrawCase", width: 10 },
      { header: "สถานะ", key: "status", width: 15 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = { bold: true }; // ทำให้ตัวหนังสือเป็นตัวหนา
    });

    let data = selectedRows.length > 0 ? selectedRows : arrayTable;

    // คำนวณยอดรวมเฉพาะที่อนุมัติ (attorney_fees_payment_status === 1)
    const totalApprovedAmount = data
      .filter((item) => item.attorney_fees_payment_status === 1)
      .reduce((sum, item) => sum + item.attorney_fees, 0);

    const totalJudgeAmount = data
      .filter((item) => item.trial_money_cleared_status === 1)
      .reduce((sum, item) => sum + item.attorney_fees, 0);

    const totalJudgeAgreementAmount = data
      .filter((item) => item.trial_money_cleared_status === 2)
      .reduce((sum, item) => sum + item.attorney_fees, 0);

    const totalWithdrawCaseAmount = data
      .filter((item) => item.trial_money_cleared_status === 3)
      .reduce((sum, item) => sum + item.attorney_fees, 0);

    const totalFinalCaseAmount = data
      .filter((item) => item.trial_money_cleared_status === 4)
      .reduce((sum, item) => sum + item.attorney_fees, 0);

    const totalReFinanceCaseAmount = data
      .filter((item) => item.trial_money_cleared_status === 5)
      .reduce((sum, item) => sum + item.attorney_fees, 0);

    // เพิ่มข้อมูลลงใน Excel
    data.forEach((item, index) => {
      let row = worksheet.addRow({
        no: index + 1,
        contno: item.CONTNO,
        cusName: `${item.customer_title}${item.customer_name} ${item.customer_lastname}`,
        judgeDate: convertDateThaiShort(item.trial_money_cleared_datetime),
        actionDate: item.attorney_fees_payment_datetime
          ? convertDateThaiShort(item.attorney_fees_payment_datetime)
          : "-",
        judgement:
          item.trial_money_cleared_status === 1
            ? currencyFormatComma(item.attorney_fees)
            : null,
        judgementAgreement:
          item.trial_money_cleared_status === 2
            ? currencyFormatComma(item.attorney_fees)
            : null,
        withdrawCase:
          item.trial_money_cleared_status === 3
            ? currencyFormatComma(item.attorney_fees)
            : null,
        status:
          item.attorney_fees_payment_status === 1
            ? "อนุมัติ"
            : item.attorney_fees_payment_status === 2
            ? "ไม่อนุมัติ"
            : "รอดำเนินการ",
      });

      // จัดกึ่งกลางทุกเซลล์ในแถว
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    // ✅ เพิ่มแถวรวมยอด
    let detailRow = worksheet.addRow({
      no: "",
      contno: "",
      cusName: "",
      actionDate: "รวม",
      judgement: currencyFormatComma(totalJudgeAmount),
      judgementAgreement: currencyFormatComma(totalJudgeAgreementAmount),
      withdrawCase: currencyFormatComma(totalWithdrawCaseAmount),

      status: "",
    });

    // ทำให้แถวรวมยอดเป็นตัวหนา
    detailRow.font = { bold: true };

    // จัดกึ่งกลางแถวรวมยอด
    detailRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // ✅ เพิ่มแถวรวมยอด
    let totalRow = worksheet.addRow({
      no: "",
      contno: "",
      cusName: "",

      actionDate: "รวมยอดอนุมัติทั้งหมด",
      judgement: currencyFormatComma(totalApprovedAmount),
      judgementAgreement: "",
      withdrawCase: "",

      status: "",
    });

    // ทำให้แถวรวมยอดเป็นตัวหนา
    totalRow.font = { bold: true };

    // จัดกึ่งกลางแถวรวมยอด
    totalRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ดาวน์โหลดไฟล์
    saveAs(
      blob,
      `รายงานค่าคอม ${lawyerName} ${convertDateThaiShort(
        selectedDate[0]
      )} - ${convertDateThaiShort(selectedDate[1])}.xlsx`
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
      title: "ผู้รับผิดชอบคดี",
      align: "center",
      render: (record) => <>{record.NNAME ? record.NNAME : null}</>,
    },
    {
      title: "วันที่พิพากษา",
      align: "center",
      render: (record) => (
        <>
          {record.trial_money_cleared_datetime
            ? convertDateThaiShort(record.trial_money_cleared_datetime)
            : null}
        </>
      ),
    },
    {
      title: "วันที่อนุมัติ",
      align: "center",
      render: (record) => (
        <>
          {record.attorney_fees_payment_datetime
            ? convertDateThaiShort(record.attorney_fees_payment_datetime)
            : null}
        </>
      ),
    },
    {
      title: "จำนวนเงิน",
      align: "center",
      render: (record) => <>{currencyFormatComma(record.attorney_fees)}</>,
      // render: (record) => (
      //   <>
      //     {userCompany === "3"
      //       ? record.LOAN_TYPE_ID === 2 || record.LOAN_TYPE_ID === 5
      //         ? "2,000"
      //         : "3,000"
      //       : record.LOAN_TYPE_ID === 2 || record.LOAN_TYPE_ID === 5
      //       ? "2,500"
      //       : "3,500"}
      //   </>
      // ),
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

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"24"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Space direction="vertical" size={12}>
                <Select
                  placeholder="เลือกทนาย"
                  showSearch
                  optionFilterProp="label"
                  value={lawyerId}
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
                popupMatchSelectWidth={false}
                value={statusId}
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
            <Col span={"24"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Space direction="vertical" size={12}>
                <RangePicker
                  size="large"
                  style={{ marginRight: "10px" }}
                  onChange={(dates) => {
                    if (dates) {
                      onSearchByDate(dates);
                    }
                  }}
                  value={selectedDate}
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
          </Row>
          <Row>
            <Col
              span={"12"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
              <Popconfirm
                placement="topLeft"
                title="อัพเดทสถานะหลายสัญญา"
                description="คุณต้องการอัพเดทสถานะให้ทนายใช่หรือไม่ ?"
                onConfirm={() => confirmInsertAll()}
                onCancel={() => cancelAll()}
                okText="อนุมัติ"
                cancelText="ไม่อนุมัติ"
              >
                <Button style={{ fontSize: "20px", color: "green" }}>
                  <DollarOutlined />
                </Button>
              </Popconfirm>
            </Col>
            <Col span={"12"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Tooltip
                placement="bottom"
                title="คลิกเพื่อบันทึกสรุปรายงาน"
                arrow={mergedArrow}
              >
                <PrinterOutlined
                  style={{
                    fontSize: "40px",
                    color: printOption ? "green" : "blue",
                    cursor: "pointer",
                  }}
                  key="print"
                  onClick={() => {
                    createAndDownloadExcel();
                  }}
                />
              </Tooltip>
            </Col>
            <Col span={"24"}>
              <Table
                size="small"
                columns={columns}
                dataSource={arrayTable}
                rowSelection={rowSelection}
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
                rowKey="key"
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
};

const CommissionLaw = MotionHoc(Main);
export default CommissionLaw;
