import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
  Select,
  InputNumber,
  Divider,
} from "antd";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import ExpenseType from "../../../../hook/ExpenseType";

const ExpenseList = ({ open, close, dataDefault, handleEdit, editData }) => {
  const [form] = Form.useForm();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const { TextArea } = Input;
  const [expenseList, setLoadingExpenseType] = ExpenseType();
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrow, setArrow] = useState("Show");
  const [expenseTypeSelect, setExpenseTypeSelect] = useState([]);
  const USER_ID = localStorage.getItem("USER_ID");
  const [labelSelect, setLabelSelect] = useState();
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [dataExpenseList, setDataExpenseList] = useState();

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      if (editData?.length > 1) {
        setDataExpenseList(editData);
      }

      console.log("editData", editData);
      console.log("loadData---->", dataDefault);
      setLoadingExpenseType(true);
    }
  }, [isModal]);

  useEffect(() => {
    if (expenseList) {
      setOptionExpenseType();
    }
  }, [expenseList]);

  const setOptionExpenseType = () => {
    const options = expenseList
      .filter(
        (item) =>
          item.id === 13 ||
          item.id === 14 ||
          item.id === 15 ||
          item.id === 16 ||
          item.id === 17
      )
      .map((item) => ({
        value: item.id,
        name: item.name,
        label: item.description,
      }));

    console.log("options ----->", options);
    setExpenseTypeSelect(options);
  };

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

  const handleOk = () => {
    if (dataExpenseList?.length > 0) {
      console.log("Clicked handleOk button", dataExpenseList);
      dataExpenseList.forEach((item) => handleEdit(item));
      close(false);
      setIsModal(false);
    } else {
      message.error("ไม่พบรายการเบิก คลิก ยกเลิก/เพิ่ม ! ");
    }
  };

  const handleEditItem = (item, index) => {
    form.setFieldsValue({
      expenseType: item.expense_type_id,
      amount: item.withdraw,
    });
    setCurrentEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    console.log("index", index);

    const updatedList = [...dataExpenseList];
    updatedList.splice(index, 1);

    console.log("updatedList", updatedList);

    setDataExpenseList(updatedList);
    if (index === currentEditIndex) {
      form.resetFields();
      setCurrentEditIndex(null);
    }
  };

  const onFinish = (values) => {
    if (!values.amount || !values.expenseType) {
      message.error("กรุณาเลือกรายการและระบุจำนวนมากกว่า 0");
      return;
    }
    console.log(values);

    console.log(expenseList);

    const newItem = {
      LAWSUIT_ID: dataDefault[0]?.LAWSUIT_ID,
      expense_type_id: values.expenseType,
      withdraw: values.amount,
      label:
        labelSelect?.label ||
        expenseList.find((item) => item.id === values.expenseType)
          ?.description ||
        "โปรดลบและสร้างใหม่",
    };

    setDataExpenseList((prev = []) => {
      // prev รับประกันเป็น array จึง iterable ได้
      const updated = [...prev];

      if (currentEditIndex !== null) {
        updated[currentEditIndex] = newItem;
      } else {
        if (updated.some((it) => it.expense_type_id === values.expenseType)) {
          message.warning("มีรายการนี้อยู่แล้ว");
          return prev; // ส่ง prev คืน ถ้าเจอซ้ำ
        }
        updated.push(newItem);
      }

      return updated; // ส่งกลับเป็น array เสมอ
    });

    setCurrentEditIndex(null);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeSelect = (value) => {
    console.log("value--->", value);
    setLabelSelect(value);
  };

  const infoList = () => {
    Modal.confirm({
      title: "ค่าธรรมเนียมในชั้นบังคับคดี",
      width: "30%",

      style: {
        top: 20,
      },
      bodyStyle: {
        padding: "16px 24px",
        maxWidth: "650px", // ถ้าจะจำกัดไม่ให้เนื้อหายืดเกิน
      },

      content: (
        <div style={{ textAlign: "left", lineHeight: 1.8 }}>
          <p>1. ค่าธรรมเนียมตั้งเรื่องอายัด 1,000 บาท/สำนวนคดี</p>
          <p>2. ค่าธรรมเนียมตั้งเรื่องบังคับคดีแทน 1,000 บาท/สำนวนคดี</p>
          <p>
            3. ค่าธรรมเนียมตั้งเรื่องยึดอสังหาริมทรัพย์ ณ ที่ทำการ 2,500
            บาท/สำนวนคดี
          </p>
          <p>4. ค่าธรรมเนียมตั้งเรื่องยึดทรัพย์สินอื่น ๆ 1,000 บาท/สำนวนคดี</p>
          <p>5. ค่าธรรมเนียมตั้งเรื่องขับไล่ 1,000 บาท/สำนวนคดี</p>
        </div>
      ),
      centered: true,
      cancelText: "ปิด",
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  console.log("dataExpenseList====>", dataExpenseList);

  const dataExpense = () => {
    const expensePreview = dataExpenseList || [];

    return (
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <span onClick={infoList}>ℹ️</span>
        <Divider>รายการที่ขอเบิก 🧾</Divider>

        {/* แสดงรายการที่เคยเพิ่มไว้ */}
        {expensePreview?.length > 0 &&
          expensePreview?.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                marginLeft: "25%",
                marginRight: "10%",
                background: "#fafafa",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <span>
                ▪ {item.label} : {currencyFormatPoint(item.withdraw)} บาท
              </span>
              <div>
                <Button type="link" onClick={() => handleEditItem(item, index)}>
                  ✏️
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteItem(index)}
                >
                  🗑
                </Button>
              </div>
            </div>
          ))}

        <Form.Item label="รายการที่ขอเบิก" name="expenseType">
          <Select
            placeholder="โปรดเลือกรายการ"
            showSearch
            optionFilterProp="label"
            options={expenseTypeSelect}
            onChange={(value) => {
              const selectedOption = expenseTypeSelect.find(
                (item) => item.value === value
              );
              onChangeSelect(selectedOption);
            }}
            popupMatchSelectWidth={false}
            style={{ width: "auto" }}
            size="large"
          />
        </Form.Item>
        <Form.Item label="จำนวน" name="amount">
          <InputNumber
            suffix="บาท"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            size="large"
            placeholder="กรุณากรอกจำนวน"
            style={{ width: "auto", color: "black" }}
            min={0.01}
          />
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={handleCancel}
            style={{ color: "red", marginRight: "20px" }}
          >
            ยกเลิก
          </Button>
          <Button
            style={{ color: "blue", marginRight: "20px" }}
            htmlType="submit"
          >
            เพิ่ม
          </Button>
          <Button style={{ color: "green" }} onClick={handleOk}>
            บันทึก
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <>
      <Modal
        title={"รายการที่ต้องการเบิก"}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card style={{ marginBottom: "10px" }}>{dataExpense()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default ExpenseList;
