import { useEffect, useState } from 'react'
import './style.css'
import { Flex } from '@chakra-ui/react';

function Dashboard() {
    const [messageData, setMessageData] = useState([]);

    useEffect(() => {
        const studentData1 = (localStorage.getItem("studentData"))
        const studentData = JSON.parse(studentData1)
        console.log("studentData.program_id:", studentData.program_id)

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/messageData?programId=${studentData.program_id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMessageData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDownload = (url,filename) => {
        window.open(url, '_blank');
        // Logic to download image
        // console.log('Downloading image:', url);
        // const anchor = document.createElement('a');
        // anchor.href = url;
        // anchor.download = filename;
        // anchor.click();
      };

    return (
        <Flex
        minHeight="100vh"
        w="100%"
        position="absolute"
        justifyContent="center"
        zIndex={-1}
      >
        <div style={{ padding:'30px', backgroundColor:'#e6e6e6'}}>
            <div>
                <h1>Message Data</h1>
                <div>
                    {messageData.map((message, index) => (
                        <div key={index} className="message" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Name: {message.name}</p>
                            <p>Email: {message.email}</p>
                            <p>Message: {message.inputMessage}</p>
                            {/* Render image if available */}
                            {message.image &&
                                // <img width={100} height={100} src={`http://localhost:3000/api/v1/uploads/images/${message.image}`} alt="Message Image" />
                                <div>
                                    <img width={100} height={100} className='image' src={`http://localhost:3000/api/v1/uploads/images/${message.image}`} alt="Message Image" />
                                    {/* Download button */}
                                    <button  className='btn-style' onClick={() => handleDownload(`http://localhost:3000/api/v1/uploads/images/${message.image}`, `image_${index}.jpg`)}>Download</button>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
       

    </Flex>

    )
}

export default Dashboard