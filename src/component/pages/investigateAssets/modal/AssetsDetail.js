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
} from "antd";
import {
  baseUrl,
  HEADERS_EXPORT,
  POST_CALCULATE_LAND,
  POST_INVESTIGATE_ITEM,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import GeoLand from "../../../../hook/GeoLand";
import TextArea from "antd/es/input/TextArea";
import LoadLawyers from "../../../../hook/LoadLawyers";
import dayjs from "dayjs";
import LoadLandDetail from "../../../../hook/LoadLandDetail";

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
  const [currencyFormatComma] = CurrencyFormat();
  const [assistantOption, setAssistantOption] = useState();
  const [setLoadingDataProvice, dataProvice, dataDistrict, setDataSearch] =
    GeoLand();
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
  const [landPrice, setLandPrice] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [refAssetOption, setRefAssetOption] = useState([]);
  const [radioRefAsset, setRadioRefAsset] = useState();
  const [ralationSelect, setRalationSelect] = useState();
  const [radioTimeType, setRadioTimeType] = useState(null);
  const [dataLandDetailList, setDataLandDetailList] = useState(null);

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

  const optionsRalation = [
    { label: "เป็นสามีภรรยา", value: "เป็นสามีภรรยา****" },
    { label: "ไม่เป็นสามีภรรยา", value: "ไม่เป็นสามีภรรยา****" },
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
    if (loadLandDetailList) {
      setOptionLandDetail();
    }
    if (dataProvice) {
      setOptionProvice();
    }
    if (dataDistrict) {
      setOptionDistrict();
    }
  }, [lawyersList, dataProvice, dataDistrict, loadLandDetailList]);

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
    console.log("dataGovernmentOfficers", dataGovernmentOfficers);
    const optionsGovernmentOfficers = dataGovernmentOfficers.map((item) => ({
      value: item.id,
      label: `${item.SNAME}${item.NAME1} ${item.NAME2}`,
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

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const onChangeInputInvestigateDate = (date, dateSting) => {
    console.log(date);
    console.log(dateSting);
  };

  const onChangeInputDeed = (value) => {
    console.log(value);
    setResultData({ ...resultData, landNo: value });
  };

  const onChangeInputRai = (value) => {
    console.log(value);
  };

  const onChangeInputNgan = (value) => {
    console.log(value);
  };

  const onChangeInputWa = (value) => {
    console.log(value);
  };

  const onChangeInputpossessorAsset = (value) => {
    console.log(value);
  };

  const onChangeUrlFile = (value) => {
    console.log(value);
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

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
      let setAverage = landPrice
        ? parseInt(landPrice.replace(/,/g, "")) - intValue
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
    setResultData({ ...resultData, pvcode: value });
    form.setFieldsValue({
      assetDistrict: null,
    });
  };

  const onChangeSelectLandDetail = (value) => {
    console.log(`selected provice ${value}`);
  };

  const onChangeSelectDistrictAsset = (value) => {
    console.log(`selected District ${value}`);
    setResultData({ ...resultData, amcode: value });
  };

  const onChangeSelectInvestigatorAsset = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
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
      INVESTIGATION_LOG_ID: dataDefualt.investigation_log_id
        ? dataDefualt.investigation_log_id
        : null,
      CUSTOMER_ID: values.refAsset,
      investigation_date: dayjs(values.investigateAssetsDate).format(
        "YYYY-MM-DD"
      ),
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
      seize_date: null,
      legal_execution_office: null,
      sale_announcement_mark: null,
      investigation_fees: null,
      investigation_fees_payment_status: null,
      mark: values.memo,
      investigate_filepath: values.urlFile,
      district_desc: district_desc[0].label,
      province_desc: province_desc[0].label,
      investigation_type_id: radioTimeType,
      property_detail_id: values.propertyDetail,
      rai: values.rai ? parseInt(values.rai) : null,
      ngan: values.ngan ? parseInt(values.ngan) : null,
      wa: valueWa ? parseInt(valueWa) : null,
      subwa: valueSubWa ? parseInt(valueSubWa) : null,
      utm: values.utm ? values.utm : null,
      lat: values.latlon ? parseFloat(valueLat) : null,
      lon: values.latlon ? parseFloat(valueLon) : null,
    };

    console.log("postDataInvestigate---->", postDataInvestigate);

    if (flag === "add") {
      console.log("add----->");
      sendStatus(postDataInvestigate);
    } else {
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
          placement="bottom"
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
          <Input
            name="possessorAsset"
            onChange={(e) => onChangeInputpossessorAsset(e.target.value)}
          />
        </Form.Item>
        <Tooltip
          placement="bottom"
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
            placeholder="ประเภททรัพย์"
            optionFilterProp="value"
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
            placeholder="เลือกลักษณะที่ดิน"
            optionFilterProp="value"
            onChange={(value) => onChangeSelectLandDetail(value)}
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
        <Form.Item label="ไร่" name="rai">
          <Input
            min={1} // กำหนดค่าต่ำสุด
            step={1} // จำกัดให้กรอกเฉพาะจำนวนเต็ม
            placeholder="กรุณากรอกเลขจำนวนเต็ม"
            type="number"
            onChange={(e) => onChangeInputRai(e.target.value)}
          />
        </Form.Item>
        <Tooltip
          placement="bottom"
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
              onChange={(e) => onChangeInputNgan(e.target.value)}
            />
          </Form.Item>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title="กรุณากรอกเลข `ตารางวา` ไม่เกิน 99.99"
          arrow={mergedArrow}
        >
          <Form.Item label="ตารางวา" name="wa">
            <Input
              type="number"
              placeholder="กรุณากรอกเลข`ตารางวา`ไม่เกิน 99.99 "
              min={0.01} // ป้องกันการกรอกค่าต่ำกว่า 0
              max={99.99} // ขีดจำกัดไม่เกิน 99.99
              step="0.01" // กำหนดให้สามารถกรอกค่าทศนิยม 2 ตำแหน่ง
              onChange={(e) => onChangeInputWa(e.target.value)}
            />
          </Form.Item>
        </Tooltip>
        {/* {assetTypeSelect ? (
          <>
            <Form.Item label="เลขระหว่าง" name="utm">
              <Input onChange={(e) => onChangeInputUtm(e.target.value)} />
            </Form.Item>
            <Form.Item label="ตำแหน่ง" name="latlon">
              <Input onChange={(e) => onChangeInputLatLon(e.target.value)} />
            </Form.Item>
          </>
        ) : null} */}

        <Form.Item label="ราคาประเมิน" name="estimatedPrice">
          <Input
            name="estimatedPrice"
            onChange={(e) => onChangeEstimatedPrice(e.target.value)}
            placeholder="รอประเมินราคา"
            disabled
          />
        </Form.Item>

        <Form.Item label="ผู้ถือกรรมสิทธิ์" name="ownerAsset">
          <Input onChange={(e) => onChangeInputOwnerAssetLaw(e.target.value)} />
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
              <Input onChange={(e) => onChangeInputOwner(e.target.value)} />
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
                onChange={(e) => onChangeMortgageBalance(e.target.value)}
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
        {sequestrateStatus === 1 ? (
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
              onChange={(e) => onChangeInputPreferenceCreditor(e.target.value)}
            />
          </Form.Item>
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
        <Form.Item
          label="ลิ้งเก็บรูป"
          name="urlFile"
          rules={[
            ({ getFieldValue }) => ({
              required: getFieldValue("radioCus") !== 3,
              message: "กรุณาใส่ url ของรูปจากไฟล์กลาง !",
            }),
          ]}
        >
          <Input
            name="urlFile"
            onChange={(e) => onChangeUrlFile(e.target.value)}
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
        title={`รายละเอียดข้อมูลที่ดิน`}
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
export default AssetsDetail;
