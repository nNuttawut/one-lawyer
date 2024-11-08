import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  Select,
  Spin,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  NOTICE,
  STATUS_PROCESS_PROGRESS,
} from "../../../../utils/constant/StatusConstant";
import axios from "axios";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_PARCELS,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import LoadCompanies from "../../../../hook/LoadCompanies";
import dayjs from "dayjs";

const CreateNotice = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState();
  const { TextArea } = Input;
  const [companiesList, setLoadingData] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [lawsuitData, setLawsuitData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [dataSend, setDataSend] = useState(null);

  useEffect(() => {
    loadData();
    setLoadingData(true);
    dateSet();
    console.log("dataDefualt--->", dataDefualt);
  }, [setLoadingData]);

  const dateSet = () => {
    const date = dayjs().format("YYYY-MM-DD");
    return date;
  };

  useEffect(() => {
    setOption();
  }, [companiesList]);

  const setOption = () => {
    const options = companiesList.map((item) => ({
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
        .get(baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefualt.LAWSUIT_ID, {
          HEADERS_EXPORT,
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
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefualt.CONTNO, {
          HEADERS_EXPORT,
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

  const sendStatus = async (data, lawsuit, parcel) => {
    console.log("data-->", data, lawsuit, parcel);
    if (data) {
      setLoading(true);
      try {
        await axios
          .put(baseUrl + PUT_STATUS, data, { HEADERS_EXPORT })
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
          .put(baseUrl + PUT_LAWSUIT_DETAIL, lawsuit, { HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefualt,
                MAIN_STATUS_ID: NOTICE,
                DATE: data.DATE,
                COMPANY_ID: lawsuit.COMPANY_ID,
                MEMO: data.MEMO,
                PROCESS_ID: data.PROCESS_ID,
                PARCEL_NO: parcel.parcel_no,
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
              HEADERS_EXPORT,
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

  const onFinish = (values) => {
    console.log("Success:", values);
    const postData = {
      WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_ID: dataDefualt.id,
      MEMO: values.memo,
      PROCESS_ID: STATUS_PROCESS_PROGRESS,
      DATE: preData
        ? dayjs(preData.dateNotice).format("YYYY-MM-DD")
        : dayjs(values.dateNotice).format("YYYY-MM-DD"),
    };
    const putLawsuit = {
      ...lawsuitData,
      COMPANY_ID: parseInt(values.company),
    };

    let parcelsSet = [];
    const initData = {
      WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
      parcel_typ_id: null,
      response_status: null,
      process_id: STATUS_PROCESS_PROGRESS,
      url_path: null,
    };

    if (dataDefualt.LOAN_TYPE_ID === 2) {
      parcelsSet.push({
        ...initData,
        CUSTOMER_ID: values.cusId,
        parcel_no: values.parcelNoCustomer,
        mark: values.memo,
      });
    } else {
      parcelsSet.push({
        ...initData,
        CUSTOMER_ID: values.cusId,
        parcel_no: values.parcelNoCustomer,
        mark: values.memo,
      });

      if (loanData.GUARANTORS.length > 0) {
        console.log("loadData.GUARANTORS.length > 0");
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor1,
          parcel_no: values.parcelNoGuarantor1,
          mark: values.memo,
        });
      }
      if (loanData.GUARANTORS.length > 1) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor2,
          parcel_no: values.parcelNoGuarantor2,
          mark: values.memo,
        });
      }
      if (loanData.GUARANTORS.length > 2) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor3,
          parcel_no: values.parcelNoGuarantor3,
          mark: values.memo,
        });
      }

      if (loanData.GUARANTORS.length > 3) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor4,
          parcel_no: values.parcelNoGuarantor4,
          mark: values.memo,
        });
      }

      if (loanData.GUARANTORS.length > 4) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor5,
          parcel_no: values.parcelNoGuarantor5,
          mark: values.memo,
        });
      }
      if (loanData.GUARANTORS.length > 5) {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values.guarantor6,
          parcel_no: values.parcelNoGuarantor6,
          mark: values.memo,
        });
      }
    }
    console.log("dataSet", parcelsSet);
    console.log("putDataData", postData);

    sendStatus(postData, putLawsuit, parcelsSet);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  return (
    <>
      <Modal
        title="สร้างโนติส"
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
                company: 2,
                dateNotice: dayjs(),
                cus: loanData?.CUSTOMER?.id,
              }}
            >
              <Form.Item label="เลขสัญญา">{dataDefualt.CONTNO}</Form.Item>
              <Form.Item label="ประเภทสัญญา">
                {dataDefualt.LOAN_TYPE_ID === 1 ? "เช่าซื้อ" : "จำนอง"}
              </Form.Item>
              <Form.Item
                label="บริษัทที่ออกหนังสือ"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกข้อมูล",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 250,
                  }}
                  placeholder="เลือกบริษัท"
                  optionFilterProp="value"
                  options={companiesOption}
                  onChange={(value) => onChangeSelect(value)}
                  defaultValue={2}
                />
              </Form.Item>
              <Form.Item
                label="วันที่ออกหนังสือ"
                name="dateNotice"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกข้อมูล",
                  },
                ]}
              >
                <DatePicker onChange={onChange} />
              </Form.Item>
              <Form.Item
                label="ผู้ทำสัญญา"
                name="cusId"
                initialValue={dataDefualt?.CUSTOMER_ID}
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
              {dataDefualt.LOAN_TYPE_ID === 1 ? (
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
                    </>
                  ) : null}
                </>
              ) : null}
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
export default CreateNotice;
