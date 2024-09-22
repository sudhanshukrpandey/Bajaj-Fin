import React, { useState, useEffect } from 'react';
import './App.css';
import Select from 'react-select'; // Using react-select for multi-select dropdown

function App() {
  useEffect(() => {
    document.title = 'RA2111003030239';
  }, []);

  const [jsonInput, setJsonInput] = useState(''); // Store JSON input
  const [responseData, setResponseData] = useState(null); // Store API response
  const [selectedOptions, setSelectedOptions] = useState([]); // Multi-select dropdown options
  const [errorMessage, setErrorMessage] = useState(''); // Handle JSON validation errors

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate JSON input
    let parsedInput;
    try {
      parsedInput = JSON.parse(jsonInput); // Parse JSON input
      if (!parsedInput.data) throw new Error(); // Ensure "data" key exists
      setErrorMessage(''); // Clear previous errors
    } catch (error) {
      setErrorMessage('Invalid JSON format! Please enter valid JSON.');
      return;
    }

    // Send data to backend API (replace URL with your backend endpoint)
    try {
      const response = await fetch('http://localhost:5000/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedInput),
      });
      const data = await response.json();
      setResponseData(data); // Store the API response
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="App">
      <h1>JSON Input Processor</h1>

      {/* Form for JSON Input */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="api-group">
          <input
            type="text"
            id="jsonInput"
            placeholder=" "
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            required
          />
          <label htmlFor="jsonInput">Enter JSON </label>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {/* Display error if JSON is invalid */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Display response data */}
      {responseData && (
        <div className="response-section">
          <h2>Multi Filter</h2>

          {/* Multi-select dropdown */}
          <Select
            options={options}
            isMulti
            onChange={(selected) => setSelectedOptions(selected.map(opt => opt.value))}
            className="multi-select"
          />

          {/* Display selected response */}
          <div className="filtered-response">
            {selectedOptions.includes('alphabets') && (
              <div>
                <h3>Alphabets: {responseData.alphabets.join(', ')}</h3>
              </div>
            )}
            {selectedOptions.includes('numbers') && (
              <div>
                <h3>Numbers: {responseData.numbers.join(', ')}</h3>
              </div>
            )}
            {selectedOptions.includes('highest_lowercase_alphabet') && (
              <div>
                <h3>Highest Lowercase Alphabet: {responseData.highest_lowercase_alphabet.join(', ')}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;