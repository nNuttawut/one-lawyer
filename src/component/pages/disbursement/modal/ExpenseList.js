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
import dayjs from "dayjs";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import ExpenseType from "../../../../hook/ExpenseType";
import { STATUS_WITHDRAW_PROCESS } from "../../../../utils/constant/ExpenseType";

const ExpenseList = ({ open, close, dataDefault, handleEdit }) => {
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
  const [dataExpenseList, setDataExpenseList] = useState({
    setPreExpense: [],
  });

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      setDataExpenseList(dataDefault);
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
      .filter((item) => item.id === 5 || item.id === 6)
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
    if (dataExpenseList?.setPreExpense?.length > 0) {
      console.log("Clicked cancel button", dataExpenseList);
      handleEdit(dataExpenseList);
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
    const updatedList = [...dataExpenseList.setPreExpense];
    updatedList.splice(index, 1);
    setDataExpenseList({ ...dataExpenseList, setPreExpense: updatedList });
    if (index === currentEditIndex) {
      form.resetFields();
      setCurrentEditIndex(null);
    }
  };

  const onFinish = (values) => {
    console.log("values", values);
    if (!values.amount || !values.expenseType) {
      message.error("กรุณาเลือกรายการและระบุจำนวนมากกว่า 0 ");
    } else {
      const newItem = {
        LAWSUIT_ID: dataDefault.LAWSUIT_ID,
        expense_type_id: values.expenseType,
        withdraw: values.amount,
        label:
          labelSelect?.label ||
          expenseList.find((item) => item.id === values.expenseType)
            ?.description ||
          "โปรดลบและสร้างใหม่",
      };

      const updatedList = [...(dataExpenseList.setPreExpense || [])];

      if (currentEditIndex !== null) {
        updatedList[currentEditIndex] = newItem;
      } else {
        const isDuplicate = updatedList.some(
          (item) => item.expense_type_id === values.expenseType
        );
        const isDuplicateFee = dataDefault.fee ? true : false;
        const isDuplicateCopyingFee = dataDefault.copying_fee ? true : false;

        console.log("isDuplicateFee", isDuplicateFee);
        console.log("isDuplicateCopyingFee", isDuplicateCopyingFee);

        if (isDuplicateFee && values.expenseType === 5) {
          message.warning("เคยทำรายการไปแล้ว");
          console.log("1");

          return;
        }

        if (isDuplicateCopyingFee && values.expenseType === 6) {
          message.warning("เคยทำรายการไปแล้ว");
          console.log("2");
          return;
        }

        if (isDuplicate) {
          message.warning("มีรายการนี้อยู่แล้ว");
          return;
        }

        updatedList.push(newItem);
      }

      setDataExpenseList({ ...dataExpenseList, setPreExpense: updatedList });
      setCurrentEditIndex(null);
      form.resetFields();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeSelect = (value) => {
    console.log("value--->", value);
    setLabelSelect(value);
  };

  const dataExpense = () => {
    const expensePreview = dataExpenseList?.setPreExpense || [];

    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Divider>รายการที่ขอเบิก 🧾</Divider>

        {/* แสดงรายการที่เคยเพิ่มไว้ */}
        {expensePreview.length > 0 &&
          expensePreview.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                marginLeft: "30%",
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
        title={`รายการที่ต้องการเบิก`}
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
