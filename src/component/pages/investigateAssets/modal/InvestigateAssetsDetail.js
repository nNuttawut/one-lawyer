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
  Cascader,
} from "antd";
import {
  baseUrl,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  PUT_INVESTIGATE,
  PUT_LAWSUIT_DETAIL,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import CeckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import LoadLawyers from "../../../../hook/LoadLawyers";
import { JUDGEMENT } from "../../../../utils/constant/StatusConstant";

const InvestigateAssetsDetail = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [form] = Form.useForm();
  const [setupGovernmentOfficerList, governmentOfficers] =
    CeckGovermentOfficer();
  const [currencyFormatNoPoint, currencyFormatComma] = CurrencyFormat();
  const [lawyersOption, setLawyersOption] = useState();
  const [assistantOption, setAssistantOption] = useState();
  const [lawyersList, setLoadingData, loadLawyerJobs] = LoadLawyers();
  const { TextArea } = Input;

  const status = dataDefualt.lawsuitData[0].MAIN_STATUS_ID;
  //   const status = 2;
  const COMPANY = 1;

  console.log("status", status);

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
  //   const options = [
  //     {
  //       value: "zhejiang",
  //       label: "Zhejiang",
  //       children: [
  //         {
  //           value: "hangzhou",
  //           label: "Hangzhou",
  //           children: [
  //             {
  //               value: "xihu",
  //               label: "West Lake",
  //             },
  //             {
  //               value: "xiasha",
  //               label: "Xia Sha",
  //               disabled: true,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       value: "jiangsu",
  //       label: "Jiangsu",
  //       children: [
  //         {
  //           value: "nanjing",
  //           label: "Nanjing",
  //           children: [
  //             {
  //               value: "zhonghuamen",
  //               label: "Zhong Hua men",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ];

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLoadingData(true);
      console.log("loadData", dataDefualt);
      if (status < 2) {
        setDataType("ก่อนฟ้อง");
      } else {
        setDataType("หลังฟ้อง");
      }
    }
  }, [isModal]);

  useEffect(() => {
    setOption();
  }, [lawyersList]);

  const setOption = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 1) {
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
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefualt.lawsuitData[0].CONTNO, {
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
    investigateStatus,
    statusResult
  ) => {
    setLoading(true);
    try {
      if (statusResult === 1) {
        console.log("status", putDataLawsuit);
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
      }
      console.log("data", putDataLawsuit, investigateStatus);
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, putDataLawsuit, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            message.success("อัพเดทข้อมูลสำเร็จ");
            funcUpdateStatus({
              ...dataDefualt,
              [investigateStatus]: statusResult,
            });
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
    let investigateStatus =
      status < JUDGEMENT
        ? "investigate_before_status"
        : "investigate_after_status";

    console.log("investigateStatus", investigateStatus);

    if (values.investigateAssetsResult === 0) {
      putDataLawsuit = {
        ...dataDefualt,
        government_officer_number: governmentOfficerLength,
        [investigateStatus]: values.investigateAssetsResult,
        investigate_mark: values.memo,
      };
    } else {
      putDataLawsuit = {
        ...dataDefualt,
        government_officer_number: governmentOfficerLength,
        [investigateStatus]: values.investigateAssetsResult,
        investigate_mark: values.memo,
      };
      postDataInvestigate = {
        LAWSUIT_ID: dataDefualt.id,
        owner: values?.ownerAsset ? values?.ownerAsset : null,
        possessor: values.possessorAsset,
        estimated_price: parseInt(values.estimatedPrice.replace(/,/g, "")),
        property_type_id: values.assetPropotyType,
        investigator_user_id: values.investigatorAsset,
        deed_number: values.deed,
        sub_district: values.assetSubDistrict,
        district: values.assetDistrict,
        province: values.assetProvince,
        zipcode: values.assetZipCode,
        mortgagee: values?.mortgagee ? values?.mortgagee : null,
        sequestrate_status: values?.sequestrateStatus
          ? values?.sequestrateStatus
          : null,
        preference_creditor: values?.preferenceCreditor
          ? values?.preferenceCreditor
          : null,
        mortgage_balance: values?.mortgageBalance
          ? parseInt(values?.mortgageBalance.replace(/,/g, ""))
          : null,
        average_status: values.averageStatus,
        lawyer_seize_id: null,
        seize_status: null,
        seize_status_mark: null,
        legal_execution_office: null,
        sale_announcement_mark: null,
      };
    }

    console.log("putDataLawsuit--->", putDataLawsuit);
    console.log("post---->", postDataInvestigate);

    sendStatus(
      postDataInvestigate,
      putDataLawsuit,
      investigateStatus,
      values.investigateAssetsResult
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

  const onChangeInputAssetSubDistrict = (value) => {
    console.log(value);
  };

  const onChangeInputAssetDistrict = (value) => {
    console.log(value);
  };

  const onChangeInputAssetProvince = (value) => {
    console.log(value);
  };

  const onChangeInputAssetZipCode = (value) => {
    console.log(value);
  };

  //      const addressAssetCascader = (value) => {
  //       return (
  //         <>
  //           <Cascader
  //             options={options}
  //             onChange={onChange}
  //             placeholder="กรุณาเลือกที่ตั้งทรัพย์"
  //             showSearch={{
  //               filter,
  //             }}
  //             onSearch={(value) => console.log(value)}
  //           />
  //         </>
  //       );
  //     };

  //   const onChange = (value, selectedOptions) => {
  //     console.log(value, selectedOptions);
  //   };

  //   const filter = (inputValue, path) =>
  //     path.some(
  //       (option) =>
  //         option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  //     );

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

  const formDataSetBefore = () => {
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
          memo: "",
          suspensionAmount: 0,
        }}
      >
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {governmentOfficers
              ? `${dataDefualt?.lawsuitData[0].CONTNO}/${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${governmentOfficers?.NAME2}`
              : "-"}
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
              label="ตำบล"
              name="assetSubDistrict"
              rules={[
                {
                  required: true,
                  message: "กรุณาระบุตำบล !",
                },
              ]}
            >
              <Input
                onChange={(e) => onChangeInputAssetSubDistrict(e.target.value)}
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
              <Input
                onChange={(e) => onChangeInputAssetDistrict(e.target.value)}
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
              <Input
                onChange={(e) => onChangeInputAssetProvince(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="รหัสไปษณีย์"
              name="assetZipCode"
              rules={[
                {
                  required: true,
                  message: "กรุณาระบุรหัสไปษณีย์ !",
                },
              ]}
            >
              <Input
                type="number"
                maxLength={"5"}
                onChange={(e) => {
                  e.target.value.length < 6
                    ? onChangeInputAssetZipCode(e.target.value)
                    : message.error("กรอกได้แค่ 5 ตัวเท่านั้น");
                }}
              />
            </Form.Item>

            {/* <Form.Item
              label="สถานที่ตั้งทรัพย์"
              name="addressAsset"
              rules={[
                {
                  required: true,
                  message: "กรุณาระบุสถานที่ !",
                },
              ]}
            >
              {addressAssetCascader()}
            </Form.Item> */}
            {dataDefualt.lawsuitData[0].MAIN_STATUS_ID > JUDGEMENT ? (
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
          <Card>{formDataSetBefore()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default InvestigateAssetsDetail;
