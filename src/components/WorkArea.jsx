import React, { useState } from 'react';
import './WorkArea.css';

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function WorkArea() {
  // Generate an array of letters from 'a' to 'z'
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

  // Create an array of values (e.g., 'a' to 'z') and shuffle it for unique assignment
  const randomValues = shuffle([...letters]);

  // Initialize the letterMap with unique, random values
  const initialMap = new Map(letters.map((letter, index) => [letter, randomValues[index]]));
  const [letterMap, setLetterMap] = useState(initialMap);
  const [message, setMessage] = useState(""); // For storing user message
  const [encryptedMessage, setEncryptedMessage] = useState(""); // For storing encrypted message
  const [isEncryptionMode, setIsEncryptionMode] = useState(true); // State for toggle

  // Number of tables to display
  const n = 3; // Change this value to increase or decrease the number of tables

  // Function to validate if a character is an uppercase letter
  const isUpperCaseChar = (char) => /^[A-Z]*$/.test(char);

  // Handler to update the Map when input changes
  const handleInputChange = (letter, event) => {
    const newChar = event.target.value.slice(-1); // Get only the last character
    if (!isUpperCaseChar(newChar)) { // Only update if it's not an uppercase letter
      const newMap = new Map(letterMap); // Copy the current map
      newMap.set(letter, newChar); // Update the specific letter’s value with a single character
      setLetterMap(newMap); // Set the updated map in state
    }
  };

  // Handle message input to allow all characters except uppercase letters
  const handleMessageChange = (event) => {
    const value = event.target.value;
    const filteredValue = value.split('').filter(char => !isUpperCaseChar(char)).join(''); // Remove uppercase letters
    setMessage(filteredValue);
  };

  // Encrypt or decrypt the message using the letterMap
  const handleProcessMessage = () => {
    const processed = message
      .split('')
      .map(char => {
        // If in encryption mode, use letterMap; else find the key for the value
        if (isEncryptionMode) {
          return letterMap.get(char) || char; // Use the mapped character or keep the original if not found
        } else {
          // Decrypt: Find the key for the value
          for (let [key, value] of letterMap.entries()) {
            if (value === char) return key; // Return the key that matches the current character
          }
          return char; // Keep original if no match found
        }
      })
      .join('');
    setEncryptedMessage(processed);
  };

  // Function to split the letters into n parts
  const splitIntoParts = (array, parts) => {
    const result = [];
    const partSize = Math.ceil(array.length / parts);
    for (let i = 0; i < parts; i++) {
      result.push(array.slice(i * partSize, (i + 1) * partSize));
    }
    return result;
  };

  const letterParts = splitIntoParts(letters, n); // Split letters into n parts

  return (
    <div className="work-area flex">
      <div className="map-editor">
        <h2>Encryption Map</h2>
        <div className='flex'>
          {letterParts.map((part, partIndex) => (
            <div key={partIndex} className="encryption-map">
              <table>
                <tbody>
                  {part.map((letter) => (
                    <tr key={letter}>
                      <td>{letter}</td>
                      <td>
                        <input
                          value={letterMap.get(letter) || ""}
                          onChange={(e) => handleInputChange(letter, e)}
                          maxLength={1} // Ensure only one character can be entered
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <div className="encryption-section">
        <h2>{isEncryptionMode ? 'Message Encryption' : 'Message Decryption'}</h2>
        <textarea
          placeholder={`Enter message to ${isEncryptionMode ? 'encrypt' : 'decrypt'}`}
          value={message}
          onChange={handleMessageChange} // Use the new handler
          className="message-input"
        />
        <button onClick={handleProcessMessage} className="encrypt-button">
          {isEncryptionMode ? 'Encrypt' : 'Decrypt'}
        </button>
        <button onClick={() => setIsEncryptionMode(!isEncryptionMode)} className="toggle-button">
          Switch to {isEncryptionMode ? 'Decryption' : 'Encryption'}
        </button>
        <div className="encrypted-message">
          <h3>{isEncryptionMode ? 'Encrypted Message:' : 'Decrypted Message:'}</h3>
          <p>{encryptedMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkArea;

