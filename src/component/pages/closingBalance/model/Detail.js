import React, { useState, useEffect, useRef } from 'react'
import { Form, Modal, Row, Col, Table, Card, Button, Tag, Divider, Space, Collapse, Spin, Typography } from 'antd';
import { useReactToPrint } from "react-to-print";
import { currencyFormatOne } from "../modelFormat/Format";
import dayjs from 'dayjs';
// import axios from "axios";
import { columnsAROTHR } from '../modelColumn/Columns';
import CCB from '../modelPrint/PrintCcb';
import "./Detail.css";

const { Text } = Typography;

export default function Detail({ open, close, dataPost }) {
    const { Panel } = Collapse;
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    // const [contextHolder] = notification.useNotification();
    const [mainData, setMainData] = useState();
    const [isModalCCB, setIsModalCCB] = useState(false);
    const conponentPDF = useRef();
    // const currentDate = dayjs().format("DD/MM/YYYY");

    useEffect(() => {
        console.log("dataPost :", dataPost)
        setMainData(dataPost)
    }, [dataPost])

    const generatePDF = useReactToPrint({
        content: () => conponentPDF.current,
        documentTitle: `ใบขออนุมัติยอดปิดบัญชี ${dataPost?.contno}`,
    });
    const pim = async () => {
        setLoading(true)
        setIsModalCCB(true)
        setTimeout(() => {
            setLoading(false)
            generatePDF();
        }, 1000);
    };
    const handleCancel = () => {
        close(false);
    };

    return (
        <div>
            <Modal title="ตรวจสอบข้อมูล" open={open} onCancel={handleCancel} width={1000} footer={[null]}>
                <Card>
                    <Spin spinning={loading} size='large' tip="Loading...">
                        {/* <Divider orientation="left"><b>รายละเอียด</b></Divider> */}
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{
                                span: 12,
                            }}
                            wrapperCol={{
                                span: 12,
                            }}>
                            <>
                                <Row>
                                    <Col span={16}></Col>
                                    <Row justify={'center'}>
                                        <Col span={24} >
                                            <Form.Item label="" style={{ margin: 5 }}>
                                                <Button onClick={() => pim()} style={{ background: '#00FF00' }}>พิมพ์ใบขออนุมัติยอดปิด</Button>
                                            </Form.Item>
                                            <Form.Item label="เลขสัญญา" style={{ margin: 0 }}>
                                                <Tag color="geekblue">{mainData?.contno}</Tag>
                                            </Form.Item>
                                            <Form.Item label="สาขา" style={{ margin: 0 }}>
                                                <Tag color="geekblue">{mainData?.locat}</Tag>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Col>
                                        <Row justify="space-between" style={{ fontSize: "12px" }}>
                                            <Col><Text strong style={{ fontSize: '18px', color: 'red' }}>วันที่ขอ: {dayjs(mainData?.inputDate).format("YYYY-MM-DD")}</Text></Col>
                                            <Col></Col>
                                        </Row>
                                        <Row justify="space-between" style={{ fontSize: "12px" }}>
                                            <Col><Text strong style={{ fontSize: '18px', color: 'red' }}>ใบนี้หมดอายุวันที่: {dayjs(mainData?.inputDate).add(7, "day").format("YYYY-MM-DD")}</Text></Col>
                                            <Col></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* <Row> */}
                                {
                                    mainData?.detail?.length > 0 ?
                                        <>
                                            <Divider orientation="left"><b>ข้อมูลลูกค้า</b></Divider>
                                            <Row>
                                                <Col span={12}>
                                                    <Form.Item label="เลขบัตรประชาชน" style={{ margin: 0 }}>
                                                        {mainData?.cuscod}
                                                    </Form.Item>
                                                    <Form.Item label="ชื่อลูกค้า" style={{ margin: 0 }}>
                                                        {mainData?.detail[0]?.NAME}
                                                    </Form.Item>
                                                    <Form.Item label="ที่อยู่" style={{ margin: 0 }}>
                                                        {mainData?.detail[0]?.ADDRES}
                                                        {mainData?.detail[0]?.TUMB + ' '}
                                                        {mainData?.detail[0]?.AUMP + ' '}
                                                        {mainData?.detail[0]?.PROVDES + ' '}
                                                        {mainData?.detail[0]?.ZIP}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="เบอร์ติดต่อ" style={{ margin: 0 }}>
                                                        {mainData?.detail[0]?.TELP}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Divider orientation="left"><b>รายละเอียดสินค้า</b></Divider>
                                            <Row>
                                                <Col span={12}>
                                                    <Form.Item label="รายละเอียด" style={{ margin: 0 }}>
                                                        {mainData?.detail[0]?.TYPE ? mainData?.detail[0]?.TYPE + ' ' : null}
                                                        {mainData?.detail[0]?.MODEL ? mainData?.detail[0]?.MODEL + ' ' : null}
                                                        {mainData?.detail[0]?.MANUYR ? mainData?.detail[0]?.MANUYR + ' ' : null}
                                                    </Form.Item>
                                                    <Form.Item label="สีรถ" style={{ margin: 0 }}>
                                                        {mainData?.detail[0]?.COLOR ? mainData?.detail[0]?.COLOR : null}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="ทะเบียน/เลขที่ดิน" style={{ margin: 0 }}>
                                                        {mainData?.detail[0]?.REGNO ? mainData?.detail[0]?.REGNO + ' ' : null}
                                                        {mainData?.detail[0]?.DORECV ? mainData?.detail[0]?.DORECV : null}
                                                    </Form.Item>
                                                    <Form.Item label="เลขตัวถัง/เลขโฉนด" style={{ margin: 0 }}>
                                                        <div style={{ margin: 5 }}>{mainData?.detail[0]?.STRNO ? mainData?.detail[0]?.STRNO : null}</div>
                                                        <div style={{ margin: 5 }}>{mainData?.detail[0]?.ENGNO ? mainData?.detail[0]?.ENGNO : null}</div>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </> : null
                                }

                                <Divider orientation="left"><b>รายละเอียดการชำระ</b></Divider>
                                {/* <div className='center'> */}
                                {/* <Row className='center'> */}
                                {/* <Col span={12}> */}
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label="ยอดเงินกู้ยืม" style={{ margin: 0 }}>
                                            {currencyFormatOne(mainData?.ncshprc)}
                                        </Form.Item>
                                        <Form.Item label="ชำระเงินแล้ว" style={{ margin: 0 }}>
                                            {currencyFormatOne(mainData?.npayres)}
                                        </Form.Item>
                                        {
                                            mainData?.book > 0 ?
                                                <Form.Item label="ค่าธรรมเนียมเร่งเล่ม" style={{ margin: 0 }}>
                                                    {currencyFormatOne(mainData?.book)}
                                                </Form.Item>
                                                :
                                                <Form.Item label="ไถ่ถอนกรมพัฒน์ฯ" style={{ margin: 0 }}>
                                                    {currencyFormatOne(mainData?.pat)}
                                                </Form.Item>
                                        }
                                        <Form.Item label="ลูกหนี้อื่นๆ" style={{ margin: 0 }}>
                                            {currencyFormatOne(mainData?.arothr)}
                                        </Form.Item>
                                    </Col>
                                    {/* <Divider /> */}
                                    {/* </Col>
                                    <Col span={12}> */}
                                    <Col span={12}>
                                        <Form.Item label="เงินต้นคงเหลือ" style={{ margin: 0 }}>
                                            {currencyFormatOne(mainData?.ton)}
                                        </Form.Item>
                                        <Form.Item label="ดอกเบี้ย" style={{ margin: 0 }}>
                                            {currencyFormatOne(mainData?.dok)}
                                        </Form.Item>
                                        <Form.Item label="ค้างค่าธรรมเนียมล่าช้า" style={{ margin: 0 }}>
                                            {currencyFormatOne(mainData?.follow)}
                                        </Form.Item>
                                        <Form.Item label="ส่วนลด" style={{ margin: 0 }}>
                                            {currencyFormatOne(0)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Divider />
                                <Form.Item label={<span style={{ color: 'red', fontSize: '18px' }}><b>รวมยอดที่ลูกค้าต้องจ่าย</b></span>} style={{ margin: 0 }}>
                                    <b style={{ color: 'red', fontSize: '18px' }}>
                                        {currencyFormatOne(parseFloat(dataPost?.ton) + parseFloat(dataPost?.dok) + parseFloat(dataPost?.follow) + parseFloat(dataPost?.arothr) + parseFloat(dataPost?.book) + parseFloat(dataPost?.pat))}
                                        {" "}{"บาท"}
                                    </b>
                                </Form.Item>
                                {/* </Col>
                                </Row> */}
                                {/* </div> */}
                                {/* </Row> */}
                            </>
                            <Divider />
                            <Collapse defaultActiveKey={[]}>
                                <Panel header="รายละเอียดข้อมูล" key="1">
                                    {mainData?.AROTHR?.length > 0 ? (
                                        <>
                                            <Table
                                                rowKey={(record) => record.uid}
                                                dataSource={mainData?.AROTHR}
                                                columns={columnsAROTHR}
                                                scroll={{
                                                    x: 1500,
                                                    y: 400,
                                                }}
                                                style={{ padding: 20 }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Divider orientation="center"><b style={{ fontSize: "12px" }}>*** ไม่พบข้อมูล ***</b></Divider>
                                        </>
                                    )}
                                </Panel>
                            </Collapse>
                            <Divider />
                            <Row>
                                <Col span={24} style={{ textAlign: "center" }}>
                                    <Space>
                                        <Button type='text' onClick={handleCancel} style={{ backgroundColor: "gray" }}>close</Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                    {/* {contextHolder} */}
                    {
                        isModalCCB && mainData &&
                        <div className="print-only" ref={conponentPDF} >
                            <CCB dataPost={mainData} />
                        </div>
                    }
                </Card>
                <Divider />
            </Modal>
        </div >
    )
}
