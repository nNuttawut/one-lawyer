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
  Tooltip,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_CALCULATE_LAND,
  POST_STATUS,
  PUT_INVESTIGATE,
  PUT_LAWSUIT_DETAIL,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import CeckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import LoadLawyers from "../../../../hook/LoadLawyers";
import { ENFORCEMENT } from "../../../../utils/constant/StatusConstant";
import GeoLand from "../../../../hook/GeoLand";
import { PlusCircleOutlined } from "@ant-design/icons";

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
  const [setLoadingDataProvice, dataProvice, dataDistrict, setDataSearch] =
    GeoLand();
  const { TextArea } = Input;
  const [isModal, setIsModal] = useState(false);
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [loading, setLoading] = useState();
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const [dataType, setDataType] = useState(null);
  const [checkLenght, setCheckLenght] = useState([]);
  const [arrow, setArrow] = useState("Show");
  const [radioStatus, setRadioStatus] = useState(null);
  const [governmentOfficerLength, setGovernmentOfficerLength] = useState(null);
  const [investigateDateValue, setInvestigateDateValue] = useState(null);
  const [averageStatus, setAverageStatus] = useState(null);
  const [sequestrateStatus, setSequestrateStatus] = useState(null);
  const [mortgageStatus, setMortgageStatus] = useState(null);
  const [dataProviceList, setDataProviceList] = useState(null);
  const [dataDistrictList, setDataDistrictList] = useState(null);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [assetTypeSelect, setAssetTypeSelect] = useState(false);
  const [resultData, setResultData] = useState({
    pvcode: null,
    amcode: null,
    landNo: null,
  });
  const [landPrice, setLandPrice] = useState(null);
  const [checked, setChecked] = useState(false);
  const [checkedGuarantors, setCheckedGuarantors] = useState({});

  const optionsInvestigate = [
    { label: "ไม่เจอทรัพย์", value: 0 },
    { label: "เจอทรัพย์", value: 1 },
  ];
  const optionsMortgageStatus = [
    { label: "ไม่ติดภาระ", value: 0 },
    { label: "ติดภาระ", value: 1 },
  ];
  const optionsSequestrateStatus = [
    { label: "ไม่ติดอายัด", value: 0 },
    { label: "ติดอายัด", value: 1 },
  ];
  const optionsAssetsType = [
    { label: "น.ส.4 จ", value: 1 },
    { label: "น.ส.3 ก.", value: 2 },
  ];

  const optionsAverageStatus = [
    { label: "ไม่พอเฉลี่ย", value: 0 },
    { label: "พอเฉลี่ย", value: 1 },
  ];

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
  }, [lawyersList, dataProvice, dataDistrict]);

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 1) {
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

  const setOptionProvice = () => {
    console.log(dataProvice);

    const optionsProvice = dataProvice.map((item) => ({
      value: item.pvcode,
      label: item.pvnamethai,
    }));
    setDataProviceList(optionsProvice);
  };

  const setOptionDistrict = () => {
    console.log("dataDistrict", dataDistrict);
    const optionsDistrict = dataDistrict.map((item) => ({
      value: item.amcode,
      label: item.amnamethai,
    }));
    setDataDistrictList(optionsDistrict);
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
        if (investigate === "after") {
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
        sub_district: null,
        district: values.assetDistrict,
        province: values.assetProvince,
        zipcode: null,
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
      if (investigate === "after") {
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
    setResultData({ ...resultData, landNo: value });
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

  const handleCheckCustomer = (e) => {
    console.log("checked = ", e.target.value);
    setChecked(e.target.checked);
  };

  const handleChangeGuarantor = (guarantorId, e) => {
    setCheckedGuarantors((prev) => ({
      ...prev,
      [guarantorId]: e.target.checked,
    }));
  };

  const handleCheckBoxGroupGoverment = () => {
    if (checkLenght) {
      return (
        <>
          <Checkbox
            value={governmentOfficers.id}
            onChange={handleCheckCustomer}
          >
            {governmentOfficers
              ? `${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${governmentOfficers?.NAME2}`
              : "-"}
          </Checkbox>
          {checked ? (
            <Input
              placeholder="กรอกข้อมูลอาชีพ"
              style={{ marginLeft: "20px" }}
              size="small"
            />
          ) : null}

          {/* แสดง checkbox สำหรับ guarantors */}
          {governmentOfficers?.guarantors?.length > 0
            ? governmentOfficers.guarantors.map((guarantor, index) => (
                <div key={index}>
                  <Checkbox
                    value={guarantor.id}
                    onChange={(e) => handleChangeGuarantor(guarantor.id, e)}
                  >
                    {`${guarantor?.SNAM} ${guarantor?.NAME1} ${guarantor?.NAME2}`}
                  </Checkbox>

                  {/* แสดง Input ถ้า guarantor checkbox ถูกเลือก */}
                  {checkedGuarantors[guarantor.id] ? (
                    <Input
                      placeholder="กรอกข้อมูลอาชีพ"
                      style={{ marginLeft: "20px" }}
                      size="small"
                    />
                  ) : null}
                </div>
              ))
            : null}
        </>
      );
    } else {
      return null;
    }
  };

  const onChangeInvestiGateResult = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setRadioStatus(value);
    setLoadingDataProvice(true);
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
    if (value === 1) {
      setAssetTypeSelect(true);
    } else {
      setAssetTypeSelect(false);
    }
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
      let setAverage = parseInt(landPrice.replace(/,/g, "")) - intValue;
      console.log("serAverage", setAverage);
      form.setFieldsValue({
        mortgageBalance: formattedValue,
        averageStatus: setAverage > 1 ? 1 : 0,
      });
      console.log("formattedValue", formattedValue);
    } else {
      let setAverage = parseInt(landPrice.replace(/,/g, "")) - value;
      form.setFieldsValue({
        mortgageBalance: inputValue,
        averageStatus: setAverage > 1 ? 1 : 0,
      });
    }
  };

  const onChangeAverageStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setAverageStatus(value);
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

  const onChangeSelectProviceAsset = (value) => {
    console.log(`selected provice ${value}`);
    setDataSearch(value);
    setResultData({ ...resultData, pvcode: value });
    form.setFieldsValue({
      assetDistrict: null,
    });
  };

  const onChangeSelectDistrictAsset = (value) => {
    console.log(`selected District ${value}`);
    setResultData({ ...resultData, amcode: value });
  };

  const checkLandPrice = async () => {
    var result = {
      pvcode: resultData.pvcode,
      amcode: resultData.amcode,
      landNo: resultData.landNo,
    };
    if (resultData.landNo && resultData.pvcode && resultData.amcode) {
      console.log("resul---->", resultData);
      setLoading(true);
      try {
        await axios
          .post(POST_CALCULATE_LAND, result, {
            headers: HEADERS_EXPORT,
          })
          .then(async (resQuery) => {
            if (resQuery.status === 200) {
              console.log("loanRes", resQuery.data);
              form.setFieldsValue({
                estimatedPrice: resQuery.data.result[0].landprice,
              });
              setLandPrice(resQuery.data.result[0].landprice);
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
    } else {
      message.error(
        "กรอกข้อมูลไม่ครบโปรดตรวจสอบอีกที เลขโฉนด, ประเภททรัพย์, จังหวัด, อำเภอ"
      );
    }
  };

  const renderTabs = () => {
    return (
      <>
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
            {assetTypeSelect ? (
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <Button style={{ color: "blue" }} onClick={checkLandPrice}>
                  เช็คราคาประเมิน
                </Button>
              </div>
            ) : null}
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
                <Form.Item
                  label="ติดภาระจำนอง"
                  name="mortgageStatus"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือก !",
                    },
                  ]}
                >
                  <Radio.Group
                    label="ติดภาระจำนอง"
                    name="mortgageStatus"
                    options={optionsMortgageStatus}
                    onChange={onChangeMortgageStatus}
                    value={mortgageStatus}
                  />
                </Form.Item>
                {mortgageStatus === 1 ? (
                  <>
                    <Form.Item
                      label="เจ้าหนี้จำนอง"
                      name="mortgagee"
                      rules={[
                        {
                          required: true,
                          message: "กรณากรอกข้อมูล !",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) => onChangeInputOwner(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="ยอดหนี้จำนอง"
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
                        onChange={(e) =>
                          onChangeMortgageBalance(e.target.value)
                        }
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
                    disabled
                  />
                </Form.Item>
              </>
            ) : null}
          </>
        ) : null}
      </>
    );
  };

  const dataResult = () => {
    return (
      <>
        {radioStatus === 1 ? (
          <Button>
            <PlusCircleOutlined />
          </Button>
        ) : null}
      </>
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
          {radioStatus === 1 ? (
            <Button>
              <PlusCircleOutlined />
            </Button>
          ) : null}
        </Form.Item>

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
