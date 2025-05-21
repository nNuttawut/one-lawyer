import { Button, Descriptions, Divider, List, Modal, Tag } from "antd";
import DateCustom from "../../../../hook/DateCustom";
import dayjs from "dayjs";

const AppoointmentData = ({ open, close, dataRec, date, panel }) => {
  const [convertDateThai] = DateCustom();

  const renderData = () => {
    const sortedData = dataRec.sort(
      (a, b) =>
        dayjs(a.consideration_date).valueOf() -
        dayjs(b.consideration_date).valueOf()
    );

    return sortedData;
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const renderColor = (value) => {
    const itemDate = dayjs(value);

    let color = "red";
    if (itemDate.isBefore(dayjs(), "day")) color = "green";
    else if (itemDate.isAfter(dayjs(), "day")) color = "blue";

    let status = "ดำเนินการ";
    if (itemDate.isBefore(dayjs(), "day")) status = "เสร็จสิ้น";
    else if (itemDate.isAfter(dayjs(), "day")) status = "รอพิจารณา";

    return { color, status };
  };

  return (
    <Modal
      title={
        panel === "month"
          ? `รายละเอียดนัดหมาย | วันที่ ${convertDateThai(date)}`
          : `รายละเอียดนัดหมาย | เดือน ${dayjs
              .utc(date)
              .add(543, "year")
              .format("MMMM YY")}`
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      {dataRec.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999" }}>ไม่พบข้อมูล</div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={renderData(dataRec)}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Descriptions
                size="small"
                column={1}
                bordered
                styles={{ fontWeight: "bold" }}
              >
                <Descriptions.Item label="เลขคดีดำ">
                  {item.black_case_number || "ไม่ระบุ"}
                </Descriptions.Item>
                <Descriptions.Item label="ศาล">
                  {item.provincial_court || "ไม่ระบุ"}
                </Descriptions.Item>
                <Descriptions.Item label="เวลา">
                  <Tag color={"red"}>
                    {panel === "year"
                      ? `วันที่ ${convertDateThai(
                          item.consideration_date
                        )} เวลา `
                      : null}
                    {dayjs.utc(item.consideration_date).format("HH:mm")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="เรื่อง">
                  {item.subject || "ไม่ระบุ"}
                </Descriptions.Item>
                <Descriptions.Item label="จำเลย">
                  {`${item.customer_title}${item.customer_name} ${
                    item.customer_lastname ? item.customer_lastname : ""
                  }` || "ไม่ระบุ"}
                </Descriptions.Item>
                <Descriptions.Item label="สถานะ">
                  <Tag color={renderColor(item.consideration_date).color}>
                    {renderColor(item.consideration_date).status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
              {index !== dataRec.length - 1 && <Divider />}
            </List.Item>
          )}
        />
      )}
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={handleCancel}
          style={{ color: "red", marginRight: "20px" }}
        >
          ปิด
        </Button>
      </div>
    </Modal>
  );
};
export default AppoointmentData;
