import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Modal,
  Card,
  message,
  Spin,
  Radio,
  Tabs,
  Tooltip,
  Checkbox,
  Space,
  InputNumber,
  Row,
  Col,
  Upload,
  Popconfirm,
  List,
} from "antd";
import {
  baseUrl,
  GET_LOAN_BY_CONTNO,
  GET_WORK_LOG_DETAIL_BY_ID,
  HEADERS_EXPORT,
  POST_AGREEMENTS,
  POST_JUDGE,
  POST_JUDGE_DEFENDANTS,
  POST_STATUS,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import { InboxOutlined } from "@ant-design/icons";
import { optionsMonth } from "../../../../utils/constant/MonthSelect";
import dayjs from "dayjs";
import LoadLawyers from "../../../../hook/LoadLawyers";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";
import Dragger from "antd/es/upload/Dragger";
import { Link } from "react-router-dom";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";

const ReportSeize = ({ open, close, dataDefualt, responseData }) => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const USER_ID = localStorage.getItem("USER_ID");
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [form] = Form.useForm();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [assistantOption, setAssistantOption] = useState();
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [radioDecide, setRadioDecide] = useState("enforce");
  const [arrow, setArrow] = useState("Show");
  const [fileList, setFileList] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      //   setLoadingData(true);
    }
  }, [isModal]);

  console.log(dataDefualt);

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

  const handleCancel = () => {
    close(false);
  };

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 1 || COMPANY === 2) {
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [worklogs, loanRes] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${dataDefualt.WORK_LOG_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
      ]);

      if (worklogs.status === 200) {
        setDataLoadLawSuit(worklogs.data);
        setDataStore(worklogs.data);
        console.log("worklogs.data---->", worklogs.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      if (loanRes.status === 200) {
        setDataLoadLoan(loanRes.data);

        console.log("loanRes.data---->", loanRes.data);
      } else {
        message.error("ไม่พบข้อมูลเงิน");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (
    judgement,
    defendants,
    finishStatus,
    agreement,
    statusData,
    putStatus
  ) => {
    setLoading(true);

    try {
      console.log("normal---> defendants", defendants);
      console.log("data", judgement);
      await axios
        .post(baseUrl + POST_JUDGE, judgement, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 201) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });

      if (defendants?.length > 0) {
        const promises = defendants.map(async (item) => {
          let arrayData = item;
          await axios
            .post(baseUrl + POST_JUDGE_DEFENDANTS, arrayData, {
              headers: HEADERS_EXPORT,
            })
            .then(async (res) => {
              if (res.status === 201) {
                console.log("resQuery", res.data);
              } else {
                message.error("ไม่สามารถส่งข้อมูลได้");
                console.log("ไม่สามารถส่งข้อมูลได้");
                setLoading(false);
              }
            })
            .catch((err) => {
              console.log(err);
              if (err.status > 400) {
                message.error("ไม่สามารถส่งข้อมูลได้");
              }
            });
          const results = await Promise.all(promises);
          console.log("results promise", results);
        });
      }
      if (radioDecide === "agreementFinish") {
        await axios
          .post(baseUrl + POST_STATUS, finishStatus, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });
      }
      if (radioDecide === "payment" || radioDecide === "agreementFinish") {
        console.log("agreement", agreement);
        await axios
          .put(baseUrl + PUT_STATUS, putStatus, { headers: HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });

        await axios
          .post(baseUrl + POST_STATUS, statusData, { headers: HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });

        await axios
          .post(baseUrl + POST_AGREEMENTS, agreement, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });
      }
      handleUploadAllImage();
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);

      window.location.reload();
    }
  };

  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
  };

  const handleUploadAllImage = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    axios
      .post(
        baseUrl +
          `/files/lawyer/enforcement/${PARAM_PUBLIC}/คำพิพากษา${dataDefualt.contno}`,
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

  const onChangeSeizeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleSelectAsset = (checked, item) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, item]);
    } else {
      setSelectedAssets(selectedAssets.filter((i) => i.id !== item.id));
    }
  };

  const handleSelectAssetGuarantor = (checked, item) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, item]);
    } else {
      setSelectedAssets(selectedAssets.filter((i) => i.id !== item.id));
    }
  };

  const handleNoteChange = (e, id) => {
    // const newValue = e.target.value;
    console.log(e);
    console.log(id);
    // setDataDefualt((prevState) => ({
    //   ...prevState,
    //   customer_property_list: prevState.customer_property_list.map((item) =>
    //     item.id === id ? { ...item, note: newValue } : item
    //   ),
    // }));
  };

  console.log(selectedAssets);
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
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        initialValues={{
          memo: "",
          suspensionAmount: 0,
          investigateAssetsDate: dayjs(),
        }}
      >
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {`${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
            ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
          </p>
        </Form.Item>
        <Form.Item label="เลขคดีดำ" name="blackNo">
          {dataLoadLawSuit?.lawsuit?.black_case_number
            ? dataLoadLawSuit?.lawsuit?.black_case_number
            : "-"}
        </Form.Item>
        <Form.Item label="เลขคดีแดง" name="redNo">
          {dataLoadLawSuit?.judge?.red_case_number
            ? dataLoadLawSuit?.judge?.red_case_number
            : "-"}
        </Form.Item>
        <Form.Item label="พิพากษาจำนวน" name="judgement">
          {dataLoadLawSuit?.judge?.judgement
            ? `${currencyFormatComma(dataLoadLawSuit?.judge?.judgement)} บาท`
            : "-"}
        </Form.Item>
        <Form.Item
          label="วันที่รายงานยึด"
          name="investigateAssetsDate"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่รายงานยึด",
            },
          ]}
        >
          <DatePicker onChange={onChangeSeizeDate} />
        </Form.Item>
        <Form.Item
          label="สำนักงานบังคับคดี"
          name="AddrEnforce"
          rules={[
            {
              required: true,
              message: "กรุณากรอกสำนักงานบังคับคดี",
            },
          ]}
        >
          <Input name="AddrEnforce" />
        </Form.Item>

        <Form.Item
          label="ทรัพย์ที่สืบพบผู้เช่าซื้อ"
          name="assetsFound"
          labelCol={{ span: 6 }} // กำหนดความกว้างของ label
          wrapperCol={{ span: 14 }} // กำหนดความกว้างของ input หรือ content
        >
          <List
            itemLayout="horizontal"
            dataSource={dataDefualt?.customer_property_list}
            renderItem={(item) => (
              <List.Item
                actions={
                  !item.seize_status
                    ? [
                        <Checkbox
                          key={item.id}
                          checked={selectedAssets.some((i) => i.id === item.id)}
                          onChange={(e) =>
                            handleSelectAsset(e.target.checked, item)
                          }
                        >
                          เลือกเพื่อยึด
                        </Checkbox>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  title={
                    <Link>
                      {item.possessor} <br /> สืบเมื่อ{" "}
                      {convertDateThai(item.investigation_date)}
                      {item.investigation_type_id === 1
                        ? "(ก่อนฟ้อง)"
                        : item.investigation_type_id === 2
                        ? "(หลังฟ้อง)"
                        : null}
                    </Link>
                  }
                  description={
                    <>
                      <p
                        style={{
                          color: item.estimated_price ? "blue" : "red",
                        }}
                      >
                        {item.estimated_price
                          ? `ยอดประเมินที่ดิน ${currencyFormatComma(
                              item.estimated_price
                            )}  บาท `
                          : "ยังไม่ประเมินจากคุณหนุ่ม"}
                      </p>
                      <p
                        style={{
                          color: item.estimated_enforce_price ? "blue" : "red",
                        }}
                      >
                        ยอดประเมินจากกรม : 3
                        <InputNumber
                          suffix="บาท"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          size="small"
                          placeholder="กรอกราคาประเมินจากกรมบังคับคดี"
                          style={{ width: "50%", color: "black" }}
                          onChange={(e) => handleNoteChange(e, item.id)}
                          defaultValue={item.estimated_enforce_price}
                        />
                      </p>
                      <p>{`เลขโฉนด ${item.deed_number} อำเภอ ${item.district_desc} จังหวัด${item.province_desc}`}</p>
                      <p>หมายเหตุ {item.mark}</p>
                      <p
                        style={{
                          color: item.mortgagee ? "red" : "lightgreen",
                        }}
                      >
                        {item.mortgagee
                          ? `ผู้รับจำนอง ${
                              item.mortgagee
                            } จำนวน ${currencyFormatComma(
                              item.mortgage_balance
                            )} บาท`
                          : null}
                      </p>
                      <p
                        style={{
                          color: item.sequestrate_status ? "red" : "lightgreen",
                        }}
                      >
                        {item.sequestrate_status
                          ? `ติดอายัด เจ้าหนี้บุริมสิทธิ ${item.sequestrate_status}`
                          : null}
                      </p>
                    </>
                  }
                />
                <div>
                  <p
                    style={{
                      color: !item.seize_status ? "red" : "green",
                    }}
                  >
                    {!item.seize_status ? null : "ยึดแล้ว"}
                  </p>
                </div>
              </List.Item>
            )}
          />
        </Form.Item>

        <Form.Item
          label="ทรัพย์ที่สืบของคนค้ำ"
          name="assetsFound"
          labelCol={{ span: 6 }} // กำหนดความกว้างของ label
          wrapperCol={{ span: 14 }} // กำหนดความกว้างของ input หรือ content
        >
          <List
            itemLayout="horizontal"
            dataSource={dataDefualt?.guarantor_property_list}
            renderItem={(item) => (
              <List.Item
                actions={
                  !item.seize_status
                    ? [
                        <Checkbox
                          key={item.id}
                          checked={selectedAssets.some((i) => i.id === item.id)}
                          onChange={(e) =>
                            handleSelectAssetGuarantor(e.target.checked, item)
                          }
                        >
                          เลือกเพื่อยึด
                        </Checkbox>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  title={
                    <Link>
                      {item.possessor} <br /> สืบเมื่อ{" "}
                      {convertDateThai(item.investigation_date)}
                      {item.investigation_type_id === 1
                        ? "(ก่อนฟ้อง)"
                        : item.investigation_type_id === 2
                        ? "(หลังฟ้อง)"
                        : null}
                    </Link>
                  }
                  description={
                    <>
                      {item.estimated_price
                        ? `ยอดประเมินที่ดิน ${currencyFormatComma(
                            item.estimated_price
                          )}  บาท `
                        : "ยังไม่ประเมิน"}
                      <p>{`เลขโฉนด ${item.deed_number} อำเภอ ${item.district_desc} จังหวัด${item.province_desc}`}</p>
                      <p>หมายเหตุ {item.mark}</p>
                      <p
                        style={{
                          color: item.mortgagee ? "red" : "lightgreen",
                        }}
                      >
                        {item.mortgagee
                          ? `ผู้รับจำนอง ${item.mortgagee} จำนวน ${item.mortgage_balance} บาท`
                          : null}
                      </p>
                      <p
                        style={{
                          color: item.sequestrate_status ? "red" : "lightgreen",
                        }}
                      >
                        {item.sequestrate_status
                          ? `ติดอายัด ${item.preference_creditor} เลขคดีแดง ${item.owner}`
                          : null}
                      </p>
                    </>
                  }
                />
                <div>
                  <p
                    style={{
                      color: !item.seize_status ? "red" : "lightgreen",
                    }}
                  >
                    {!item.seize_status ? null : "ยึดแล้ว"}
                  </p>
                </div>
              </List.Item>
            )}
          />
        </Form.Item>
        <Form.Item label="หมายเหตุ" name="memo">
          <TextArea
            rows={5}
            // onChange={(e) => onChangeInputMemo(e.target.value)}
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
            title="อัพเดทข้อมูล"
            description="กรุณาตรวจสอบข้อมูลให้เรียบร้อย !"
            // onConfirm={confirm}
            // onCancel={() => cancel(record)}
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
        title={`บันทึกการยึดทรัพย์ ${dataLoadLawSuit?.lawsuit?.CONTNO}/${
          dataLoadLawSuit?.lawsuit?.customer_title
        }${dataLoadLawSuit?.lawsuit?.customer_name} ${
          dataLoadLawSuit?.lawsuit?.customer_lastname
            ? dataLoadLawSuit?.lawsuit?.customer_lastname
            : ""
        }`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          {formDataSet()}
        </Spin>
      </Modal>
    </>
  );
};
export default ReportSeize;
