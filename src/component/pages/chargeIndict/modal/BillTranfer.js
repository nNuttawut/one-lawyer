import { Modal, Card, Spin, Image, Divider, Empty } from "antd";
import axios from "axios";

import { useEffect, useState } from "react";
import { baseUrl } from "../../../API/apiUrls";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";

const BillTranfer = ({ open, close, dataDefault }) => {
  const [loading, setLoading] = useState(false);
  const [fileListLoad, setFileListLoad] = useState([]);
  const [fileTranferMoneyLoad, setFileTranferMoneyLoad] = useState([]);

  useEffect(() => {
    if (dataDefault) {
      loadImagesProduct();
      loadImagesProductTranferMoney();
      console.log("dataDefault", dataDefault);
    }
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const loadImagesProduct = async () => {
    await axios
      .get(
        baseUrl +
          `/files/lawyer/advance-payment/${PARAM_PUBLIC}/receipt_${dataDefault.reference_no}`
      )
      .then((response) => {
        console.log("ImageList", response.data);
        if (response.data.length > 0) {
          setFileListLoad(response.data);
          setLoading(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const loadImagesProductTranferMoney = async () => {
    await axios
      .get(
        baseUrl +
          `/files/lawyer/advance-payment/${PARAM_PUBLIC}/slip_${dataDefault.reference_no}`
      )
      .then((response) => {
        console.log("ImageList", response.data);
        if (response.data.length > 0) {
          setFileTranferMoneyLoad(response.data);
          setLoading(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <Modal
        title="รูปภาพใบเสร็จ"
        open={open}
        onCancel={handleCancel}
        width={650}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>
            <Divider>รูปใบเสร็จ</Divider>

            {fileListLoad.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px", // เพิ่มช่องว่างระหว่างแต่ละไฟล์
                  justifyContent: "center", // จัดให้อยู่ตรงกลาง
                }}
              >
                <Image.PreviewGroup>
                  {fileListLoad?.map((image, index) => (
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
                          <a
                            href={image.url}
                            download
                            style={{ display: "inline-block" }}
                          >
                            <FilePdfOutlined
                              style={{ fontSize: "40px", color: "red" }}
                            />
                          </a>
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
                              คลิกเพื่อดาวน์โหลด {index + 1}
                            </a>
                          ) : null}
                        </>
                      ) : image.url.includes(".xlsx") ? (
                        <>
                          <a
                            href={image.url}
                            download
                            style={{ display: "inline-block" }}
                          >
                            <FileExcelOutlined
                              style={{ fontSize: "40px", color: "green" }}
                            />
                          </a>
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
                          <a
                            href={image.url}
                            download
                            style={{ display: "inline-block" }}
                          >
                            <FileWordOutlined
                              style={{ fontSize: "40px", color: "blue" }}
                            />
                          </a>
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
            ) : (
              <Empty />
            )}
            <Divider>รูปสลิปโอนเงิน</Divider>
            {fileTranferMoneyLoad.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px", // เพิ่มช่องว่างระหว่างแต่ละไฟล์
                  justifyContent: "center", // จัดให้อยู่ตรงกลาง
                }}
              >
                <Image.PreviewGroup>
                  {fileTranferMoneyLoad?.map((image, index) => (
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
                      <Image
                        src={image.url}
                        alt={`Captured ${index}`}
                        width="150px"
                      />
                    </div>
                  ))}
                </Image.PreviewGroup>
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default BillTranfer;
