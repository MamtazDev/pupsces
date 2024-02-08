import { useEffect, useState } from "react";
import FacultyConversation from "./FacultyConversation";

const ConversationList = ({ facultyprogram, setShowDropdown }) => {
  const [messageData, setMessageData] = useState([]);
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    const studentData1 = localStorage.getItem("studentData");
    const studentData = JSON.parse(studentData1);
    console.log("studentData.program_id:", studentData.program_id);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messageData?programId=1`
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

  const handleModal = () => {
    setOpen(true);
    // setShowDropdown(false);
  };

  return (
    <div>
      <div className="conversation_list">
        {groupData?.map((message, index) => (
          <div style={{ marginBottom: "10px" }} key={index}>
            {message.map((data, idx) => (
              <div
                onClick={() => handleModal()}
                key={idx}
                style={{ display: "flex", gap: "15px", alignItems: "center" }}
              >
                <img
                  style={{ borderRadius: "50%" }}
                  width={40}
                  height={40}
                  src={
                    idx === 0 && data.image
                      ? `http://localhost:3000/api/v1/uploads/images/${data.image}`
                      : "https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw"
                  }
                  alt=""
                />
                <div>
                  <p className="name">{idx === 0 && data?.name}</p>
                  <p style={{ color: "lightgray", textSize: "12px" }}>
                    {idx === 0 && data.email}
                  </p>
                </div>
                <p style={{ textSize: "5px" }}>
                  20.30 <span>am</span>
                </p>
              </div>
            ))}
          </div>
        ))}
        {/* {messageData?.map((data, index) => (
          <div
            onClick={() => handleModal()}
            key={index}
            style={{ display: "flex", gap: "15px", alignItems: "center" }}
          >
            <img
              style={{ borderRadius: "50%" }}
              width={40}
              height={40}
              src={
                data.image
                  ? `http://localhost:3000/api/v1/uploads/images/${data.image}`
                  : "https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw"
              }
              alt=""
            />
            <div>
              <p className="name">{data.name}</p>
              <p style={{ color: "lightgray", textSize: "12px" }}>
                {data.email}
              </p>
            </div>
            <p style={{ textSize: "5px" }}>
              20.30 <span>am</span>
            </p>
          </div>
        ))} */}
      </div>

      {open && (
        <FacultyConversation setOpen={setOpen} groupedArray={groupData} />
      )}
    </div>
  );
};

export default ConversationList;
