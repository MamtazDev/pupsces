import { useEffect, useState } from "react";
import FacultyConversation from "./FacultyConversation";


const ConversationList = ({ facultyprogram, setShowDropdown }) => {
    const [messageData, setMessageData] = useState([]);

    useEffect(() => {
        const studentData1 = (localStorage.getItem("studentData"))
        const studentData = JSON.parse(studentData1)
        console.log("studentData.program_id:", studentData.program_id)

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/messageData?programId=1`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const groupedByEmail = data.reduce((acc, obj) => {
                    // Check if the email already exists in the accumulator
                    if (acc[obj.email]) {
                        // If it exists, push the current object to the existing array
                        acc[obj.email].push(obj);
                    } else {
                        // If it doesn't exist, create a new array with the current object
                        acc[obj.email] = [obj];
                    }
                    return acc;
                }, {});
                
                const groupedArray = Object.values(groupedByEmail);
                console.log("data",data)
                console.log("data groupedArray",groupedArray)


                setMessageData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    console.log("messageData", messageData);

    const [open, setOpen] = useState(false)

    const handleModal = ()=>{
        setOpen(true)
        // setShowDropdown(false) 
    }

    return (
        <div>

            <div className="conversation_list">
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => <div onClick={() => handleModal()} key={index} style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                        <img style={{ borderRadius: "50%" }} width={40} height={40} src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw" alt="" />
                        <div>
                            <p className="name">Dihan Abir</p>
                            <p style={{ color: 'lightgray', textSize: "12px" }}>Who are you?</p>
                        </div>
                        <p style={{ textSize: "5px" }}>20.30 <span>am</span></p>
                    </div>)
                }

            </div>


            {open && <FacultyConversation setOpen={setOpen} />}
        </div>
    );
};

export default ConversationList;
