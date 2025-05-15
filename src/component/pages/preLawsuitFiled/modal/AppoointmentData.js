import { Descriptions, Divider, List, Modal, Tag } from "antd";
import DateCustom from "../../../../hook/DateCustom";
import dayjs from "dayjs";

const AppoointmentData = ({ open, close, dataRec, date }) => {
  const [convertDateThai] = DateCustom();

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  return (
    <Modal
      title={`รายละเอียดนัดหมาย | วันที่ ${convertDateThai(date)}`}
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
          dataSource={dataRec}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Descriptions
                size="small"
                column={1}
                bordered
                labelStyle={{ fontWeight: "bold" }}
              >
                <Descriptions.Item label="เลขคดีดำ">
                  {item.black_case_number || "ไม่ระบุ"}
                </Descriptions.Item>
                <Descriptions.Item label="ศาล">
                  {item.provincial_court || "ไม่ระบุ"}
                </Descriptions.Item>
                <Descriptions.Item label="เวลา">
                  <Tag color={"red"}>
                    {" "}
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
              </Descriptions>
              {index !== dataRec.length - 1 && <Divider />}
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};
export default AppoointmentData;
