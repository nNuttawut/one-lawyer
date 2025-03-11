import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
  Radio,
  Checkbox,
  Tooltip,
  List,
  Row,
  Col,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_INVESTIGATE_ITEM,
  POST_INVESTIGATE_LOG,
  PUT_INVESTIGATE_LOG,
  PUT_LAWSUIT_DETAIL,
  PUT_USER_UPDATE,
} from "../../../API/apiUrls";
import axios from "axios";
import CeckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import AssetsDetail from "./AssetsDetail";
import dayjs from "dayjs";
import EditAssetsDetail from "./EditAssetDetail";
import { Link } from "react-router-dom";

const EditInvestigateAssets = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [form] = Form.useForm();
  const [setupGovernmentOfficerList, governmentOfficers] =
    CeckGovermentOfficer();
  const { TextArea } = Input;
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState();
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const [checkLenght, setCheckLenght] = useState([]);
  const [arrow, setArrow] = useState("Show");
  const [radioStatus, setRadioStatus] = useState(
    dataDefualt.investigation_status
  );
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [checked, setChecked] = useState(false);
  const [checkedGuarantors, setCheckedGuarantors] = useState([]);
  const [isModalAssetsDetail, setIsModalAssetsDetail] = useState(false);
  const [isModalEditAssetsDetail, setIsModalEditAssetsDetail] = useState(false);
  const [dataPropertyList, setDataPropertyList] = useState([]);
  const [dataEdit, setDataEdit] = useState();

  const optionsInvestigate = [
    { label: "ไม่เจอทรัพย์", value: 0 },
    { label: "เจอทรัพย์", value: 1 },
  ];

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      console.log("loadData", dataDefualt);
      form.setFieldsValue({
        investigateAssetsResult: dataDefualt.investigation_status,
      });
    }
  }, [isModal]);

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
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefualt.CONTNO, {
          headers: HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            setDataLoadLoan(resQuery.data);
            setupGovernmentOfficerList(resQuery.data);
            listGovermentList(resQuery.data);
            console.log("loanRes", resQuery.data);
          } else {
            message.error("ไม่พบข้อมูล");
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));

      await axios
        .get(baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefualt.LAWSUIT_ID, {
          headers: HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            console.log("resQuery--->", resQuery.data);
            setDataLoadLawSuit(resQuery.data);
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
  };

  const listGovermentList = (data) => {
    if (data) {
      if (data?.GUARANTORS) {
        const listLength = data?.GUARANTORS?.filter((item) => item);
        console.log("listLength", listLength.length);
        setCheckLenght(listLength.length);
      }
    }
  };

  const sendStatus = async (putDataInvestigate, governmentOfficerData) => {
    console.log("governmentOfficerData---->", governmentOfficerData);

    setLoading(true);

    try {
      console.log("investigateStatus ", putDataInvestigate);
      await axios
        .put(baseUrl + PUT_INVESTIGATE_LOG, putDataInvestigate, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res);
            funcUpdateStatus({
              ...dataDefualt,
              investigation_status: radioStatus,
              investigation_date: putDataInvestigate.investigation_date,
            });
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้1");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });

      //   console.log("putDataLawsuit", putDataLawsuit);
      //   await axios
      //     .put(baseUrl + PUT_LAWSUIT_DETAIL, putDataLawsuit, {
      //       headers: HEADERS_EXPORT,
      //     })
      //     .then(async (res) => {
      //       if (res.status === 200) {
      //         console.log("resQuery", res.data);
      //         message.success("อัพเดทข้อมูลสำเร็จ");
      //       } else {
      //         message.error("ไม่สามารถส่งข้อมูลได้");
      //         console.log("ไม่สามารถส่งข้อมูลได้3");
      //         setLoading(false);
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       if (err.status > 400) {
      //         message.error("ไม่สามารถส่งข้อมูลได้4");
      //       }
      //     });

      if (dataPropertyList.length > 0) {
        console.log("dataPropertyList", dataPropertyList);
        const promises = dataPropertyList.map(async (item) => {
          const arrayData = item;
          console.log("arrayData", arrayData);

          if (!arrayData) {
            message.warning("พบค่าที่ไม่ถูกต้อง");
            return null;
          }
          await axios
            .post(baseUrl + POST_INVESTIGATE_ITEM, arrayData, {
              headers: HEADERS_EXPORT,
            })
            .then((resQuery) => {
              if (resQuery.status === 201) {
                console.log(resQuery.data);
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
        });
      }

      if (governmentOfficerData.length > 0) {
        console.log("governmentOfficerData", governmentOfficerData);
        const promises = governmentOfficerData.map(async (item) => {
          const arrayData = item;
          console.log("arrayData", arrayData);

          if (!arrayData) {
            message.warning("พบค่าที่ไม่ถูกต้อง");
            return null;
          }
          await axios
            .put(baseUrl + PUT_USER_UPDATE, arrayData, {
              headers: HEADERS_EXPORT,
            })
            .then((resQuery) => {
              if (resQuery.status === 201) {
                console.log(resQuery.data);
                return resQuery.data;
              } else {
                console.log(`แก้ไขข้อมูลสำเร็จ`);
                return null;
              }
            })
            .catch((err) => {
              console.error(err);
              message.error(`แก้ไขข้อมูลไม่สำเร็จ7`);
            });
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const handleUpdateData = (data) => {
    console.log("data---->update", data);

    // ตรวจสอบว่า data เป็นอาร์เรย์หรือไม่
    const dataArray = Array.isArray(data) ? data : [data]; // ถ้าไม่ใช่อาร์เรย์, แปลงเป็นอาร์เรย์

    if (dataPropertyList.length === 0) {
      console.log("(if dataPropertyList ว่าง)-->", dataPropertyList);
      setDataPropertyList(dataArray); // อัปเดต state ด้วย dataArray ที่เป็นอาร์เรย์
    } else {
      console.log("else dataPropertyList มีข้อมูล-->", dataPropertyList);

      // กรองข้อมูลที่มี deed_number ซ้ำ
      const result = dataPropertyList.filter((item) => {
        // ถ้า deed_number ซ้ำ ให้ไม่เอาข้อมูลนั้นมา
        if (
          item.deed_number === data.deed_number &&
          item.district === data.district &&
          item.province === data.province
        ) {
          message.error("พบข้อมูลที่ดินซ้ำโปรดตรวจสอบข้อมูล");
          return false; // กรองข้อมูลที่มี deed_number ซ้ำ
        }
        return true; // ให้ข้อมูลที่ไม่ซ้ำมา
      });

      // เพิ่มข้อมูลจาก dataArray ไปยัง result
      const updatedData = [...result, ...dataArray];

      console.log("Updated Data: ", updatedData);

      // อัปเดต state ด้วยข้อมูลที่กรองและเพิ่มข้อมูลใหม่จาก dataArray
      setDataPropertyList(updatedData);
    }
  };

  const handleUpdateDataEdit = (data) => {
    console.log("data---->update", data);
    if (data) {
      const result = dataPropertyList.map((item) => {
        if (
          item.deed_number === data.deed_number &&
          item.district === data.district &&
          item.province === data.province
        ) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      console.log(result);

      setDataPropertyList(result);
    }
  };

  const handleEdit = (item, index) => {
    console.log("item0", item, index);
    setDataEdit(dataPropertyList[index]);
    setIsModalEditAssetsDetail(true);

    // setFormValues(dataPropertyList[index]); // ตั้งค่าข้อมูลที่จะแก้ไขให้กับฟอร์ม
  };

  const handleDelete = (index) => {
    console.log("delete--->", index);
    setDataPropertyList((prevData) => prevData.filter((_, i) => i !== index));
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let putDataLawsuit;
    let putDataInvestigate;

    console.log("dataPropertyList---->", dataPropertyList);
    console.log("radioStatus--->", radioStatus);
    const result = Object.values(checkedGuarantors);

    // putDataLawsuit = {
    //   ...dataLoadLawSuit,
    //   government_officer_number: parseInt(result.length),
    //   investigate_mark: values.memo,
    // };

    putDataInvestigate = {
      id: dataDefualt.investigation_log_id,
      investigation_status: radioStatus,
      investigation_date: dayjs(values.investigateAssetsDate).format(
        "YYYY-MM-DD"
      ),
      mark: values.memo,
    };

    if (result) {
      const hasNullValues = result.some(
        (item) => item.OCCUP === "" || item.OFFIC === ""
      );
      console.log("Has null values:", hasNullValues); // true หรือ false
      console.log("result--->", result);
      console.log("postDataInvestigate--->", putDataInvestigate);
      console.log("putDataLawsuit--->", putDataLawsuit);

      if (!hasNullValues) {
        console.log("checkValue---->xxx", hasNullValues);
        sendStatus(putDataInvestigate, result);
      }
    } else {
      sendStatus(putDataInvestigate);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputInvestigateDate = (date, dateSting) => {
    console.log(date);
    console.log(dateSting);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const handleCheckCustomer = (e) => {
    const isChecked = e.target.checked; // ใช้ค่าจาก checkbox
    console.log("checked = ", isChecked);

    // ลบข้อมูลทั้งหมดของ governmentOfficers
    setCheckedGuarantors((prev) => {
      const newCheckedGuarantors = { ...prev };
      if (isChecked) {
        // ถ้า checkbox ถูกติ๊ก (checked), เก็บข้อมูล
        newCheckedGuarantors[governmentOfficers.id] = {
          OCCUP: "",
          OFFIC: "",
        };
      } else {
        // ถ้า checkbox ถูกยกเลิก (unchecked), ลบข้อมูลของ guarantorId ออกจาก checkedGuarantors
        delete newCheckedGuarantors[governmentOfficers.id];
      }

      return newCheckedGuarantors;
    });

    console.log("e", e);

    setChecked(isChecked);
  };

  const handleChangeGuarantor = (guarantorId, e) => {
    const isChecked = e.target.checked;

    setCheckedGuarantors((prev) => {
      const newCheckedGuarantors = { ...prev };

      if (isChecked) {
        // ถ้า checkbox ถูกติ๊ก (checked), เก็บข้อมูล
        newCheckedGuarantors[guarantorId] = {
          OCCUP: "",
          OFFIC: "",
        };
      } else {
        // ถ้า checkbox ถูกยกเลิก (unchecked), ลบข้อมูลของ guarantorId ออกจาก checkedGuarantors
        delete newCheckedGuarantors[guarantorId];
      }

      return newCheckedGuarantors;
    });
  };

  const handleInputChange = (id, e) => {
    const { value } = e.target;
    console.log("---->", value);

    // อัปเดตข้อมูลอาชีพของ guarantor ใน checkedGuarantors
    setCheckedGuarantors((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        OCCUP: value, // เก็บข้อมูล occupation ที่กรอก
        id: id, // ไอดี customer
        GOVMNT: 1,
      },
    }));
  };

  const handleInputChangeOffic = (id, e) => {
    const { value } = e.target;
    console.log("---->", value);

    // อัปเดตข้อมูลอาชีพของ guarantor ใน checkedGuarantors
    setCheckedGuarantors((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        id: id, // ไอดี customer
        OFFIC: value,
        GOVMNT: 1,
      },
    }));
  };

  const handleCheckBoxGroupGoverment = () => {
    return (
      <>
        <Checkbox
          value={governmentOfficers.id}
          // checked={checked}
          onChange={handleCheckCustomer}
        >
          {governmentOfficers
            ? `${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${
                governmentOfficers?.NAME2
              } ${
                governmentOfficers?.GOVMNT === 1
                  ? `ทำอาชีพ ${governmentOfficers?.OCCUP} อยู่ที่ ${governmentOfficers?.OFFIC}`
                  : ""
              }`
            : "-"}
        </Checkbox>
        {checked ? (
          <Row>
            <Col span={10}>
              <Input
                value={checkedGuarantors[governmentOfficers.id]?.occupation}
                onChange={(e) => handleInputChange(governmentOfficers.id, e)}
                placeholder="กรอกข้อมูลอาชีพ"
                style={{
                  marginLeft: "20px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                prefix="*อาชีพ : "
                size="small"
              />
            </Col>
            <Col span={14}>
              <Input
                value={checkedGuarantors[governmentOfficers.id]?.OFFIC}
                onChange={(e) =>
                  handleInputChangeOffic(governmentOfficers.id, e)
                }
                placeholder="กรอกข้อมูลสถานที่ทำงาน"
                style={{
                  marginLeft: "50px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                prefix="*สถานที่ทำงาน : "
                size="small"
              />
            </Col>
          </Row>
        ) : null}

        {/* แสดง checkbox สำหรับ guarantors */}
        {governmentOfficers?.guarantors?.length > 0
          ? governmentOfficers.guarantors.map((guarantor, index) => (
              <div key={index}>
                <Checkbox
                  value={guarantor.id}
                  onChange={(e) => handleChangeGuarantor(guarantor.id, e)}
                >
                  {`${guarantor?.SNAM} ${guarantor?.NAME1} ${
                    guarantor?.NAME2
                  } เป็น ${guarantor?.RELATN} ${
                    guarantor?.GOVMNT === 1
                      ? `ทำอาชีพ ${guarantor?.OCCUP} อยู่ที่ ${guarantor?.OFFIC}`
                      : ""
                  }`}
                </Checkbox>

                {/* แสดง Input ถ้า guarantor checkbox ถูกเลือก */}
                {checkedGuarantors[guarantor.id] ? (
                  <Row>
                    <Col span={10}>
                      <Input
                        value={checkedGuarantors[guarantor.id]?.occupation}
                        onChange={(e) => handleInputChange(guarantor.id, e)}
                        placeholder="กรอกข้อมูลอาชีพ"
                        style={{ marginLeft: "20px", marginTop: "5px" }}
                        size="small"
                        prefix="*อาชีพ : "
                      />
                    </Col>
                    <Col span={14}>
                      <Input
                        value={checkedGuarantors[guarantor.id]?.OFFIC}
                        onChange={(e) =>
                          handleInputChangeOffic(guarantor.id, e)
                        }
                        placeholder="กรอกข้อมูลสถานที่ทำงาน"
                        style={{ marginLeft: "50px", marginTop: "5px" }}
                        prefix="*สถานที่ทำงาน : "
                        size="small"
                      />
                    </Col>
                  </Row>
                ) : null}
              </div>
            ))
          : null}
      </>
    );
  };

  const onChangeInvestiGateResult = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setRadioStatus(value);
  };

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
            {`${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
            ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
          </p>
        </Form.Item>
        <Form.Item
          label="วันที่สืบทรัพย์"
          name="investigateAssetsDate"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่สืบทรัพย์",
            },
          ]}
        >
          <DatePicker onChange={onChangeInputInvestigateDate} />
        </Form.Item>
        <Tooltip
          placement="bottom"
          title="ถ้าเกิดไม่มีไม่ต้องเลือก !"
          arrow={mergedArrow}
        >
          <Form.Item label="จำเลยที่เป็นข้าราชการ" name="governmentOfficer">
            {handleCheckBoxGroupGoverment()}
          </Form.Item>
        </Tooltip>
        {dataPropertyList.length === 0 ? (
          <Form.Item
            label="ผลการสืบทรัพย์"
            name="investigateAssetsResult"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกผลการสืบทรัพย์",
              },
            ]}
          >
            <Radio.Group
              label="ผลการสืบทรัพย์"
              name="investigateAssetsResult"
              options={optionsInvestigate}
              onChange={onChangeInvestiGateResult}
              value={radioStatus}
            />
          </Form.Item>
        ) : null}

        {radioStatus === 1 ? (
          <>
            <Form.Item
              label="ทรัพย์ที่สืบเจอ"
              name="assetsFound"
              labelCol={{ span: 6 }} // กำหนดความกว้างของ label
              wrapperCol={{ span: 14 }} // กำหนดความกว้างของ input หรือ content
            >
              <List
                header={
                  <Button
                    style={{ color: "blue" }}
                    onClick={() => setIsModalAssetsDetail(true)}
                  >
                    เพิ่มทรัพย์
                  </Button>
                }
                itemLayout="horizontal"
                dataSource={dataPropertyList}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Link
                        key="list-loadmore-edit"
                        onClick={() => handleEdit(item, index)}
                      >
                        แก้ไข
                      </Link>,
                      <Link
                        key="list-loadmore-more"
                        style={{ color: "red" }}
                        onClick={() => handleDelete(index)} // ส่ง index เข้าไปในฟังก์ชัน
                      >
                        ลบ
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Link onClick={() => handleEdit(item, index)}>
                          {item.possessor}
                        </Link>
                      }
                      description={
                        <>
                          <p>{`เลขโฉนด ${item.deed_number} อำเภอ ${item.district_desc} จังหวัด${item.province_desc}`}</p>
                          <p>{`หมายเหตุ ${item.mark}`}</p>
                        </>
                      }
                    />
                    <div>
                      {" "}
                      {item.investigation_type_id === 1
                        ? "ก่อนฟ้อง"
                        : item.investigation_type_id === 2
                        ? "หลังฟ้อง"
                        : null}
                    </div>
                  </List.Item>
                )}
              />
            </Form.Item>
          </>
        ) : null}
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
          {dataPropertyList.length > 0 ? (
            <Button style={{ color: "green" }} htmlType="submit">
              บันทึก
            </Button>
          ) : null}
        </div>
      </Form>
    );
  };

  return (
    <>
      <Modal
        title={`แก้ไขสืบทรัพย์ลูกหนี้`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
      </Modal>
      {isModalAssetsDetail ? (
        <AssetsDetail
          open={isModalAssetsDetail}
          close={setIsModalAssetsDetail}
          dataLoan={dataLoadLoan}
          dataDefualt={dataDefualt}
          governmentOfficers={governmentOfficers}
          handleData={handleUpdateData}
        />
      ) : null}
      {isModalEditAssetsDetail ? (
        <EditAssetsDetail
          open={isModalEditAssetsDetail}
          close={setIsModalEditAssetsDetail}
          dataLoan={dataLoadLoan}
          dataDefualt={dataDefualt}
          governmentOfficers={governmentOfficers}
          handleEdit={handleUpdateDataEdit}
          dataIndex={dataEdit}
        />
      ) : null}
    </>
  );
};
export default EditInvestigateAssets;
