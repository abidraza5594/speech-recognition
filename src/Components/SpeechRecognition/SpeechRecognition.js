import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import './speech.css';

const PopupMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 3000); // Popup will automatically close after 3 seconds

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="popup-message">
      <p>{message}</p>
    </div>
  );
};

const SpeechRecognitionApp = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [showClearPopup, setShowClearPopup] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  const recognition = useRef(null);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition is not available.');
      return;
    }

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;

    recognition.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript.trim());
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  }, []);

  const handleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition is not available.');
      return;
    }

    if (!isListening) {
      recognition.current.start();
      setIsListening(true);
    } else {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const handleCopyText = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setShowCopyPopup(true);
    }
  };

  const handleClear = () => {
    setIsListening(false);
    setTranscript('');
    setShowClearPopup(true);
    window.location.reload()
  };

  const handleDownloadQR = () => {
    if (qrCanvasRef.current) {
      const qrCanvas = qrCanvasRef.current;
      const url = qrCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.png';
      link.click();
      setShowDownloadPopup(true);
    }
  };

  const handleCloseCopyPopup = () => {
    setShowCopyPopup(false);
  };

  const handleCloseClearPopup = () => {
    setShowClearPopup(false);
  };

  const handleCloseDownloadPopup = () => {
    setShowDownloadPopup(false);
  };

  return (
    <div>
      <button onClick={handleSpeechRecognition}>
        {isListening ? 'Stop Listening' : 'Start Speech Recognition'}
      </button>
      <button onClick={handleCopyText} disabled={!transcript}>
        Copy Text
      </button>
      <button onClick={handleClear} disabled={!transcript}>
        Clear Text
      </button>
      <button onClick={handleDownloadQR} disabled={!transcript}>
        Download QR Code
      </button>

      {isListening && <p>Listening...</p>}
      {transcript && <p>{transcript}</p>}

      {transcript && <QRCode value={transcript} ref={qrCanvasRef} />}

      {showCopyPopup && <PopupMessage message="Text copied to clipboard!" onClose={handleCloseCopyPopup} />}
      {showClearPopup && <PopupMessage message="Text cleared!" onClose={handleCloseClearPopup} />}
      {showDownloadPopup && (
        <PopupMessage message="QR Code downloaded!" onClose={handleCloseDownloadPopup} />
      )}
    </div>
  );
};

export default SpeechRecognitionApp;
