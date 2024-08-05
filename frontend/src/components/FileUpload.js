import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onSummary, onLoading }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        onLoading(); // Start loading

        try {
            const uploadResponse = await axios.post('http://localhost:5000/upload', formData);
            const filename = uploadResponse.data.filename;

            const summarizeResponse = await axios.post('http://localhost:5000/summarize', { filename });
            onSummary(summarizeResponse.data.summary);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing the file');
            onLoading(false);
        }
    };

    return (
        <div className='file-upload-container'>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Summarize</button>
        </div>
    );
}

export default FileUpload;
