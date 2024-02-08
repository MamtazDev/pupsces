import { useEffect, useState } from "react";
import FacultyConversation from "./FacultyConversation";

const ConversationList = ({ facultyprogram, setShowDropdown }) => {
  const [messageData, setMessageData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [groupMessageData, setGroupMessageData] = useState([]);

  useEffect(() => {
    const studentData1 = localStorage.getItem("studentData");
    const studentData = JSON.parse(studentData1);
    console.log("studentData.program_id:", studentData.program_id);

    const program_id = localStorage.getItem("program_id");
    const program_idData = JSON.parse(program_id);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messageData?programId=${program_idData}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const groupedByEmail = data.reduce((acc, obj) => {
          if (acc[obj.email]) {
            acc[obj.email].push(obj);
          } else {
            acc[obj.email] = [obj];
          }
          return acc;
        }, {});

        const groupedArray = Object.values(groupedByEmail);
        console.log("data", data);
        console.log("data groupedArray", groupedArray);

        setMessageData(data);
        setGroupData(groupedArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("messageData", messageData);
  console.log("groupData", groupData);

  const [open, setOpen] = useState(false);

  const handleModal = (message) => {
    console.log("message", message);
    setGroupMessageData(message);
    setOpen(true);
    // setShowDropdown(false);
  };

  return (
    <div>
      <div className="conversation_list">
        {groupData?.map((message, index) => (
          <div style={{ marginBottom: "10px" }} key={index}>
            <div
              onClick={() => handleModal(message)}
              key={index}
              style={{ display: "flex", gap: "15px", alignItems: "center" }}
            >
              <img
                style={{ borderRadius: "50%" }}
                width={40}
                height={40}
                src={
                  message[0].image
                    ? `http://localhost:3000/api/v1/uploads/images/${message[0].image}`
                    : "https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw"
                }
                alt=""
              />
              <div>
                <p className="name">{message[0]?.name}</p>
                <p style={{ color: "lightgray", textSize: "12px" }}>
                  {message[0].email}
                </p>
              </div>
              <p style={{ textSize: "5px" }}>
                20.30 <span>am</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <FacultyConversation
          setOpen={setOpen}
          groupedArray={groupMessageData}
        />
      )}
    </div>
  );
};

export default ConversationList;
