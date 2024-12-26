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
  Checkbox,
  Tooltip,
  DatePicker,
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

  const optionsMortgageStatus = [
    { label: "ไม่ติดภาระ", value: 0 },
    { label: "ติดภาระ", value: 1 },
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

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
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

  const onChangeSelectInvestigatorAsset = (value) => {
    console.log(`selected ${value}`);
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
    };

    console.log("postDataInvestigate---->", putDataInvestigate);

    sendStatus(putDataInvestigate, dataIndex);
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
          {currencyFormatComma(dataIndex.estimated_price)}
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

        {dataIndex.mortgagee || mortgageStatus === 1 ? (
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
            {
              required: true,
              message: "กรุณาใส่ url ของรูปจากไฟล์กลาง !",
            },
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
