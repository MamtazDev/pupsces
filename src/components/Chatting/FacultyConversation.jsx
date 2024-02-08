import { useEffect, useState } from "react";
import chat from "../../assets/chat.png";
import logo from "../../assets/p.jpg";
import { FaPlus } from "react-icons/fa6";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";

const FacultyConversation = ({ setOpen, groupedArray }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileDisplay, setFileDisplay] = useState("");

  const sendMessage = () => {
    if (inputMessage.trim() !== "" || file) {
      const newMessages = [...messages, { text: inputMessage, file }];
      setMessages(newMessages);
      setInputMessage("");
      setFile(null);
      setFileDisplay("");
    }

    const studentData1 = localStorage.getItem("studentData");
    const studentData = JSON.parse(studentData1);

    console.log("studen tData:", JSON.parse(studentData1));

    if (studentData) {
      console.log("studentData.email:", studentData.email);
      console.log("studentData.file:", file);

      const data = new FormData();
      data.append("email", studentData.email);
      data.append("name", studentData.first_name);
      data.append("inputMessage", inputMessage);
      data.append("image", file);

      fetch("http://localhost:3000/api/message/upload", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileDisplay(selectedFile);
  };

  return (
    <div className="conversation">
      <div className="chat_box shadow-sm">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img width={30} src={logo} alt="" />
            <p>PUPSCES</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setOpen(false)}>
              <FaMinus />
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setMessages([]);
              }}
            >
              <IoMdClose />
            </button>
          </div>
        </div>

        <div className="chat_body">
          <div className="chat_boxy">
            {groupedArray?.map((message, index) => (
              <div style={{ marginBottom: "10px" }} key={index}>
                <div key={index}>
                  <p
                    style={{
                      background: "whitesmoke",
                      padding: "5px 10px",
                      display: "inline-block",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    {message.inputMessage}
                  </p>
                </div>
              </div>
            ))}
            {messages.map((message, index) => (
              <div style={{ marginBottom: "10px" }} key={index}>
                {message.text && (
                  <p
                    style={{
                      background: "whitesmoke",
                      padding: "5px 10px",
                      display: "inline-block",
                      borderRadius: "5px",
                    }}
                  >
                    {message.text}
                  </p>
                )}
                {message.file && (
                  <div>
                    <img src={URL.createObjectURL(message.file)} alt="" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyConversation;
