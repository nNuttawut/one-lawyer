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
} from "antd";
import {
  HEADERS_EXPORT,
  POST_CALCULATE_LAND,
  baseUrl,
  PUT_INVESTIGATE_ITEM_BY_ID,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import TextArea from "antd/es/input/TextArea";
import LoadLawyers from "../../../../hook/LoadLawyers";
import dayjs from "dayjs";
import DateCustom from "../../../../hook/DateCustom";
import LoadLandDetail from "../../../../hook/LoadLandDetail";

const EstimateAssetsResult = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [form] = Form.useForm();
  const [loadLandDetailList, setLoadingLandDetailData] = LoadLandDetail();
  const [convertDateThai] = DateCustom();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [currencyFormatComma, currencyFormatPoint] = CurrencyFormat();
  const [assistantOption, setAssistantOption] = useState();
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assetTypeSelect, setAssetTypeSelect] = useState(false);
  const [landPrice, setLandPrice] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [radioCustomer, setRadioCustomer] = useState();
  const [ralationSelect, setRalationSelect] = useState();
  const [dataLandDetailList, setDataLandDetailList] = useState(null);
  const [radioTimeType, setRadioTimeType] = useState(null);

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
      console.log("dataDefualt", dataDefualt);
      let dataWa;
      if (dataDefualt.wa && dataDefualt.subwa) {
        dataWa = `${dataDefualt.wa}.${dataDefualt.subwa}`;
      } else if (dataDefualt.wa && !dataDefualt.subwa) {
        dataWa = `${dataDefualt.wa}`;
      } else if (!dataDefualt.wa && dataDefualt.subwa) {
        dataWa = `0.${dataDefualt.subwa}`;
      } else {
        dataWa = 0;
      }
      form.setFieldsValue({
        customerAsset: dataDefualt.CUSTOMER_ID,
        possessorAsset: dataDefualt.possessor,
        ralation:
          dataDefualt.mark.split("*")[0] === "เป็นสามีภรรยา"
            ? "เป็นสามีภรรยา****"
            : dataDefualt.mark.split("*")[0] === "ไม่เป็นสามีภรรยา"
            ? "ไม่เป็นสามีภรรยา****"
            : null,
        deed: dataDefualt.deed_number,
        assetProvince: dataDefualt.province,
        assetDistrict: dataDefualt.district,
        assetPropotyType: dataDefualt.property_type_id,
        ownerAsset: dataDefualt.owner,
        mortgageStatus: !dataDefualt.mortgagee ? 0 : 1,
        sequestrateStatus: dataDefualt.sequestrate_status,
        investigatorAsset: dataDefualt.investigator_user_id,
        memo: dataDefualt.mark,
        urlFile: dataDefualt.investigate_filepath,
        mortgagee: dataDefualt.mortgagee,
        mortgageBalance: currencyFormatComma(dataDefualt.mortgage_balance),
        propertyDetail: dataDefualt.property_detail_id,
        rai: dataDefualt.rai,
        ngan: dataDefualt.ngan,
        wa: dataWa,
        investigateAssetsTime: dataDefualt.investigation_type_id,
        utm: dataDefualt.utm,
        estimatedPrice: dataDefualt.estimated_price
          ? currencyFormatPoint(dataDefualt.estimated_price)
          : null,
      });
    }
  }, [isModal]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
    if (loadLandDetailList) {
      setOptionLandDetail();
    }
  }, [lawyersList]);

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
        estimatedPrice: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
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

  const onChangeRalation = ({ target: { value } }) => {
    console.log("onChangeRalation", value);
    setRalationSelect(value);
    form.setFieldsValue({
      ralation: value,
      memo: value,
    });
  };

  const onChangeSelectInvestigatorAsset = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
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

  const onChangeInputLatLon = (value) => {
    console.log(value);
  };

  const checkLandPrice = async () => {
    var result = {
      pvcode: dataDefualt.province,
      amcode: dataDefualt.district,
      landNo: dataDefualt.deed_number,
    };
    if (
      dataDefualt.deed_number &&
      dataDefualt.district &&
      dataDefualt.province
    ) {
      setLoading(true);
      try {
        await axios
          .post(POST_CALCULATE_LAND, result, {
            HEADERS_EXPORT,
          })
          .then(async (resQuery) => {
            if (resQuery.status === 200) {
              console.log("POST_CALCULATE_LAND", resQuery?.data?.result);
              calLandPrice(resQuery?.data?.result[0]);
              if (
                Number.isNaN(resQuery?.data?.result[0].landprice) ||
                !resQuery?.data?.result[0].landprice
              ) {
                message.error("ไม่มีข้อมูลประเมินจากกรมที่ดิน ");
              }
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

  const onChangeInvestiGateTimeType = ({ target: { value } }) => {
    console.log("radio onChangeInvestiGateTimeType", value);
    setRadioTimeType(value);
  };

  const calLandPrice = (value) => {
    let raiArea = parseInt(value?.rai) * 400;
    let nganArea = parseInt(value?.ngan) * 100;
    let waArea = parseFloat(`${value?.wa}.${value?.subwa}`);
    let landPrice =
      value?.landprice &&
      typeof value?.landprice === "string" &&
      value?.landprice.includes(",")
        ? parseInt(value?.landprice.replace(/,/g, ""))
        : parseInt(value?.landprice)
        ? parseInt(value?.landprice)
        : null;
    let totalArea = (raiArea + nganArea + waArea) * landPrice;

    console.log("raiArea + nganArea + waArea", raiArea + nganArea + waArea);
    console.log("parseInt(value?.landprice)", landPrice);
    console.log("totalArea", totalArea);

    form.setFieldsValue({
      estimatedPrice: currencyFormatPoint(parseInt(totalArea)),
      rai: value?.rai,
      ngan: value?.ngan,
      wa: waArea,
    });
    setLandPrice(value);
  };

  const onChangeSelectLandDetail = (value) => {
    console.log(`selected provice ${value}`);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let putDataInvestigate;

    let convertValues = parseFloat(values.wa).toFixed(2);
    console.log("utm", dataDefualt.utm);
    console.log("utm", landPrice?.utm);

    let valueWa = values.wa ? convertValues.split(".")[0] : null;
    let valueSubWa = values.wa ? convertValues.split(".")[1] : null;
    let valueLat = values.latlon ? values.latlon.split(",")[0] : null;
    let valueLon = values.latlon ? values.latlon.split(",")[1] : null;

    putDataInvestigate = {
      ...dataDefualt,
      estimated_price:
        values?.estimatedPrice &&
        typeof values.estimatedPrice === "string" &&
        values.estimatedPrice.includes(",")
          ? parseInt(values.estimatedPrice.replace(/,/g, ""))
          : parseInt(values.estimatedPrice)
          ? parseInt(values.estimatedPrice)
          : null,
      mark: values.memo,
      rai: values.rai ? parseInt(values.rai) : null,
      ngan: values.ngan ? parseInt(values.ngan) : null,
      wa: valueWa ? parseInt(valueWa) : null,
      subwa: valueSubWa ? parseInt(valueSubWa) : null,
      utm: dataDefualt.utm
        ? dataDefualt.utm
        : landPrice?.utm
        ? landPrice?.utm
        : null,
      lat: dataDefualt.lat
        ? dataDefualt.lat
        : landPrice?.parcellat
        ? landPrice?.parcellat
        : valueLat
        ? valueLat
        : null,
      lon: dataDefualt.lon
        ? dataDefualt.lon
        : landPrice?.parcellon
        ? landPrice?.parcellon
        : valueLon
        ? valueLon
        : null,
    };

    console.log("postDataInvestigate---->", putDataInvestigate);

    sendStatus(putDataInvestigate);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const sendStatus = async (putDataInvestigate) => {
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
            funcUpdateStatus({
              ...dataDefualt,
              estimated_price: putDataInvestigate.estimated_price,
            });
            message.success(
              `ประเมินทรัพย์ของสัญญา ${dataDefualt.CONTNO} สำเร็จ`
            );
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

  const formDataSet = () => {
    return (
      <Form
        labelCol={{
          span: 8,
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
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {`${dataDefualt?.CONTNO} / ${dataDefualt?.SNAM}
            ${dataDefualt?.NAME1} ${dataDefualt?.NAME2}`}
          </p>
        </Form.Item>
        <Form.Item label="วันที่สืบทรัพย์" name="investigateAssetsDate">
          <p>{convertDateThai(dataDefualt.investigation_date)}</p>
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
            disabled
          />
        </Form.Item>
        <Form.Item label="บุคคลอ้างอิงในสัญญา" name="refAsset">
          <p>{`${dataDefualt.SNAM}${dataDefualt.NAME1} ${dataDefualt.NAME2}`}</p>
        </Form.Item>
        <Form.Item label="ชื่อเจ้าของทรัพย์" name="possessorAsset">
          <p>{dataDefualt.possessor}</p>
        </Form.Item>
        <Tooltip
          placement="bottom"
          title="ความเกี่ยวข้องของผู้ทำสัญญาหรือผู้ค้ำกับเจ้าของทรัพย์"
          arrow={mergedArrow}
        >
          <Form.Item label="เลือกความเกี่ยวข้อง" name="ralation">
            <Radio.Group
              label="เลือกความเกี่ยวข้อง"
              name="ralation"
              options={optionsRalation}
              onChange={onChangeRalation}
              value={radioCustomer}
              disabled
            />
          </Form.Item>
        </Tooltip>
        <Form.Item label="ประเภททรัพย์" name="assetPropotyType">
          <Select
            placeholder="ประเภททรัพย์"
            optionFilterProp="value"
            onChange={(value) => onChangeSelectAssetPropotyType(value)}
            options={optionsAssetsType}
            style={{ width: "100%" }}
            disabled
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
            disabled
          />
        </Form.Item>
        <Form.Item label="เลขโฉนด/เลขที่ดิน" name="deed">
          {dataDefualt.deed_number}
        </Form.Item>
        <Form.Item label="จังหวัด" name="assetProvince">
          <p>{dataDefualt.prov_desc}</p>
        </Form.Item>
        <Form.Item label="อำเภอ" name="assetDistrict">
          <p>{dataDefualt.dist_desc}</p>
        </Form.Item>
        <Form.Item label="ไร่" name="rai">
          <Input
            min={0}
            step={1} // จำกัดให้กรอกเฉพาะจำนวนเต็ม
            placeholder="กรุณากรอกเลขจำนวนเต็ม"
            type="number"
            onChange={(e) => onChangeInputRai(e.target.value)}
          />
        </Form.Item>
        v{" "}
        <Tooltip
          placement="bottom"
          title="กรุณากรอกเลข`งาน`เป็นจำนวนเต็มไม่เกิน 3 "
          arrow={mergedArrow}
        >
          <Form.Item label="งาน" name="ngan">
            <Input
              type="number"
              placeholder="กรุณากรอกเลข`งาน`เป็นจำนวนเต็มไม่เกิน 3 "
              min={0}
              max={3}
              step={1} // จำกัดให้กรอกเฉพาะจำนวนเต็ม
              onChange={(e) => onChangeInputNgan(e.target.value)}
            />
          </Form.Item>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title="กรุณากรอกเลข`ตารางวา`ไม่เกิน 99.99 "
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
        {dataDefualt.property_type_id === 1 ? (
          <>
            <Tooltip
              placement="bottom"
              title={landPrice?.utm ? "คลิกเพื่อเข้าสู่เว็บ กรมที่ดิน" : null}
              arrow={mergedArrow}
            >
              <Form.Item label="เลขระหว่าง" name="utm">
                {landPrice?.utm || dataDefualt.utm ? (
                  <a
                    href={`https://landsmaps.dol.go.th/` || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dataDefualt.utm ? dataDefualt.utm : landPrice?.utm}
                  </a>
                ) : (
                  <span>
                    {" "}
                    {dataDefualt.utm ? dataDefualt.utm : landPrice?.utm}
                  </span>
                )}
              </Form.Item>
            </Tooltip>
            <Tooltip
              placement="bottom"
              title={landPrice?.utm ? "คลิกเพื่อเข้าสู่เว็บ google map" : null}
              arrow={mergedArrow}
            >
              <Form.Item label="ตำแหน่ง" name="latlon">
                {landPrice?.parcellat || dataDefualt.lat ? (
                  <a
                    href={
                      `https://www.google.com/maps/place/@${
                        dataDefualt.lat ? dataDefualt.lat : landPrice?.parcellat
                      },${
                        dataDefualt.lon ? dataDefualt.lon : landPrice?.parcellon
                      },1096m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D` ||
                      "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dataDefualt.lat ? dataDefualt.lat : landPrice?.parcellat},{" "}
                    {dataDefualt.lon ? dataDefualt.lon : landPrice?.parcellon}
                  </a>
                ) : null}
              </Form.Item>
            </Tooltip>
          </>
        ) : (
          <>
            <Form.Item label="ตำแหน่ง" name="latlon">
              <Input
                placeholder="
8.17240819, 99.03230145"
                onChange={(e) => onChangeInputLatLon(e.target.value)}
              />
            </Form.Item>
          </>
        )}
        {dataDefualt.property_type_id === 1 ? (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Button style={{ color: "blue" }} onClick={checkLandPrice}>
              เช็คราคาประเมิน
            </Button>
          </div>
        ) : null}
        <Form.Item label="ราคาประเมิน" name="estimatedPrice">
          <Input
            name="estimatedPrice"
            onChange={(e) => onChangeEstimatedPrice(e.target.value)}
            placeholder="รอประเมินราคา"
          />
        </Form.Item>
        <Form.Item label="เลือกผู้สืบทรัพย์" name="investigatorAsset">
          <Select
            placeholder="เลือกผู้สืบทรัพย์"
            optionFilterProp="value"
            onChange={(value) => onChangeSelectInvestigatorAsset(value)}
            options={assistantOption}
            style={{ width: "100%" }}
            disabled
          />
        </Form.Item>
        <Form.Item label="ลิ้งเก็บรูป" name="urlFile">
          {dataDefualt?.investigate_filepath ? (
            <a
              href={dataDefualt?.investigate_filepath || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              คลิกเพื่อดูรูปภาพ
            </a>
          ) : (
            <span>ไม่มีลิงก์รูปภาพ</span>
          )}
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
export default EstimateAssetsResult;
