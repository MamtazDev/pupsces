import { useState } from "react";
import chat from "../../assets/chat.png";
import logo from "../../assets/p.jpg";
import { IoAddOutline } from "react-icons/io5";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";

const Conversation = () => {
  const [show, setShow] = useState(false);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessages = [...messages, inputMessage];
      setMessages(newMessages);
      setInputMessage("");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  return (
    <div className="conversation">
      {show && (
        <div className="chat_box">
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
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>

          <div className="text_box">
            <button className="attachment_btn">
              <IoAddOutline />
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
                placeholder="Type Here..."
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
