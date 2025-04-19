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
  Image,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LOAN_BY_CONTNO,
  GET_PARCELS,
  HEADERS_EXPORT,
  POST_STATUS,
  PUT_LAWSUIT_DETAIL,
  PUT_PARCELS,
  PUT_STATUS,
} from "../../../API/apiUrls";
import {
  InboxOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import LoadCompanies from "../../../../hook/LoadCompanies";
import dayjs from "dayjs";
import "dayjs/locale/th"; // import ภาษาไทย
import {
  INDICT,
  PARAM_PUBLIC,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import { optionsLone } from "../../../../utils/constant/LoanTypeConstant";
import Dragger from "antd/es/upload/Dragger";
dayjs.locale("th"); // ตั้งค่าภาษาเป็นไทย

const UpdateReplyNoticeEms = ({
  open,
  close,
  dataDefault,
  funcUpdateStatus,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState();
  const { TextArea } = Input;
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [loanOption, setLoanOption] = useState(null);
  const [lawsuitData, setLawsuitData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [parcelsData, setParcelsData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    loadData();
    setLoadingDataCompany(true);
    loadImagesProduct();
    console.log("dataDefault", dataDefault);
  }, [setLoadingDataCompany]);

  useEffect(() => {
    setOption();
    setLoan();
    if (parcelsData) {
      setDataDefualt();
    }
  }, [companiesListCompany, parcelsData]);

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
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));
    setCompaniesOption(options);
  };

  const setLoan = () => {
    const options = optionsLone.map((item) => {
      if (dataDefault.LOAN_TYPE_ID === 2) {
        return {
          value: item.value,
          label: item.label,
          disabled: true,
        };
      } else {
        return {
          value: item.value,
          label: item.label,
        };
      }
    });

    console.log("options", options);
    setLoanOption(options);
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

  const sendData = async (putStatus, lawsuit, parcel, postStatus) => {
    setLoading(true);
    try {
      if (putStatus) {
        await axios
          .put(baseUrl + PUT_STATUS, putStatus, { headers: HEADERS_EXPORT })
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
      }
      if (postStatus) {
        await axios
          .post(baseUrl + POST_STATUS, postStatus, { headers: HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
              message.success(`อัพเดทข้อมูลสำเร็จ ${dataDefault.CONTNO}`);
              setLoading(false);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status === 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });
      }
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, lawsuit, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            funcUpdateStatus({
              ...dataDefault,
              MAIN_STATUS_ID: putStatus ? dataDefault.MAIN_STATUS_ID : INDICT,
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
      if (fileList) {
        handleUploadAllImage();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const loadImagesProduct = async () => {
    await axios
      .get(
        baseUrl + `/files/lawyer/notice/${PARAM_PUBLIC}/${dataDefault.CONTNO}`
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

  const handleUploadAllImage = async () => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    await axios
      .post(
        baseUrl + `/files/lawyer/notice/${PARAM_PUBLIC}/${dataDefault.CONTNO}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setFileList([]);
        setLoading(false);
      })
      .catch((err) => {
        Modal.error({
          title: "ผิดพลาด",
          content: err.message,
          centered: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value} `);
  };

  const onChangeSelectLoanType = (value) => {
    console.log(`selected ${value} `);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setPreData(dateString);
  };

  const onChangeRadio = (value) => {
    console.log(value);
  };

  const onChangeInput = (value) => {
    console.log(value);
  };

  const handleInputChange = (value) => {
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
      values.radioGuarantor6 === 3 ||
      values.radioGuarantor7 === 3 ||
      values.radioGuarantor8 === 3 ||
      values.radioGuarantor9 === 3 ||
      values.radioGuarantor10 === 3
    ) {
      statutProcess = STATUS_PROCESS_UNSUCCESSFUL;
    } else {
      statutProcess = STATUS_PROCESS_SUCCESSFUL;
    }

    let postStatus = null;
    let putStatus = null;
    if (statutProcess === STATUS_PROCESS_SUCCESSFUL) {
      postStatus = {
        MAIN_STATUS_ID: INDICT,
        LOAN_ID: dataDefault.id,
        USER_ID: dataDefault.LAWYER_ID,
        LOAN_TYPE_ID: values.loanTypeId
          ? values.loanTypeId
          : dataDefault.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefault.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: preData ? dayjs(preData).format("YYYY-MM-DD") : dataDefault.DATE,
      };
    }

    putStatus = {
      id: dataDefault.WORK_LOG_ID,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_ID: dataDefault.id,
      LOAN_TYPE_ID: values.loanTypeId
        ? values.loanTypeId
        : dataDefault.LOAN_TYPE_ID,
      MEMO: values.memo,
      DATE: preData ? dayjs(preData).format("YYYY-MM-DD") : dataDefault.DATE,
      PROCESS_ID: statutProcess,
    };

    const putLawsuit = {
      ...lawsuitData,
      COMPANY_ID: parseInt(values.company),
      LOAN_TYPE_ID: values.loanTypeId
        ? values.loanTypeId
        : dataDefault.LOAN_TYPE_ID,
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
          id: parcelsData[index].id,
          CUSTOMER_ID: values.guarantor0,
          parcel_no: values.parcelNoGuarantor0,
          mark: values.memo,
          parcel_type_id: guarantor.parcel_type_id,
          response_status: values.radioGuarantor0,
          parcel_no_response: values.parcelNoResponseGuarantor0,
        });
      });
    } else {
      dataDefault.parcel_list.forEach((guarantor, index) => {
        console.log("index--->", index, guarantor);

        parcelsSet.push({
          ...initData,
          id: parcelsData[index]?.id, // ใช้ index เพื่อเลือกค่าจาก parcelsData
          CUSTOMER_ID: values[`guarantor${index}`], // ใช้ค่าจาก form
          parcel_no: values[`parcelNoGuarantor${index}`],
          mark: values.memo,
          parcel_type_id: guarantor.parcel_type_id,
          response_status: values[`radioGuarantor${index}`],
          parcel_no_response: values[`parcelNoResponseGuarantor${index}`]
            ? values[`parcelNoResponseGuarantor${index}`]
            : guarantor.parcel_no_response,
        });
      });
    }
    console.log("putStatus", putStatus);
    console.log("putLawsuit", putLawsuit);
    console.log("parcelsSet", parcelsSet);
    console.log("postStatus", postStatus);
    sendData(putStatus, putLawsuit, parcelsSet, postStatus);
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
      loanTypeId: dataDefault.LOAN_TYPE_ID,
    };

    parcelsData?.forEach((parcel, index) => {
      // กำหนดชื่อของฟิลด์เพื่อให้ตรงกับจำนวนของแต่ละตัวอย่าง (e.g., guarantor1, parcelNoGuarantor1)
      fieldsToSet[`guarantor${index}`] = parcel?.id;
      fieldsToSet[`parcelNoGuarantor${index}`] = parcel?.parcel_no;
      fieldsToSet[`radioGuarantor${index}`] =
        parcel?.response_status === 0 ? 3 : parcel?.response_status;
    });

    // ตั้งค่าให้กับ Form
    form.setFieldsValue(fieldsToSet);
  };
  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);

      setCapturedImages(
        (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
      );
    },
    beforeUpload: (file) => {
      const fileType = file.type; // ตรวจสอบ MIME type
      const imgUrl = URL.createObjectURL(file); // สร้าง URL ของไฟล์ที่อัปโหลด

      // // แปลง Blob เป็น File ที่มีชื่อไฟล์ถูกต้อง
      // const newFile = new File(
      //   [file],
      //   `สืบทรัพย์_${dataDefualt?.CONTNO}.${
      //     fileType.includes("pdf") ? "pdf" : file.name.split(".").pop()
      //   }`,
      //   { type: fileType }
      // );

      // console.log("ไฟล์ที่ได้:", newFile, "ประเภท:", fileType);

      // ตรวจสอบประเภทและแยกเก็บใน state
      if (fileType.startsWith("image/")) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "image" }]);
      } else if (fileType === "application/pdf") {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "pdf" }]);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "xlsx" }]);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "docx" }]);
      }

      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
  };

  const deleteImg = (index) => {
    setCapturedImages(
      (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
    );
    setFileList(
      (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
    );
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
              <Form.Item
                label="ประเภทสัญญา"
                name="loanTypeId"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกข้อมูล",
                  },
                ]}
              >
                <Select
                  popupMatchSelectWidth={false}
                  style={{
                    width: "auto", // ทำให้ Select ขยายตามเนื้อหา
                    // maxWidth: 200, // จำกัดความกว้างสูงสุด
                  }}
                  placeholder="เลือกประเภทสัญญา"
                  showSearch
                  optionFilterProp="label"
                  options={loanOption}
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
                  style={{
                    width: 250,
                  }}
                  placeholder="เลือกบริษัท"
                  showSearch
                  optionFilterProp="label"
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
              {parcelsData?.map((parcel, index) => (
                <div key={index}>
                  <Form.Item
                    label={
                      parcel?.GARNO === 0 || !parcel?.GARNO
                        ? "ผู้ทำสัญญา"
                        : `คนค้ำที่ ${index}`
                    }
                    name={`guarantor${index}`}
                    initialValue={parcel?.id}
                  >
                    {`${parcel?.SNAM}${parcel?.NAME1} ${parcel?.NAME2}`}
                  </Form.Item>

                  <Form.Item
                    label="EMS จดหมาย"
                    name={`parcelNoGuarantor${index}`}
                  >
                    {parcel?.parcel_no}
                  </Form.Item>

                  <Form.Item
                    label="EMS ใบตอบกลับ"
                    name={`parcelNoResponseGuarantor${index}`}
                  >
                    <Input
                      placeholder="ตัวอย่าง:EF582568151TH"
                      maxLength={13}
                      onChange={(e) => handleInputChange(e.target.value)}
                      defaultValue={parcel?.parcel_no_response}
                    />
                  </Form.Item>

                  <Form.Item
                    label="การตอบกลับ"
                    name={`radioGuarantor${index}`}
                    rules={[{ required: true, message: "โปรดเลือกข้อมูล" }]}
                  >
                    <Radio.Group onChange={onChangeRadio}>
                      <Radio value={1}>จากใบตอบกลับ</Radio>
                      <Radio value={2}>จากเว็บไปรษณีย์</Radio>
                      <Radio value={3}>ยังไม่ตอบกลับ</Radio>
                      <Radio value={4}>ตีกลับ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
              <Form.Item label="อัปโหลดไฟล์/รูปภาพ" name="imageUrlFile">
                <Dragger
                  {...props}
                  style={{
                    width: "400px", // กำหนดความกว้าง
                    height: "200px", // กำหนดความสูง
                    margin: "0 auto", // กำหนดให้อยู่ตรงกลาง
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: "blue" }} />
                  </p>
                  <p className="ant-upload-text">
                    กรุณาคลิกหรือลากเพื่อเลือกไฟล์
                  </p>
                  <p className="ant-upload-hint">
                    รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม
                  </p>
                </Dragger>
              </Form.Item>
              {capturedImages.length > 0 ? (
                <Form.Item label="ไฟล์ที่ต้องการบันทึก" name={"imageFile"}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      justifyContent: "center",
                      padding: "10px", // เพิ่ม padding เพื่อไม่ให้ชิดขอบเกินไป
                    }}
                  >
                    <Image.PreviewGroup>
                      {capturedImages?.map((image, index) => {
                        if (!image || !image.type) return null;

                        return (
                          <div
                            key={index}
                            style={{
                              position: "relative", // ให้ปุ่มลบอยู่บนสุด
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              background: "#f8f8f8",
                              borderRadius: "8px",
                              padding: "10px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {/* แสดงไอคอนตามประเภทไฟล์ */}
                            {image.type.includes("pdf") ? (
                              <FilePdfOutlined
                                style={{ fontSize: "40px", color: "red" }}
                              />
                            ) : image.type.includes("xlsx") ? (
                              <FileExcelOutlined
                                style={{ fontSize: "40px", color: "green" }}
                              />
                            ) : image.type.includes("docx") ? (
                              <FileWordOutlined
                                style={{ fontSize: "40px", color: "blue" }}
                              />
                            ) : (
                              <Image
                                src={image.url}
                                alt={`Captured ${index}`}
                                width="150px"
                              />
                            )}

                            {/* ลิงก์ดาวน์โหลด */}
                            {image.url && (
                              <a
                                style={{
                                  display: "block",
                                  marginTop: "8px",
                                  color: "#007bff",
                                  textDecoration: "none",
                                  fontWeight: "bold",
                                }}
                                href={image.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                คลิกเพื่อดาวน์โหลด
                              </a>
                            )}

                            {/* ปุ่มลบ */}
                            <button
                              type="button"
                              onClick={() => deleteImg(index)}
                              style={{
                                position: "absolute",
                                top: "-5px",
                                right: "-5px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </Image.PreviewGroup>
                  </div>
                </Form.Item>
              ) : null}
              {imageList.length > 0 ? (
                <Form.Item label="ไฟล์/ภาพที่บันทึก" name={"imageFile"}>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <Image.PreviewGroup>
                      {imageList?.map((image, index) => (
                        <div
                          key={index}
                          style={{ position: "relative", textAlign: "center" }}
                        >
                          {image.url.includes("pdf") ? (
                            <>
                              <FilePdfOutlined
                                style={{ fontSize: "40px", color: "red" }}
                              />
                              {image.url ? (
                                <a
                                  style={{ display: "block", marginTop: "8px" }}
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
export default UpdateReplyNoticeEms;
