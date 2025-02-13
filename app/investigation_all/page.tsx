'use client'
import { useEffect, useState } from "react";
import axios from "axios";


type SelectedUser = {
  id: string;
  userId: string;
  display_name: string;
  email: string;
};

type InvestigationMeeting = {
  id: string;
  topic_meeting: string;
  scheduled_date: string;
  summary_meeting: string;
  SelectedUser: SelectedUser[];
};


export default function InvestigationMeetings() {
  const [meetings, setMeetings] = useState<InvestigationMeeting[]>([]);

  useEffect(() => {
    axios.get("/api/investigation_meeting")
      .then((response) => {
        setMeetings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching investigation meetings:", error);
      });
  }, []);

  return (
    <div>
      <h2>Investigation Meetings</h2>
      {meetings.map((meeting) => (
        <div key={meeting.id} className="border p-4 my-2">
          <h3>Topic: {meeting.topic_meeting}</h3>
          <p>Date: {new Date(meeting.scheduled_date).toLocaleDateString()}</p>
          <p>Summary: {meeting.summary_meeting}</p>
          
          <h4>Selected Users:</h4>
          <ul>
            {meeting.SelectedUser?.map((user) => (
              <li key={user.id}>
                {user.display_name} ({user.email})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
