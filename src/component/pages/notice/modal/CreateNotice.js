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
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import LoadCompanies from "../../../../hook/LoadCompanies";
import dayjs from "dayjs";
import { optionsLone } from "../../../../utils/constant/LoanTypeConstant";

const CreateNotice = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState();
  const { TextArea } = Input;
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [lawsuitData, setLawsuitData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [loanType, setLoanType] = useState(dataDefault.LOAN_TYPE_ID);
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [loanOption, setLoanOption] = useState(null);

  useEffect(() => {
    loadData();
    setLoadingDataCompany(true);
    console.log("dataDefault--->", dataDefault);
  }, [setLoadingDataCompany]);

  useEffect(() => {
    setOption();
    setLoan();
  }, [companiesListCompany]);

  useEffect(() => {
    console.log("loanType", loanType);
    guarantorSet();
  }, [loanType]);

  const setOption = () => {
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));

    console.log("options", options);

    setCompaniesOption(options);
  };

  const setLoan = () => {
    const options = optionsLone.map((item) => {
      return {
        value: item.value,
        label: item.label,
      };
    });

    console.log("options", options);
    setLoanOption(options);
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
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };

  const sendStatus = async (data, lawsuit) => {
    console.log("data-->", data, lawsuit);
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
                LOAN_TYPE_ID: lawsuit.LOAN_TYPE_ID,
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
        setLoading(false);
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

  const onChangeInput = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    const putData = {
      id: dataDefault.WORK_LOG_ID,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_ID: dataDefault.id,
      LOAN_TYPE_ID: loanType ? loanType : dataDefault.LOAN_TYPE_ID,
      MEMO: values.memo,
      PROCESS_ID: STATUS_PROCESS_PROGRESS,
      DATE: preData
        ? dayjs(preData.dateNotice).format("YYYY-MM-DD")
        : dayjs(values.dateNotice).format("YYYY-MM-DD"),
    };
    const putLawsuit = {
      ...lawsuitData,
      LOAN_TYPE_ID: loanType,
      COMPANY_ID: parseInt(values.company),
    };

    console.log("putDataData", putData);
    console.log("putLawsuit", putLawsuit);

    sendStatus(putData, putLawsuit);
  };

  const guarantorSet = () => {
    if (loanType !== 2) {
      return (
        <>
          {loanData?.GUARANTORS.length > 0 ? (
            <>
              <Form.Item
                label="ผู้ค้ำที่ 1"
                name="guarantor1"
                initialValue={loanData?.GUARANTORS[0]?.id}
              >
                {`${loanData?.GUARANTORS[0]?.SNAM}${loanData?.GUARANTORS[0]?.NAME1} ${loanData?.GUARANTORS[0]?.NAME2}`}
              </Form.Item>
            </>
          ) : null}
          {loanData?.GUARANTORS.length > 1 ? (
            <>
              <Form.Item
                label="ผู้ค้ำที่ 2"
                name="guarantor2"
                initialValue={loanData?.GUARANTORS[1]?.id}
              >
                {`${loanData?.GUARANTORS[1]?.SNAM}${loanData?.GUARANTORS[1]?.NAME1} ${loanData?.GUARANTORS[1]?.NAME2}`}
              </Form.Item>
            </>
          ) : null}
          {loanData?.GUARANTORS.length > 2 ? (
            <>
              <Form.Item
                label="ผู้ค้ำที่ 3"
                name="guarantor3"
                initialValue={loanData?.GUARANTORS[2]?.id}
              >
                {`${loanData?.GUARANTORS[2]?.SNAM}${loanData?.GUARANTORS[2]?.NAME1} ${loanData?.GUARANTORS[2]?.NAME2}`}
              </Form.Item>
            </>
          ) : null}
          {loanData?.GUARANTORS.length > 3 ? (
            <>
              <Form.Item
                label="ผู้ค้ำที่ 4"
                name="guarantor4"
                initialValue={loanData?.GUARANTORS[3]?.id}
              >
                {`${loanData?.GUARANTORS[3]?.SNAM}${loanData?.GUARANTORS[3]?.NAME1} ${loanData?.GUARANTORS[3]?.NAME2}`}
              </Form.Item>
            </>
          ) : null}
          {loanData?.GUARANTORS.length > 4 ? (
            <>
              <Form.Item
                label="ผู้ค้ำที่ 5"
                name="guarantor5"
                initialValue={loanData?.GUARANTORS[4]?.id}
              >
                {`${loanData?.GUARANTORS[4]?.SNAM}${loanData?.GUARANTORS[4]?.NAME1} ${loanData?.GUARANTORS[4]?.NAME2}`}
              </Form.Item>
            </>
          ) : null}
          {loanData?.GUARANTORS.length > 5 ? (
            <>
              <Form.Item
                label="ผู้ค้ำที่ 6"
                name="guarantor6"
                initialValue={loanData?.GUARANTORS[5]?.id}
              >
                {`${loanData?.GUARANTORS[5]?.SNAM}${loanData?.GUARANTORS[5]?.NAME1} ${loanData?.GUARANTORS[5]?.NAME2}`}
              </Form.Item>
            </>
          ) : null}
        </>
      );
    }
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
                loanTypeId: dataDefault.LOAN_TYPE_ID,
                memo: null,
                company:
                  userCompany === "3"
                    ? 3
                    : loanType === 1
                    ? 1
                    : loanType === 2
                    ? 2
                    : 2,
                dateNotice: dayjs(),
                cus: loanData?.CUSTOMER?.id,
              }}
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
                    width: "auto",
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
                  popupMatchSelectWidth={false}
                  style={{
                    width: "auto",
                  }}
                  placeholder="เลือกบริษัท"
                  showSearch
                  optionFilterProp="label"
                  options={companiesOption}
                  onChange={(value) => onChangeSelect(value)}
                  defaultValue={
                    userCompany === "3"
                      ? 3
                      : loanType === 1
                      ? 1
                      : loanType === 2
                      ? 2
                      : 2
                  }
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
              {guarantorSet()}

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
