import React, { useState } from "react";
import axios from 'axios';
import dayjs from "dayjs";
import MotionHoc from "../../../utils/MotionHoc";
import DetailCcb from "./model/Detail";
import { Button, Card, Col, Divider, Form, Input, Row, Space, Spin, notification, Checkbox, DatePicker, Select, Modal, Table } from 'antd';
import { currencyFormatOne, msDue, msConnt, msData, msCancel, currencyFormat, msOK, msOKMemo1, msErrorInst, msError, msReceipt } from "./modelFormat/Format";
import { calPayAROTHR, calPayGRADE, calPayHD } from "./calculate/Calculate";
import { columns, columnsHDPAYMENT, columnsAROTHR } from './modelColumn/Columns';
import { optionsSearchPay } from "./modelOption/Options";
import { loadPayamtCcb, InsertPayamtCcb, insertMemo1, FindPAYTYP } from "./api/Api";

const Main = () => {
  const { TextArea } = Input;
  const { confirm } = Modal
  // const token = localStorage.getItem('token');
  // const currentToken = localStorage.getItem("currentToken");
  const currentDateTime = dayjs().add(1, 'month');
  // const currentDateTime = dayjs().add(7, 'day');
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [formKey, setFormKey] = useState(0);
  const [formKey2, setFormKey2] = useState(0);
  const [formKey3, setFormKey3] = useState(0);
  // const componentPDF = useRef();
  // const generatePDF = useReactToPrint({ content: () => componentPDF.current, documentTitle: "ใบรับเงิน", }); // บิลปกติ
  // const componentPDF2 = useRef();
  // const generatePDF2 = useReactToPrint({ content: () => componentPDF2.current, documentTitle: "ใบรับเงิน", }); // บิลปกติ + บิลปิด
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClickedTy, setIsClickedTy] = useState(1); // เลือกค้นหาจาก
  const [changeItem, setChangeItem] = useState(false);
  const [checkDataInsert, setCheckDataInsert] = useState(false);
  const [isClicked, setIsClicked] = useState(1);
  const [checkButton, setCheckButton] = useState(1);
  const [checkCt, setCheckCt] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [dataSend, setDataSend] = useState({
    textData: "",
    textData2: "",
    CONTNO: "",
    money: 0,
    TOTAMT: 0,
    sale: 0,
    saleFollow: 0,
    date: currentDateTime,
    payType: "จ่ายเข้าตารางดิว",
    PAYCODE: "01",
    selectPay: 1,
    MEMO1: "",
    book: false,
    books: 0,
    pat: 200,
  });
  const [findPAYTYP, setFindPAYTYP] = useState([]);
  const [dataHDPAYMENT, setDataHDPAYMENT] = useState([]);
  const [dataAROTHR, setDataAROTHR] = useState([]);
  const [dataPay, setDataPay] = useState(null);
  const [calData, setCalData] = useState({
    ALLPAYAMT: 0,
    ALLPAYFOLLOW: 0,
    ALLPAYINTEFF: 0,
    ALLPAYTON: 0,
    ALLCAL: 0,
    text: "",
  });
  const [sum, setSum] = useState({
    sumAmt: 0,
    sumFollow: 0,
    sumAll: 0,
    sumMoney: 0,
    HDPAY: 0, // เข้ารับฝาก
    amt: 0,
    nopay: 0,
    GRDCOD: "",
    AROTHR: 0, // โชว์ลูกหนี้อื่นๆ มาจากหลังบ้าน
    HD: 0, // โชว์รับฝาก มาจากหลังบ้าน
    payGRADE: 0,
    flagTMPTELDEBT: null,
    flagCutTon: false,
  });
  const [isModalInfoCCB, setIsModalInfoCCB] = useState(false);

  const handleCCB = () => {
    setIsModalInfoCCB(true)
  }
  const buttonAmt = async (value) => {
    setCheckButton(value)
    setIsClicked(value)
  }
  const onChangeTime = async (e) => {
    setCheckDataInsert(false)
    setChangeItem(true)
    if (e) {
      setDataSend({ ...dataSend, date: e.format("YYYY-MM-DDTHH:mm:ssZ") })
    }
  }
  const onChangeBook = async (e) => {
    // console.log(e.target.checked)
    setCheckDataInsert(false)
    if (e.target.checked) {
      setDataSend({ ...dataSend, book: true, books: 2000, pat: 0, })
    } else {
      setDataSend({ ...dataSend, book: false, books: 0, pat: 200, })
      console.log("ไม่เข้า")
    }
  };
  const handleSelectCONTNO = async (value) => {
    console.log(value)
    if (value) {
      setLoading(true);
      setTimeout(() => {
        setDataSend({ ...dataSend, CONTNO: value })
        setCheckDataInsert(false)
        setChangeItem(true)
        setLoading(false);
      }, 1000);
    }
  }
  const handleCONTNO = (e, number) => {
    if (number === 31 || number === 32) {
      if (number === 31) {
        setDataSend({ ...dataSend, CONTNO: "", textData: e.target.value })
      } else {
        setDataSend({ ...dataSend, CONTNO: "", textData2: e.target.value })
      }
      setFindPAYTYP([])
      form.setFieldsValue({ CONTNO: "", })
    } else {
      if (isClickedTy === 1) {
        // console.log("e.target.value", e.target.value)
        setDataSend({ ...dataSend, CONTNO: e.target.value, textData: "" })
      } else {
        // console.log("e.target.value", e.target.value)
        // setLoading(true);
        // setTimeout(() => {
        setDataSend({ ...dataSend, CONTNO: "", textData: e.target.value })
        setFindPAYTYP([])
        //   setLoading(false);
        // }, 1000);
        form.setFieldsValue({ CONTNO: "", })

      }
    }
    setCheckDataInsert(false)
    setChangeItem(true)
  }
  const handleMEMO1 = (value) => {
    // console.log("value MEMO1", value)
    setDataSend((prevData) => ({ ...prevData, MEMO1: value }));
  }
  const funcInsertMemo1 = async (contno, memo1) => {
    console.log("funcInsertMemo1")
    if (contno !== "" && memo1 !== "") {
      try {
        const response = await axios.post(insertMemo1, { CONTNO: contno, MEMO1: memo1 });
        if (response.status === 200) {
          console.log("response.data", response.data)
          return 200;
        } else {
          return 201;
        }
      } catch (error) {
        console.log("err", error);
        return 201;
      }
    }
  };
  const handleSubmitMemo = async () => {
    setFormKey3(prevKey => prevKey + 1);
    console.log("memo")
    setLoading(true)
    try {
      const result = await funcInsertMemo1(dataSend?.CONTNO, dataSend?.MEMO1);
      if (result === 200) {
        msOKMemo1(api, "top")
      } else {
        msErrorInst(api, "top")
      }
    } catch (error) {
      console.error("Error in funcInsertMemo1: ", error);
      msErrorInst(api, "top")
    } finally {
      setLoading(false);
    }
  }

  const showConfirm = () => {
    confirm({
      title: (
        <Row>
          <Form form={form}>
            <Col span={24}>
              <Form.Item label="" style={{ margin: 0 }}>
                <b>{"คอมเฟิร์มทำรายการ"}</b>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="เลขที่สัญญา" style={{ margin: 0 }}>
                <b style={{ color: 'blue' }}>{dataSend?.CONTNO}</b>
              </Form.Item>
            </Col>
          </Form>
        </Row>
      ),
      content: 'กด OK เพื่อยืนยัน',
      onOk() {
        setLoading(true);
        setFormKey(prevKey => prevKey + 1);
        setFormKey2(prevKey => prevKey + 1);
        setFormKey3(prevKey => prevKey + 1);
        submitCCB();
      },
      onCancel() {
        setFormKey(prevKey => prevKey + 1);
        setFormKey2(prevKey => prevKey + 1);
        setFormKey3(prevKey => prevKey + 1);
        msCancel(api, "top");
      },
    });
  };
  const submitCCB = async () => {
    setFormKey2(prevKey => prevKey + 1);
    if (dataPay) {
      var mix = {
        cuscod: dataPay?.CUSCOD,
        contno: dataPay?.CONTNO,
        ccb: dataPay?.ccb,
        dok: dataPay?.mixDok,
        dokDaily: dataPay?.Dok,
        ton: dataPay?.mixTon,
        follow: dataPay?.followCCB,
        arothr: sum?.AROTHR,
        book: dataSend?.books,
        date: dataSend?.date,
        inputBy: "MIT00001",
        company: dataPay?.company,
        detail: dataPay?.detail,
        AROTHR: dataPay?.AROTHR,
        balanc: dataPay?.detail ? dataPay?.detail[0]?.BALANC : 0,
        smpay: dataPay?.detail ? dataPay?.detail[0]?.SMPAY : 0,
        ncshprc: dataPay?.detail ? dataPay?.detail[0]?.NCSHPRC : 0,
        npayres: dataPay?.detail ? dataPay?.detail[0]?.NPAYRES : 0,
        pat: dataSend?.pat,
      }
      console.log(mix)
      await axios.post(InsertPayamtCcb, mix)
        .then(async (res) => {
          console.log("res", res)
          if (res.status === 200) {
            setCheckDataInsert(true);
            setChangeItem(false);
            setTimeout(async () => {
              await handleSubmit()
              setLoading(false)
              msOK(api, "top")
            }, 1500)
          } else {
            setLoading(false)
            msErrorInst(api, "top")
          }
        })
        .catch((err) => {
          console.log("err", err)
          msError(api, "top")
          setLoading(false)
        })
    } else {
      msReceipt(api, "top")
      setLoading(false)
    }
  }

  const loadDataFindPAYTYP = async (value, value2, isClickedTy) => {
    // console.log("loadDataFindPAYTYP")
    if (value) {
      try {
        const response = await axios.post(FindPAYTYP, { textData: value, textData2: value2, isClickedTy: isClickedTy });
        if (response.status === 200) {
          console.log("response.data", response.data)
          return response.data;
        } else {
          return null;
        }
      } catch (error) {
        console.log("err", error);
        return null;
      }
    }
  };
  const handleSubmit = async () => { // ค้นหา
    // console.log(dataSend?.CONTNO, isClickedTy, dataSend.textData)
    setFormKey(prevKey => prevKey + 1);
    if (dataSend?.CONTNO !== "") {
      setCheckCt(false);
      setCheckDataInsert(false);
      setChangeItem(false);
      setCheckButton(1);
      setIsClicked(1);
      let sumAmt = 0;
      let sumFollow = 0;
      let sumAll = 0;
      let resultCalPayAROTHR = 0;
      let resultCalPayGRADE = 0;
      let resultCalPayHD = 0;
      setLoading(true)
      // await axios.post("http://localhost:8070/api-db2/load-payamt", dataSend)
      await axios.post(loadPayamtCcb, dataSend)
        .then(async (res) => {
          console.log("res", res)
          if (res.data?.AROTHR) {
            resultCalPayAROTHR = await calPayAROTHR(res.data.AROTHR);
            console.log("resultCalPayAROTHR", resultCalPayAROTHR)
          }
          if (res.data?.HDPAYMENT) {
            resultCalPayHD = await calPayHD(res.data?.HDPAYMENT[0]?.TOTAMT);
            console.log("resultCalPayHD", resultCalPayHD)
          }
          if (res.status === 200) {
            console.log("res.data load-payamt", res.data)
            // console.log(parseFloat(dataPay?.resLogCCB?.ccb) , dataPay?.ccb)
            setDataPay(res.data)
            if (res.data?.result && res.data?.ccb !== 0) {
              setDataTable(res.data.result)
              if (res.data?.flagTMPTELDEBT?.Flag === true) {
                resultCalPayGRADE = await calPayGRADE(res.data.result[0]?.GRDCOD, res.data.result[0]?.DUEAMT, res.data?.flagTMPTELDEBT.GRDCAL);
                console.log("resultCalPayGRADE", resultCalPayGRADE)
              }
              if (res.data.flagDue === false) {
                await res.data.result.forEach((item) => {
                  sumAmt += item.DUEAMT - item.PAYAMT;
                  sumFollow += item.FOLLOWAMT - item.PAYFOLLOW;
                });
                sumAll = sumAmt + sumFollow
                setSum({
                  sumAmt: sumAmt, sumFollow: sumFollow, sumAll: sumAll + resultCalPayAROTHR, sumMoney: dataSend.money + dataSend.sale + dataSend.saleFollow,
                  HDPAY: 0, amt: res.data.result[0]?.DUEAMT, nopay: res.data.result?.length, GRDCOD: res.data.result[0]?.GRDCOD,
                  AROTHR: resultCalPayAROTHR, HD: resultCalPayHD, payGRADE: resultCalPayGRADE, flagTMPTELDEBT: res.data?.flagTMPTELDEBT?.Flag,
                  flagCutTon: res.data.flagCutTon,
                  // tonKongCCB: 0, dokCCB: 0, followCCB: 0,
                })
              } else {
                setSum({
                  sumAmt: 0, sumFollow: 0, sumAll: 0, sumMoney: dataSend.money + dataSend.sale + dataSend.saleFollow,
                  HDPAY: 0, amt: res.data.result[0]?.DUEAMT, nopay: 0, GRDCOD: res.data.result[0]?.GRDCOD,
                  AROTHR: resultCalPayAROTHR, HD: resultCalPayHD, payGRADE: resultCalPayGRADE, flagTMPTELDEBT: res.data?.flagTMPTELDEBT?.Flag,
                  flagCutTon: res.data.flagCutTon,
                })
                if (res.data.ccb <= 0) {
                  setCheckCt(true)
                }
              }
              // console.log("sumAmt", sumAmt)
              // console.log("sumFollow", sumFollow)
            } else {
              setDataTable([])
              setCheckCt(true)
              setSum({
                sumAmt: 0, sumFollow: 0, sumAll: 0, sumMoney: dataSend.money + dataSend.sale + dataSend.saleFollow,
                HDPAY: 0, amt: 0, nopay: 0, GRDCOD: "", AROTHR: 0, HD: 0, payGRADE: 0, flagTMPTELDEBT: null,
                flagCutTon: res.data.flagCutTon,
              })
            }
          } else if (res.status === 201) {
            console.log("res.data", res.data)
            setCheckCt(true)
            setDataPay(null)
            setDataTable([])
            setSum({
              sumAmt: 0, sumFollow: 0, sumAll: 0, sumMoney: dataSend.money + dataSend.sale + dataSend.saleFollow,
              HDPAY: 0, amt: 0, nopay: 0, GRDCOD: "", AROTHR: 0, HD: 0, payGRADE: 0, flagTMPTELDEBT: null,
              flagCutTon: false,
            })
            msDue(api, "top")
          } else {
            setCheckCt(true)
            setDataPay(null)
            setDataTable([])
            setSum({
              sumAmt: 0, sumFollow: 0, sumAll: 0, sumMoney: dataSend.money + dataSend.sale + dataSend.saleFollow,
              HDPAY: 0, amt: 0, nopay: 0, GRDCOD: "", AROTHR: 0, HD: 0, payGRADE: 0,
              flagCutTon: false,
            })
            msConnt(api, "top")
          }
          setTimeout(() => {
            setDataHDPAYMENT(res.data?.HDPAYMENT)
            setDataAROTHR(res.data?.AROTHR)
            setDataSend({ ...dataSend, money: 0, TOTAMT: 0, sale: 0, saleFollow: 0, payType: "จ่ายเข้าตารางดิว", PAYCODE: "01", selectPay: 1, MEMO1: res.data?.MEMO1, book: false, books: 0, pat: 200, })
            setCalData({ ALLPAYAMT: 0, ALLPAYFOLLOW: 0, ALLPAYINTEFF: 0, ALLPAYTON: 0, ALLCAL: 0, text: "" })
            form2.setFieldsValue({
              money: "",
              sale: "",
              saleFollow: "",
              PAYCODE: "01",
              selectPay: 1,
              book: false,
            });
            setLoading(false);
          }, 1000);
        })
        .catch((err) => {
          console.log("err", err)
          clearData(0)
          msData(api, "top")
          setLoading(false)
        })
    } else if (isClickedTy === 2 || isClickedTy === 3 || isClickedTy === 4) {
      if (dataSend.textData !== "") {
        setLoading(true)
        try {
          const results = await loadDataFindPAYTYP(dataSend.textData, dataSend.textData2, isClickedTy);
          if (!results) {
            msData(api, "top")
            setFindPAYTYP([])
          } else {
            setFindPAYTYP(results)
          }
        } catch (error) {
          console.error("Error in loadData: ", error);
          msData(api, "top")
          setFindPAYTYP([])
        } finally {
          setCheckCt(true)
          setDataPay(null)
          setSum({
            sumAmt: 0, sumFollow: 0, sumAll: 0, sumMoney: dataSend.money + dataSend.sale + dataSend.saleFollow,
            HDPAY: 0, amt: 0, nopay: 0, GRDCOD: "", AROTHR: 0, HD: 0, payGRADE: 0,
            flagCutTon: false,
          })
          setDataHDPAYMENT()
          setDataAROTHR()
          setDataSend({ ...dataSend, money: 0, TOTAMT: 0, sale: 0, saleFollow: 0, date: currentDateTime, payType: "จ่ายเข้าตารางดิว", PAYCODE: "01", selectPay: 1, MEMO1: "", book: false, books: 0, pat: 200, })
          setCalData({ ALLPAYAMT: 0, ALLPAYFOLLOW: 0, ALLPAYINTEFF: 0, ALLPAYTON: 0, ALLCAL: 0, text: "" })
          form.setFieldsValue({ date: currentDateTime });
          form2.setFieldsValue({
            money: "",
            sale: "",
            saleFollow: "",
            PAYCODE: "01",
            selectPay: 1,
            book: false,
          });
          setLoading(false);
        }
      }
    } else {
      msConnt(api, "top")
    }
  }
  const showConfirmClear = () => {
    confirm({
      title: 'คุณต้องการที่ล้างข้อมูลนี้ใช่หรือไม่ ?',
      content: 'กด OK เพื่อยืนยัน',
      onOk() {
        // setLoading(true)
        clearData(0)
      },
      onCancel() {
        msCancel(api, "top")
      },
    });
  }
  const clearData = async (value) => {
    setLoading(true);
    console.log("clearData", value)
    if (value > 0) {
      setIsClickedTy(value)
      form.setFieldsValue({ CONTNO: "", textData: "", textData2: "", searchPay: value, date: currentDateTime })
    } else {
      setIsClickedTy(1)
      form.setFieldsValue({ CONTNO: "", textData: "", textData2: "", searchPay: 1, date: currentDateTime })
    }
    form2.setFieldsValue({
      selectPay: "ปกติ",
      money: "",
      sale: "",
      saleFollow: "",
      PAYCODE: "01",
      book: false,
    });
    form3.setFieldsValue({ codeQ: "", codeCCB: "" })
    setTimeout(() => {
      setIsClicked(1);
      // setIsClickedTy(1);
      setFindPAYTYP([])
      setCheckDataInsert(false);
      setChangeItem(true);
      setCheckButton(1);
      setCheckCt(true);
      setDataSend({ textData: "", textData2: "", CONTNO: "", money: 0, TOTAMT: 0, sale: 0, saleFollow: 0, date: currentDateTime, payType: "จ่ายเข้าตารางดิว", PAYCODE: "01", selectPay: 1, MEMO1: "", book: false, books: 0, pat: 200, });
      setDataHDPAYMENT([]);
      setDataAROTHR([]);
      setDataPay(null);
      setDataTable([]);
      setCalData({ ALLPAYAMT: 0, ALLPAYFOLLOW: 0, ALLPAYINTEFF: 0, ALLPAYTON: 0, ALLCAL: 0, text: "" });
      setSum({ sumAmt: 0, sumFollow: 0, sumAll: 0, sumMoney: dataSend.money + dataSend.sale + dataSend.saleFollow, HDPAY: 0, amt: 0, nopay: 0, GRDCOD: "", AROTHR: 0, HD: 0, payGRADE: 0, flagTMPTELDEBT: null, flagCutTon: false, });
      setLoading(false);
    }, 1000);
  }


  return (
    <Card style={{ height: '100%' }}>
      <Row style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Spin spinning={loading} size='large' tip="Loading...">
            <Col span={24}>
              <div className='text-center'>
                <h2>ขออนุมัติยอดปิดบัญชี</h2>
              </div>
              <div className='text-right'>
                <Space>
                  {/* <Button onClick={exportToExcel}>Export to Excel</Button> */}
                  {/* <Button disabled={!dataAll} type='primary' onClick={showConfirm} >บันทึกข้อมูล</Button> */}
                </Space>
              </div>
            </Col>
            {/* <Col span={24} style={{ textAlign: 'right' }}>
              </Col> */}
            <Divider />
            <Row gutter={32} justify={'center'}>
              <Col span={8}>
                <Card title="รายละเอียดสัญญา" bordered={false}>
                  <Form
                    form={form}
                    key={formKey}
                    onFinish={handleSubmit}
                  >
                    <Form.Item label="วันที่" name="date" style={{ height: '30px', width: '100%' }}>
                      <DatePicker format={'YYYY-MM-DD'}
                        // disabled
                        defaultValue={dataSend?.date}
                        style={{ height: '40px', width: '100%' }}
                        onChange={(e) => { onChangeTime(e) }} />
                    </Form.Item>
                    <Form.Item label="" name="tt" style={{ height: '30px', width: '100%' }}>
                      <b style={{ fontSize: '14px', color: 'red' }}>{"*** วันที่ใช้ในการประมวลผลยอดปิด ***"}</b>
                    </Form.Item>
                    <Form.Item label="ค้นหาจาก" name="searchPay">
                      <Select
                        style={{ width: '100%', height: '40px' }}
                        defaultValue={isClickedTy}
                        onChange={clearData}
                        options={optionsSearchPay}
                      />
                    </Form.Item>
                    {/* <Form.Item label="" style={{ height: '30px', width: '100%' }}></Form.Item> */}
                    {/* </Space> */}
                    {/* <Space> */}
                    {
                      isClickedTy === 1 ?
                        <Form.Item label="เลขสัญญา" name="CONTNO" style={{ height: '30px', width: '100%' }}>
                          <Input onChange={(e) => handleCONTNO(e, 0)}></Input>
                        </Form.Item>
                        :
                        <>
                          {
                            isClickedTy === 3 ?
                              <>
                                <Form.Item label="ชื่อ-สกุล" name="textData" style={{ height: '30px', width: '100%' }}
                                  rules={[{ required: true, message: 'กรุณากรอกชื่อ-สกุล !' },]}
                                >
                                  <Input onChange={(e) => handleCONTNO(e, 31)}></Input>
                                </Form.Item>
                                <Form.Item label="" name="snam" style={{ height: '30px', width: '100%' }}>
                                  <b style={{ fontSize: '14px', color: 'red' }}>{"***ไม่จำเป็นต้องใส่คำนำหน้าชื่อ***"}</b>
                                </Form.Item>
                              </>
                              :
                              <Form.Item label="ข้อความ" name="textData" style={{ height: '30px', width: '100%' }}>
                                <Input onChange={(e) => handleCONTNO(e, 0)}></Input>
                              </Form.Item>
                          }
                          {
                            findPAYTYP?.length > 0 ?
                              <Form.Item label="เลือกสัญญา" name="CONTNO">
                                <Select
                                  showSearch
                                  style={{ width: '100%', height: '40px' }}
                                  onChange={handleSelectCONTNO}
                                  optionFilterProp="children"
                                  placeholder="Search to Select"
                                  filterOption={(inputValue, option) =>
                                    option.children.join('').toLowerCase().includes(inputValue.toLowerCase())
                                  }
                                >
                                  {findPAYTYP?.map((e) => {
                                    return (
                                      <Select.Option key={e.keyId} value={e.CONTNO}>
                                        {e.CONTNO} (ทะเบียน {e.REGNO}) (ชื่อ {e.NAME1} {e.NAME2})
                                        {/* ({e.PAYDESC}) */}
                                      </Select.Option>
                                    )
                                  })}
                                </Select>
                              </Form.Item>
                              : null
                          }
                        </>
                    }
                    {/* </Space> */}
                    <Space>
                      <Form.Item label="" style={{ height: '30px', width: '100%', margin: '10px' }}>
                        <Button disabled={loading} type='primary' htmlType="submit" >ตกลง</Button>
                        {/* <Button disabled={loading} type='primary' onClick={handleSubmit} >ค้นหา</Button> */}
                      </Form.Item>
                      <Form.Item label="" style={{ height: '30px', width: '100%', margin: '10px' }}>
                        <Button disabled={loading} onClick={showConfirmClear} >Clear</Button>
                      </Form.Item>
                    </Space>
                    <Divider />
                    <Card style={{ borderColor: '#000000', marginTop: '5px' }}>
                      <Row gutter={32} justify={"center"} align="middle">
                        <Col span={16}>
                          {/* <Form.Item label="ลูกหนี้อื่นๆ" style={{ margin: 0 }}>
                                                      <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(sum?.AROTHR)}</b>
                                                      <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                                  </Form.Item> */}
                          <Form.Item label="รับฝาก" style={{ margin: 0 }}>
                            <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(sum?.HD)}</b>
                            <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                    <Divider />
                    <Row gutter={32} justify={"center"}>
                      <Col>
                        <Space>
                          <Form.Item label="เกรด" style={{ marginRight: 10 }}>
                            <b style={{ fontSize: '18px', color: 'red' }}>{sum?.GRDCOD}</b>
                          </Form.Item>
                          <Form.Item label="ค่างวด" style={{ marginLeft: 10 }}>
                            <b style={{ fontSize: '18px', color: 'red' }}>{currencyFormatOne(sum?.amt)}</b>
                            <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                          </Form.Item>
                        </Space>
                        {
                          sum?.payGRADE > 0 ?
                            <>
                              <Form.Item label="ชำระขั้นต่ำ" style={{ margin: 0 }}>
                                <b style={{ fontSize: '18px', color: 'red' }}>{currencyFormatOne(sum?.payGRADE)}</b>
                                <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                              </Form.Item>
                            </> : null
                        }
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={32} justify={"center"}>
                      <Col span={16}>
                        <Form.Item label="ค้างค่างวด" style={{ margin: 0 }}>
                          <b style={{ fontSize: '14px', }}>{currencyFormatOne(sum?.sumAmt)}</b>
                          <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                        </Form.Item>
                        <Form.Item label="ค้างกี่งวด" style={{ margin: 0 }}>
                          <b style={{ fontSize: '14px', }}>{currencyFormat(sum?.nopay)}</b>
                          <span style={{ display: 'inline-block', marginLeft: '10px' }}> งวด</span>
                        </Form.Item>
                        <Form.Item label="ค้างค่าทวงถาม" style={{ margin: 0 }}>
                          <b style={{ fontSize: '14px', }}>{currencyFormatOne(sum?.sumFollow)}</b>
                          <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                        </Form.Item>
                        <Form.Item label="รวมยอดค้าง" style={{ margin: 0 }}>
                          <b style={{ fontSize: '14px', }}>{currencyFormatOne(sum?.sumAll)}</b>
                          <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form >
                </Card>
              </Col>
              <Col span={8}>
                <Card title="รายละเอียดการชำระ" bordered={false}>
                  <Form
                    form={form2}
                    key={formKey2}
                    onFinish={showConfirm}
                  >
                    {
                      calData?.ccb > 0 || dataPay?.ccb > 0 ?
                        <>
                          <Card style={{ borderColor: '#000000', margin: 0 }}>
                            <Row gutter={32} justify={"center"} align="middle">
                              <Col span={16}>
                                <Form.Item label="" name="book" valuePropName="checked" style={{ margin: 0 }}>
                                  <Checkbox
                                    style={{ fontSize: '16px' }}
                                    onChange={onChangeBook}
                                  >ค่าเร่งเล่ม
                                  </Checkbox>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                          <Divider />
                          {
                            dataSend?.book === true ?
                              <Card style={{ borderColor: '#000000', margin: 10 }}>
                                <Row gutter={32} justify={"center"} align="middle">
                                  <Col span={16}>
                                    <Form.Item label="ค่าเร่งเล่ม" style={{ margin: 0 }}>
                                      <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(dataSend?.books)}</b>
                                      <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                              :
                              < Card style={{ borderColor: '#000000', margin: 10 }}>
                                <Row gutter={32} justify={"center"} align="middle">
                                  <Col span={16}>
                                    <Form.Item label="ไถ่ถอนกรมพัฒน์ฯ" style={{ margin: 0 }}>
                                      <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(dataSend?.pat)}</b>
                                      <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                          }
                          <Card style={{ borderColor: '#000000', margin: 10 }}>
                            <Row gutter={32} justify={"center"} align="middle">
                              <Col span={16}>
                                <Form.Item label="ดอกเบี้ยรายวัน" style={{ margin: 0 }}>
                                  <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(dataPay?.Dok)}</b>
                                  <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                </Form.Item>
                                <Form.Item label="ดอกเบี้ยตารางดิว" style={{ margin: 0 }}>
                                  <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(dataPay?.dokDue)}</b>
                                  <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                          {
                            sum?.AROTHR > 0 ?
                              <Card style={{ borderColor: '#000000', margin: 10 }}>
                                <Row gutter={32} justify={"center"} align="middle">
                                  <Col span={16}>
                                    <Form.Item label="ลูกหนี้อื่นๆ" style={{ margin: 0 }}>
                                      <b style={{ fontSize: '16px', color: 'red' }}>{currencyFormatOne(sum?.AROTHR)}</b>
                                      <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                              : null
                          }
                          <Card style={{ borderColor: '#000000', margin: 10 }}>
                            <Row gutter={32} justify={"center"} align="middle">
                              <Col span={16}>
                                <Form.Item label="ต้นคงเหลือ" style={{ margin: 0 }}>
                                  <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(dataPay?.mixTon)}</b>
                                  <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                </Form.Item>
                                <Form.Item label="ดอกเบี้ย" style={{ margin: 0 }}>
                                  <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(dataPay?.mixDok)}</b>
                                  <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                </Form.Item>
                                <Form.Item label="ค่าทวงถาม" style={{ margin: 0 }}>
                                  <b style={{ fontSize: '14px', color: 'red' }}>{currencyFormatOne(dataPay?.followCCB)}</b>
                                  <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                </Form.Item>
                                <Divider />
                                <Form.Item label="ยอดปิด" style={{ margin: 0 }}>
                                  <b style={{ fontSize: '16px', color: 'red' }}>{currencyFormatOne(dataPay?.ccb + sum?.AROTHR + dataSend?.books + dataSend?.pat)}</b>
                                  <span style={{ display: 'inline-block', marginLeft: '10px' }}> บาท</span>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                          <Form.Item label="" style={{ height: '30px', width: '100%', margin: '10px' }}>
                            <Button disabled={loading || checkDataInsert || changeItem || !dataPay} type='primary' htmlType="submit" >บันทึกข้อมูล</Button>
                          </Form.Item>
                        </>
                        : dataPay?.ccb === 0 ?
                          <b><div style={{ margin: 0, fontSize: '20px', color: 'red' }}>** สัญญาน่าจะปิดแล้ว  **</div></b>
                          : null
                    }
                    <Divider />
                  </Form >
                </Card>
              </Col>
              <Col span={8}>
                <Card title="รายละเอียดยอดปิดที่บันทึก" bordered={false}>
                  <Form form={form3} key={formKey3}>
                    <Row gutter={32} justify={"center"}>
                      <Col span={32}>
                        {
                          !dataPay?.resLogCCB ?
                            <Space size="middle">
                              <b style={{ fontSize: '14px', color: 'red' }}>*** ยังไม่มีข้อมูลขอยอดปิด ***</b>
                              <Button disabled style={{ background: '#00FF00' }} >รายละเอียดยอดปิดที่บันทึก</Button>
                            </Space>
                            :
                            <>
                              <Space size="middle">
                                <b style={{ fontSize: '14px', color: 'red' }}>*** มีข้อมูลขอยอดปิด ***</b>
                                <Button disabled={loading} style={{ background: '#00FF00' }} onClick={handleCCB} >รายละเอียดยอดปิดที่บันทึก</Button>
                              </Space>
                              {/* {
                                parseFloat(dataPay?.resLogCCB?.ccb) !== dataPay?.ccb ?
                                  <>
                                    <Divider />
                                    <Form.Item label="" style={{ height: '30px', width: '100%', margin: '10px' }}>
                                      <b style={{ fontSize: '14px', color: 'red' }}>** ยอดมีการเปลี่ยนแปลง **</b>
                                      <span style={{ display: 'inline-block', marginLeft: '10px' }}></span>
                                    </Form.Item>
                                  </>
                                  : null
                              } */}
                            </>
                        }
                      </Col>
                    </Row>
                  </Form >
                </Card>
                <Divider />
                <Card title="โน๊ต" bordered={false}>
                  <Form form={form3}
                    key={formKey3}
                  // onFinish={handleSubmitMemo}
                  >
                    <Row gutter={32} justify={"center"}>
                      <Col span={32}>
                        <Form.Item label="" style={{ margin: 0 }}>
                          <TextArea
                            rows={12} // ขยายความสูงให้แสดงบรรทัดมากขึ้น
                            cols={60} // ขยายความกว้างให้กว้างขึ้น
                            type='text'
                            disabled={checkCt}
                            value={dataSend?.MEMO1 || ""}
                            onChange={(e) => handleMEMO1(e.target.value)}
                          />
                        </Form.Item>
                        <Button disabled={checkCt} type='primary' htmlType="submit" style={{ margin: 10 }} onClick={handleSubmitMemo} >บันทึกโน๊ต</Button>
                      </Col>
                    </Row>
                  </Form >
                </Card>
              </Col>
            </Row>
            <Divider />
            <Col span={24}>
              <div className='text-right'>
                <Space>
                  <Button onClick={() => buttonAmt(1)} style={{ background: isClicked === 1 ? '#00FF00' : 'white' }}>ตารางค่างวด</Button>
                  <Button onClick={() => buttonAmt(3)} style={{ background: isClicked === 3 ? '#00FF00' : 'white' }}>ตารางรับฝาก</Button>
                  <Button onClick={() => buttonAmt(4)} style={{ background: isClicked === 4 ? '#00FF00' : 'white' }}>ตารางลูกหนี้อื่นๆ</Button>
                </Space>
              </div>
            </Col>
            {
              checkButton === 1 ?
                <Table
                  rowKey={(record) => record.uid}
                  dataSource={dataTable}
                  columns={columns}
                  scroll={{
                    x: 1500,
                    y: 400,
                  }}
                  style={{ padding: 20 }}
                >
                </Table>
                : checkButton === 3 ?
                  <Table
                    rowKey={(record) => record.uid}
                    dataSource={dataHDPAYMENT}
                    columns={columnsHDPAYMENT}
                    scroll={{
                      x: 1500,
                      y: 400,
                    }}
                    style={{ padding: 20 }}
                  >
                  </Table>
                  : checkButton === 4 ?
                    <Table
                      rowKey={(record) => record.uid}
                      dataSource={dataAROTHR}
                      columns={columnsAROTHR}
                      scroll={{
                        x: 1500,
                        y: 400,
                      }}
                      style={{ padding: 20 }}
                    >
                    </Table>
                    : <><Divider />*** ไม่พบข้อมูล ***<Divider /></>
            }
          </Spin>
        </Col>
      </Row >
      {contextHolder}
      {
        isModalInfoCCB ?
          <DetailCcb
            open={isModalInfoCCB}
            close={setIsModalInfoCCB}
            dataPost={dataPay?.resLogCCB}
          />
          : null
      }
    </Card >
  )
}

const MainClosingBalance = MotionHoc(Main);
export default MainClosingBalance;
