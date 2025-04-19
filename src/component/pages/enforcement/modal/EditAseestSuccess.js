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
  Image,
  InputNumber,
  Popconfirm,
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

const EditAssetsSuccess = ({
  open,
  close,
  dataLoan,
  dataDefualt,
  governmentOfficers,
  handleEdit,
  dataIndex,
  flag,
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
  const [seizeStatus, setSeizeStatus] = useState(null);
  const [sequestrateStatus, setSequestrateStatus] = useState(null);
  const [mortgageStatus, setMortgageStatus] = useState(null);
  const [landPrice, setLandPrice] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [refAssetOption, setRefAssetOption] = useState([]);
  const [radioRefAsset, setRadioRefAsset] = useState();
  const [dataLandDetailList, setDataLandDetailList] = useState(null);
  const [imageList, setImageList] = useState([]);

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

  const optionsSeizeStatus = [
    { label: "ถอนยึด", value: 0 },
    { label: "ยึด", value: 1 },
  ];

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
    setMortgageStatus(!dataIndex.mortgagee ? 0 : 1);
    setSequestrateStatus(dataIndex.sequestrate_status);
    setSeizeStatus(dataIndex.seize_status);
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
      mortgageStatus: mortgageStatus,
      sequestrateStatus: sequestrateStatus,
      investigatorAsset: dataIndex.investigator_user_id,
      memo: dataIndex.mark,
      urlFile: dataIndex.investigate_filepath,
      mortgagee: dataIndex.mortgagee,
      mortgageBalance: dataIndex.mortgage_balance,
      investigateAssetsTime: dataIndex.investigation_type_id,
      rai: dataIndex.rai,
      ngan: dataIndex.ngan,
      wa: dataWa,
      preferenceCreditor: dataIndex.preference_creditor,
      averageStatus:
        dataIndex.estimated_price > dataIndex.mortgage_balance ? 1 : 0,
      seizeStatus: !dataIndex.seize_status ? 0 : 1,
      estimatedEnforcePrice: dataIndex.estimated_enforce_price,
      AddrEnforce: dataIndex.legal_execution_office,
    });
  }, [isModal]);
  console.log(dataIndex);

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
    await axios
      .get(
        baseUrl +
          `/files/lawyer/investigate-property/${PARAM_PUBLIC}/asset_${dataDefualt?.CONTNO}_${dataIndex?.CUSTOMER_ID}_${dataIndex?.deed_number}_${dataIndex?.province}_${dataIndex?.district}`
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
    let dataGovernmentOfficers = [];

    dataGovernmentOfficers.push({
      id: governmentOfficers.id,
      ADDRESS: governmentOfficers.ADDRESS,
      GARNO: governmentOfficers.GARNO,
      SNAME: governmentOfficers.SNAM,
      NAME1: governmentOfficers.NAME1,
      NAME2: governmentOfficers.NAME2,
    });

    governmentOfficers?.guarantors?.forEach((guarantor, index) => {
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

    const optionsGovernmentOfficers = dataGovernmentOfficers?.map((item) => ({
      value: item.id,
      label: `${item.SNAME}${item.NAME1} ${item.NAME2}`,
    }));
    setRefAssetOption(optionsGovernmentOfficers);
  };

  const setOptionLandDetail = () => {
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

  const onChangeInputOwner = (value) => {
    console.log(value);
  };

  const onChangeInputPreferenceCreditor = (value) => {
    console.log(value);
  };

  const onChangeMortgageStatus = ({ target: { value } }) => {
    console.log("radio Mortgage checked", value);
    setMortgageStatus(value);
    // if (value === 0) {
    //   form.setFieldsValue({
    //     mortgageBalance: null,
    //     mortgagee: null,
    //   });
    // }
  };

  const onChangeSequestrateStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setSequestrateStatus(value);
  };

  const onChangeSeizeStatus = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setSeizeStatus(value);
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
      average_status: values.mortgageBalance
        ? values.estimatedEnforcePrice > values.mortgageBalance
          ? 1
          : 0
        : null,
      mark: values.memo,
      investigate_filepath: values.urlFile,
      seize_status: values.seizeStatus,
      seize_date: dayjs().format("YYYY-MM-DD"),
      legal_execution_office:
        values.seizeStatus === 1 ? values.AddrEnforce : null,
      estimated_enforce_price: values.estimatedEnforcePrice
        ? values.estimatedEnforcePrice
        : null,
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
            handleEdit(putDataInvestigate, flag);

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

  const confirm = () => {
    form.submit(); // ส่งฟอร์มเมื่อกด "ยืนยัน"
  };

  const cancel = () => {
    message.success("ยกเลิกการบันทึก");
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
          {convertDateThai(dataIndex?.investigation_date)}
        </Form.Item>
        <Form.Item label="ห้วงเวลาการฟ้อง" name="investigateAssetsTime">
          {dataIndex?.investigation_type_id === 1 ? "ก่อนฟ้อง" : "หลังฟ้อง"}
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
          {/* <Form.Item label="เลือกความเกี่ยวข้อง" name="ralation">
            {dataIndex?.mark.split("*")[0] === "เป็นสามีภรรยา"
              ? "เป็นสามีภรรยา"
              : dataIndex.mark.split("*")[0] === "ไม่เป็นสามีภรรยา"
              ? "ไม่เป็นสามีภรรยา"
              : null}
          </Form.Item> */}
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
            ) : (
              "-"
            )}
          </Form.Item>
        </Tooltip>

        <Tooltip
          placement="lift"
          title="ราคาประเมินจากบริษัท"
          arrow={mergedArrow}
        >
          <Form.Item label="ราคาประเมิน(บ.)" name="estimatedPrice">
            {currencyFormatComma(dataIndex.estimated_price)} บาท
          </Form.Item>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title="ราคาประเมินจากกรมบังคับคดี"
          arrow={mergedArrow}
        >
          <Form.Item
            label="ราคาประเมิน(กบค)"
            name="estimatedEnforcePrice"
            style={{ color: "red" }}
            rules={[
              {
                required: true,
                message: "กรุณาใส่ราคาประเมิน(กบค) !",
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
        </Tooltip>
        <Form.Item
          label="สถานะการยึด"
          name="seizeStatus"
          rules={[
            {
              required: true,
              message: "กรุณาเลือก !",
            },
          ]}
        >
          <Radio.Group
            label="สถานะการยึด"
            name="seizeStatus"
            options={optionsSeizeStatus}
            onChange={onChangeSeizeStatus}
            defaultValue={seizeStatus}
          />
        </Form.Item>
        {seizeStatus ? (
          <>
            <Form.Item
              label="สำนักงานบังคับคดี"
              name="AddrEnforce"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณากรอกสำนักงานบังคับคดี",
              //   },
              // ]}
            >
              <Input name="AddrEnforce" />
            </Form.Item>
          </>
        ) : null}
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
            defaultValuevalue={mortgageStatus}
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
              <InputNumber
                name="mortgageBalance"
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
            {/* <Form.Item
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
            </Form.Item> */}
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
            </Form.Item>{" "}
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
            showSearch
            optionFilterProp="label"
            disabled
            onChange={(value) => onChangeSelectInvestigatorAsset(value)}
            options={assistantOption}
            style={{ width: "100%" }}
          />
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

          <Popconfirm
            placement="topLeft"
            title="อัพเดทสถานะ"
            description="กรุณาตรวจสอบข้อมูลให้เรียบร้อย !"
            onConfirm={confirm}
            onCancel={cancel}
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
