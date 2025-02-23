import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  // State für Text, verfügbare Stimmen und die ausgewählte Stimme
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speech] = useState(new SpeechSynthesisUtterance());

  // useEffect, um Stimmen zu laden, wenn die Seite lädt oder sich ändert
  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]); // Wählen die erste Stimme als Standard
    };

    // Event-Listener für Stimmenänderung
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    // Stimmen beim ersten Laden der Seite holen
    handleVoicesChanged();

    // Bereinigen des Event Listeners bei Unmount
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Wenn sich die ausgewählte Stimme ändert, wird `speech.voice` aktualisiert
  useEffect(() => {
    speech.voice = selectedVoice;
  }, [selectedVoice, speech]);

  // Funktion für den Text-to-Speech-Ereignis
  const handleSpeak = () => {
    speech.text = text;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="hero">
      <h1>Text To Speech <span>Converter</span></h1>

      {/* Textarea für den Benutzer */}
      <textarea
        placeholder="Write anything here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      {/* Dropdown zum Auswählen einer Stimme */}
      <div className="row">
        <select
          value={voices.findIndex((voice) => voice === selectedVoice)}
          onChange={(e) => setSelectedVoice(voices[e.target.value])}
        >
          {voices.map((voice, index) => (
            <option key={index} value={index}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>

        {/* Button für den Benutzer, um die Sprachsynthese zu starten */}
        <button onClick={handleSpeak}>
          <img src="/images/play.png" alt="play icon" />
          Listen
        </button>
      </div>
    </div>
  );
}

export default App;