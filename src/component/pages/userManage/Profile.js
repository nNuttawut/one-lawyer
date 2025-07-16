import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Spin,
  Switch,
} from "antd";
import MotionHoc from "../../../utils/MotionHoc";
import {
  baseUrl,
  GET_BY_ID,
  HEADERS_EXPORT,
  POST_USER,
} from "../../API/apiUrls";
import axios from "axios";
import RoleSelect from "../../../hook/RoleSelect";
import LoadCompanies from "../../../hook/LoadCompanies";

const Main = () => {
  const [form] = Form.useForm();
  const [roleList, setLoadingDataRole] = RoleSelect();
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [userData, setUserData] = useState(null);
  // ดึงค่าจาก localStorage
  const [loading, setLoading] = useState();
  const [roleOption, setRoleOption] = useState(null);
  const [companiesOption, setCompaniesOption] = useState(null);
  const [companie, setCompanie] = useState(null);
  const [dataComfirm, setDataComfirm] = useState({});

  useEffect(() => {
    loadData();
    setLoadingDataCompany(true);
    setLoadingDataRole(true);
    // ตั้งค่าฟิลด์ในฟอร์ม
  }, [setLoadingDataRole, setLoadingDataCompany]);

  useEffect(() => {
    setOptionRole();
    setOptionCompanies();
  }, [companiesListCompany, roleList]);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(baseUrl + GET_BY_ID + userId, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        if (response.status === 200) {
          setUserData(response.data);
          console.log(response.data);
          setDataDefualt(response.data);
          setLoading(false);
          console.log(response.data);
        }
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
    }
  };

  const setOptionRole = () => {
    const options = roleList.map((item) => ({
      value: item.id,
      label: item.description_th,
    }));
    setRoleOption(options);
  };

  const setOptionCompanies = () => {
    const options = companiesListCompany
      .filter((item) => item.id === 1 || item.id === 2 || item.id === 3)
      .map((item) => ({
        value: item.id,
        label: item.company_name,
        address: item.address,
      }));
    setCompaniesOption(options);
    let companieDefualt = options?.find(
      (item) => item.value === parseInt(userCompany)
    );
    form.setFieldsValue({
      COMPANY_SHOW: companieDefualt?.label,
    });
    setCompanie(companieDefualt);
  };

  const setDataDefualt = (data) => {
    if (data) {
      form.setFieldsValue({
        USERNAME: data?.USERNAME ? data?.USERNAME : "-",
        FNAME: data?.FNAME ? data?.FNAME : "-",
        LNAME: data?.LNAME ? data?.LNAME : "-",
        NNAME: data?.NNAME ? data?.NNAME : "-",
        LICENCE_NO: data?.LICENCE_NO ? data?.LICENCE_NO : "-",
        COMPANY_SHOW: data?.COMPANY_ID,
        ROLE_ID: data?.ROLE_ID ? data?.ROLE_ID : "-",
        ACTIVE_STATUS: data?.ACTIVE_STATUS,
        bookBank: data?.book_bank,
      });
    }
  };

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const onChangeSelect = (value) => {
    console.log(` ${value}`);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    console.log("userData:", userData);
    setDataComfirm({
      ...userData,
      USERNAME: values?.USERNAME,
      TNAME: userData.TNAME,
      FNAME: values.FNAME,
      LNAME: values.LNAME,
      NNAME: values.NNAME,
      LICENCE_NO: values.LICENCE_NO ? values.LICENCE_NO : userData.LICENCE_NO,
      COMPANY_ID: values.COMPANY_ID ? values.COMPANY_ID : companie.value,
      ROLE_ID: values.ROLE_ID,
      ACTIVE_STATUS: values.ACTIVE_STATUS,
      book_bank: values.book_Bank ? values.book_Bank : userData.book_bank,
    });
  };

  const sendData = async () => {
    setLoading(true);
    try {
      await axios
        .post(baseUrl + POST_USER, dataComfirm, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            message.success(`อัพเดทข้อมูลสำเร็จ ${userData.USERNAME}`);
            localStorage.setItem("USERNAME", dataComfirm?.USERNAME);
            localStorage.setItem("FNAME", dataComfirm?.FNAME);
            localStorage.setItem("LNAME", dataComfirm?.LNAME);
            localStorage.setItem("NNAME", dataComfirm?.NNAME);
            localStorage.setItem("LICENCE_NO_LAWYERS", dataComfirm?.LICENCE_NO);
            localStorage.setItem("COMPANY_ID", dataComfirm?.COMPANY_ID);
            localStorage.setItem("ACTIVE_STATUS", dataComfirm?.ACTIVE_STATUS);
            localStorage.setItem("ACTIVE_STATUS", dataComfirm?.line_uid);
          } else if (res.status === 201) {
            message.error("ลงทะเบียนใหม่");
            console.log("ลงทะเบียนใหม่");
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
          }
        })
        .catch((err) => {
          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const confirm = () => {
    console.log(dataComfirm);
    sendData();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };
  if (userData) {
    return (
      <Spin spinning={loading} size="large" tip=" Loading... ">
        <Form
          form={form} // ตั้งค่า form ที่นี่
          name="user"
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="สถานะ" name="ACTIVE_STATUS">
            <Switch onChange={onChange} />
          </Form.Item>

          <Form.Item label="User Name" name="USERNAME">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="ชื่อ"
            name="FNAME"
            rules={[
              {
                required: true,
                message: "โปรดกรอกชื่อ",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="นามสกุล"
            name="LNAME"
            rules={[
              {
                required: true,
                message: "โปรดกรอกนามสกุล",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ชื่อเล่น"
            name="NNAME"
            rules={[
              {
                required: true,
                message: "โปรดกรอกชื่อเล่น",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item label="บัญชีธนาคาร" name="bookBank">
            <Input />
          </Form.Item>
          {userData.ROLE_ID === 3 ? (
            <Form.Item label="ใบอนุญาติทนาย" name="LICENCE_NO">
              <Input />
            </Form.Item>
          ) : null} */}
          <Form.Item label="บริษัทที่สังกัดปัจจุบัน">
            {companie?.label}
          </Form.Item>
          <Form.Item label="เปลี่ยนบริษัทที่สังกัด" name="COMPANY_ID">
            <Select
              showSearch
              style={{
                width: 250,
              }}
              placeholder="เลือกบริษัท"
              optionFilterProp="value"
              options={companiesOption}
              onChange={(value) => onChangeSelect(value)}
              disabled={
                userData.ROLE_ID === 1 || userData.ROLE_ID === 2 ? false : true
              }
            />
          </Form.Item>

          <Form.Item label="ตำแหน่ง" name="ROLE_ID">
            <Select
              showSearch
              style={{
                width: 250,
              }}
              disabled
              placeholder="เลือกตำแหน่ง"
              optionFilterProp="value"
              options={roleOption}
            />
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Popconfirm
              title="บันทึกข้อมูลโปรไฟล์"
              description="คุณต้องการบันทึกข้อมูลโปรไฟล์หรือไม่ ?"
              onConfirm={confirm}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
            >
              <Button style={{ color: "green" }} htmlType="submit">
                บันทึก
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </Spin>
    );
  }
};
const Profile = MotionHoc(Main);
export default Profile;
