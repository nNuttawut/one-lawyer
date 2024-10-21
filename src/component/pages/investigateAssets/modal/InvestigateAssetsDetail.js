import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Modal,
  Card,
  message,
  Spin,
  Radio,
  Checkbox,
  Space,
  Tooltip,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_STATUS,
  PUT_INVESTIGATE,
  PUT_LAWSUIT_DETAIL,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import CeckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import LoadLawyers from "../../../../hook/LoadLawyers";
import GeoThailand from "../../../../hook/GeoThailand";
import { ENFORCEMENT } from "../../../../utils/constant/StatusConstant";

const InvestigateAssetsDetail = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
  investigate,
}) => {
  const [form] = Form.useForm();
  const [setupGovernmentOfficerList, governmentOfficers] =
    CeckGovermentOfficer();
  const [currencyFormatNoPoint, currencyFormatComma] = CurrencyFormat();
  const [assistantOption, setAssistantOption] = useState();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [
    setLoadingDataProvice,
    setLoadingDataDistrict,
    setLoadingDataSubDistrict,
    setLoadingDataZipcode,
    dataProvice,
    dataDistrict,
    dataSubDistrict,
    dataZipcode,
    setDataSearch,
  ] = GeoThailand();
  const { TextArea } = Input;
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const [dataType, setDataType] = useState(null);
  const [checkLenght, setCheckLenght] = useState([]);
  const [arrow, setArrow] = useState("Show");
  const [radioStatus, setRadioStatus] = useState(null);
  const [governmentOfficerLength, setGovernmentOfficerLength] = useState(null);
  const [investigateDateValue, setInvestigateDateValue] = useState(null);
  const [averageStatus, setAverageStatus] = useState(null);
  const [sequestrateStatus, setSequestrateStatus] = useState(null);
  const [dataProviceList, setDataProviceList] = useState(null);
  const [dataDistrictList, setDataDistrictList] = useState(null);
  const [dataSubDistrictList, setDataSubDistrictList] = useState(null);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const optionsInvestigate = [
    { label: "ไม่เจอทรัพย์", value: 0 },
    { label: "เจอทรัพย์", value: 1 },
  ];
  const optionsSequestrateStatus = [
    { label: "ไม่ติดอายัด", value: 0 },
    { label: "ติดอายัด", value: 1 },
  ];
  const optionsAssetsType = [
    { label: "ฉโนดที่ดิน", value: 1 },
    { label: "น.ส.3ก.", value: 2 },
  ];

  const optionsAverageStatus = [
    { label: "ไม่พอเฉลี่ย", value: 0 },
    { label: "พอเฉลี่ย", value: 1 },
  ];
  console.log("data--->", dataDefualt);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLoadingData(true);
      console.log("loadData", dataDefualt);
      if (investigate === "before") {
        setDataType("ก่อนฟ้อง");
      } else {
        setDataType("หลังฟ้อง");
      }
      setLoadingDataProvice(true);
    }
  }, [isModal]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
    if (dataProvice) {
      setOptionProvice();
    }
    if (dataDistrict) {
      setOptionDistrict();
    }
    if (dataSubDistrict) {
      setOptionSubDistrict();
    }
  }, [lawyersList, dataProvice, dataDistrict, dataSubDistrict]);

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === "1") {
      companySelectAssistant = lawyersList.filter(
        (item) => item.COMPANY_ID === 1 && item.ROLE_ID === 4
      );
    } else {
      companySelectAssistant = lawyersList.filter(
        (item) => item.COMPANY_ID === 1 && item.ROLE_ID === 4
      );
    }
    const optionsAssistant = companySelectAssistant.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setAssistantOption(optionsAssistant);
  };

  const setOptionProvice = () => {
    const optionsProvice = dataProvice.map((item) => ({
      value: item.provinceId,
      label: item.provinceName,
    }));
    setDataProviceList(optionsProvice);
  };

  const setOptionDistrict = () => {
    console.log("dataDistrict", dataDistrict);
    const optionsDistrict = dataDistrict.map((item) => ({
      value: item.districtId,
      label: item.districtName,
    }));
    setDataDistrictList(optionsDistrict);
  };

  const setOptionSubDistrict = () => {
    console.log("dataDistrict", dataSubDistrict);
    const optionsSubDistrict = dataSubDistrict.map((item) => ({
      value: item.subdistrictId,
      label: item.subdistrictName,
    }));
    setDataSubDistrictList(optionsSubDistrict);
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

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefualt.CONTNO, {
          HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            setDataLoadLoan(resQuery.data);
            setupGovernmentOfficerList(resQuery.data);
            listGovermentList(resQuery.data);
            console.log("loanRes", resQuery.data);
          } else {
            message.error("ไม่พบข้อมูล");
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));

      await axios
        .get(baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefualt.LAWSUIT_ID, {
          HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            console.log("resQuery--->", resQuery.data);
            setDataLoadLawSuit(resQuery.data);
          } else {
            message.error("ไม่พบข้อมูล");
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const listGovermentList = (data) => {
    if (data) {
      if (data?.GUARANTORS) {
        const listLength = data?.GUARANTORS?.filter((item) => item);
        console.log("listLength", listLength.length);
        setCheckLenght(listLength.length);
      }
    }
  };

  const sendStatus = async (
    postDataInvestigate,
    putDataLawsuit,
    statusResult,
    postStatus
  ) => {
    setLoading(true);

    try {
      if (statusResult === 1) {
        console.log("investigateStatus ", postDataInvestigate);
        await axios
          .post(baseUrl + PUT_INVESTIGATE, postDataInvestigate, {
            HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });
        await axios
          .post(baseUrl + POST_STATUS, postStatus, {
            HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });
      }
      console.log("putDataLawsuit", putDataLawsuit);
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, putDataLawsuit, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            message.success("อัพเดทข้อมูลสำเร็จ");
            if (investigate === "before") {
              funcUpdateStatus({
                ...dataDefualt,
                INVESTIGATE_BEFORE_STATUS: statusResult,
              });
            } else {
              funcUpdateStatus({
                ...dataDefualt,
                INVESTIGATE_AFTER_ID: statusResult,
              });
            }
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
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

  const onFinish = (values) => {
    console.log("Success:", values);
    let putDataLawsuit;
    let postDataInvestigate;
    let postStatus;
    let investigateStatus =
      investigate === "before"
        ? "investigate_before_status"
        : "investigate_after_status";

    console.log("investigateStatus", investigateStatus);

    if (values.investigateAssetsResult === 0) {
      putDataLawsuit = {
        ...dataLoadLawSuit,
        government_officer_number: governmentOfficerLength,
        [investigateStatus]: values.investigateAssetsResult,
        investigate_mark: values.memo,
      };
    } else {
      putDataLawsuit = {
        ...dataLoadLawSuit,
        government_officer_number: governmentOfficerLength,
        [investigateStatus]: values.investigateAssetsResult,
        investigate_mark: values.memo,
      };

      postDataInvestigate = {
        LAWSUIT_ID: dataDefualt.LAWSUIT_ID,
        owner: values?.ownerAsset ? values?.ownerAsset : null,
        possessor: values.possessorAsset,
        estimated_price: parseInt(values.estimatedPrice.replace(/,/g, "")),
        property_type_id: values.assetPropotyType,
        investigator_user_id: values.investigatorAsset,
        deed_number: values.deed,
        sub_district: values.assetSubDistrict,
        district: values.assetDistrict,
        province: values.assetProvince,
        zipcode: dataZipcode ? dataZipcode[0]?.zipCode : null,
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
        mortgage_balance: values?.mortgageBalance
          ? parseInt(values?.mortgageBalance.replace(/,/g, ""))
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
        legal_execution_office: null,
        sale_announcement_mark: null,
        investigate_property_type_id: investigate === "before" ? 1 : 2,
      };

      postStatus = {
        MAIN_STATUS_ID: ENFORCEMENT,
        LOAN_ID: dataDefualt.id,
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: investigateDateValue,
      };
    }
    console.log("postStatus---->", postStatus);

    console.log("putDataLawsuit--->", putDataLawsuit);
    console.log("postDataInvestigate---->", postDataInvestigate);

    sendStatus(
      postDataInvestigate,
      putDataLawsuit,
      values.investigateAssetsResult,
      postStatus
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputInvestigateDate = (date, dateSting) => {
    console.log(date);
    console.log(dateSting);
    setInvestigateDateValue(dateSting);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeInputDeed = (value) => {
    console.log(value);
  };

  const onChangeInputpossessorAsset = (value) => {
    console.log(value);
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const onChangeGovermentOfficer = (checkedValues) => {
    console.log("checked = ", checkedValues);
    setGovernmentOfficerLength(checkedValues.length);
  };

  const handleCheckBoxGroupGoverment = () => {
    if (checkLenght) {
      return (
        <>
          <Checkbox.Group onChange={onChangeGovermentOfficer}>
            <Space direction="vertical" style={{ marginTop: "5px" }}>
              <Checkbox value={governmentOfficers?.id}>
                {governmentOfficers
                  ? `${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${governmentOfficers?.NAME2}`
                  : "-"}
              </Checkbox>
              {checkLenght > 0 ? (
                <Checkbox value={governmentOfficers?.guarantors[0]?.id}>
                  {governmentOfficers?.guarantors?.length > 0
                    ? `${governmentOfficers?.guarantors[0]?.SNAM} ${governmentOfficers?.guarantors[0]?.NAME1} ${governmentOfficers?.guarantors[0]?.NAME2}`
                    : "ไม่มีจำเลยที่ 2"}
                </Checkbox>
              ) : null}
              {checkLenght > 1 ? (
                <Checkbox value={governmentOfficers?.guarantors[1]?.id}>
                  {governmentOfficers?.guarantors?.length > 1
                    ? `${governmentOfficers?.guarantors[1]?.SNAM} ${governmentOfficers?.guarantors[1]?.NAME1} ${governmentOfficers?.guarantors[1]?.NAME2}`
                    : "ไม่มีจำเลยที่ 3"}
                </Checkbox>
              ) : null}
              {checkLenght > 2 ? (
                <Checkbox value={governmentOfficers?.guarantors[2]?.id}>
                  {governmentOfficers?.guarantors?.length > 2
                    ? `${governmentOfficers?.guarantors[2]?.SNAM} ${governmentOfficers?.guarantors[2]?.NAME1} ${governmentOfficers?.guarantors[2]?.NAME2}`
                    : "ไม่มีจำเลยที่ 4"}
                </Checkbox>
              ) : null}
            </Space>
            <Space direction="vertical" style={{ marginTop: "5px" }}>
              {checkLenght > 3 ? (
                <Checkbox value={governmentOfficers?.guarantors[3]?.id}>
                  {governmentOfficers?.guarantors?.length > 3
                    ? `${governmentOfficers?.guarantors[3]?.SNAM} ${governmentOfficers?.guarantors[3]?.NAME1} ${governmentOfficers?.guarantors[3]?.NAME2}`
                    : "ไม่มีจำเลยที่ 5"}
                </Checkbox>
              ) : null}
              {checkLenght > 4 ? (
                <Checkbox
                  value={governmentOfficers?.guarantors[4]?.id}
                  disabled="false"
                >
                  {governmentOfficers?.guarantors?.length > 4
                    ? `${governmentOfficers?.guarantors[4]?.SNAM} ${governmentOfficers?.guarantors[4]?.NAME1} ${governmentOfficers?.guarantors[4]?.NAME2}`
                    : "ไม่มีจำเลยที่ 6"}
                </Checkbox>
              ) : null}
              {checkLenght > 5 ? (
                <Checkbox value={governmentOfficers?.guarantors[5]?.id}>
                  {governmentOfficers?.guarantors?.length > 5
                    ? `${governmentOfficers?.guarantors[5]?.SNAM} ${governmentOfficers?.guarantors[5]?.NAME1} ${governmentOfficers?.guarantors[5]?.NAME2}`
                    : "ไม่มีจำเลยที่ 7"}
                </Checkbox>
              ) : null}
              {checkLenght > 6 ? (
                <Checkbox value={governmentOfficers?.guarantors[6]?.id}>
                  {governmentOfficers?.guarantors?.length > 6
                    ? `${governmentOfficers?.guarantors[6]?.SNAM} ${governmentOfficers?.guarantors[6]?.NAME1} ${governmentOfficers?.guarantors[6]?.NAME2}`
                    : "ไม่มีจำเลยที่ 8"}
                </Checkbox>
              ) : null}
            </Space>
          </Checkbox.Group>
        </>
      );
    } else {
      return null;
    }
  };

  const onChangeInvestiGateResult = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setRadioStatus(value);
  };

  const onChangeEstimatedPrice = (value) => {
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        estimatedPrice: formattedValue,
      });
      console.log("formattedValue", formattedValue);
    } else {
      form.setFieldsValue({
        estimatedPrice: inputValue,
      });
    }
  };

  const onChangeSelectInvestigatorAsset = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeSelectAssetPropotyType = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeInputOwnerAssetLaw = (value) => {
    console.log(value);
  };
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
      form.setFieldsValue({
        mortgageBalance: formattedValue,
      });
      console.log("formattedValue", formattedValue);
    } else {
      form.setFieldsValue({
        mortgageBalance: inputValue,
      });
    }
  };

  const onChangeAverageStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setAverageStatus(value);
  };

  const onChangeSequestrateStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setSequestrateStatus(value);
  };

  const onChangeSelectProviceAsset = (value) => {
    console.log(`selected provice ${value}`);
    setDataSearch({ provice: value });
    form.setFieldsValue({
      assetDistrict: null,
      assetSubDistrict: null,
      assetZipCode: null,
    });
  };

  const onChangeSelectDistrictAsset = (value) => {
    console.log(`selected District ${value}`);
    setDataSearch({ District: value });
    form.setFieldsValue({
      assetSubDistrict: null,
      assetZipCode: null,
    });
  };

  const onChangeSelectSubDistrictAsset = (value) => {
    console.log(`selected subDistrict${value}`);
    setDataSearch({ subDistrict: value });
    form.setFieldsValue({
      assetZipCode: null,
    });
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
        }}
      >
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {`${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
            ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
          </p>
        </Form.Item>
        <Form.Item
          label="วันที่สืบทรัพย์"
          name="investigateAssetsDate"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่สืบทรัพย์",
            },
          ]}
        >
          <DatePicker onChange={onChangeInputInvestigateDate} />
        </Form.Item>
        <Tooltip
          placement="bottom"
          title="ถ้าเกิดไม่มีไม่ต้องเลือก !"
          arrow={mergedArrow}
        >
          <Form.Item label="จำเลยที่เป็นข้าราชการ" name="governmentOfficer">
            {handleCheckBoxGroupGoverment()}
          </Form.Item>
        </Tooltip>
        <Form.Item
          label="ผลการสืบทรัพย์"
          name="investigateAssetsResult"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกผลการสืบทรัพย์",
            },
          ]}
        >
          <Radio.Group
            label="ผลการสืบทรัพย์"
            name="investigateAssetsResult"
            options={optionsInvestigate}
            onChange={onChangeInvestiGateResult}
            value={radioStatus}
          />
        </Form.Item>
        {radioStatus === 1 ? (
          <>
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
              <Input
                onChange={(e) => onChangeInputpossessorAsset(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="เลขโฉนด"
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
                placeholder="ประเภททรัพย์"
                optionFilterProp="value"
                onChange={(value) => onChangeSelectAssetPropotyType(value)}
                options={optionsAssetsType}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="ราคาประเมิน"
              name="estimatedPrice"
              rules={[
                {
                  required: true,
                  message: "กรุณาใส่ค่าราคาประเมิน !",
                },
              ]}
            >
              <Input
                name="estimatedPrice"
                onChange={(e) => onChangeEstimatedPrice(e.target.value)}
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
                placeholder="เลือกจังหวัด"
                optionFilterProp="value"
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
                placeholder="เลือกอำเภอ"
                optionFilterProp="value"
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
                placeholder="เลือกตำบล"
                optionFilterProp="value"
                onChange={(value) => onChangeSelectSubDistrictAsset(value)}
                options={dataSubDistrictList}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label="รหัสไปษณีย์" name="assetZipCode">
              <p>{dataZipcode ? dataZipcode[0]?.zipCode : "เลือกตำบลก่อน"}</p>
            </Form.Item>
            {investigate === "after" ? (
              <>
                <Form.Item
                  label="ผู้ถือกรรมสิทธิ์"
                  name="ownerAsset"
                  rules={[
                    {
                      required: true,
                      message: "ผู้ถือกรรมสิทธิ์ !",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => onChangeInputOwnerAssetLaw(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="ผู้รับจำนอง/ไม่มีภาระ" name="mortgagee">
                  <Input onChange={(e) => onChangeInputOwner(e.target.value)} />
                </Form.Item>
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
                <Form.Item label="เจ้าหนี้บุริมสิทธ์" name="preferenceCreditor">
                  <Input
                    onChange={(e) =>
                      onChangeInputPreferenceCreditor(e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="ยอดหนี้จำนอง" name="mortgageBalance">
                  <Input
                    name="estimatedPrice"
                    onChange={(e) => onChangeMortgageBalance(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="พอเฉลี่ยหนี้"
                  name="averageStatus"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือก !",
                    },
                  ]}
                >
                  <Radio.Group
                    label="พอเฉลี่ยหนี้"
                    name="averageStatus"
                    options={optionsAverageStatus}
                    onChange={onChangeAverageStatus}
                    value={averageStatus}
                  />
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
                placeholder="เลือกผู้สืบทรัพย์"
                optionFilterProp="value"
                onChange={(value) => onChangeSelectInvestigatorAsset(value)}
                options={assistantOption}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </>
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
        title={`สืบทรัพย์ลูกหนี้ ${dataType}`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default InvestigateAssetsDetail;
