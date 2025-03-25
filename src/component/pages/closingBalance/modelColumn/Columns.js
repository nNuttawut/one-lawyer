import { Space } from 'antd';
import dayjs from "dayjs";


const currencyFormatOne = (amount) => {
    if (amount) {
        return Number(amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    } else {
        return "-"
    }
}
export function dayFormatOne(value) {
    if (value) {
        // console.log("vv",value)
        return dayjs(value).format('DD-MM-YYYY');
        // return dayjs(value).format('YYYY-MM-DD');
    } else {
        return ""
    }
}

const columns = [
    // {
    //   title: "ลำดับ",
    //   dataIndex: "index",
    //   key: 'index',
    //   width: "auto",
    //   align: 'center',
    //   render: (text, object, index) => index + 1
    // },
    {
        title: "เลขสัญญา",
        dataIndex: "CONTNO",
        key: 'index',
        align: 'center',
        width: "auto",
    },
    {
        title: "งวดที่",
        dataIndex: "NOPAY",
        key: 'index',
        align: 'center',
        width: "auto",
    },
    {
        title: "เงินต้นคงเหลือ",
        dataIndex: "TONBALANCE",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.TONBALANCE)}</>
            </Space>
        ),
    },
    {
        title: "จำนวนวัน",
        dataIndex: "DELAYDAY",
        key: 'index',
        align: 'center',
        width: "auto",
    },
    {
        title: "วันกำหนดชำระ",
        dataIndex: "DUEDATE",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{dayFormatOne(record.DUEDATE)}</>
        ),
    },
    {
        title: "ค่างวด",
        dataIndex: "DUEAMT",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.DUEAMT)}</>
            </Space>
        ),
    },
    {
        title: "ดอกเบี้ย",
        dataIndex: "DUEINTEFF",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.DUEINTEFF)}</>
            </Space>
        ),
    },
    {
        title: "เงินต้น",
        dataIndex: "DUETONEFF",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.DUETONEFF)}</>
            </Space>
        ),
    },
    {
        title: "ค่าทวงถาม",
        dataIndex: "FOLLOWAMT",
        key: 'index',
        align: 'center',
        width: "auto",
    },
    {
        title: "วันที่ชำระ",
        dataIndex: "PAYDATE",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                {
                    record.PAYDATE !== "" && record.PAYDATE !== "0001-01-01T00:00:00Z" ?
                        <>{dayFormatOne(record.PAYDATE)}</>
                        : "-"
                }
            </Space>
        ),
    },
    {
        title: "ชำระค่างวด",
        dataIndex: "PAYAMT",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.PAYAMT)}</>
            </Space>
        ),
    },
    {
        title: "ชำระดอกเบี้ย",
        dataIndex: "PAYINTEFF",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.PAYINTEFF)}</>
            </Space>
        ),
    },
    {
        title: "ชำระเงินต้น",
        dataIndex: "PAYTON",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.PAYTON)}</>
            </Space>
        ),
    },
    {
        title: "ชำระค่าทวงถาม",
        dataIndex: "PAYFOLLOW",
        key: 'index',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <Space size="middle">
                <>{currencyFormatOne(record.PAYFOLLOW)}</>
            </Space>
        ),
    },
];

const columnsHDPAYMENT = [
    {
        title: "เลขที่สัญญา",
        dataIndex: "CONTNO",
        key: 'CONTNO',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{record.CONTNO}</>
        ),
    },
    {
        title: "สาขา",
        dataIndex: "LOCAT",
        key: 'LOCAT',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{record.LOCAT}</>
        ),
    },
    {
        title: "ยอดเงินในระบบ",
        dataIndex: "TOTAMT",
        key: 'TOTAMT',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{currencyFormatOne(record.TOTAMT)}</>
        ),
    },
    // {
    //   title: "ชำระขั้นต่ำ",
    //   dataIndex: "PAYLIMITAMT",
    //   key: 'PAYLIMITAMT',
    //   align: 'center',
    //   width: "auto",
    //   render: (text, record) => (
    //     <>{currencyFormatOne(record.PAYLIMITAMT)}</>
    //   ),
    // },
];

const columnsAROTHR = [
    {
        title: "ลำดับ",
        dataIndex: "index",
        key: 'index',
        width: "5%",
        align: 'center',
        render: (text, object, index) => index + 1
    },
    {
        title: "เลขที่สัญญา",
        dataIndex: "CONTNO",
        key: 'CONTNO',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{record.CONTNO}</>
        ),
    },
    {
        title: "วันที่",
        dataIndex: "INPDT",
        key: 'INPDT',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{dayFormatOne(record.INPDT)}</>
        ),
    },
    {
        title: "จำนวนเงิน",
        dataIndex: "PAYAMT",
        key: 'PAYAMT',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{currencyFormatOne(record.PAYAMT)}</>
        ),
    },
    {
        title: "CODE",
        dataIndex: "PAYFOR",
        key: 'PAYFOR',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{record.PAYFOR}</>
        ),
    },
    {
        title: "หมายเหตุ",
        dataIndex: "FORDESC",
        key: 'FORDESC',
        align: 'center',
        width: "auto",
        render: (text, record) => (
            <>{record.FORDESC}</>
        ),
    },
];

export { columns, columnsHDPAYMENT, columnsAROTHR };