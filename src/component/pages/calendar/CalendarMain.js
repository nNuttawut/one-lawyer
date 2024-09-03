import React, { useState } from "react";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import MotionHoc from "../../../utils/MotionHoc";
import { Button, DatePicker, Input, Space } from "antd";
import moment from "moment";
import axios from "axios";

const CalendarMain = () => {
  const session = useSession(); //token
  const supabase = useSupabaseClient(); // connect supabase
  const { isLoading } = useSessionContext();

  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  if (isLoading) {
    console.log("ssssss");
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) {
      alert("Error logging in to google with Supabase");
      console.log(error);
    }
  }

  async function createCalendarEvent() {
    console.log("create Calendar Event", startDate.toISOString());
    console.log("create Calendar Event", endDate.toISOString());
    const urlCreate =
      "https://www.googleapis.com/calendar/v3/calendars/primary/events";
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [
        { email: "nickie.nuttawut@gmail.com" },
        { email: "suttisakphiw@gmail.com" },
      ],
    };
    try {
      const res = await axios.post(urlCreate, event, {
        headers: {
          Authorization: `Bearer ${session.provider_token}`, // แทนที่ด้วย Access Token ของคุณ
          "Content-Type": "application/json",
        },
      });
      console.log("res", res);
      console.log("resdata", res.data);
      return res.json();
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response ? error.response.data : error.message
      );
    }
  }

  const setStartDateEvent = (date, dateString) => {
    // date เป็นอ็อบเจ็กต์ moment, dateString เป็นสตริงที่แสดงวันที่
    setStartDate(date); // แปลง moment เป็น Date หรือใช้ null ถ้าไม่มีการเลือก
    if (date) {
      console.log("date", date); // แสดงอ็อบเจ็กต์ moment
      console.log("startString", dateString);
      console.log(startDate);
    }
  };

  const setEndDateEvent = (date, dateString) => {
    setEndDate(date ? date : null); // แปลง moment เป็น Date หรือใช้ null ถ้าไม่มีการเลือก
    if (date) {
      console.log("date", date); // แสดงอ็อบเจ็กต์ moment
      console.log("endString", dateString);
      console.log(endDate);
    }
  };

  async function signOut() {
    await supabase.auth.signOut();
  }
  console.log(session);
  // console.log("session.provider_token", session.access_token);
  console.log("start", startDate);
  console.log(eventName);
  console.log(eventDescription);
  return (
    <div>
      {session ? (
        <>
          <h2>My calendar {session.user.email}</h2>
          <Space direction="vertical">
            <p>start date of event</p>
            <DatePicker
              onChange={setStartDateEvent}
              value={startDate ? moment(startDate) : null}
            />
            <p>end date of event</p>
            <DatePicker
              onChange={setEndDateEvent}
              value={endDate ? moment(endDate) : null}
            />
            <p>event name</p>
            <Input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>event Description</p>
            <Input
              type="text"
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <hr />
            <Button onClick={() => createCalendarEvent()}>
              creat calendar event
            </Button>
            <Button onClick={() => signOut()}> Sign Out </Button>
          </Space>
        </>
      ) : (
        <>
          <Button onClick={() => googleSignIn()}> Sign In With Google </Button>
        </>
      )}
    </div>
  );
};

const Calendar = MotionHoc(CalendarMain);

export default Calendar;
