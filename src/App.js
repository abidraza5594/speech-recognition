// App.js
import React from 'react';
import "./App.css"
import SpeechRecognitionApp from './Components/SpeechRecognition/SpeechRecognition';

const App = () => {
  return (
    <div className='container'>
      <h1>Speech Recognition App</h1>
      <SpeechRecognitionApp />
    </div>
  );
};

export default App;
