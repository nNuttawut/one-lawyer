import { Col, Row, Table, Card, Button, message, Spin, Popconfirm } from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detail/DetailModal";
import MotionHoc from "../../../utils/MotionHoc";
import { PlusOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  HEADERS_EXPORT,
  baseUrl,
  GET_RECEIVE_PAYMENT,
  DELETE_RECEIVE_PAYMENT_BY_ID,
} from "../../API/apiUrls";
import AddData from "./modal/AddData";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [isModal, setIsModal] = useState(false);
  const [isModalAddData, setIsModalAddData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [tableLength, setTableLength] = useState(0);
  const [dataArr, setDataArr] = useState();
  const [dataItem, setDataItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_RECEIVE_PAYMENT, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        if (response.data) {
          console.log(response.data);
          let i = 1;

          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));

          filterDataLawyer(newData);

          setLoading(false);
        }
      } else {
        setArrayTable([]);
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล`);
    }
  };

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) => item.payee_id === userId || ROLE_ID === "1" || ROLE_ID === "2"
      );
      console.log("newData", newData);

      setArrayTable(newData);
      setDataArr(newData);
      setTableLength(newData.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const renderManage = (record) => {
    return (
      <>
        <Button
          style={{
            fontSize: "14px",
            marginRight: "5px",
            color: "orange",
          }}
          onClick={() => {
            setDataItem(record);
            setIsModalAddData(true);
          }}
        >
          แก้ไข
        </Button>

        <Popconfirm
          placement="topLeft"
          title="ลบข้อมูล"
          description="คุณต้องการลบข้อมูลนี้ ?"
          onConfirm={() => {
            deleteItem(record);
          }}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <Button
            style={{
              fontSize: "14px",
              marginRight: "5px",
              color: "red",
            }}
          >
            ลบ
          </Button>
        </Popconfirm>
      </>
    );
  };

  const deleteItem = async (data) => {
    console.log(data);

    setLoading(true);

    try {
      const response = await axios.delete(
        baseUrl + DELETE_RECEIVE_PAYMENT_BY_ID + data.id,
        {
          headers: HEADERS_EXPORT,
        }
      );
      if (response.status === 200) {
        handleUpdateData(data, "delete");
        setLoading(false);
      }
      console.log("response", response);
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล`);
    }
  };

  const handleUpdateData = (data, status) => {
    console.log("data---->update", data);

    if (data !== 0) {
      let result = [];

      const found = dataArr.find((item) => item.id === data.id);

      if (status === "delete" && found) {
        // 🔴 ลบข้อมูลที่ id ตรงกัน
        result = dataArr.filter((item) => item.id !== data.id);
      } else if (status === "edit" && found) {
        // 🟡 แก้ไขข้อมูลเดิม
        result = dataArr.map((item) =>
          item.id === data.id ? { ...data } : item
        );
      } else if (status === "add" && !found) {
        // 🟢 เพิ่มข้อมูลใหม่
        result = [...dataArr, data];
      } else {
        // ❌ กรณีผิดเงื่อนไข เช่น เพิ่มซ้ำ หรืออัปเดต/ลบที่ไม่มีอยู่
        result = [...dataArr]; // คงเดิม
      }

      console.log("result", result);
      setDataArr(result);

      // 🔄 กรองข้อมูลเฉพาะที่เกี่ยวข้องกับ user
      const arr = result.filter(
        (item) => item.payee_id === userId || ROLE_ID === "1" || ROLE_ID === "2"
      );
      console.log("arr", arr);
      setArrayTable(arr);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      sorter: {
        compare: (a, b) => a.key - b.key,
        multiple: 5,
      },
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => <>{record.contno}</>,
    },
    {
      title: "สถานะ",
      align: "center",
      render: (text, record) => <>{record.type}</>,
    },
    {
      title: "วันที่รับเงิน",
      align: "center",
      render: (text, record) => <>{convertDateThai(record.date)}</>,
    },
    {
      title: "รับชำระจำนวน",
      align: "center",
      render: (text, record) => <>{currencyFormatComma(record.amount)}</>,
    },
    {
      title: "หมายเหตุ",
      align: "center",
      render: (text, record) => <>{record.mark}</>,
    },
    ...(ROLE_ID === "1" || ROLE_ID === "2"
      ? [
          {
            title: "ผู้รับเงิน",
            align: "center",
            render: (record) => <>{record?.payee_id}</>,
          },
        ]
      : []),
    {
      title: "การจัดการ",
      align: "center",
      render: (record) => renderManage(record),
    },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"12"} style={{ textAlign: "start" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />} // ไอคอน
                size="small" // ขนาดเล็ก
                onClick={() => {
                  setIsModalAddData(true);
                  setDataItem(null);
                }}
                loading={loading}
              >
                สร้างรายการ
              </Button>
            </Col>
            <Col span={"12"} style={{ textAlign: "end" }}>
              <Search
                placeholder="ค้นหาสัญญา"
                // onSearch={onQuery}
                // enterButton
                // onChange={(e) => setQueryContno(e.target.value)}
                style={{
                  width: 200,
                }}
                size="large"
              />
            </Col>
            <Col span={"24"}>
              <Table
                style={{ marginTop: "10px" }}
                size="small"
                columns={columns}
                dataSource={arrayTable}
                scroll={{ x: 850 }}
                footer={() => <p>จำนวนสัญญทั้งหมด {tableLength}</p>}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
      {isModalAddData ? (
        <AddData
          open={isModalAddData}
          close={setIsModalAddData}
          funcUpdateStatus={handleUpdateData}
          data={dataItem}
        />
      ) : null}
    </>
  );
};

const ReceiveMoney = MotionHoc(Main);
export default ReceiveMoney;
