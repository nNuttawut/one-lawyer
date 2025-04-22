import {
  Button,
  Form,
  Modal,
  Card,
  Spin,
  message,
  Image,
  Row,
  Col,
  Divider,
} from "antd";
import { useEffect, useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import axios from "axios";
import { baseUrl, POST_DETAIL_PAYMENT } from "../../../API/apiUrls";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";
import {
  FileWordOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { faMapLocationDot, faCarSide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainLoanPDF from './modalPDF/MainLoanPDF';

const PrintCancel = ({ open, close, data, queryContno }) => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const companyId = localStorage.getItem("COMPANY_ID");
  const [arrData, setArrData] = useState();

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  useEffect(() => {
    console.log("data---->", data);

    if (queryContno) {
      let typeValue;
      let subData = queryContno.substring(0, 1);
      if (companyId === "3") {
        typeValue = "KSM";
        queryData(queryContno, typeValue);
        console.log("subData", subData);
        console.log("typeValue", typeValue);
        console.log("queryContno--->", queryContno);
      } else {
        if (subData === "1") {
          typeValue = "LSFHP";
          queryData(queryContno, typeValue);
        } else if (subData === "3") {
          let checkType = queryContno.substring(5, 9);
          console.log("checkType", checkType);
          if (parseInt(checkType) > 1200) {
            typeValue = "RPSL";
            queryData(queryContno, typeValue);
          } else {
            message.error("ไม่สามารถดูข้อมูล บัญชี 3(เก่า) ได้ ❌");
          }
        } else {
          typeValue = "RPSL";
          queryData(queryContno, typeValue);
        }

        console.log("subData", subData);
        console.log("typeValue", typeValue);
        console.log("queryContno--->", queryContno);
      }
    }
  }, []);

  const queryData = async (queryContno, typeValue) => {
    setLoading(true);
    try {
      await axios
        .post(POST_DETAIL_PAYMENT, {
          contno: queryContno,
          todate: dayjs().format("YYYY-MM-DD"),
          type: typeValue,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            console.log("resQuery", resQuery.data);
            setArrData(resQuery?.data[0]);
            setLoading(false);
          } else {
            message.error("ไม่มีเลขที่สัญญาที่ค้นหา");
            console.log("ไม่มีเลขที่สัญญาที่ค้นหา");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 404) {
            message.error("ไม่มีเลขที่สัญญาที่ค้นหา");
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="รายละเอียดบอกเลิกสัญญา"
      open={open}
      onCancel={handleCancel}
      width={650}
      footer={null}
    >
      <Card>
        <Row>
          <Col
            span={"12"}
            style={{
              textAlign: "start",
            }}
          >
            <b>ผู้ทำสัญญา : {arrData?.customer[0]?.NAME}</b>
            <br />
            {arrData?.guarantor?.length > 0 &&
            queryContno.substring(0, 1) !== "1"
              ? arrData.guarantor.map((data, index) => (
                  <>
                    <b key={index}>
                      คนค้ำที่ {data.GARNO}: {data.NAME}
                    </b>
                    <br />
                  </>
                ))
              : null}
          </Col>
        </Row>

        <Divider>
          รายละเอียดสัญญา{" "}
          <FontAwesomeIcon
            icon={
              queryContno.substring(0, 1) === "3"
                ? faCarSide
                : queryContno.substring(0, 1) === "1"
                ? faMapLocationDot
                : null
            }
            size="2x"
            color={
              queryContno.substring(0, 1) === "3"
                ? "blue"
                : queryContno.substring(0, 1) === "1"
                ? "green"
                : null
            }
            style={{ marginLeft: "10px" }}
          />
        </Divider>
        <Row gutter={[16, 16]}>
          <Col span={12} style={{ textAlign: "center" }}>
            <p>
              <b>เลขที่สัญญา : </b> {arrData?.customer[0]?.CONTNO}
            </p>
            <p>
              <b>ประเภท : </b> {arrData?.invtran?.baabdes}
            </p>
            <p>
              <b>{queryContno.substring(0, 1) === "3" ? "รุ่น" : "อำเภอ"} : </b>{" "}
              {arrData?.invtran?.modeldes}
            </p>
            <p>
              <b>{queryContno.substring(0, 1) === "3" ? "สี" : "โฉนด"} : </b>{" "}
              {arrData?.invtran?.color}
            </p>
            <p>
              <b>
                {queryContno.substring(0, 1) === "3"
                  ? "เลขตัวถัง"
                  : queryContno.substring(0, 1) === "1"
                  ? "เลขโฉนด"
                  : null}{" "}
                :{" "}
              </b>{" "}
              {arrData?.invtran?.strno}
            </p>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <p>
              <b>วันเริ่มทำสัญญา : </b>
              {arrData?.loan?.sdate
                ? convertDateThaiShort(arrData?.loan?.sdate)
                : "-"}
            </p>
            <p>
              <b>ชำระงวดแรกเมื่อ : </b>{" "}
              {arrData?.chqtran[0]?.inpdt
                ? convertDateThaiShort(arrData?.chqtran[0]?.inpdt)
                : "-"}
            </p>
            <p>
              <b>ยอดกู้ : </b>{" "}
              {arrData?.loan?.ncshprc
                ? currencyFormatPoint(arrData?.loan?.ncshprc)
                : 0}{" "}
              บาท
            </p>
            <p style={{ color: "red" }}>
              <b>ต้นคงเหลือ : </b>{" "}
              {arrData?.loan?.tonkong
                ? currencyFormatPoint(arrData?.loan?.tonkong)
                : 0}{" "}
              บาท
            </p>
            <p style={{ color: "red" }}>
              <b>ค้างดอกเบี้ย : </b>{" "}
              {arrData?.loan?.flag === 1
                ? currencyFormatPoint(
                    arrData?.loan?.kangdok + arrData?.loan?.dok
                  )
                : arrData?.loan?.kangdok}{" "}
              บาท
            </p>

            <p>
              <b>วันที่คิดดอกเบี้ย : </b>
              {arrData?.loan?.startdate
                ? `${convertDateThaiShort(arrData?.loan?.startdate)} -
                        ${convertDateThaiShort(arrData?.loan?.enddate)}`
                : "-"}
            </p>
            <p>
              <b>ผ่อน : </b>
              {arrData?.loan?.tnopay
                ? currencyFormatPoint(arrData?.loan?.tnopay)
                : 0}{" "}
              งวด <b>งวดละ : </b>{" "}
              {arrData?.loan?.totUpay
                ? currencyFormatComma(arrData?.loan?.totUpay)
                : 0}{" "}
              บาท
            </p>
          </Col>
        </Row>
        <Divider />
        <center>
        <MainLoanPDF dataCus = {data ? data : null} arrData = {arrData ? arrData.loan : null}/>       
        </center>
      </Card>
    </Modal>
  );
};
export default PrintCancel;
