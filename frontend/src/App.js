import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Summary from './components/Summary';
import "./App.css";

const App = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummary = (text) => {
    setSummary(text);
    setLoading(false);
  };

  const handleLoading = () => {
    setLoading(true);
  };

  return (
    <div className="App">
      <h1>Document Summarizer</h1>
      <FileUpload onSummary={handleSummary} onLoading={handleLoading} />
      <Summary text={summary} loading={loading} />
    </div>
  );
}

export default App;
