import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
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
  POST_INVESTIGATE_ITEM,
} from "../../../API/apiUrls";
import axios from "axios";
import GeoLand from "../../../../hook/GeoLand";
import TextArea from "antd/es/input/TextArea";
import LoadLawyers from "../../../../hook/LoadLawyers";
import dayjs from "dayjs";
import LoadLandDetail from "../../../../hook/LoadLandDetail";
import {
  InboxOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";
import DateInput from "../../../../hook/DateInput";

const AssetsDetail = ({
  open,
  close,
  dataLoan,
  dataDefualt,
  governmentOfficers,
  handleData,
  flag,
}) => {
  const [form] = Form.useForm();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [loadLandDetailList, setLoadingLandDetailData] = LoadLandDetail();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [assistantOption, setAssistantOption] = useState();
  const [
    setLoadingDataProvice,
    dataProvice,
    dataDistrict,
    setDataSearch,
    dataSubDistrict,
    setDataSearchSubDistrict,
  ] = GeoLand();
  const [subDistrict, setSubDistrict] = useState(null);
  const [dataSubDistrictList, setDataSubDistrictList] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sequestrateStatus, setSequestrateStatus] = useState(null);
  const [mortgageStatus, setMortgageStatus] = useState(null);
  const [dataProviceList, setDataProviceList] = useState(null);
  const [dataDistrictList, setDataDistrictList] = useState(null);
  const [assetTypeSelect, setAssetTypeSelect] = useState(false);
  const [resultData, setResultData] = useState({
    pvcode: null,
    amcode: null,
    landNo: null,
  });
  const [arrow, setArrow] = useState("Show");
  const [refAssetOption, setRefAssetOption] = useState([]);
  const [radioRefAsset, setRadioRefAsset] = useState();
  const [ralationSelect, setRalationSelect] = useState();
  const [radioTimeType, setRadioTimeType] = useState(null);
  const [dataLandDetailList, setDataLandDetailList] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [inputType, setInputType] = useState("manual"); // หรือ "manual"

  const optionsMortgageStatus = [
    { label: "ไม่ติดภาระ", value: 0 },
    { label: "ติดจำนอง", value: "จำนอง" },
    { label: "ติดขายฝาก", value: "ขายฝาก" },
  ];

  const optionsSequestrateStatus = [
    { label: "ไม่ติดอายัด", value: 0 },
    { label: "ติดอายัด", value: 1 },
  ];

  const optionsAssetsType = [
    { label: "น.ส.4 จ", value: 1 },
    { label: "น.ส.3 ก.", value: 2 },
  ];

  const optionsRalation = [
    { label: "เป็นสามีภรรยา", value: "เป็นสามีภรรยา****" },
    { label: "ไม่เป็นสามีภรรยา", value: "ไม่เป็นสามีภรรยา****" },
    { label: "เป็นบุตร", value: "เป็นบุตร****" },
  ];

  const optionsInvestigateTime = [
    { label: "ก่อนฟัอง", value: 1 },
    { label: "หลังฟ้อง", value: 2 },
  ];

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      setLoadingData(true);
      setLoadingLandDetailData(true);
      console.log("dataLoan-->", dataLoan);
      setLoadingDataProvice(true);
    }
    handleRefAssetOption();
  }, [isModal]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

  useEffect(() => {
    if (loadLandDetailList) {
      setOptionLandDetail();
    }
  }, [loadLandDetailList]);

  useEffect(() => {
    console.log("dataProvice1");
    if (dataProvice) {
      console.log("dataProvice2");

      setOptionProvice();
    }
  }, [dataProvice]);

  useEffect(() => {
    if (dataDistrict) {
      setOptionDistrict();
    }
  }, [dataDistrict]);

  useEffect(() => {
    if (dataSubDistrict) {
      console.log("dataSubDistrict", dataSubDistrict);

      setOptionSubDistrict();
    }
  }, [dataSubDistrict]);

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

  const handleRefAssetOption = () => {
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
    const governmentSort = dataGovernmentOfficers.sort(
      (a, b) => a.GARNO - b.GARNO
    );

    console.log("dataGovernmentOfficers", governmentSort);
    const optionsGovernmentOfficers = governmentSort.map((item) => ({
      value: item.id,
      label: `${item.SNAME}${item.NAME1} ${item.NAME2 ? item.NAME2 : ""} `,
      // cusType: `${item.GARNO ? `คนค้ำ ${item.GARNO}` : "ผู้เช่าซื้อ"}`,
    }));
    setRefAssetOption(optionsGovernmentOfficers);
  };

  const setOptionLandDetail = () => {
    console.log("setOptionLandDetail", loadLandDetailList);

    const optionsLandDetail = loadLandDetailList.map((item) => ({
      value: item.id,
      label: item.description,
    }));

    setDataLandDetailList(optionsLandDetail);
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

  const setOptionProvice = () => {
    console.log(dataProvice);

    const optionsProvice = dataProvice.map((item) => ({
      value: item.prov_code,
      label: item.prov_desc,
    }));
    setDataProviceList(optionsProvice);
  };

  const setOptionDistrict = () => {
    console.log("dataDistrict", dataDistrict);
    const optionsDistrict = dataDistrict.map((item) => ({
      value: item.dist_code,
      label: item.dist_desc,
    }));
    setDataDistrictList(optionsDistrict);
  };

  const setOptionSubDistrict = () => {
    console.log("dataSubDistrict", dataSubDistrict);
    const optionsSubDistrict = dataSubDistrict.map((item) => ({
      value: item.sub_dist_code,
      label: item.sub_dist_desc,
      code: item.code,
    }));
    setDataSubDistrictList(optionsSubDistrict);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const onChangeInputDeed = (value) => {
    console.log(value);
    setResultData({ ...resultData, landNo: value });
  };

  const onChangeSelectAssetPropotyType = (value) => {
    console.log(`selected ${value}`);
    if (value === 1) {
      setAssetTypeSelect(true);
    } else {
      setAssetTypeSelect(false);
    }
  };

  const onChangeMortgageStatus = ({ target: { value } }) => {
    console.log("radio Mortgage checked", value);
    setMortgageStatus(value);
    if (value === 0) {
      form.setFieldsValue({
        mortgageBalance: null,
        averageStatus: 1,
      });
    }
  };

  const onChangeSequestrateStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setSequestrateStatus(value);
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

  const onChangeRalation = ({ target: { value } }) => {
    console.log("onChangeRalation", value);
    setRalationSelect(value);
    form.setFieldsValue({
      ralation: value,
      memo: value,
    });
  };

  const onChangeSelectProviceAsset = (value) => {
    console.log(`selected provice ${value}`);
    setDataSearch(value);
    setResultData({ ...resultData, prov_code: value });
    form.setFieldsValue({
      assetDistrict: null,
      assetSubDistrict: null,
    });
    setSubDistrict(null);
  };

  const onChangeSelectDistrictAsset = (value) => {
    console.log(`selected District ${value}`);
    setDataSearchSubDistrict(value);
    setResultData({ ...resultData, dist_code: value });
    form.setFieldsValue({
      assetSubDistrict: null,
    });
    setSubDistrict(null);
  };

  const onChangeSelectSubDistrictAsset = (value, data) => {
    console.log(`selected District ${value}`);
    console.log("data", data);
    setSubDistrict(data);
  };

  const onChangeInvestiGateTimeType = ({ target: { value } }) => {
    console.log("radio onChangeInvestiGateTimeType", value);
    setRadioTimeType(value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let postDataInvestigate;

    const province_desc = dataProviceList.filter(
      (item) => item.value === values.assetProvince
    );
    const district_desc = dataDistrictList.filter(
      (item) => item.value === values.assetDistrict
    );
    let convertValues = parseFloat(values.wa).toFixed(2);

    let valueWa = values.wa ? convertValues.split(".")[0] : null;
    let valueSubWa = values.wa ? convertValues.split(".")[1] : null;
    let valueLat = values.latlon ? values.latlon.split(",")[0] : null;
    let valueLon = values.latlon ? values.latlon.split(",")[1] : null;

    postDataInvestigate = {
      INVESTIGATION_LOG_ID: dataDefualt?.investigation_log_id
        ? dataDefualt?.investigation_log_id
        : null,
      CUSTOMER_ID: values.refAsset,
      investigation_date: values.investigateAssetsDateManual
        ? values.investigateAssetsDateManual
        : dayjs(values.investigateAssetsDatePicker).format("YYYY-MM-DD"),
      owner: values?.ownerAsset ? values?.ownerAsset : null,
      possessor: values.possessorAsset,
      estimated_price:
        values?.estimatedPrice &&
        typeof values.estimatedPrice === "string" &&
        values.estimatedPrice.includes(",")
          ? parseInt(values.estimatedPrice.replace(/,/g, ""))
          : parseInt(values.estimatedPrice)
          ? parseInt(values.estimatedPrice)
          : null,
      property_type_id: values.assetPropotyType,
      investigator_user_id: values.investigatorAsset,
      deed_number: values.deed,
      sub_district: subDistrict.value,
      district: values.assetDistrict,
      province: values.assetProvince,
      zipcode: subDistrict?.code,
      mortgagee: values?.mortgagee ? values?.mortgagee : null,
      sequestrate_status:
        values?.sequestrateStatus === 1 ? values?.sequestrateStatus : null,
      preference_creditor: values?.JudgmentCreditor
        ? values?.JudgmentCreditor
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
      lawyer_seize_id: null,
      seize_status: null,
      seize_status_mark: null,
      seize_date: values.sequestrateStatus
        ? values.judgmentCreditorDateManual
          ? values.judgmentCreditorDateManual
          : dayjs(values.judgmentCreditorDatePicker).format("YYYY-MM-DD")
        : null,
      legal_execution_office: values.AddrEnforce ? values.AddrEnforce : null,
      estimated_enforce_price: values.estimatedEnforcePrice
        ? values.estimatedEnforcePrice
        : null,
      sale_announcement_mark: null,
      investigation_fees: null,
      investigation_fees_payment_status: null,
      mark: values.memo,
      // investigate_filepath: values.urlFile,
      district_desc: district_desc[0].label,
      province_desc: province_desc[0].label,
      investigation_type_id: radioTimeType,
      property_detail_id: values.propertyDetail,
      rai: values.rai ? parseInt(values.rai) : null,
      ngan: values.ngan ? parseInt(values.ngan) : null,
      wa: valueWa ? parseInt(valueWa) : null,
      subwa: valueSubWa ? parseInt(valueSubWa) : null,
      utm: values.utm ? values.utm : null,
      latitude: values.latlon ? parseFloat(valueLat) : null,
      longitude: values.latlon ? parseFloat(valueLon) : null,
      fileList: fileList,
      capturedImages: capturedImages,
      mortgage_type: values.mortgageStatus === 0 ? null : values.mortgageStatus,
      mortgage_start_date: values.mortgageStatus
        ? values.contractDateManual
          ? values.contractDateManual
          : dayjs(values.contractDatePicker).format("YYYY-MM-DD")
        : null,
      mortgage_end_date: values.mortgageStatus
        ? values.dueDateManual
          ? values.dueDateManual
          : dayjs(values.dueDatePicker).format("YYYY-MM-DD")
        : null,
    };

    if (flag === "add") {
      console.log("add----->");
      console.log("postDataInvestigate", postDataInvestigate);
      sendStatus(postDataInvestigate);
    } else {
      console.log("postDataInvestigate", postDataInvestigate);
      handleData(postDataInvestigate);
      handleCancel();
    }
  };

  const sendStatus = async (postDataInvestigate) => {
    setLoading(true);
    try {
      console.log("postDataInvestigate ", postDataInvestigate);
      await axios
        .post(baseUrl + POST_INVESTIGATE_ITEM, postDataInvestigate, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 201) {
            console.log("resQuery", res);
            message.success(
              `เพิ่มข้อมูลโฉนดเลขที่ ${postDataInvestigate.deed_number}`
            );
            if (postDataInvestigate.fileList.length > 0) {
              console.log(postDataInvestigate.fileList);
              handleUploadAllImage(
                postDataInvestigate.fileList,
                postDataInvestigate
              ); // ส่งไฟล์ไปอัปโหลดทีละตัว
            } else {
              console.warn(
                "⚠️ ไม่มีไฟล์ใน fileList สำหรับ",
                postDataInvestigate.CUSTOMER_ID
              );
            }
            handleData(postDataInvestigate);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้1");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
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
    console.log(item);

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
          investigateAssetsDate: dayjs(),
        }}
      >
        <Form.Item
          label="วันที่สืบทรัพย์"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่สืบทรัพย์",
            },
          ]}
        >
          <Radio.Group
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            style={{ marginBottom: 8 }}
          >
            <Radio value="picker">เลือกจากปฏิทิน</Radio>
            <Radio value="manual">กรอกเอง</Radio>
          </Radio.Group>

          {inputType === "picker" ? (
            <Form.Item name="investigateAssetsDatePicker" noStyle>
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="เลือกวันที่"
              />
            </Form.Item>
          ) : (
            <Form.Item name="investigateAssetsDateManual" noStyle>
              <DateInput />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item
          label="ห้วงเวลาการฟ้อง"
          name="investigateAssetsTime"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกผลการสืบทรัพย์",
            },
          ]}
        >
          <Radio.Group
            label="ห้วงเวลาการฟ้อง"
            name="investigateAssetsTime"
            options={optionsInvestigateTime}
            onChange={onChangeInvestiGateTimeType}
            value={radioTimeType}
          />
        </Form.Item>
        <Tooltip
          placement="top"
          title="ถ้าเกิดไม่มีในรายชื่อให้เลือกคนที่มีความเกี่ยวข้องกับเจ้าของทรัพย์"
          arrow={mergedArrow}
        >
          <Form.Item
            label="บุคคลอ้างอิงในสัญญา"
            name="refAsset"
            rules={[
              {
                required: true,
                message: "กรุณาเลือก !",
              },
            ]}
          >
            <Radio.Group
              label="บุคคลอ้างอิง"
              name="refAsset"
              options={refAssetOption}
              onChange={onChangeRefAsset}
              value={radioRefAsset}
            />
          </Form.Item>
        </Tooltip>
        <Form.Item
          label="ชื่อเจ้าของทรัพย์"
          name="possessorAsset"
          rules={[
            {
              required: true,
              message: "กรุณาระบุเจ้าของทรัพย์ !",
            },
          ]}
        >
          <Input name="possessorAsset" />
        </Form.Item>
        <Tooltip
          placement="top"
          title="ความเกี่ยวข้องของผู้ทำสัญญาหรือผู้ค้ำกับเจ้าของทรัพย์"
          arrow={mergedArrow}
        >
          <Form.Item
            label="เลือกความเกี่ยวข้อง"
            name="ralation"
            rules={[
              {
                required: true,
                message: "กรุณาเลือก !",
              },
            ]}
          >
            <Radio.Group
              label="เลือกความเกี่ยวข้อง"
              name="ralation"
              options={optionsRalation}
              onChange={onChangeRalation}
              value={ralationSelect}
            />
          </Form.Item>
        </Tooltip>
        <Form.Item
          label="ประเภททรัพย์"
          name="assetPropotyType"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกประเภททรัพย์ !",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="ประเภททรัพย์"
            optionFilterProp="label"
            onChange={(value) => onChangeSelectAssetPropotyType(value)}
            options={optionsAssetsType}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="ลักษณะที่ดิน"
          name="propertyDetail"
          rules={[
            {
              required: true,
              message: "กรุณาระบุ !",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="เลือกลักษณะที่ดิน"
            optionFilterProp="label"
            options={dataLandDetailList}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="เลขโฉนด/เลขที่ดิน"
          name="deed"
          rules={[
            {
              required: true,
              message: "กรุณาพิมพ์เลขโฉนด !",
            },
          ]}
        >
          <Input
            type="number"
            onChange={(e) => onChangeInputDeed(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="จังหวัด"
          name="assetProvince"
          rules={[
            {
              required: true,
              message: "กรุณาระบุจังหวัด !",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="เลือกจังหวัด"
            optionFilterProp="label"
            onChange={(value) => onChangeSelectProviceAsset(value)}
            options={dataProviceList}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="อำเภอ"
          name="assetDistrict"
          rules={[
            {
              required: true,
              message: "กรุณาระบุอำเภอ !",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="เลือกอำเภอ"
            optionFilterProp="label"
            onChange={(value) => onChangeSelectDistrictAsset(value)}
            options={dataDistrictList}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="ตำบล"
          name="assetSubDistrict"
          rules={[
            {
              required: true,
              message: "กรุณาระบุตำบล !",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="เลือกตำบล"
            optionFilterProp="label"
            onChange={(value, data) =>
              onChangeSelectSubDistrictAsset(value, data)
            }
            options={dataSubDistrictList}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="รหัสไปษณีย์" name="zipcode">
          {subDistrict?.code || "-"}
        </Form.Item>
        <Form.Item label="ไร่" name="rai">
          <Input
            min={1} // กำหนดค่าต่ำสุด
            step={1} // จำกัดให้กรอกเฉพาะจำนวนเต็ม
            placeholder="กรุณากรอกเลขจำนวนเต็ม"
            type="number"
          />
        </Form.Item>
        <Tooltip
          placement="top"
          title="กรุณากรอกเลข`งาน`เป็นจำนวนเต็มไม่เกิน 3 "
          arrow={mergedArrow}
        >
          <Form.Item label="งาน" name="ngan">
            <Input
              type="number"
              placeholder="กรุณากรอกเลข`งาน`เป็นจำนวนเต็มไม่เกิน 3 "
              min={1} // กำหนดค่าต่ำสุด
              max={3}
              step={1} // จำกัดให้กรอกเฉพาะจำนวนเต็ม
            />
          </Form.Item>
        </Tooltip>
        <Tooltip
          placement="top"
          title="กรุณากรอกเลข `ตารางวา` ไม่เกิน 99.99"
          arrow={mergedArrow}
        >
          <Form.Item label="ตารางวา" name="wa">
            <Input
              type="number"
              placeholder="กรุณากรอกเลข`ตารางวา`ไม่เกิน 99.99 "
              min={0.0} // ป้องกันการกรอกค่าต่ำกว่า 0
              max={99.99} // ขีดจำกัดไม่เกิน 99.99
              step="0.01" // กำหนดให้สามารถกรอกค่าทศนิยม 2 ตำแหน่ง
            />
          </Form.Item>
        </Tooltip>
        <>
          <Form.Item label="เลขระหว่าง" name="utm">
            <Input
              placeholder="กรุณากรอกเลขระหว่าง"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="ตำแหน่ง" name="latlon">
            <Input placeholder="ตัวอย่าง : 8.17240819, 99.03230145" />
          </Form.Item>
        </>

        <Form.Item label="ราคาประเมิน" name="estimatedPrice">
          <Input name="estimatedPrice" placeholder="รอประเมินราคา" disabled />
        </Form.Item>
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
        {mortgageStatus ? (
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
              <Input name="mortgagee" />
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
              <InputNumber
                name="estimatedPrice"
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
        {sequestrateStatus === 1 ? (
          <>
            <Form.Item
              label="เจ้าหนี้คำพิพากษา"
              name="JudgmentCreditor"
              rules={[
                {
                  required: true,
                  message: "กรณากรอกข้อมูล !",
                },
              ]}
            >
              <Input name="JudgmentCreditor" />
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
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกวันที่สืบทรัพย์",
                },
              ]}
            >
              <Radio.Group
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                style={{ marginBottom: 8 }}
              >
                <Radio value="picker">เลือกจากปฏิทิน</Radio>
                <Radio value="manual">กรอกเอง</Radio>
              </Radio.Group>

              {inputType === "picker" ? (
                <Form.Item name="judgmentCreditorDatePicker" noStyle>
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    placeholder="เลือกวันที่"
                  />
                </Form.Item>
              ) : (
                <Form.Item name="judgmentCreditorDateManual" noStyle>
                  <DateInput />
                </Form.Item>
              )}
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
          <Select
            showSearch
            placeholder="เลือกผู้สืบทรัพย์"
            optionFilterProp="label"
            options={assistantOption}
            style={{ width: "100%" }}
          />
        </Form.Item>

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
          <TextArea rows={5} name="memo" />
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
        title={`รายละเอียดข้อมูลที่ดิน`}
        open={open}
        onCancel={handleCancel}
        width={750}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default AssetsDetail;
