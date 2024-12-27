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
  Radio,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LAWSUIT_DETAIL_BY_LOAN,
  GET_LOAN_BY_CONTNO,
  GET_PARCELS,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
  PUT_PARCELS,
  PUT_STATUS,
} from "../../../API/apiUrls";

import LoadCompanies from "../../../../hook/LoadCompanies";
import dayjs from "dayjs";
import "dayjs/locale/th"; // import ภาษาไทย
import {
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import TokenCheck from "../../../../hook/TokenCheck";
dayjs.locale("th"); // ตั้งค่าภาษาเป็นไทย

const EditReplyNotice = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState();
  const { TextArea } = Input;
  const [companiesList, setLoadingData] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [lawsuitData, setLawsuitData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [parcelsData, setParcelsData] = useState(null);
  const [defaultRadio, setDefaultRadio] = useState(null);

  useEffect(() => {
    loadData();
    setLoadingData(true);
    console.log("dataDefault", dataDefault);
  }, [setLoadingData]);

  useEffect(() => {
    setOption();
    if (parcelsData) {
      setDataDefualt();
    }
  }, [companiesList, parcelsData]);

  // const setDataDefualt = () => {
  //   form.setFieldsValue({
  //     company: dataDefault.COMPANY_ID,
  //     dateNotice: dayjs(dataDefault.DATE),
  //     memo: parcelsData[0]?.mark,
  //     parcelNoCustomer: parcelsData[0]?.parcel_no,
  //     parcelNoGuarantor1: parcelsData[1]?.parcel_no,
  //     parcelNoGuarantor2: parcelsData[2]?.parcel_no,
  //     parcelNoGuarantor3: parcelsData[3]?.parcel_no,
  //     parcelNoGuarantor4: parcelsData[4]?.parcel_no,
  //     parcelNoGuarantor5: parcelsData[5]?.parcel_no,
  //     parcelNoGuarantor6: parcelsData[6]?.parcel_no,
  //     imageReplyFile: parcelsData[0]?.url_path,
  //     radioCus:
  //       parcelsData[0]?.parcel_typ_id === null
  //         ? 3
  //         : parcelsData[0]?.parcel_typ_id === 2
  //         ? 2
  //         : parcelsData[0]?.parcel_typ_id === 1
  //         ? 1
  //         : 3,
  //     radioGuarantor1:
  //       parcelsData[1]?.parcel_typ_id === null
  //         ? 3
  //         : parcelsData[1]?.parcel_typ_id === 2
  //         ? 2
  //         : parcelsData[1]?.parcel_typ_id === 1
  //         ? 1
  //         : null,
  //     radioGuarantor2:
  //       parcelsData[2]?.parcel_typ_id === null
  //         ? 3
  //         : parcelsData[2]?.parcel_typ_id === 2
  //         ? 2
  //         : parcelsData[2]?.parcel_typ_id === 1
  //         ? 1
  //         : null,
  //     radioGuarantor3:
  //       parcelsData[3]?.parcel_typ_id === null
  //         ? 3
  //         : parcelsData[3]?.parcel_typ_id === 2
  //         ? 2
  //         : parcelsData[3]?.parcel_typ_id === 1
  //         ? 1
  //         : null,
  //     radioGuarantor4:
  //       parcelsData[4]?.parcel_typ_id === null
  //         ? 3
  //         : parcelsData[4]?.parcel_typ_id === 2
  //         ? 2
  //         : parcelsData[4]?.parcel_typ_id === 1
  //         ? 1
  //         : null,
  //     radioGuarantor5:
  //       parcelsData[5]?.parcel_typ_id === null
  //         ? 3
  //         : parcelsData[5]?.parcel_typ_id === 2
  //         ? 2
  //         : parcelsData[5]?.parcel_typ_id === 1
  //         ? 1
  //         : null,
  //     radioGuarantor6:
  //       parcelsData[6]?.parcel_typ_id === null
  //         ? 3
  //         : parcelsData[6]?.parcel_typ_id === 2
  //         ? 2
  //         : parcelsData[6]?.parcel_typ_id === 1
  //         ? 1
  //         : null,
  //   });
  // };

  const setOption = () => {
    const options = companiesList.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));
    setCompaniesOption(options);
  };

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefault.LAWSUIT_ID,
        {
          headers: HEADERS_EXPORT,
        }
      );
      if (response.data) {
        setLawsuitData(response.data);
        console.log(response.data);

        setLoading(false);
      }
      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefault.CONTNO, {
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

      await axios
        .get(baseUrl + GET_PARCELS + dataDefault.WORK_LOG_ID, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setParcelsData(res.data);
            console.log("GET_PARCELS", res.data);
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
                DATE: data.DATE,
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
            .put(baseUrl + PUT_PARCELS, arrayData, {
              headers: HEADERS_EXPORT,
            })
            .then((resQuery) => {
              if (resQuery.status === 200) {
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
    setPreData(dateString);
  };

  const onChangeInputParcel = (value) => {
    console.log(value);
  };

  const onChangeInput = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let statutProcess;

    if (
      values.radioGuarantor0 === 3 ||
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
      WORK_LOG_ID: dataDefault.WORK_LOG_ID,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_ID: dataDefault.id,
      MEMO: values.memo,
      DATE: preData ? dayjs(preData).format("YYYY-MM-DD") : dataDefault.DATE,
      PROCESS_ID: statutProcess,
    };
    const putLawsuit = {
      ...lawsuitData,
      COMPANY_ID: parseInt(values.company),
    };
    let parcelsSet = [];
    const initData = {
      WORK_LOG_ID: parcelsData[0].WORK_LOG_ID,
      process_id: statutProcess,
      url_path: values.imageReplyFile,
    };

    if (dataDefault.LOAN_TYPE_ID === 2) {
      dataDefault.parcel_list.forEach((guarantor, index) => {
        console.log("index--->", guarantor);

        parcelsSet.push({
          ...initData,
          id: parcelsData[0].id,
          CUSTOMER_ID: values.guarantor0,
          parcel_no: values.parcelNoGuarantor0,
          mark: values.memo,
          parcel_typ_id:
            values.radioGuarantor0 === 3 ? null : values.radioGuarantor0,
          response_status: values.radioGuarantor0 === 3 ? 0 : 1,
        });
      });
    } else {
      // parcelsSet.push({
      //   ...initData,
      //   id: parcelsData[0].id,
      //   CUSTOMER_ID: values.cusId,
      //   parcel_no: values.parcelNoCustomer,
      //   mark: values.memo,
      //   parcel_typ_id: values.radioCus === 3 ? null : values.radioCus,
      //   response_status: values.radioCus === 3 ? 0 : 1,
      // });

      // if (loanData.GUARANTORS.length > 0) {
      //   console.log("loadData.GUARANTORS.length > 0");
      //   parcelsSet.push({
      //     ...initData,
      //     id: parcelsData[1].id,
      //     CUSTOMER_ID: values.guarantor1,
      //     parcel_no: values.parcelNoGuarantor1,
      //     mark: values.memo,
      //     parcel_typ_id:
      //       values.radioGuarantor1 === 3 ? null : values.radioGuarantor1,
      //     response_status: values.radioGuarantor1 === 3 ? 0 : 1,
      //   });
      // }
      // if (loanData.GUARANTORS.length > 1) {
      //   parcelsSet.push({
      //     ...initData,
      //     id: parcelsData[2].id,
      //     CUSTOMER_ID: values.guarantor2,
      //     parcel_no: values.parcelNoGuarantor2,
      //     mark: values.memo,
      //     parcel_typ_id:
      //       values.radioGuarantor2 === 3 ? null : values.radioGuarantor2,
      //     response_status: values.radioGuarantor2 === 3 ? 0 : 1,
      //   });
      // }
      // if (loanData.GUARANTORS.length > 2) {
      //   parcelsSet.push({
      //     ...initData,
      //     id: parcelsData[3].id,
      //     CUSTOMER_ID: values.guarantor3,
      //     parcel_no: values.parcelNoGuarantor3,
      //     mark: values.memo,
      //     parcel_typ_id:
      //       values.radioGuarantor3 === 3 ? null : values.radioGuarantor3,
      //     response_status: values.radioGuarantor3 === 3 ? 0 : 1,
      //   });
      // }

      // if (loanData.GUARANTORS.length > 3) {
      //   parcelsSet.push({
      //     ...initData,
      //     id: parcelsData[4].id,
      //     CUSTOMER_ID: values.guarantor4,
      //     parcel_no: values.parcelNoGuarantor4,
      //     mark: values.memo,
      //     parcel_typ_id:
      //       values.radioGuarantor4 === 3 ? null : values.radioGuarantor4,
      //     response_status: values.radioGuarantor4 === 3 ? 0 : 1,
      //   });
      // }

      // if (loanData.GUARANTORS.length > 4) {
      //   parcelsSet.push({
      //     ...initData,
      //     id: parcelsData[5].id,
      //     CUSTOMER_ID: values.guarantor5,
      //     parcel_no: values.parcelNoGuarantor5,
      //     mark: values.memo,
      //     parcel_typ_id:
      //       values.radioGuarantor5 === 3 ? null : values.radioGuarantor5,
      //     response_status: values.radioGuarantor5 === 3 ? 0 : 1,
      //   });
      // }
      // if (loanData.GUARANTORS.length > 5) {
      //   parcelsSet.push({
      //     ...initData,
      //     id: parcelsData[6].id,
      //     CUSTOMER_ID: values.guarantor6,
      //     parcel_no: values.parcelNoGuarantor6,
      //     mark: values.memo,
      //     parcel_typ_id:
      //       values.radioGuarantor6 === 3 ? null : values.radioGuarantor6,
      //     response_status: values.radioGuarantor6 === 3 ? 0 : 1,
      //   });
      // }
      dataDefault.parcel_list.forEach((guarantor, index) => {
        console.log("index--->", index);

        parcelsSet.push({
          ...initData,
          id: parcelsData[index]?.id, // ใช้ index เพื่อเลือกค่าจาก parcelsData
          CUSTOMER_ID: values[`guarantor${index}`], // ใช้ค่าจาก form
          parcel_no: values[`parcelNoGuarantor${index}`],
          mark: values.memo,
          parcel_typ_id:
            values[`radioGuarantor${index}`] === 3
              ? null
              : values[`radioGuarantor${index}`],
          response_status: values[`radioGuarantor${index}`] === 3 ? 0 : 1,
        });
      });
    }
    console.log("putStatus", putStatus);
    console.log("putLawsuit", putLawsuit);
    console.log("parcelsSet", parcelsSet);
    sendStatus(putStatus, putLawsuit, parcelsSet);
  };
  const onChangeReplyFile = (value) => {
    console.log(value);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const sortedParcels = dataDefault?.parcel_list?.sort(
    (a, b) => a.GARNO - b.GARNO
  ); // เรียงลำดับ parcel ตาม GARNO

  const setDataDefualt = () => {
    // ถ้าข้อมูลใน sortedParcels หรือ parcelsData ไม่เป็น null

    // ตั้งค่าฟิลด์ใน Form
    const fieldsToSet = {
      company: dataDefault.COMPANY_ID,
      dateNotice: dayjs(dataDefault.DATE),
      memo: parcelsData[0]?.mark,
      imageReplyFile: parcelsData[0]?.url_path,
    };

    sortedParcels?.forEach((parcel, index) => {
      // กำหนดชื่อของฟิลด์เพื่อให้ตรงกับจำนวนของแต่ละตัวอย่าง (e.g., guarantor1, parcelNoGuarantor1)
      fieldsToSet[`guarantor${index}`] = parcel?.id;
      fieldsToSet[`parcelNoGuarantor${index}`] = parcel?.parcel_no;
      fieldsToSet[`radioGuarantor${index}`] =
        parcel?.parcel_typ_id === null
          ? 3
          : parcel?.parcel_typ_id === 2
          ? 2
          : parcel?.parcel_typ_id === 1
          ? 1
          : 3;
    });

    // ตั้งค่าให้กับ Form
    form.setFieldsValue(fieldsToSet);
  };

  return (
    <>
      <Modal
        title="แก้ไขตอบกลับโนติส"
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
              form={form} // ตั้งค่า form ที่นี่
              name="editNotice"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              // initialValues={{ memo: null }}
            >
              <Form.Item label="เลขสัญญา">{dataDefault.CONTNO}</Form.Item>
              <Form.Item label="ประเภทสัญญา">
                {dataDefault.LOAN_TYPE_ID === 1 ? "เช่าซื้อ" : "จำนอง"}
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
                <DatePicker
                  format={"YYYY-MM-DD"}
                  defaultValue={
                    dataDefault.DATE ? dayjs(dataDefault.DATE) : dayjs()
                  }
                  onChange={onChange}
                />
              </Form.Item>

              {sortedParcels?.map((parcel, index) => (
                <div key={index}>
                  <Form.Item
                    label={
                      parcel?.GARNO === 0 ? "ผู้ทำสัญญา" : `คำค้ำ ${index}`
                    }
                    name={`guarantor${index}`}
                    initialValue={parcel?.id}
                  >
                    {`${parcel?.SNAM}${parcel?.NAME1} ${parcel?.NAME2}`}
                  </Form.Item>

                  <Form.Item
                    label="กรอกหมายเลข EMS"
                    name={`parcelNoGuarantor${index}`}
                    rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
                  >
                    <Input
                      placeholder="ตัวอย่าง:EF582568151TH"
                      maxLength={13}
                      onChange={(e) => onChangeInputParcel(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="การตอบกลับ"
                    name={`radioGuarantor${index}`}
                    rules={[{ required: true, message: "โปรดเลือกข้อมูล" }]}
                  >
                    <Radio.Group onChange={onChange}>
                      <Radio value={1}>จากใบตอบกลับ</Radio>
                      <Radio value={2}>จากเว็บไปรษณีย์</Radio>
                      <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
              <Form.Item
                label="ลิ้งเก็บรูปตอบกลับ"
                name="imageReplyFile"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ url ของรูปจากไฟล์กลาง !",
                  },
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

                <Button
                  style={{ color: "green", marginRight: "20px" }}
                  htmlType="submit"
                >
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
export default EditReplyNotice;
