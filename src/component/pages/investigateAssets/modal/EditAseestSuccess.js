import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
  Radio,
  Tooltip,
  DatePicker,
  Image,
  InputNumber,
} from "antd";
import {
  baseUrl,
  HEADERS_EXPORT,
  POST_CALCULATE_LAND,
  PUT_INVESTIGATE_ITEM_BY_ID,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import TextArea from "antd/es/input/TextArea";
import LoadLawyers from "../../../../hook/LoadLawyers";
import dayjs from "dayjs";
import LoadLandDetail from "../../../../hook/LoadLandDetail";
import DateCustom from "../../../../hook/DateCustom";
import {
  InboxOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";
import Dragger from "antd/es/upload/Dragger";
import DateInput from "../../../../hook/DateInput";

const EditAssetsSuccess = ({
  open,
  close,
  dataLoan,
  dataDefualt,
  governmentOfficers,
  handleEdit,
  dataIndex,
}) => {
  const [form] = Form.useForm();
  const [convertDateThai] = DateCustom();
  const [loadLandDetailList, setLoadingLandDetailData] = LoadLandDetail();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [currencyFormatComma] = CurrencyFormat();
  const [assistantOption, setAssistantOption] = useState();
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [averageStatus, setAverageStatus] = useState(null);
  const [sequestrateStatus, setSequestrateStatus] = useState(null);
  const [mortgageStatus, setMortgageStatus] = useState(null);
  const [landPrice, setLandPrice] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [refAssetOption, setRefAssetOption] = useState([]);
  const [radioRefAsset, setRadioRefAsset] = useState();
  const [dataLandDetailList, setDataLandDetailList] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [inputType, setInputType] = useState("manual"); // หรือ "manual"

  const optionsMortgageStatus = [
    { label: "ไม่ติดภาระ", value: 0 },
    { label: "ติดภาระจำนอง", value: 1 },
    { label: "ติดภาระขายฝาก", value: 2 },
  ];

  const optionsSequestrateStatus = [
    { label: "ไม่ติดอายัด", value: 0 },
    { label: "ติดอายัด", value: 1 },
  ];

  const optionsAverageStatus = [
    { label: "ไม่พอเฉลี่ย", value: 0 },
    { label: "พอเฉลี่ย", value: 1 },
  ];

  console.log("dataIndex--->", dataIndex);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      setLoadingData(true);
      setLoadingLandDetailData(true);
      loadImagesProduct();
    }
    handleCustomerOption();
    let dataWa;
    if (dataIndex.wa && dataIndex.subwa) {
      dataWa = `${dataIndex.wa}.${dataIndex.subwa}`;
    } else if (dataIndex.wa && !dataIndex.subwa) {
      dataWa = `${dataIndex.wa}`;
    } else if (!dataIndex.wa && dataIndex.subwa) {
      dataWa = `0.${dataIndex.subwa}`;
    } else {
      dataWa = 0;
    }

    form.setFieldsValue({
      customerAsset: dataIndex.CUSTOMER_ID,
      possessorAsset: dataIndex.possessor,
      ralation:
        dataIndex.mark.split("*")[0] === "เป็นสามีภรรยา"
          ? "เป็นสามีภรรยา****"
          : dataIndex.mark.split("*")[0] === "ไม่เป็นสามีภรรยา"
          ? "ไม่เป็นสามีภรรยา****"
          : null,
      deed: dataIndex.deed_number,
      assetProvince: dataIndex.province,
      assetDistrict: dataIndex.district,
      propertyDetail: dataIndex.property_detail_id,
      assetPropotyType: dataIndex.property_type_id,
      ownerAsset: dataIndex.owner,
      mortgageStatus: !dataIndex.mortgagee ? 0 : 1,
      sequestrateStatus: dataIndex.sequestrate_status,
      investigatorAsset: dataIndex.investigator_user_id,
      memo: dataIndex.mark,
      urlFile: dataIndex.investigate_filepath,
      mortgagee: dataIndex.mortgagee,
      mortgageBalance: currencyFormatComma(dataIndex.mortgage_balance),
      investigateAssetsTime: dataIndex.investigation_type_id,
      rai: dataIndex.rai,
      ngan: dataIndex.ngan,
      wa: dataWa,
      preferenceCreditor: dataIndex.preference_creditor,
      estimatedPrice: currencyFormatComma(dataIndex.estimated_price),
      averageStatus:
        dataIndex.estimated_price > dataIndex.mortgage_balance ? 1 : 0,
      estimatedEnforcePrice: dataIndex?.estimated_enforce_price
        ? dataIndex?.estimated_enforce_price
        : null,
      AddrEnforce: dataIndex?.legal_execution_office
        ? dataIndex?.legal_execution_office
        : null,
      judgmentCreditorDate: dataIndex?.seize_date
        ? dayjs(dataIndex?.seize_date)
        : null,
    });
  }, [isModal]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
    if (loadLandDetailList) {
      setOptionLandDetail();
    }
  }, [lawyersList, loadLandDetailList]);

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

  const loadImagesProduct = async () => {
    console.log(dataDefualt);

    await axios
      .get(
        baseUrl +
          `/files/lawyer/investigate-property/${PARAM_PUBLIC}/${dataDefualt?.CONTNO}_${dataIndex?.CUSTOMER_ID}_${dataIndex?.deed_number}_${dataIndex?.province}_${dataIndex?.district}`
      )
      .then((response) => {
        console.log("ImageList", response.data);
        setImageList(response.data);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleCustomerOption = () => {
    console.log("governmentOfficers", governmentOfficers);
    let dataGovernmentOfficers = [];

    dataGovernmentOfficers.push({
      id: governmentOfficers.id,
      ADDRESS: governmentOfficers.ADDRESS,
      GARNO: governmentOfficers.GARNO,
      SNAME: governmentOfficers.SNAM,
      NAME1: governmentOfficers.NAME1,
      NAME2: governmentOfficers.NAME2,
    });

    governmentOfficers.guarantors.forEach((guarantor, index) => {
      // ตรวจสอบว่าใน values มีข้อมูลสำหรับแต่ละ guarantor หรือไม่
      dataGovernmentOfficers.push({
        id: guarantor.id,
        ADDRESS: guarantor.ADDRESS,
        GARNO: guarantor.GARNO,
        SNAME: guarantor.SNAM,
        NAME1: guarantor.NAME1,
        NAME2: guarantor.NAME2,
      });
    });
    console.log("dataGovernmentOfficers", dataGovernmentOfficers);
    const optionsGovernmentOfficers = dataGovernmentOfficers.map((item) => ({
      value: item.id,
      label: `${item.SNAME}${item.NAME1} ${item.NAME2}`,
    }));
    setRefAssetOption(optionsGovernmentOfficers);
  };

  const setOptionLandDetail = () => {
    console.log("setOptionLandDetail", loadLandDetailList);

    const optionLandDetail = loadLandDetailList.find(
      (item) => item.id === dataIndex.property_detail_id
    );

    const result = optionLandDetail
      ? { value: optionLandDetail.id, label: optionLandDetail.description }
      : {};

    setDataLandDetailList(result);
  };

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 3) {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4) &&
          item.ACTIVE_STATUS === 1
      );
    } else {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4) &&
          item.ACTIVE_STATUS === 1
      );
    }
    const optionsAssistant = companySelectAssistant.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setAssistantOption(optionsAssistant);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const onChangeInputOwner = (value) => {
    console.log(value);
  };

  const onChangeInputPreferenceCreditor = (value) => {
    console.log(value);
  };

  const onChangeMortgageBalance = (value) => {
    console.log(value);
    let inputValue = value;

    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      let setAverage = dataIndex.estimated_price
        ? dataIndex.estimated_price - intValue
        : 0;
      console.log("serAverage", setAverage);
      form.setFieldsValue({
        mortgageBalance: formattedValue,
        averageStatus: setAverage > 1 ? 1 : 0,
      });
      console.log("formattedValue", formattedValue);
    } else {
      let setAverage = landPrice
        ? parseInt(landPrice.replace(/,/g, "")) - value
        : 0;
      form.setFieldsValue({
        mortgageBalance: inputValue,
        averageStatus: setAverage > 1 ? 1 : 0,
      });
    }
  };

  const onChangeMortgageStatus = ({ target: { value } }) => {
    console.log("radio Mortgage checked", value);
    setMortgageStatus(value);
    if (value === 0) {
      form.setFieldsValue({
        mortgageBalance: null,
        mortgagee: null,
      });
    }
  };

  const onChangeSequestrateStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setSequestrateStatus(value);
  };

  const onChangeAverageStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setAverageStatus(value);
  };

  const onChangeRefAsset = ({ target: { value } }) => {
    console.log("onChangeCustomerAsset", value);
    setRadioRefAsset(value);
    let result = refAssetOption.find((item) => item.value === value);
    console.log(result);
    if (result) {
      form.setFieldsValue({
        possessorAsset: result.label,
      });
    }
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let putDataInvestigate;
    putDataInvestigate = {
      ...dataIndex,
      owner: values?.ownerAsset ? values?.ownerAsset : null,
      mortgagee: values?.mortgagee ? values?.mortgagee : null,
      sequestrate_status:
        values?.sequestrateStatus === 1
          ? values?.sequestrateStatus
          : values?.sequestrateStatus === 0
          ? values?.sequestrateStatus
          : null,
      preference_creditor: values?.preferenceCreditor
        ? values?.preferenceCreditor
        : null,
      mortgage_balance:
        values?.mortgageBalance &&
        typeof values.mortgageBalance === "string" &&
        values.mortgageBalance.includes(",")
          ? parseInt(values?.mortgageBalance.replace(/,/g, ""))
          : parseInt(values.mortgageBalance)
          ? parseInt(values.mortgageBalance)
          : null,
      average_status:
        values.averageStatus === 1
          ? values.averageStatus
          : values.averageStatus === 0
          ? values.averageStatus
          : null,
      mark: values.memo,
      investigate_filepath: values.urlFile,
      estimated_enforce_price: values?.estimatedEnforcePrice
        ? values?.estimatedEnforcePrice
        : null,
      legal_execution_office: values?.AddrEnforce ? values?.AddrEnforce : null,
      seize_date: values.judgmentCreditorDate
        ? dayjs(values.judgmentCreditorDate).format("YYYY-MM-DD")
        : null,
      fileList: fileList,
    };

    console.log("postDataInvestigate---->", putDataInvestigate);

    sendStatus(putDataInvestigate, dataIndex);
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

  const sendStatus = async (putDataInvestigate, dataIndex) => {
    setLoading(true);
    try {
      console.log("investigateStatus ", putDataInvestigate);
      await axios
        .put(baseUrl + PUT_INVESTIGATE_ITEM_BY_ID, putDataInvestigate, {
          headers: HEADERS_EXPORT,
        })
        .then((resQuery) => {
          if (resQuery.status === 200) {
            console.log(resQuery.data);
            message.success(`อัพเดทข้อมูลสำเร็จ`);
            if (putDataInvestigate.fileList.length > 0) {
              console.log(putDataInvestigate.fileList);
              handleUploadAllImage(
                putDataInvestigate.fileList,
                putDataInvestigate
              ); // ส่งไฟล์ไปอัปโหลดทีละตัว
            } else {
              console.warn(
                "⚠️ ไม่มีไฟล์ใน fileList สำหรับ",
                putDataInvestigate.CUSTOMER_ID
              );
            }
            handleEdit(putDataInvestigate, dataIndex);
            return resQuery.data;
          } else {
            console.log(`แก้ไขข้อมูลสำเร็จ`);
            return null;
          }
        })
        .catch((err) => {
          console.error(err);
          message.error(`แก้ไขข้อมูลไม่สำเร็จ`);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const handleUploadAllImage = (fileList, item) => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    axios
      .post(
        `${baseUrl}/files/lawyer/investigate-property/${PARAM_PUBLIC}/${dataDefualt?.CONTNO}_${item?.CUSTOMER_ID}_${item?.deed_number}_${item?.province}_${item?.district}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
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
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
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
        initialValues={{
          memo: null,
          suspensionAmount: 0,
          investigateAssetsDate: dayjs(),
        }}
      >
        <Form.Item label="วันที่สืบทรัพย์" name="investigateAssetsDate">
          {convertDateThai(dataIndex.investigation_date)}
        </Form.Item>
        <Form.Item label="ห้วงเวลาการฟ้อง" name="investigateAssetsTime">
          {dataIndex.investigation_type_id === 1 ? "ก่อนฟ้อง" : "หลังฟ้อง"}
        </Form.Item>

        <Form.Item label="บุคคลที่อ้างอิง" name="customerAsset">
          <Radio.Group
            label="เลือกเจ้าของทรัพย์"
            name="customerAsset"
            options={refAssetOption}
            onChange={onChangeRefAsset}
            value={radioRefAsset}
            disabled
          />
        </Form.Item>

        <Form.Item label="ชื่อเจ้าของทรัพย์" name="possessorAsset">
          {dataIndex.possessor}
        </Form.Item>
        <Tooltip
          placement="bottom"
          title="ความเกี่ยวข้องของผู้ทำสัญญาหรือผู้ค้ำกับเจ้าของทรัพย์"
          arrow={mergedArrow}
        >
          <Form.Item label="เลือกความเกี่ยวข้อง" name="ralation">
            {dataIndex.mark.split("*")[0] === "เป็นสามีภรรยา"
              ? "เป็นสามีภรรยา"
              : dataIndex.mark.split("*")[0] === "ไม่เป็นสามีภรรยา"
              ? "ไม่เป็นสามีภรรยา"
              : null}
          </Form.Item>
        </Tooltip>
        <Form.Item label="ประเภททรัพย์" name="assetPropotyType">
          {dataIndex.property_type_id === 1 ? "น.ส.4 จ" : "น.ส.3 ก"}
        </Form.Item>
        <Form.Item label="ลักษณะที่ดิน" name="propertyDetail">
          {dataLandDetailList?.label}
        </Form.Item>
        <Form.Item label="เลขโฉนด/เลขที่ดิน" name="deed">
          {dataIndex.deed_number}
        </Form.Item>

        <Form.Item label="จังหวัด" name="assetProvince">
          {dataIndex.province_desc}
        </Form.Item>
        <Form.Item label="อำเภอ" name="assetDistrict">
          {dataIndex.district_desc}
        </Form.Item>

        <Form.Item label="ไร่" name="rai">
          {dataIndex.rai}
        </Form.Item>
        <Form.Item label="งาน" name="ngan">
          {dataIndex.ngan}
        </Form.Item>
        <Form.Item label="ตารางวา" name="wa">
          {dataIndex.wa && dataIndex.subwa
            ? `${dataIndex.wa}.${dataIndex.subwa}`
            : dataIndex.wa && !dataIndex.subwa
            ? `${dataIndex.wa}`
            : !dataIndex.wa && dataIndex.subwa
            ? `0.${dataIndex.subwa}`
            : 0}
        </Form.Item>
        <Form.Item label="เลขระหว่าง" name="utm">
          {dataIndex?.utm ? dataIndex?.utm : "-"}
        </Form.Item>
        <Tooltip
          placement="bottom"
          title={landPrice?.utm ? "คลิกเพื่อเข้าสู่เว็บ google map" : null}
          arrow={mergedArrow}
        >
          <Form.Item label="ตำแหน่ง" name="latlon">
            {dataIndex?.latitude || dataIndex.longitude ? (
              <a
                href={
                  `https://www.google.com/maps/place/@${
                    dataIndex?.latitude ? dataIndex?.latitude : null
                  },${
                    dataIndex.longitude ? dataIndex.longitude : null
                  },1096m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D` ||
                  "#"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {dataIndex?.latitude ? dataIndex?.latitude : null},{" "}
                {dataIndex.longitude ? dataIndex.longitude : null}
              </a>
            ) : null}
          </Form.Item>
        </Tooltip>
        <Form.Item label="ราคาประเมิน" name="estimatedPrice">
          {currencyFormatComma(dataIndex.estimated_price)}
        </Form.Item>
        {/* 
        <Form.Item label="ผู้ถือกรรมสิทธิ์" name="ownerAsset">
          <Input onChange={(e) => onChangeInputOwnerAssetLaw(e.target.value)} />
        </Form.Item> */}
        <Form.Item
          label="ติดภาระจำนอง/ขายฝาก"
          name="mortgageStatus"
          rules={[
            {
              required: true,
              message: "กรุณาเลือก !",
            },
          ]}
        >
          <Radio.Group
            label="ติดภาระจำนอง/ขายฝาก"
            name="mortgageStatus"
            options={optionsMortgageStatus}
            onChange={onChangeMortgageStatus}
            value={mortgageStatus}
          />
        </Form.Item>

        {dataIndex.mortgagee || mortgageStatus === 1 || mortgageStatus === 2 ? (
          <>
            <Form.Item
              label="เจ้าหนี้จำนอง/ขายฝาก"
              name="mortgagee"
              rules={[
                {
                  required: true,
                  message: "กรณากรอกข้อมูล !",
                },
              ]}
            >
              <Input onChange={(e) => onChangeInputOwner(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="ยอดหนี้จำนอง/ขายฝาก"
              name="mortgageBalance"
              rules={[
                {
                  required: true,
                  message: "กรณากรอกข้อมูล !",
                },
              ]}
            >
              <Input
                name="estimatedPrice"
                onChange={(e) => onChangeMortgageBalance(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="วันที่ทำสัญญา">
              <Radio.Group
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                style={{ marginBottom: 8 }}
              >
                <Radio value="picker">เลือกจากปฏิทิน</Radio>
                <Radio value="manual">กรอกเอง</Radio>
              </Radio.Group>

              {inputType === "picker" ? (
                <Form.Item name="contractDatePicker" noStyle>
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    placeholder="เลือกวันที่"
                  />
                </Form.Item>
              ) : (
                <Form.Item name="contractDateManual" noStyle>
                  <DateInput />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item label="กำหนดไถ่ถอน">
              <Radio.Group
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                style={{ marginBottom: 8 }}
              >
                <Radio value="picker">เลือกจากปฏิทิน</Radio>
                <Radio value="manual">กรอกเอง</Radio>
              </Radio.Group>

              {inputType === "picker" ? (
                <Form.Item name="dueDatePicker" noStyle>
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    placeholder="เลือกวันที่"
                  />
                </Form.Item>
              ) : (
                <Form.Item name="dueDateManual" noStyle>
                  <DateInput />
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item
              label="พอเฉลี่ย"
              name="averageStatus"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือก !",
                },
              ]}
            >
              <Radio.Group
                label="พอเฉลี่ย"
                name="averageStatus"
                options={optionsAverageStatus}
                onChange={onChangeAverageStatus}
                value={averageStatus}
              />
            </Form.Item>
          </>
        ) : null}
        <Form.Item
          label="ติดอายัด"
          name="sequestrateStatus"
          rules={[
            {
              required: true,
              message: "กรุณาเลือก !",
            },
          ]}
        >
          <Radio.Group
            label="ผลการติดอายัด"
            name="sequestrateStatus"
            options={optionsSequestrateStatus}
            onChange={onChangeSequestrateStatus}
            value={sequestrateStatus}
          />
        </Form.Item>
        {dataIndex.sequestrate_status === 1 || sequestrateStatus === 1 ? (
          <>
            <Form.Item
              label="เจ้าหนี้คำพิพากษา"
              name="preferenceCreditor"
              rules={[
                {
                  required: true,
                  message: "กรณากรอกข้อมูล !",
                },
              ]}
            >
              <Input
                onChange={(e) =>
                  onChangeInputPreferenceCreditor(e.target.value)
                }
              />
            </Form.Item>
            <Form.Item
              label="เลขคดีแดง"
              name="ownerAsset"
              rules={[
                {
                  required: true,
                  message: "กรณากรอกข้อมูล !",
                },
              ]}
            >
              <Input name="ownerAsset" />
            </Form.Item>
            <Form.Item
              label="วันที่โดนอายัด"
              name="judgmentCreditorDate"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกวันที่สืบทรัพย์",
                },
              ]}
            >
              <DatePicker name="judgmentCreditorDate" />
            </Form.Item>
            <Tooltip
              placement="bottom"
              title="ราคาประเมินจากกรมบังคับคดี"
              arrow={mergedArrow}
            >
              <Form.Item
                label="ราคาประเมิน(จพค.)"
                name="estimatedEnforcePrice"
                style={{ color: "red" }}
              >
                <InputNumber
                  name="estimatedEnforcePrice"
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="จำนวนเงินที่จำเลยต้องชำระ"
                  style={{ width: "100%", color: "black" }}
                />
              </Form.Item>
            </Tooltip>
            <Form.Item label="สำนักงานบังคับคดี" name="AddrEnforce">
              <Input name="AddrEnforce" />
            </Form.Item>
          </>
        ) : null}
        <Form.Item
          label="เลือกผู้สืบทรัพย์"
          name="investigatorAsset"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกผู้สืบทรัพย์ !",
            },
          ]}
        >
          {assistantOption?.find(
            (item) => item.value === dataIndex.investigator_user_id
          )?.label || "ไม่พบชื่อ"}
          {/* <Select
            placeholder="เลือกผู้สืบทรัพย์"
            showSearch
            optionFilterProp="label"
            disabled
            onChange={(value) => onChangeSelectInvestigatorAsset(value)}
            options={assistantOption}
            style={{ width: "100%" }}
            
          /> */}
        </Form.Item>
        {imageList.length > 0 ? (
          <Form.Item label="ไฟล์/ภาพที่บันทึก" name={"imageFile"}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px", // เพิ่มช่องว่างระหว่างแต่ละไฟล์
                justifyContent: "center", // จัดให้อยู่ตรงกลาง
              }}
            >
              <Image.PreviewGroup>
                {imageList?.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px", // ระยะห่างระหว่างไอคอนกับลิงก์
                      textAlign: "center",
                    }}
                  >
                    {image.url.includes("pdf") ? (
                      <>
                        <FilePdfOutlined
                          style={{ fontSize: "40px", color: "red" }}
                        />
                        {image.url ? (
                          <a
                            style={{
                              display: "block",
                              marginTop: "8px",
                            }}
                            href={image.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            คลิกเพื่อดาวน์โหลด
                          </a>
                        ) : null}
                      </>
                    ) : image.url.includes(".xlsx") ? (
                      <>
                        <FileExcelOutlined
                          style={{ fontSize: "40px", color: "green" }}
                        />
                        {image.url ? (
                          <a
                            style={{
                              display: "block",
                              marginTop: "8px",
                            }}
                            href={image.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            คลิกเพื่อดาวน์โหลด
                          </a>
                        ) : null}
                      </>
                    ) : image.url.includes(".docx") ? (
                      <>
                        <FileWordOutlined
                          style={{ fontSize: "40px", color: "blue" }}
                        />
                        {image.url ? (
                          <a
                            style={{
                              display: "block",
                              marginTop: "8px",
                            }}
                            href={image.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            คลิกเพื่อดาวน์โหลด
                          </a>
                        ) : null}
                      </>
                    ) : (
                      <Image
                        src={image.url}
                        alt={`Captured ${index}`}
                        width="150px"
                      />
                    )}
                  </div>
                ))}
              </Image.PreviewGroup>
            </div>
          </Form.Item>
        ) : null}

        <Form.Item
          label="อัปโหลดไฟล์/รูปภาพ"
          name="imageUrlFile"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกผู้สืบทรัพย์ !",
            },
          ]}
        >
          <Dragger
            {...props}
            style={{
              width: "300px", // กำหนดความกว้าง
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
          <Form.Item label="อัปโหลดไฟล์เพิ่มเติม" name={"imageFile"}>
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
            onChange={(e) => onChangeInputMemo(e.target.value)}
          />
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Button
            onClick={handleCancel}
            style={{ color: "red", marginRight: "20px" }}
          >
            ปิด
          </Button>

          <Button style={{ color: "green" }} htmlType="submit">
            บันทึก
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <>
      <Modal
        title={`แก้ไขรายละเอียดข้อมูลที่ดิน`}
        open={open}
        onCancel={handleCancel}
        width={650}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default EditAssetsSuccess;
