import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  Select,
  Spin,
  message,
  Radio,
} from "antd";
import {
  NOTICE,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import axios from "axios";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LAWSUIT_DETAIL_BY_LOAN,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_PARCELS,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import LoadCompanies from "../../../../hook/LoadCompanies";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";

const UpdateReplyNotice = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState(null);
  const { TextArea } = Input;
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [lawsuitData, setLawsuitData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [defaultRadio, setDefaultRadio] = useState(null);
  const userCompany = localStorage.getItem("COMPANY_ID");

  useEffect(() => {
    loadData();
    setLoadingDataCompany(true);
    dateSet();
    console.log("dataDefault--->", dataDefault);
  }, [setLoadingDataCompany]);

  const dateSet = () => {
    const date = dayjs().format("YYYY-MM-DD");
    return date;
  };

  useEffect(() => {
    setOption();
  }, [companiesListCompany]);

  const setOption = () => {
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));
    setCompaniesOption(options);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await axios
        .get(baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefault.LAWSUIT_ID, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setLawsuitData(res.data);
            console.log("setLawsuitData", res.data);
            setLoading(false);
          } else {
            message.error("ไม่สามารถดึงข้อมูลได้");
            console.log("ไม่สามารถดึงข้อมูลได้", res.status);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status >= 300) {
            message.error("ไม่สามารถดึงข้อมูลได้", err.status);
          }
        });

      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefault?.CONTNO, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setLoanData(res.data);
            console.log("setLoanData", res.data);
            setLoading(false);
          } else {
            message.error("ไม่สามารถดึงข้อมูลได้");
            console.log("ไม่สามารถดึงข้อมูลได้", res.status);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status >= 300) {
            message.error("ไม่สามารถดึงข้อมูลได้", err.status);
          }
        });
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };

  const sendStatus = async (status, lawsuit, parcel) => {
    console.log("data-->", status, lawsuit, parcel);
    if (status) {
      setLoading(true);
      try {
        await axios
          .put(baseUrl + PUT_STATUS, status, { headers: HEADERS_EXPORT })
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
            if (err.status === 404) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });

        await axios
          .put(baseUrl + PUT_LAWSUIT_DETAIL, lawsuit, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 200) {
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefault,
                MAIN_STATUS_ID: NOTICE,
                DATE: status.DATE,
                COMPANY_ID: lawsuit.COMPANY_ID,
                MEMO: status.MEMO,
                PROCESS_ID: status.PROCESS_ID,
                parcel_list: parcel,
              });
              setLoading(false);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status === 404) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });

        const promises = parcel.map(async (item) => {
          const arrayData = item;
          console.log("arrayData", arrayData);

          if (!arrayData) {
            message.warning("พบค่าที่ไม่ถูกต้อง");
            return null;
          }
          await axios
            .post(baseUrl + POST_PARCELS, arrayData, {
              headers: HEADERS_EXPORT,
            })
            .then((resQuery) => {
              if (resQuery.status === 201) {
                console.log(resQuery.data);
                return resQuery.data;
              } else {
                console.log(`นำเข้าข้อมูลสำเร็จไม่สำเร็จ `);
                return null;
              }
            })
            .catch((err) => {
              console.error(err);
              message.error(`นำเข้าข้อมูลไม่สำเร็จ`);
            });
        });

        const response = await Promise.all(promises);
        console.log("results", response);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      } finally {
        setLoading(false);
        handleCancel();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      message.error("โปรดตรวจสอบข้อมูลและกดบันทึกอีกครั้ง");
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value} `);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, dateNotice: dateString });
  };

  const onChangeInputParcel = (value) => {
    console.log(value);
  };

  const onChangeInput = (value) => {
    console.log(value);
  };

  const onChangeReplyFile = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let statutProcess;
    if (
      values.radioCus === 3 ||
      values.radioGuarantor1 === 3 ||
      values.radioGuarantor2 === 3 ||
      values.radioGuarantor3 === 3 ||
      values.radioGuarantor4 === 3 ||
      values.radioGuarantor5 === 3 ||
      values.radioGuarantor6 === 3
    ) {
      statutProcess = STATUS_PROCESS_UNSUCCESSFUL;
    } else {
      statutProcess = STATUS_PROCESS_SUCCESSFUL;
    }

    const putStatus = {
      WORK_LOG_ID: dataDefault?.WORK_LOG_ID,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_ID: dataDefault.id,
      MEMO: values.memo,
      PROCESS_ID: statutProcess,
      DATE: dayjs(dataDefault.DATE).format("YYYY-MM-DD"),
    };

    const putLawsuit = {
      ...lawsuitData,
      COMPANY_ID: parseInt(values.company),
    };

    let parcelsSet = [];
    const initData = {
      WORK_LOG_ID: dataDefault.WORK_LOG_ID,
      url_path: values.imageReplyFile,
    };

    if (dataDefault.LOAN_TYPE_ID === 2) {
      parcelsSet.push({
        ...initData,
        CUSTOMER_ID: values.cusId,
        parcel_no: values.parcelNoCustomer,
        mark: values.memo,
        response_status: values.radioCus === 3 ? 0 : values.radioCus,
        parcel_typ_id: 2,
      });
    } else {
      parcelsSet.push({
        ...initData,
        CUSTOMER_ID: values.cusId,
        parcel_no: values.parcelNoCustomer,
        mark: values.memo,
        response_status: values.radioCus === 3 ? 0 : values.radioCus,
        parcel_typ_id: 2,
      });

      if (loanData.GUARANTORS.length > 0) {
        console.log("loadData.GUARANTORS.length > 0");
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor1,
          parcel_no: values.parcelNoGuarantor1,
          mark: values.memo,
          response_status:
            values.radioGuarantor1 === 3 ? 0 : values.radioGuarantor1,
          parcel_typ_id: 3,
        });
      }
      if (loanData.GUARANTORS.length > 1) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor2,
          parcel_no: values.parcelNoGuarantor2,
          mark: values.memo,
          response_status:
            values.radioGuarantor2 === 3 ? 0 : values.radioGuarantor2,
          parcel_typ_id: 3,
        });
      }
      if (loanData.GUARANTORS.length > 2) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor3,
          parcel_no: values.parcelNoGuarantor3,
          mark: values.memo,
          response_status:
            values.radioGuarantor3 === 3 ? 0 : values.radioGuarantor3,
          parcel_typ_id: 3,
        });
      }

      if (loanData.GUARANTORS.length > 3) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor4,
          parcel_no: values.parcelNoGuarantor4,
          mark: values.memo,
          response_status:
            values.radioGuarantor4 === 3 ? 0 : values.radioGuarantor4,
          parcel_typ_id: 3,
        });
      }

      if (loanData.GUARANTORS.length > 4) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor5,
          parcel_no: values.parcelNoGuarantor5,
          mark: values.memo,
          response_status:
            values.radioGuarantor5 === 3 ? 0 : values.radioGuarantor5,
          parcel_typ_id: 3,
        });
      }
      if (loanData.GUARANTORS.length > 5) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor6,
          parcel_no: values.parcelNoGuarantor6,
          mark: values.memo,
          response_status:
            values.radioGuarantor6 === 3 ? 0 : values.radioGuarantor6,
          parcel_typ_id: 3,
        });
      }
    }
    console.log("dataSet", parcelsSet);
    console.log("putDataData", putStatus);

    sendStatus(putStatus, putLawsuit, parcelsSet);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  return (
    <>
      <Modal
        title="สร้างตอบกลับโนติส"
        open={open}
        onCancel={handleCancel}
        width={650}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>
            <Form
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 24,
              }}
              layout="horizontal"
              style={{
                maxWidth: 600,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{
                memo: null,
                company: dataDefault.COMPANY_ID,
                dateNotice: dayjs(),
                cus: loanData?.CUSTOMER?.id,
                imageReplyFile: null,
              }}
              dependencies={["radioCus"]}
            >
              <Form.Item label="เลขสัญญา">{dataDefault?.CONTNO}</Form.Item>
              <Form.Item label="ประเภทสัญญา">
                {dataDefault?.LOAN_TYPE_ID === 1 ? "เช่าซื้อ" : "จำนอง"}
              </Form.Item>
              <Form.Item label="บริษัทที่ออกหนังสือ" name="company">
                <Select
                  showSearch
                  style={{
                    width: 250,
                  }}
                  disabled
                  placeholder="เลือกบริษัท"
                  optionFilterProp="value"
                  options={companiesOption}
                  onChange={(value) => onChangeSelect(value)}
                  defaultValue={parseInt(userCompany) === 3 ? 3 : 2}
                />
              </Form.Item>
              <Form.Item label="วันที่ออกหนังสือ" name="dateNotice">
                {dayjs(dataDefault?.DATE).format("D MMMM YYYY ")}
              </Form.Item>
              <Form.Item
                label="ผู้ทำสัญญา"
                name="cusId"
                initialValue={dataDefault?.CUSTOMER_ID}
              >
                {`${loanData?.CUSTOMER?.SNAM}${loanData?.CUSTOMER?.NAME1}  ${loanData?.CUSTOMER?.NAME2}`}
              </Form.Item>
              <Form.Item
                label="กรอกหมายเลข EMS"
                name="parcelNoCustomer"
                rules={[
                  {
                    required: true,
                    message: "โปรดกรอกข้อมูล",
                  },
                ]}
              >
                <Input
                  placeholder="ตัวอย่าง:EF582568151TH"
                  maxLength={13}
                  onChange={(e) => onChangeInputParcel(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="การตอบกลับ"
                name="radioCus"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกข้อมูล",
                  },
                ]}
              >
                <Radio.Group onChange={onChange} defaultValue={defaultRadio}>
                  <Radio value={1}>จากใบตอบกลับ</Radio>
                  <Radio value={2}>จากเว็บไปษณีย์</Radio>
                  <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                </Radio.Group>
              </Form.Item>
              {dataDefault?.LOAN_TYPE_ID === 1 ? (
                <>
                  {loanData?.GUARANTORS.length > 0 ? (
                    <>
                      <Form.Item
                        label="ผู้ค่ำที่ 1"
                        name="guarantor1"
                        initialValue={loanData?.GUARANTORS[0]?.id}
                      >
                        {`${loanData?.GUARANTORS[0]?.SNAM}${loanData?.GUARANTORS[0]?.NAME1} ${loanData?.GUARANTORS[0]?.NAME2}`}
                      </Form.Item>
                      <Form.Item
                        label="กรอกหมายเลข EMS"
                        name="parcelNoGuarantor1"
                        rules={[
                          {
                            required: true,
                            message: "โปรดกรอกข้อมูล",
                          },
                        ]}
                      >
                        <Input
                          placeholder="ตัวอย่าง:EF582568151TH"
                          maxLength={13}
                          onChange={(e) => onChangeInputParcel(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label="การตอบกลับ"
                        name="radioGuarantor1"
                        rules={[
                          {
                            required: true,
                            message: "โปรดเลือกข้อมูล",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChange}
                          defaultValue={defaultRadio}
                        >
                          <Radio value={1}>จากใบตอบกลับ</Radio>
                          <Radio value={2}>จากเว็บไปษณีย์</Radio>
                          <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  ) : null}
                  {loanData?.GUARANTORS.length > 1 ? (
                    <>
                      <Form.Item
                        label="ผู้ค่ำที่ 2"
                        name="guarantor2"
                        initialValue={loanData?.GUARANTORS[1]?.id}
                      >
                        {`${loanData?.GUARANTORS[1]?.SNAM}${loanData?.GUARANTORS[1]?.NAME1} ${loanData?.GUARANTORS[1]?.NAME2}`}
                      </Form.Item>
                      <Form.Item
                        label="กรอกหมายเลข EMS"
                        name="parcelNoGuarantor2"
                        rules={[
                          {
                            required: true,
                            message: "โปรดกรอกข้อมูล",
                          },
                        ]}
                      >
                        <Input
                          placeholder="ตัวอย่าง:EF582568151TH"
                          maxLength={13}
                          onChange={(e) => onChangeInputParcel(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label="การตอบกลับ"
                        name="radioGuarantor2"
                        rules={[
                          {
                            required: true,
                            message: "โปรดเลือกข้อมูล",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChange}
                          defaultValue={defaultRadio}
                        >
                          <Radio value={1}>จากใบตอบกลับ</Radio>
                          <Radio value={2}>จากเว็บไปษณีย์</Radio>
                          <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  ) : null}
                  {loanData?.GUARANTORS.length > 2 ? (
                    <>
                      <Form.Item
                        label="ผู้ค่ำที่ 3"
                        name="guarantor3"
                        initialValue={loanData?.GUARANTORS[2]?.id}
                      >
                        {`${loanData?.GUARANTORS[2]?.SNAM}${loanData?.GUARANTORS[2]?.NAME1} ${loanData?.GUARANTORS[2]?.NAME2}`}
                      </Form.Item>
                      <Form.Item
                        label="กรอกหมายเลข EMS"
                        name="parcelNoGuarantor3"
                        rules={[
                          {
                            required: true,
                            message: "โปรดกรอกข้อมูล",
                          },
                        ]}
                      >
                        <Input
                          placeholder="ตัวอย่าง:EF582568151TH"
                          maxLength={13}
                          onChange={(e) => onChangeInputParcel(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label="การตอบกลับ"
                        name="radioGuarantor3"
                        rules={[
                          {
                            required: true,
                            message: "โปรดเลือกข้อมูล",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChange}
                          defaultValue={defaultRadio}
                        >
                          <Radio value={1}>จากใบตอบกลับ</Radio>
                          <Radio value={2}>จากเว็บไปษณีย์</Radio>
                          <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  ) : null}
                  {loanData?.GUARANTORS.length > 3 ? (
                    <>
                      <Form.Item
                        label="ผู้ค่ำที่ 4"
                        name="guarantor4"
                        initialValue={loanData?.GUARANTORS[3]?.id}
                      >
                        {`${loanData?.GUARANTORS[3]?.SNAM}${loanData?.GUARANTORS[3]?.NAME1} ${loanData?.GUARANTORS[3]?.NAME2}`}
                      </Form.Item>
                      <Form.Item
                        label="กรอกหมายเลข EMS"
                        name="parcelNoGuarantor4"
                        rules={[
                          {
                            required: true,
                            message: "โปรดกรอกข้อมูล",
                          },
                        ]}
                      >
                        <Input
                          placeholder="ตัวอย่าง:EF582568151TH"
                          maxLength={13}
                          onChange={(e) => onChangeInputParcel(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label="การตอบกลับ"
                        name="radioGuarantor4"
                        rules={[
                          {
                            required: true,
                            message: "โปรดเลือกข้อมูล",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChange}
                          defaultValue={defaultRadio}
                        >
                          <Radio value={1}>จากใบตอบกลับ</Radio>
                          <Radio value={2}>จากเว็บไปษณีย์</Radio>
                          <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  ) : null}
                  {loanData?.GUARANTORS.length > 4 ? (
                    <>
                      <Form.Item
                        label="ผู้ค่ำที่ 5"
                        name="guarantor5"
                        initialValue={loanData?.GUARANTORS[4]?.id}
                      >
                        {`${loanData?.GUARANTORS[4]?.SNAM}${loanData?.GUARANTORS[4]?.NAME1} ${loanData?.GUARANTORS[4]?.NAME2}`}
                      </Form.Item>
                      <Form.Item
                        label="กรอกหมายเลข EMS"
                        name="parcelNoGuarantor5"
                        rules={[
                          {
                            required: true,
                            message: "โปรดกรอกข้อมูล",
                          },
                        ]}
                      >
                        <Input
                          placeholder="ตัวอย่าง:EF582568151TH"
                          maxLength={13}
                          onChange={(e) => onChangeInputParcel(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label="การตอบกลับ"
                        name="radioGuarantor5"
                        rules={[
                          {
                            required: true,
                            message: "โปรดเลือกข้อมูล",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChange}
                          defaultValue={defaultRadio}
                        >
                          <Radio value={1}>จากใบตอบกลับ</Radio>
                          <Radio value={2}>จากเว็บไปษณีย์</Radio>
                          <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  ) : null}
                  {loanData?.GUARANTORS.length > 5 ? (
                    <>
                      <Form.Item
                        label="ผู้ค่ำที่ 6"
                        name="guarantor6"
                        initialValue={loanData?.GUARANTORS[5]?.id}
                      >
                        {`${loanData?.GUARANTORS[5]?.SNAM}${loanData?.GUARANTORS[5]?.NAME1} ${loanData?.GUARANTORS[5]?.NAME2}`}
                      </Form.Item>
                      <Form.Item
                        label="กรอกหมายเลข EMS"
                        name="parcelNoGuarantor6"
                        rules={[
                          {
                            required: true,
                            message: "โปรดกรอกข้อมูล",
                          },
                        ]}
                      >
                        <Input
                          placeholder="ตัวอย่าง:EF582568151TH"
                          maxLength={13}
                          onChange={(e) => onChangeInputParcel(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label="การตอบกลับ"
                        name="radioGuarantor6"
                        rules={[
                          {
                            required: true,
                            message: "โปรดเลือกข้อมูล",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChange}
                          defaultValue={defaultRadio}
                        >
                          <Radio value={1}>จากใบตอบกลับ</Radio>
                          <Radio value={2}>จากเว็บไปษณีย์</Radio>
                          <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  ) : null}
                </>
              ) : null}
              <Form.Item
                label="ลิ้งเก็บรูปตอบกลับ"
                name="imageReplyFile"
                rules={[
                  ({ getFieldValue }) => ({
                    required: getFieldValue("radioCus") !== 3,
                    message: "กรุณาใส่ url ของรูปจากไฟล์กลาง !",
                  }),
                ]}
              >
                <Input
                  name="imageReplyFile"
                  onChange={(e) => onChangeReplyFile(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="หมายเหตุ" name="memo">
                <TextArea
                  rows={5}
                  onChange={(e) => onChangeInput(e.target.value)}
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
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateReplyNotice;
