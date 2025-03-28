import React, { useState, useEffect } from 'react'
import { Typography, Divider, Row, Col, Image, Card, Form } from "antd";
import dayjs from "dayjs";
import "./PrintCcb.css";
import OneLeasingImage from './ONELeasing_transparent.png';
import Background from './ONELeasing_Watermark.png';
const { Text } = Typography;


export default function PrintCcb({ dataPost }) {
    const [form] = Form.useForm()
    const [mainData, setMainData] = useState();
    const [urlLink, setUrlLink] = useState({ url1: "", url2: "" }); // 1.ชำระผ่านธนาคาร 2.ชำระผ่านเค้าน์เตอร์เซอร์วิส
    const currentDate = dayjs().format("DD/MM/YYYY");
    const QRCODE_URL = "https://apimobile-539174983798.asia-southeast1.run.app";

    useEffect(() => {
        setMainData(dataPost)
        if (dataPost?.detail?.length > 0 && dataPost?.detail[0]?.CODE !== "") {
            let sumAmount = parseFloat(dataPost?.ton) + parseFloat(dataPost?.dok) + parseFloat(dataPost?.follow) + parseFloat(dataPost?.arothr) + parseFloat(dataPost?.book) + parseFloat(dataPost?.pat)
            const url1 = QRCODE_URL + "/loans/qr/0405559001925/00/006/" + dataPost?.detail[0]?.CODE + "/" + sumAmount * 100;
            const url2 = QRCODE_URL + "/loans/qr/0405552000435/00/006/" + dataPost?.detail[0]?.CODE + "/" + sumAmount * 100;
            // console.log("url1 :", url1)
            // console.log("url2 :", url2)
            setUrlLink({ url1: url1, url2: url2 });
        }
        // console.log("PrintCcb :", dataPost)
    }, [dataPost])

    const currencyFormatOne = (amount) => {
        return Number(amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    // ข้อมูลตารางลูกหนี้อื่นๆ
    // const columns = [
    //     {
    //         title: "เลขเอกสาร", dataIndex: "ARCONT", key: "ARCONT",
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <>{record.ARCONT}</>
    //             </Space>
    //         ),
    //     },
    //     {
    //         title: "วันที่", dataIndex: "INPDT", key: "INPDT",
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <>{dayjs(record.INPDT).format("DD/MM/YYYY")}</>
    //             </Space>
    //         ),
    //     },
    //     {
    //         title: "รายละเอียด", dataIndex: "FORCODE", key: "FORCODE",
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <>{record.FORCODE} {record.FORDESC}</>
    //             </Space>
    //         ),
    //     },
    //     {
    //         title: "จำนวนเงิน", dataIndex: "PAYAMT", key: "PAYAMT",
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <>{currencyFormatOne(record.PAYAMT)}</>
    //             </Space>
    //         ),
    //     },
    //     {
    //         title: "ชำระแล้ว", dataIndex: "SMPAY", key: "SMPAY",
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <>{currencyFormatOne(record.SMPAY)}</>
    //             </Space>
    //         ),
    //     },
    //     {
    //         title: "ลูกหนี้คงเหลือ", dataIndex: "all", key: "all",
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <>{currencyFormatOne(record.PAYAMT - record.SMPAY)}</>
    //             </Space>
    //         ),
    //     },
    // ];

    return (
        <div className="print-container">
            <Card style={{
                backgroundImage: `url(${Background})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }} >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 12,
                    }}
                    wrapperCol={{
                        span: 12,
                    }}>

                    {/* Header */}
                    <Row gutter={32} justify={"center"}>
                        <b style={{ fontSize: "16px" }}>ใบขออนุมัติยอดปิดบัญชี</b>
                    </Row>
                    <Col>
                        <Row justify="space-between" style={{ fontSize: "12px", margin: "1px" }}>
                            <Col></Col>
                            <Col><div style={{ fontSize: '12px', color: 'black' }} >วันที่พิมพ์: {currentDate}</div></Col>
                        </Row>
                        <Row justify="space-between" style={{ fontSize: "12px", margin: "1px" }}>
                            <Col></Col>
                            <Col><div style={{ fontSize: '12px', color: 'black' }} >วันที่ขอ: {dayjs(mainData?.inputDate).format("DD/MM/YYYY")}</div></Col>
                        </Row>
                        <Row justify="space-between" style={{ fontSize: "12px", margin: "1px" }}>
                            <Col></Col>
                            <Col>
                                <div style={{ fontSize: '12px', color: 'black' }} >
                                    <b style={{ color: "red", fontSize: "12px", textDecoration: "underline", }}>
                                        ใบนี้หมดอายุวันที่: {dayjs(mainData?.inputDate).add(7, "day").format("DD/MM/YYYY")}
                                    </b>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {
                        mainData?.company?.length > 0 ?
                            <>
                                <Row style={{ fontSize: "12px" }}>
                                    <Col span={18} push={6}>
                                        <Form.Item label="" style={{ margin: 0 }}>
                                            <div style={{ fontSize: '12px', color: 'black' }} >{mainData?.company[0]?.COMP_NM}</div>
                                        </Form.Item>
                                        <Form.Item label="" style={{ margin: 0 }}>
                                            <div style={{ fontSize: '12px', color: 'black' }} >{mainData?.company[0]?.COMP_ADR1}</div>
                                        </Form.Item>
                                        <Form.Item label="" style={{ margin: 0 }}>
                                            <div style={{ fontSize: '12px', color: 'black' }} >{mainData?.company[0]?.TELP}</div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} pull={18}>
                                        <Image
                                            style={{ width: '150px', height: '100px' }}
                                            src={OneLeasingImage}
                                            alt="My Image"
                                        />
                                    </Col>
                                </Row>
                            </> : <><Divider orientation="center"><b style={{ fontSize: "12px" }}>*** ไม่พบข้อมูล ***</b></Divider></>
                    }
                    {/* <Divider /> */}
                    {
                        mainData ?
                            <>
                                {
                                    mainData?.detail?.length > 0 ?
                                        <>
                                            {/* ข้อมูลลูกค้า */}
                                            <Divider orientation="left"><b style={{ fontSize: "14px" }}>ข้อมูลลูกค้า</b></Divider>
                                            <Row style={{ fontSize: "12px", border: "1px solid black", padding: "10px", borderRadius: "8px" }}>
                                                <Col span={12}>
                                                    <Form.Item label={<b style={{ fontSize: "12px" }}>ชื่อลูกค้า</b>} style={{ margin: 0 }}>
                                                        <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.NAME}</div>
                                                    </Form.Item>
                                                    <Form.Item label={<b style={{ fontSize: "12px" }}>ที่อยู่</b>} style={{ margin: 0 }}>
                                                        <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.ADDRES}
                                                            {mainData?.detail[0]?.TUMB + ' '}
                                                            {mainData?.detail[0]?.AUMP + ' '}
                                                            {mainData?.detail[0]?.PROVDES + ' '}
                                                            {mainData?.detail[0]?.ZIP}</div>
                                                    </Form.Item>
                                                    <Form.Item label={<b style={{ fontSize: "12px" }}>เบอร์ติดต่อ</b>} style={{ margin: 0 }}>
                                                        <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.TELP}</div>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label={<b style={{ fontSize: "12px" }}>เลขที่สัญญา</b>} style={{ margin: 0 }}>
                                                        <div style={{ fontSize: '12px', color: 'red' }}>{mainData?.contno}</div>
                                                    </Form.Item>
                                                    <Form.Item label={<b style={{ fontSize: "12px" }}>วันที่ทำสัญญา</b>} style={{ margin: 0 }}>
                                                        <div style={{ fontSize: '12px', color: 'black' }}>{dayjs(mainData?.detail[0]?.SDATE).format("DD/MM/YYYY")}</div>
                                                    </Form.Item>
                                                </Col>
                                                {/* </Col>
                                                <Col span={12}> */}
                                                {/* <Form.Item label={<b style={{ fontSize: "12px" }}>เลขที่สัญญา</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'red' }}>{mainData?.contno}</div>
                                                </Form.Item> */}
                                                {/* </Col>
                                                <Col span={12}> */}
                                                {/* <Form.Item label={<b style={{ fontSize: "12px" }}>ที่อยู่</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}><div style={{ margin: 5 }}>{mainData?.detail[0]?.ADDRES}</div>
                                                        <div style={{ margin: 5 }}>{mainData?.detail[0]?.TUMB + ' '}
                                                            {mainData?.detail[0]?.AUMP + ' '}
                                                            {mainData?.detail[0]?.PROVDES + ' '}</div>
                                                        <div style={{ margin: 5 }}>{mainData?.detail[0]?.ZIP}</div></div>
                                                </Form.Item> */}
                                                {/* </Col>
                                                <Col span={12}> */}
                                                {/* <Form.Item label={<b style={{ fontSize: "12px" }}>วันที่ทำสัญญา</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{dayjs(mainData?.detail[0]?.SDATE).format("DD/MM/YYYY")}</div>
                                                </Form.Item> */}
                                                {/* </Col>
                                                <Col span={12}> */}
                                                {/* <Form.Item label={<b style={{ fontSize: "12px" }}>เบอร์ติดต่อ</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.TELP}</div>
                                                </Form.Item> */}
                                                {/* </Col> */}
                                            </Row>
                                            {/* <Divider /> */}
                                        </> : <><Divider orientation="center"><b style={{ fontSize: "12px" }}>*** ไม่พบข้อมูล ***</b></Divider></>
                                }
                                <Row gutter={[16, 8]} style={{ fontSize: "12px" }}>

                                    {
                                        mainData?.detail?.length > 0 ?
                                            <>
                                                {/* ข้อมูลสินค้า */}
                                                <Col span={11}>
                                                    <Divider orientation="left"><b style={{ fontSize: "14px" }}>ข้อมูลสัญญา</b></Divider>
                                                    <Row gutter={[16, 8]} style={{ fontSize: "12px", height: "400px", border: "1px solid black", padding: "10px", borderRadius: "8px" }}>
                                                        <Col span={24}>
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>สาขา</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'red' }}>{mainData?.locat}</div>
                                                            </Form.Item>
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>ยี่ห้อ</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.TYPE ? mainData?.detail[0]?.TYPE : null}</div>
                                                            </Form.Item>
                                                            {/* </Col>
                                                        <Col span={24}> */}
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>ทะเบียน/เลขที่ดิน</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>
                                                                    <>{mainData?.detail[0]?.REGNO ? mainData?.detail[0]?.REGNO + ' ' : null}</>
                                                                    <>{mainData?.detail[0]?.DORECV ? mainData?.detail[0]?.DORECV : null}</>
                                                                </div>
                                                            </Form.Item>
                                                            {/* </Col>
                                                        <Col span={24}> */}
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>รุ่น</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.MODEL ? mainData?.detail[0]?.MODEL : null}</div>
                                                            </Form.Item>
                                                            {/* </Col>
                                                        <Col span={24}> */}
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>เลขตัวถัง/เลขโฉนด</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.STRNO ? mainData?.detail[0]?.STRNO : null}</div>
                                                            </Form.Item>
                                                            {/* </Col>
                                                        <Col span={24}> */}
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>สี</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.COLOR ? mainData?.detail[0]?.COLOR : null}</div>
                                                            </Form.Item>
                                                            {/* </Col>
                                                        <Col span={24}> */}
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>เลขเครื่อง</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>{mainData?.detail[0]?.ENGNO ? mainData?.detail[0]?.ENGNO : null}</div>
                                                            </Form.Item>
                                                            {/* --- */}
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>ยอดเงินกู้ยืม</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.ncshprc)}</div>
                                                            </Form.Item>
                                                            <Form.Item label={<b style={{ fontSize: "12px" }}>ชำระเงินต้นแล้ว</b>} style={{ margin: 0 }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.npayres)}</div>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {/* <Divider /> */}
                                            </> : <><Divider orientation="center"><b style={{ fontSize: "12px" }}>*** ไม่พบข้อมูล ***</b></Divider></>
                                    }
                                    <Col span={1}></Col>
                                    {/* รายละเอียดการชำระ */}
                                    <Col span={12}>
                                        <Divider orientation="left"><b style={{ fontSize: "14px" }}>รายละเอียดการชำระ</b></Divider>
                                        <Row gutter={[16, 8]} style={{ fontSize: "12px", height: "400px", border: "1px solid black", padding: "10px", borderRadius: "8px" }}>
                                            <Col span={24}>
                                                {/* <Form.Item label={<b>ยอดเงินกู้ยืม</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.ncshprc)}</div>
                                                </Form.Item> */}
                                                {/* </Col>
                                            <Col span={24}> */}
                                                <Form.Item label={<b style={{ fontSize: "12px" }}>เงินต้นคงเหลือ</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.ton)}</div>
                                                </Form.Item>
                                                {/* </Col>
                                            <Col span={24}> */}
                                                {/* <Form.Item label={<b>ชำระเงินแล้ว</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.npayres)}</div>
                                                </Form.Item> */}
                                                {/* </Col>
                                            <Col span={24}> */}
                                                <Form.Item label={<b style={{ fontSize: "12px" }}>ดอกเบี้ย</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.dok)}</div>
                                                </Form.Item>
                                                {/* </Col>
                                            <Col span={24}> */}
                                                {
                                                    mainData?.book > 0 ?
                                                        <Form.Item label={<b style={{ fontSize: "12px" }}>ค่าธรรมเนียมเร่งเล่ม</b>} style={{ margin: 0 }}>
                                                            <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.book)}</div>
                                                        </Form.Item>
                                                        :
                                                        <Form.Item label={<b style={{ fontSize: "12px" }}>ไถ่ถอนกรมพัฒน์ฯ</b>} style={{ margin: 0 }}>
                                                            <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.pat)}</div>
                                                        </Form.Item>
                                                }
                                                {/* </Col>
                                            <Col span={24}> */}
                                                <Form.Item label={<b style={{ fontSize: "12px" }}>ค้างค่าธรรมเนียมล่าช้า</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.follow)}</div>
                                                </Form.Item>
                                                {/* </Col>
                                            <Col span={24}> */}
                                                <Form.Item label={<b style={{ fontSize: "12px" }}>ลูกหนี้อื่นๆ</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(mainData?.arothr)}</div>
                                                </Form.Item>
                                                {/* </Col>
                                            <Col span={24}> */}
                                                <Form.Item label={<b style={{ fontSize: "12px" }}>ส่วนลด</b>} style={{ margin: 0 }}>
                                                    <div style={{ fontSize: '12px', color: 'black' }}>{currencyFormatOne(0)}</div>
                                                </Form.Item>
                                                {/* </Col>
                                            <Col span={24}></Col>
                                            <Col span={24}> */}
                                                <Form.Item label={<b style={{ fontSize: "14px" }}>รวมยอดที่ลูกค้าต้องจ่าย</b>} style={{ margin: 0 }}>
                                                    <b style={{ color: "red", fontSize: "16px", textDecoration: "underline", }}>
                                                        {currencyFormatOne(parseFloat(dataPost?.ton) + parseFloat(dataPost?.dok) + parseFloat(dataPost?.follow) + parseFloat(dataPost?.arothr) + parseFloat(dataPost?.book) + parseFloat(dataPost?.pat))}
                                                    </b>
                                                </Form.Item>
                                                {/* QRCode สำหรับจ่าย */}
                                                <Divider orientation="center"><b style={{ fontSize: "12px" }}>** QRCode สำหรับจ่ายเงิน **</b></Divider>
                                                <Row gutter={[16, 8]} justify="center">
                                                    {
                                                        urlLink?.url1 !== "" ?
                                                            <Col span={12} style={{ textAlign: "center" }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>ชำระผ่านธนาคาร</div>
                                                                <Image width={70} src={urlLink?.url1}
                                                                />
                                                            </Col>
                                                            : null
                                                    }
                                                    {
                                                        urlLink?.url2 !== "" ?
                                                            <Col span={12} style={{ textAlign: "center" }}>
                                                                <div style={{ fontSize: '12px', color: 'black' }}>ชำระผ่านเค้าน์เตอร์เซอร์วิส</div>
                                                                <Image width={70} src={urlLink?.url2} />
                                                            </Col>
                                                            : null
                                                    }
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* <Divider /> */}
                                {/* <Divider orientation="center">
                                    <b style={{ color: "red", fontSize: "12px", textDecoration: "underline", }}>
                                        ใบนี้หมดอายุวันที่: {dayjs(mainData?.inputDate).add(7, "day").format("DD/MM/YYYY")}
                                    </b>
                                </Divider>*/}
                                <Divider />
                            </> : <><Divider orientation="center"><b style={{ fontSize: "12px" }}>*** ไม่พบข้อมูล ***</b></Divider></>
                    }


                    {
                        // mainData?.AROTHR?.length > 0 ?
                        // <>
                        //     {/* ตารางลูกหนี้อื่นๆ */}
                        //     <Divider orientation="left"><b>รายละเอียดลูกหนี้อื่นๆ</b></Divider>
                        //     < Table
                        //         columns={columns}
                        //         dataSource={mainData?.AROTHR}
                        //         // pagination={false}
                        //         bordered
                        //     />
                        //     <Divider />
                        // </> : <><Divider orientation="center"><b>*** ไม่พบข้อมูล ***</b></Divider></>
                    }

                    {/* ส่วนลายเซ็น */}
                    <Row justify="space-between" style={{ fontSize: "12px" }}>
                        <Col span={6} style={{ textAlign: "center", border: "1px solid black", padding: "10px", borderRadius: "8px" }}>
                            <Divider style={{ margin: "40px 0 10px" }} />
                            <Text>ผู้ซื้อ (ลูกค้า)</Text>
                        </Col>
                        <Col span={6} style={{ textAlign: "center", border: "1px solid black", padding: "10px", borderRadius: "8px" }}>
                            <Divider style={{ margin: "40px 0 10px" }} />
                            <Text>ผู้ตรวจสอบ</Text>
                        </Col>
                        <Col span={6} style={{ textAlign: "center", border: "1px solid black", padding: "10px", borderRadius: "8px" }}>
                            <Divider style={{ margin: "40px 0 10px" }} />
                            <Text>ผู้อนุมัติ</Text>
                        </Col>
                    </Row>
                </Form>
            </Card >
        </div >
    )
}
