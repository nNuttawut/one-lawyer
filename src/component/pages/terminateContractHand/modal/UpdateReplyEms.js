import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  Spin,
  message,
  Radio,
  Tooltip,
  Image,
  Switch,
  Upload,
} from "antd";

import axios from "axios";
import { baseUrl, HEADERS_EXPORT, PUT_CANCEL } from "../../../API/apiUrls";
import { useEffect, useMemo, useRef, useState } from "react";
import DateCustom from "../../../../hook/DateCustom";
import {
  CameraOutlined,
  FilePdfOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";

const UpdateReplyEms = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [convertDateThai] = DateCustom();
  const { Dragger } = Upload;
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;
  const [defaultRadio, setDefaultRadio] = useState(1);
  const [capturedImages, setCapturedImages] = useState([]);
  const [imageCap, setImageCap] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [switchCamera, setSwitchCamera] = useState(false);
  const [stream, setStream] = useState(null); // เก็บ stream ไว้ป้องกันซ้ำ

  useEffect(() => {
    if (switchCamera) {
      startWebcam();
    }
  }, [switchCamera]);

  useEffect(() => {
    console.log("loadImagesProduct");
    setLoading(true);
    loadImagesProduct();
  }, []);

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
          `/files/lawyer/cancel_contract/${PARAM_PUBLIC}/${
            dataDefault.contract_no + dataDefault.parcel_no_response
          }`
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
        baseUrl +
          `/files/lawyer/cancel_contract/${PARAM_PUBLIC}/${
            dataDefault.contract_no + dataDefault.parcel_no_response
          }`,
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

  const sendStatus = async (data) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_CANCEL, data, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            message.success("อัพเดทข้อมูลสำเร็จ");
            funcUpdateStatus({
              ...data,
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
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
      stopWebcam();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    stopWebcam();
    close(false);
  };

  const handleInputChange = (value) => {
    console.log(value);
  };

  const onChangeRadio = (value) => {
    console.log(value);
    setDefaultRadio(value);
    if (value === 2 && imageList.length < 1) {
      stopWebcam();
      if (switchCamera) {
        setSwitchCamera(!switchCamera);
      }
    }
  };

  const onFinish = (values) => {
    if (fileList?.length > 0) {
      handleUploadAllImage(values);
    }

    console.log("Success:", values);
    const putData = {
      ...dataDefault,
      status: values.radioCus,
      parcel_no: values.ems,
      parcel_no_response: values.emsResponse,
      date_response: dayjs().format("YYYY-MM-DD"),
    };

    console.log("putData", putData);

    sendStatus(putData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const startWebcam = async () => {
    setLoading(true);
    try {
      if (stream) {
        console.log("Webcam is already running");
        return; // ถ้ามี stream อยู่แล้ว ไม่ต้องเปิดใหม่
      }
      console.log("startWebcam");
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      const track = newStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      setImageCap(imageCapture); // ตั้งค่า imageCap
      setLoading(false);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการเปิดกล้อง: ", err);
      setLoading(false);
    }
  };

  const takeScreenShot = async () => {
    if (!imageCap) {
      console.error("imageCap ยังไม่ได้ถูกตั้งค่า");
      return;
    }
    setLoading(true);

    try {
      const blob = await imageCap.takePhoto();
      const fileType = blob.type; // ตรวจสอบ MIME type
      const imgUrl = URL.createObjectURL(blob);

      // แปลง Blob เป็น File
      const file = new File(
        [blob],
        `ไฟล์แนบ_${Date.now()}.${fileType.includes("pdf") ? "pdf" : "jpg"}`,
        {
          type: fileType,
        }
      );

      console.log("ไฟล์ที่ได้:", file, "ประเภท:", fileType);

      // ตรวจสอบว่าเป็นรูปภาพหรือ PDF
      if (fileType.startsWith("image/")) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "image" }]);
      } else if (fileType === "application/pdf") {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "pdf" }]);
      }

      // อัปเดตรายการไฟล์
      setFileList((prev) => [...prev, file]);

      setLoading(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการถ่ายภาพ:", error);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      console.log("Stopping webcam...");

      // หยุดทุก track ของ stream
      tracks.forEach((track) => {
        track.stop();
      });

      // เคลียร์ค่าของ videoRef
      videoRef.current.srcObject = null;

      // ล้างค่าของ state ที่เก็บ stream ไว้
      setStream(null);
    }
  };

  const deleteImg = (index) => {
    setCapturedImages(
      (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
    );
    setFileList(
      (prev) => prev.filter((_, i) => i !== index) // ลบรูปที่เลือกออก
    );
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
      const isLt5M = file.size / 1024 / 1024 < 5.1;

      if (!isLt5M) {
        message.error(`❌ ไฟล์ "${file.name}" มีขนาดเกิน 5 MB`);
        return false;
      }

      const fileType = file.type; // ตรวจสอบ MIME type
      const imgUrl = URL.createObjectURL(file); // สร้าง URL ของไฟล์ที่อัปโหลด

      // ตรวจสอบประเภทและแยกเก็บใน state
      if (fileType.startsWith("image/")) {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "image" }]);
      } else if (fileType === "application/pdf") {
        setCapturedImages((prev) => [...prev, { url: imgUrl, type: "pdf" }]);
      }

      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
  };

  const renderUpflie = () => {
    stopWebcam();
    return (
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: "blue" }} />
        </p>
        <p className="ant-upload-text">กรุณาคลิกหรือลากเพื่อเลือกไฟล์</p>
        <p className="ant-upload-hint">
          รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม ขนาดไม่เกิน 5 MB/ไฟล์
        </p>
      </Dragger>
    );
  };

  const renderCamera = () => {
    return (
      <>
        <div>
          <video ref={videoRef} autoPlay playsInline width="300px" />
        </div>

        <Tooltip
          placement="bottom"
          title="คลิกเพื่อถ่ายภาพ !"
          arrow={mergedArrow}
        >
          <CameraOutlined
            onClick={takeScreenShot}
            style={{
              color: "lightgreen",
              fontSize: "40px",
              marginLeft: "30%",
            }}
          />
        </Tooltip>
      </>
    );
  };

  return (
    <>
      <Modal
        title="ตอบกลับบอกเลิกสัญญา(มือ)"
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
                imageReplyFile: dataDefault.url_path,
                radioCus: dataDefault.status ? dataDefault.status : 1,
                ems: dataDefault.parcel_no ? dataDefault.parcel_no : null,
                emsResponse: dataDefault.parcel_no_response
                  ? dataDefault.parcel_no_response
                  : null,
              }}
            >
              <Form.Item label="เลขสัญญา">{dataDefault?.contract_no}</Form.Item>
              <Form.Item label="วันที่ออกหนังสือ" name="datetime">
                {convertDateThai(dataDefault?.datetime)}
              </Form.Item>
              <Form.Item label="ผู้ทำสัญญา" name="cusId">
                {`${dataDefault?.customer_fullname} ${
                  dataDefault?.customer_type_id === 0
                    ? "(ผู้เช่าซื้อ)"
                    : `(ผู้ค้ำที่ ${dataDefault?.customer_type_id})`
                }`}
              </Form.Item>
              <Form.Item label="รายละเอียดรถ" name="carDetail">
                {`${dataDefault?.brand} ${dataDefault?.register_no}`}
              </Form.Item>
              <Form.Item
                label="EMS จดหมาย"
                name="ems"
                rules={[
                  {
                    required: true,
                    message: "ห้ามว่าง",
                  },
                ]}
              >
                <Input
                  placeholder="ตัวอย่าง:EF582568151TH"
                  maxLength={13}
                  onChange={(e) => handleInputChange(e.target.value, 0)}
                />
              </Form.Item>
              <Form.Item
                label="EMS ใบตอบกลับ"
                name="emsResponse"
                rules={[
                  {
                    required: true,
                    message: "ห้ามว่าง",
                  },
                ]}
              >
                <Input
                  placeholder="ตัวอย่าง:EF582568151TH"
                  maxLength={13}
                  onChange={(e) => handleInputChange(e.target.value, 0)}
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
                <Radio.Group
                  onChange={(e) => onChangeRadio(e.target.value)}
                  defaultValue={defaultRadio}
                >
                  <Radio value={1}>จากใบตอบกลับ</Radio>
                  <Radio value={2}>จากเว็บไปษณีย์</Radio>
                  <Radio value={3}>ตีกลับ</Radio>
                </Radio.Group>
              </Form.Item>
              {/* {imageList?.length < 1 ? ( */}
              <Form.Item
                label={
                  <Tooltip
                    placement="bottom"
                    title={
                      switchCamera
                        ? "คลิกเพื่อเปลี่ยนเป็นเลือกไฟล์ !"
                        : "คลิกเพื่อเปลี่ยนเป็นถ่ายภาพ !"
                    }
                    arrow={mergedArrow}
                  >
                    <Switch
                      checkedChildren="เลือกไฟล์"
                      unCheckedChildren="ถ่ายรูป "
                      checked={switchCamera}
                      onChange={() => setSwitchCamera(!switchCamera)}
                      style={{
                        backgroundColor: switchCamera ? "blue" : "lightgreen",
                        color: "white",
                      }}
                    />
                  </Tooltip>
                }
                name={"capture"}
              >
                {switchCamera ? renderCamera() : renderUpflie()}
              </Form.Item>
              {/* ) : null} */}

              {capturedImages.length > 0 ? (
                <Form.Item label="ภาพที่ต้องการบันทึก" name={"imageFile"}>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <Image.PreviewGroup>
                      {capturedImages?.map((image, index) => {
                        if (!image || !image.url) return null; // ป้องกัน error

                        return (
                          <div key={index} style={{ position: "relative" }}>
                            {image?.type?.includes("pdf") ? (
                              <FilePdfOutlined
                                style={{
                                  fontSize: "100px",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => window.open(image.url, "_blank")}
                              />
                            ) : (
                              <Image
                                src={image.url}
                                alt={`Captured ${index}`}
                                width="150px"
                              />
                            )}

                            <button
                              type="button"
                              onClick={() => deleteImg(index)}
                              style={{
                                position: "absolute",
                                top: 5,
                                right: 2,
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
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
              <div style={{ textAlign: "center" }}>
                <Button
                  onClick={handleCancel}
                  style={{ color: "red", marginRight: "20px" }}
                >
                  ปิด
                </Button>

                {capturedImages.length > 0 || imageList.length > 0 ? (
                  <Button style={{ color: "green" }} htmlType="submit">
                    บันทึก
                  </Button>
                ) : null}
              </div>
            </Form>
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateReplyEms;
