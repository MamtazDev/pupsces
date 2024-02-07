import { useEffect, useState } from "react";
import chat from "../../assets/chat.png";
import logo from "../../assets/p.jpg";
import { FaPlus } from "react-icons/fa6";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";

const Conversation = () => {
  const [show, setShow] = useState(false);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileDisplay, setFileDisplay] = useState("");

  // const [fileDisplau]



  const sendMessage = () => {
    if (inputMessage.trim() !== "" || file) {
      const newMessages = [...messages, { text: inputMessage, file }];
      setMessages(newMessages);
      setInputMessage("");
      setFile(null);
      setFileDisplay("");
    }

    const studentData1 = (localStorage.getItem("studentData"))
    const studentData = JSON.parse(studentData1)

    console.log("studen tData:", JSON.parse(studentData1))


    if (studentData) {

      console.log("studentData.email:", studentData.email)
      console.log("studentData.file:", file)
    
      const data = new FormData();
      data.append('email', studentData.email);
      data.append('name',  studentData.first_name);
      data.append('inputMessage', inputMessage);
      data.append('image', file);
    
      fetch('http://localhost:3000/api/message/upload', {
        method: 'POST',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          // Handle success response here
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle error here
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


  useEffect(() => {
    const studentData = JSON.stringify(localStorage.getItem("studentData"))
    console.log("studentData:", studentData)
  },[])
  return (
    <div className="conversation">
      {show && (
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
              <button onClick={() => setShow(false)}>
                <FaMinus />
              </button>
              <button
                onClick={() => {
                  setShow(false);
                  setMessages([]);
                }}
              >
                <IoMdClose />
              </button>
            </div>
          </div>

          <div className="chat_body">
            <div className="chat_boxy">
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

          <div className="text_box">
            <button className="attachment_btn">
              <label htmlFor="fileInput">
                <FaPlus  />
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*, .pdf, .doc, .docx"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "whitesmoke",
                padding: "5px",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              <input
                type="text"
                onChange={(e) => setInputMessage(e.target.value)}
                value={inputMessage}
                onKeyPress={handleKeyPress}
                placeholder={fileDisplay || "Type Here..."}
              />
              <button className="send_btn" onClick={sendMessage}>
                <IoIosSend />
              </button>
            </div>
          </div>
        </div>
      )}
      <div onClick={() => setShow(!show)} style={{ textAlign: "end" }}>
        <button>
          <img src={chat} alt="icon" />
        </button>
      </div>
    </div>
  );
};

export default Conversation;
