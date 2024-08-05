import React from 'react';

const Summary = ({ text, loading }) => {
    return (
        <div className='summary-container'>
            <h2>Summary</h2>
            {loading ? <p>Loading...</p> : <p>{text}</p>}
        </div>
    );
}

export default Summary;
