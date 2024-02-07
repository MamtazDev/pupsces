import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import './style.css'

function Dashboard() {
    const [messageData, setMessageData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/messageData');
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
        // <Flex justifyContent="center" alignItems="center">
        <Box>
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
                                    <img width={100} height={100} src={`http://localhost:3000/api/v1/uploads/images/${message.image}`} alt="Message Image" />
                                    {/* Download button */}
                                    <button  className='btn-style' onClick={() => handleDownload(`http://localhost:3000/api/v1/uploads/images/${message.image}`, `image_${index}.jpg`)}>Download</button>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </Box>

    )
}

export default Dashboard