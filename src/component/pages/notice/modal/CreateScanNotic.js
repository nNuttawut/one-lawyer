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
  DatePicker,
} from "antd";
import {
  NOTICE,
  STATUS_PROCESS_PROCESS,
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
import { useEffect, useRef, useState } from "react";

import TokenCheck from "../../../../hook/TokenCheck";
import { optionsLone } from "../../../../utils/constant/LoanTypeConstant";

const CreateScanNotice = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState(null);
  const { TextArea } = Input;
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [lawsuitData, setLawsuitData] = useState(null);
  const [loanData, setLoanData] = useState();
  const [defaultRadio, setDefaultRadio] = useState(null);
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [loanType, setLoanType] = useState(dataDefault.LOAN_TYPE_ID);

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

  const sendStatus = async (data, lawsuit, parcel) => {
    console.log("data-->", data, lawsuit, parcel);
    if (data) {
      setLoading(true);
      try {
        await axios
          .put(baseUrl + PUT_STATUS, data, { headers: HEADERS_EXPORT })
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
                DATE: data.DATE,
                COMPANY_ID: lawsuit.COMPANY_ID,
                MEMO: data.MEMO,
                PROCESS_ID: data.PROCESS_ID,
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
        setLoading(false);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    } else {
      message.error("โปรดตรวจสอบข้อมูลและกดบันทึกอีกครั้ง");
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const onChangeSelectLoanType = (value) => {
    console.log(`selected ${value} `);
    setLoanType(value);
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

    const putStatus = {
      id: dataDefault?.WORK_LOG_ID,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_ID: dataDefault.id,
      MEMO: values.memo,
      PROCESS_ID: STATUS_PROCESS_PROCESS,
      DATE: dayjs(values.dateNotice).format("YYYY-MM-DD"),
    };

    const putLawsuit = {
      ...lawsuitData,
      LOAN_TYPE_ID: loanType,
      COMPANY_ID: parseInt(values.company),
    };

    let parcelsSet = [];
    const initData = {
      WORK_LOG_ID: dataDefault.WORK_LOG_ID,
      url_path: null,
      response_status: null,
      mark: values.memo,
      installment_cont: null,
      amount: 0,
      dep_collection_fees: 0,
    };

    if (loanType === 2) {
      console.log("if----->");

      parcelsSet.push({
        ...initData,
        CUSTOMER_ID: values.cusId,
        parcel_no: values.parcelNoCustomer,
        parcel_type_id: 2,
        parcel_no_response: values.parcelNoResponseCustomer,
      });
    } else {
      console.log("else----->");

      parcelsSet.push({
        ...initData,
        CUSTOMER_ID: values.cusId,
        parcel_no: values.parcelNoCustomer,
        parcel_type_id: 2,
        parcel_no_response: values.parcelNoResponseCustomer,
      });

      loanData?.GUARANTORS?.forEach((guarantor, index) => {
        parcelsSet.push({
          ...initData,
          CUSTOMER_ID: values[`guarantor${index + 1}`], // ใช้ดึงค่าไดนามิกจาก `values`
          parcel_no: values[`parcelNoGuarantor${index + 1}`],
          parcel_type_id: 3,
          parcel_no_response: values[`parcelNoResponseGuarantor${index + 1}`],
        });
      });
    }

    console.log("dataSet", parcelsSet);
    console.log("putDataData", putStatus);
    console.log("putLawsuit", putLawsuit);

    sendStatus(putStatus, putLawsuit, parcelsSet);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const inputRefs = useRef([]); // ใช้เก็บ refs ของ Input

  const handleInputChange = (value, index) => {
    if (value.length === 13 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus(); // เลื่อนไปยังช่องถัดไป
    }
    onChangeInputParcel(value); // เรียก callback เดิม
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
                loanType: dataDefault.LOAN_TYPE_ID,
                memo: null,
                dateNotice: dayjs(),
                cus: loanData?.CUSTOMER?.id,
                company:
                  userCompany === "3"
                    ? 3
                    : loanType === 1
                    ? 1
                    : loanType === 2
                    ? 2
                    : 2,
              }}
              dependencies={["radioCus"]}
            >
              <Form.Item label="เลขสัญญา">{dataDefault?.CONTNO}</Form.Item>
              <Form.Item label="ประเภทสัญญา" name="loanType">
                <Select
                  showSearch
                  popupMatchSelectWidth={false}
                  style={{
                    width: "auto",
                  }}
                  optionFilterProp="value"
                  options={optionsLone}
                  onChange={(value) => onChangeSelectLoanType(value)}
                />
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
                  popupMatchSelectWidth={false}
                  style={{
                    width: "auto",
                  }}
                  placeholder="เลือกบริษัท"
                  optionFilterProp="value"
                  options={companiesOption}
                  onChange={(value) => onChangeSelect(value)}
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
                initialValue={dataDefault?.CUSTOMER_ID}
              >
                {`${loanData?.CUSTOMER?.SNAM}${loanData?.CUSTOMER?.NAME1}  ${loanData?.CUSTOMER?.NAME2}`}
              </Form.Item>
              <Form.Item
                label="EMS จดหมาย"
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
                  ref={(el) => (inputRefs.current[0] = el)} // เก็บ ref
                  onChange={(e) => handleInputChange(e.target.value, 0)}
                />
              </Form.Item>
              <Form.Item
                label="EMS ใบตอบกลับ"
                name="parcelNoResponseCustomer"
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
                  ref={(el) => (inputRefs.current[0] = el)} // เก็บ ref
                  onChange={(e) => handleInputChange(e.target.value, 0)}
                />
              </Form.Item>

              {/* กรอกข้อมูลผู้ค่ำ */}
              {loanType !== 2 &&
                loanData?.GUARANTORS?.map((guarantor, index) => (
                  <div key={guarantor.id}>
                    <Form.Item
                      label={`ผู้ค่ำที่ ${index + 1}`}
                      name={`guarantor${index + 1}`}
                      initialValue={guarantor.id}
                    >
                      {`${guarantor.SNAM}${guarantor.NAME1} ${guarantor.NAME2}`}
                    </Form.Item>
                    <Form.Item
                      label="EMS จดหมาย"
                      name={`parcelNoGuarantor${index + 1}`}
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
                        ref={(el) => (inputRefs.current[index + 1] = el)} // เก็บ ref
                        onChange={(e) =>
                          handleInputChange(e.target.value, index + 1)
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="EMS ใบตอบกลับ"
                      name={`parcelNoResponseGuarantor${index + 1}`}
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
                        ref={(el) => (inputRefs.current[index + 1] = el)} // เก็บ ref
                        onChange={(e) =>
                          handleInputChange(e.target.value, index + 1)
                        }
                      />
                    </Form.Item>
                  </div>
                ))}

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
export default CreateScanNotice;
