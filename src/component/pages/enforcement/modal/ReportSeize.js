import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  message,
  Spin,
  Checkbox,
  Upload,
  Popconfirm,
  List,
  Image,
} from "antd";
import {
  baseUrl,
  GET_LOAN_BY_CONTNO,
  GET_WORK_LOG_DETAIL_BY_ID,
  HEADERS_EXPORT,
  POST_AGREEMENTS,
  POST_JUDGE,
  POST_JUDGE_DEFENDANTS,
  POST_STATUS,
  PUT_INVESTIGATE_ITEM_BY_ID,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import {
  InboxOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import LoadLawyers from "../../../../hook/LoadLawyers";
import {
  PARAM_PUBLIC,
  SELL_ASSETS,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import Dragger from "antd/es/upload/Dragger";
import { Link } from "react-router-dom";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import CheckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import EditAseestSuccess from "./EditAseestSuccess";

const ReportSeize = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [setupGovernmentOfficerList, governmentOfficers] =
    CheckGovermentOfficer();
  const USER_ID = localStorage.getItem("USER_ID");
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [form] = Form.useForm();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [assistantOption, setAssistantOption] = useState();
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [arrow, setArrow] = useState("Show");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [isModalEditAssetsDetail, setIsModalEditAssetsDetail] = useState(false);
  const [dataPropertyList, setDataPropertyList] = useState([]);
  const [dataEdit, setDataEdit] = useState();
  const [customerPropertyList, setCustomerPropertyList] = useState([]);
  const [guarantorPropertyList, setGuarantorPropertyList] = useState([]);
  const [flag, setFlag] = useState();
  const [capturedImages, setCapturedImages] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();

      setCustomerPropertyList(dataDefualt?.customer_property_list);
      setGuarantorPropertyList(dataDefualt?.guarantor_property_list);
      //   setLoadingData(true);
    }
  }, [isModal]);

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

  const handleCancel = () => {
    close(false);
  };

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 1 || COMPANY === 2) {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4)
      );
    } else {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4)
      );
    }
    const optionsAssistant = companySelectAssistant.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setAssistantOption(optionsAssistant);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [worklogs, loanRes] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${dataDefualt.WORK_LOG_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
      ]);

      if (worklogs.status === 200) {
        setDataLoadLawSuit(worklogs.data);
        setDataStore(worklogs.data);
        console.log("worklogs.data---->", worklogs.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      if (loanRes.status === 200) {
        setDataLoadLoan(loanRes.data);
        setupGovernmentOfficerList(loanRes.data);
        console.log("loanRes.data---->", loanRes.data);
      } else {
        message.error("ไม่พบข้อมูลเงิน");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (preData, sellStatus, putStatus) => {
    setLoading(true);

    try {
      // ใช้ map() เพื่อสร้าง Promise array
      const promises = preData.map(async (item) => {
        console.log("กำลังส่งข้อมูล:", item);

        return axios.put(baseUrl + PUT_INVESTIGATE_ITEM_BY_ID, item, {
          headers: HEADERS_EXPORT,
        });
      });

      // รอให้ทุก API request เสร็จ
      const responses = await Promise.all(promises);

      await axios
        .put(baseUrl + PUT_STATUS, putStatus, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            funcUpdateStatus(putStatus);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });

      // ตรวจสอบว่า API ตอบกลับสำเร็จหรือไม่
      if (responses.every((res) => res.status === 200)) {
        message.success("อัพเดทข้อมูลทั้งหมดสำเร็จ");
      } else {
        message.warning("บางรายการอัพเดทไม่สำเร็จ");
      }
      await axios
        .post(baseUrl + POST_STATUS, sellStatus, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });

      handleUploadAllImage();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล:", error);
      message.error("อัพเดทข้อมูลล้มเหลว");
    } finally {
      console.log("sendStatus okay");
      setLoading(false);
    }
  };

  const handleUploadAllImage = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    await axios
      .post(
        baseUrl +
          `/files/lawyer/seize_assets/${PARAM_PUBLIC}/report-seize_${dataDefualt.CONTNO}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setFileList([]);
      })
      .catch((err) => {
        Modal.error({
          title: "ผิดพลาด",
          content: err.message,
          centered: true,
        });
      })
      .finally(() => {
        setLoading(false);
        handleCancel();
      });
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    let preData = [];
    let initData = {
      legal_execution_office: values.addrEnforce,
      seize_date: dayjs(values.investigateAssetsDate).format("YYYY-MM-DD"),
      seize_status: 1,
    };
    console.log("dataDefualt", dataDefualt);

    const sellStatus = {
      USER_ID: parseInt(USER_ID),
      LOAN_ID: dataDefualt.id,
      LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
      LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
      MEMO: values.memo,
      DATE: dayjs(values.investigateAssetsDate).format("YYYY-MM-DD"),
      MAIN_STATUS_ID: SELL_ASSETS,
    };

    const putStatus = {
      id: dataDefualt.WORK_LOG_ID,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_ID: dataDefualt.id,
      MEMO: values.memo,
      DATE: dataDefualt.DATE,
      PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
      LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
    };
    console.log("sellStatus", sellStatus);
    console.log("putStatus", putStatus);

    if (fileList?.length > 0) {
      if (selectedAssets?.length > 0) {
        console.log("selectedAssets--->", selectedAssets);
        preData = selectedAssets.map((asset) => ({
          ...asset, // คัดลอกข้อมูลเดิมของ asset
          ...initData, // เพิ่มข้อมูลของ initData เข้าไป
        }));
        console.log("preData", preData);

        sendStatus(preData, sellStatus, putStatus);
      } else {
        message.error("กรุณาเลือกแปลงที่อยู่ในรายงานบันทึกการยึด");
      }
    } else {
      message.error("กรุณาอัปโหลดรูปภาพ");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeSeizeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleSelectAsset = (checked, item) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, item]);
    } else {
      setSelectedAssets(selectedAssets.filter((i) => i.id !== item.id));
    }
  };

  const handleUpdateDataEdit = (data, flag) => {
    console.log("data---->update", data);
    if (data && flag === "guarantorAsset") {
      const result = guarantorPropertyList.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      console.log("guarantorPropertyList result--->", result);
      setGuarantorPropertyList(result);
    } else {
      const result = customerPropertyList.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        } else {
          return { ...item };
        }
      });

      console.log("customerPropertyList result--->", result);
      setCustomerPropertyList(result);
    }
  };

  const handleEdit = (item, index, flag) => {
    setFlag(flag);
    if (flag === "guarantorAsset") {
      console.log("flag1---->", flag);
      setDataEdit(guarantorPropertyList[index]);
    } else {
      console.log("customerPropertyList---->", flag);
      setDataEdit(customerPropertyList[index]);
    }

    // setIsModalEditAssetsDetail(true);
    // setDataEdit(dataPropertyList[index]);
    setIsModalEditAssetsDetail(true);

    // setFormValues(dataPropertyList[index]); // ตั้งค่าข้อมูลที่จะแก้ไขให้กับฟอร์ม
  };

  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setCapturedImages(
        (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
      );
    },
    beforeUpload: (file) => {
      const isLt5M = file.size / 1024 / 1024 < 5.1;

      if (!isLt5M) {
        message.error(`❌ ไฟล์ "${file.name}" มีขนาดเกิน 5 MB`);
        return false;
      }

      const fileType = file.type; // ตรวจสอบ MIME type
      const imgUrl = URL.createObjectURL(file); // สร้าง URL ของไฟล์ที่อัปโหลด

      // // แปลง Blob เป็น File ที่มีชื่อไฟล์ถูกต้อง
      // const newFile = new File(
      //   [file],
      //   `สืบทรัพย์_${dataDefualt?.CONTNO}.${
      //     fileType.includes("pdf") ? "pdf" : file.name.split(".").pop()
      //   }`,
      //   { type: fileType }
      // );

      // console.log("ไฟล์ที่ได้:", newFile, "ประเภท:", fileType);

      // ตรวจสอบประเภทและแยกเก็บใน state
      if (fileType.startsWith("image/")) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "image" }]);
      } else if (fileType === "application/pdf") {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "pdf" }]);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "xlsx" }]);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "docx" }]);
      }

      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
  };

  const deleteImg = (index) => {
    setCapturedImages(
      (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
    );
    setFileList(
      (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
    );
  };

  const confirm = () => {
    form.submit(); // ส่งฟอร์มเมื่อกด "ยืนยัน"
  };
  const cancel = () => {
    message.success("ยกเลิกทำรายการ");
  };

  const formDataSet = () => {
    return (
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {`${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
            ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
          </p>
        </Form.Item>
        <Form.Item label="เลขคดีดำ" name="blackNo">
          {dataLoadLawSuit?.lawsuit?.black_case_number
            ? dataLoadLawSuit?.lawsuit?.black_case_number
            : "-"}
        </Form.Item>
        <Form.Item label="เลขคดีแดง" name="redNo">
          {dataLoadLawSuit?.judge?.red_case_number
            ? dataLoadLawSuit?.judge?.red_case_number
            : "-"}
        </Form.Item>
        <Form.Item label="พิพากษาจำนวน" name="judgement">
          {dataLoadLawSuit?.judge?.judgement
            ? `${currencyFormatComma(dataLoadLawSuit?.judge?.judgement)} บาท`
            : "-"}
        </Form.Item>
        <Form.Item
          label="วันที่รายงานยึด"
          name="investigateAssetsDate"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่รายงานยึด",
            },
          ]}
        >
          <DatePicker onChange={onChangeSeizeDate} />
        </Form.Item>
        <Form.Item
          label="สำนักงานบังคับคดี"
          name="addrEnforce"
          rules={[
            {
              required: true,
              message: "กรุณากรอกสำนักงานบังคับคดี",
            },
          ]}
        >
          <Input name="addrEnforce" />
        </Form.Item>

        <Form.Item
          label="ทรัพย์ที่สืบพบผู้เช่าซื้อ"
          name="assetsFound"
          labelCol={{ span: 6 }} // กำหนดความกว้างของ label
          wrapperCol={{ span: 16 }} // กำหนดความกว้างของ input หรือ content
        >
          <List
            itemLayout="horizontal"
            dataSource={customerPropertyList}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  !item.seize_status && !item.sequestrate_status && (
                    <Checkbox
                      key={item.id}
                      checked={selectedAssets.some((i) => i.id === item.id)}
                      onChange={(e) =>
                        handleSelectAsset(e.target.checked, item)
                      }
                    >
                      เลือกเพื่อยึด
                    </Checkbox>
                  ),
                  <Link
                    key="list-loadmore-edit"
                    onClick={() => handleEdit(item, index, "customerAsset")}
                  >
                    แก้ไข
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link
                      onClick={() => handleEdit(item, index, "customerAsset")}
                    >
                      {item.possessor} <br /> สืบเมื่อ{" "}
                      {convertDateThai(item.investigation_date)}
                      {item.investigation_type_id === 1
                        ? "(ก่อนฟ้อง)"
                        : item.investigation_type_id === 2
                        ? "(หลังฟ้อง)"
                        : null}
                    </Link>
                  }
                  description={
                    <>
                      <p
                        style={{
                          color: item.estimated_price ? "blue" : "red",
                        }}
                      >
                        {item.estimated_price
                          ? `ยอดประเมินที่ดิน ${currencyFormatComma(
                              item.estimated_price
                            )}  บาท `
                          : "ยังไม่ประเมินจากคุณหนุ่ม"}
                      </p>
                      <p
                        style={{
                          color: item.estimated_enforce_price ? "green" : "red",
                        }}
                      >
                        {item.estimated_enforce_price
                          ? `ยอดประเมินจาก(จพค.) ${currencyFormatComma(
                              item.estimated_enforce_price
                            )}  บาท `
                          : "กรุณาอัพเดทราคาประเมินจากกรมบังคับคดี"}
                      </p>

                      <p>{`เลขโฉนด ${item.deed_number} อำเภอ ${item.district_desc} จังหวัด${item.province_desc}`}</p>
                      <p>หมายเหตุ {item.mark}</p>
                      <p
                        style={{
                          color: item.mortgagee ? "red" : "lightgreen",
                        }}
                      >
                        {item.mortgagee
                          ? `เจ้าหนี้จำนอง ${
                              item.mortgagee
                            } จำนวน ${currencyFormatComma(
                              item.mortgage_balance
                            )} บาท`
                          : null}
                      </p>
                      <p
                        style={{
                          color: item.sequestrate_status ? "red" : "lightgreen",
                        }}
                      >
                        {item.sequestrate_status
                          ? `ติดอายัดกับ ${item.preference_creditor}`
                          : null}
                      </p>
                      <p
                        style={{
                          color:
                            item.estimated_enforce_price > item.mortgage_balance
                              ? "green"
                              : "red",
                        }}
                      >
                        {item.sequestrate_status && item.mortgage_balance
                          ? item.estimated_enforce_price
                            ? item.estimated_enforce_price >
                              item.mortgage_balance
                              ? "พอเฉลี่ย"
                              : "ไม่พอเฉลี่ย"
                            : null
                          : null}
                      </p>
                    </>
                  }
                />
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <p
                    style={{
                      color: !item.seize_status ? "red" : "green",
                    }}
                  >
                    {!item.seize_status ? null : "ยึดแล้ว"}
                  </p>
                  <p
                    style={{
                      color: item.sequestrate_status ? "red" : "green",
                    }}
                  >
                    {item.sequestrate_status ? "ติดอายัด" : null}
                  </p>
                </div>
              </List.Item>
            )}
          />
        </Form.Item>

        <Form.Item
          label="ทรัพย์ที่สืบพบของคนค้ำ"
          name="assetsFound"
          labelCol={{ span: 6 }} // กำหนดความกว้างของ label
          wrapperCol={{ span: 16 }} // กำหนดความกว้างของ input หรือ content
        >
          <List
            itemLayout="horizontal"
            dataSource={guarantorPropertyList}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  !item.seize_status && !item.sequestrate_status && (
                    <Checkbox
                      key={item.id}
                      checked={selectedAssets.some((i) => i.id === item.id)}
                      onChange={(e) =>
                        handleSelectAsset(e.target.checked, item)
                      }
                    >
                      เลือกเพื่อยึด
                    </Checkbox>
                  ),
                  <Link
                    key="list-loadmore-edit"
                    onClick={() => handleEdit(item, index, "guarantorAsset")}
                  >
                    แก้ไข
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link
                      onClick={() => handleEdit(item, index, "guarantorAsset")}
                    >
                      {item.possessor} <br /> สืบเมื่อ{" "}
                      {convertDateThai(item.investigation_date)}
                      {item.investigation_type_id === 1
                        ? "(ก่อนฟ้อง)"
                        : item.investigation_type_id === 2
                        ? "(หลังฟ้อง)"
                        : null}
                    </Link>
                  }
                  description={
                    <>
                      <p
                        style={{
                          color: item.estimated_price ? "blue" : "red",
                        }}
                      >
                        {item.estimated_price
                          ? `ยอดประเมินที่ดิน ${currencyFormatComma(
                              item.estimated_price
                            )}  บาท `
                          : "ยังไม่ประเมินจากคุณหนุ่ม"}
                      </p>
                      <p
                        style={{
                          color: item.estimated_enforce_price ? "green" : "red",
                        }}
                      >
                        {item.estimated_enforce_price
                          ? `ยอดประเมินจากกรมบังคับคดี ${currencyFormatComma(
                              item.estimated_enforce_price
                            )}  บาท `
                          : "กรุณาอัพเดทราคาประเมินจากกรมบังคับคดี"}
                      </p>
                      <p>{`เลขโฉนด ${item.deed_number} อำเภอ ${item.district_desc} จังหวัด${item.province_desc}`}</p>
                      <p>หมายเหตุ {item.mark}</p>
                      <p
                        style={{
                          color: item.mortgagee ? "red" : "lightgreen",
                        }}
                      >
                        {item.mortgagee
                          ? `ผู้รับจำนอง ${
                              item.mortgagee
                            } จำนวน ${currencyFormatComma(
                              item.mortgage_balance
                            )} บาท`
                          : null}
                      </p>
                      <p
                        style={{
                          color: item.sequestrate_status ? "red" : "lightgreen",
                        }}
                      >
                        {item.sequestrate_status
                          ? `ติดอายัดจาก ${item.preference_creditor}`
                          : null}
                      </p>
                      <p
                        style={{
                          color:
                            item.estimated_enforce_price > item.mortgage_balance
                              ? "green"
                              : "red",
                        }}
                      >
                        {item.sequestrate_status && item.mortgage_balance
                          ? item.estimated_enforce_price
                            ? item.estimated_enforce_price >
                              item.mortgage_balance
                              ? "พอเฉลี่ย"
                              : "ไม่พอเฉลี่ย"
                            : null
                          : null}
                      </p>
                    </>
                  }
                />
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <p
                    style={{
                      color: !item.seize_status ? "red" : "green",
                    }}
                  >
                    {!item.seize_status ? null : "ยึดแล้ว"}
                  </p>
                  <p
                    style={{
                      color: item.sequestrate_status ? "red" : "green",
                    }}
                  >
                    {item.sequestrate_status ? "ติดอายัด" : null}
                  </p>
                </div>
              </List.Item>
            )}
          />
        </Form.Item>
        <Form.Item
          label="อัปโหลดไฟล์/รูปภาพ"
          name="imageUrlFile"
          rules={[
            {
              required: true,
              message: "กรุณาอัปโหลดไฟล์/รูปภาพ !",
            },
          ]}
        >
          <Dragger
            {...props}
            style={{
              width: "460px", // กำหนดความกว้าง
              height: "200px", // กำหนดความสูง
              margin: "0 auto", // กำหนดให้อยู่ตรงกลาง
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "blue" }} />
            </p>
            <p className="ant-upload-text">กรุณาคลิกหรือลากเพื่อเลือกไฟล์</p>
            <p className="ant-upload-hint">
              รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม ขนาดไม่เกิน 5 MB/ไฟล์
            </p>
          </Dragger>
        </Form.Item>
        {capturedImages.length > 0 ? (
          <Form.Item label="ไฟล์ที่ต้องการบันทึก" name={"imageFile"}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "center",
                padding: "10px", // เพิ่ม padding เพื่อไม่ให้ชิดขอบเกินไป
              }}
            >
              <Image.PreviewGroup>
                {capturedImages?.map((image, index) => {
                  if (!image || !image.type) return null;

                  return (
                    <div
                      key={index}
                      style={{
                        position: "relative", // ให้ปุ่มลบอยู่บนสุด
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        background: "#f8f8f8",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {/* แสดงไอคอนตามประเภทไฟล์ */}
                      {image.type.includes("pdf") ? (
                        <FilePdfOutlined
                          style={{ fontSize: "40px", color: "red" }}
                        />
                      ) : image.type.includes("xlsx") ? (
                        <FileExcelOutlined
                          style={{ fontSize: "40px", color: "green" }}
                        />
                      ) : image.type.includes("docx") ? (
                        <FileWordOutlined
                          style={{ fontSize: "40px", color: "blue" }}
                        />
                      ) : (
                        <Image
                          src={image.url}
                          alt={`Captured ${index}`}
                          width="150px"
                        />
                      )}

                      {/* ลิงก์ดาวน์โหลด */}
                      {image.url && (
                        <a
                          style={{
                            display: "block",
                            marginTop: "8px",
                            color: "#007bff",
                            textDecoration: "none",
                            fontWeight: "bold",
                          }}
                          href={image.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          คลิกเพื่อดาวน์โหลด
                        </a>
                      )}

                      {/* ปุ่มลบ */}
                      <button
                        type="button"
                        onClick={() => deleteImg(index)}
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </Image.PreviewGroup>
            </div>
          </Form.Item>
        ) : null}
        <Form.Item label="หมายเหตุ" name="memo">
          <TextArea
            rows={5}
            // onChange={(e) => onChangeInputMemo(e.target.value)}
          />
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={handleCancel}
            style={{ color: "red", marginRight: "20px" }}
          >
            ปิด
          </Button>

          <Popconfirm
            placement="topLeft"
            title="อัพเดทข้อมูล"
            description="กรุณาตรวจสอบข้อมูลให้เรียบร้อย !"
            onConfirm={confirm}
            onCancel={() => cancel()}
            okText="ยืนยัน"
            cancelText="ปิด"
          >
            <Button style={{ color: "green" }}>บันทึก</Button>
          </Popconfirm>
        </div>
      </Form>
    );
  };

  return (
    <>
      <Modal
        title={`บันทึกการยึดทรัพย์ ${dataLoadLawSuit?.lawsuit?.CONTNO}/${
          dataLoadLawSuit?.lawsuit?.customer_title
        }${dataLoadLawSuit?.lawsuit?.customer_name} ${
          dataLoadLawSuit?.lawsuit?.customer_lastname
            ? dataLoadLawSuit?.lawsuit?.customer_lastname
            : ""
        }`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          {formDataSet()}
        </Spin>
      </Modal>
      {isModalEditAssetsDetail ? (
        <EditAseestSuccess
          open={isModalEditAssetsDetail}
          close={setIsModalEditAssetsDetail}
          dataLoan={dataLoadLoan}
          dataDefualt={dataDefualt}
          governmentOfficers={governmentOfficers}
          handleEdit={handleUpdateDataEdit}
          dataIndex={dataEdit}
          flag={flag}
        />
      ) : null}
    </>
  );
};
export default ReportSeize;
