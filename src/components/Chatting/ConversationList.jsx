
import chat from "../../assets/chat.png";
const ConversationList = () => {



    return (
        <div className="conversation_list">
            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => <div key={index} style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <img style={{ borderRadius: "50%" }} width={40} height={40} src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw" alt="" />
                    <div>
                        <p className="name">Dihan Abir</p>
                        <p style={{ color: 'lightgray', textSize: "12px" }}>Who are you?</p>
                    </div>
                    <p style={{textSize:"5px"}}>20.30 <span>am</span></p>
                </div>)
            }

        </div>
    );
};

export default ConversationList;
