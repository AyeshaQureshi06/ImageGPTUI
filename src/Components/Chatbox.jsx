'use client';

import { generateStoryFromImage, askQuestionAboutStory } from '@/api'; // Import both functions
import React, { useState } from 'react';

const Chatbox = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mood, setMood] = useState('fantasy');
  const [dragging, setDragging] = useState(false);

  const handleInputChange = (e) => setInputText(e.target.value);
  const handleModelChange = (e) => setSelectedModel(e.target.value);

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText && !image) return;

    const userMessageContent = (
      <div className="flex flex-col gap-2">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Uploaded preview"
            className="max-w-full rounded-lg border"
          />
        )}
        {inputText && <p>{inputText}</p>}
      </div>
    );

    setMessages((prev) => [...prev, { type: 'user', text: userMessageContent }]);
    setInputText('');
    setImage(null);
    setImagePreview(null);
    setLoading(true);

    const loadingMessage = { type: 'bot', text: 'Generating your story... Please wait.' };
    setMessages((prev) => [...prev, loadingMessage]);
    const loadingIndex = messages.length + 1;

    try {
      let response;

      // If image is uploaded
      if (selectedModel === 'Gemini' && image) {
        const data = await generateStoryFromImage(image, mood, inputText);
        response = (
          <>
            <p className="whitespace-pre-line">{data.story}</p>
            <audio controls className="mt-2">
              <source src={`http://127.0.0.1:5000${data.audio_url}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </>
        );

        // ✅ Save response to localStorage
        localStorage.setItem('lastGeneratedStory', JSON.stringify({
          text: data.story,
          audioUrl: data.audio_url,
          timestamp: new Date().toISOString()
        }));
      } else {
        // If no image, call the ask question API
        if (inputText) {
          const questionResponse = await askQuestionAboutStory(inputText);
          response = (
            <p className="whitespace-pre-line">{questionResponse.answer}</p>
          );
        } else {
          response = 'Please upload an image or ask a question to generate a story.';
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[loadingIndex] = { type: 'bot', text: response };
        return updated;
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[loadingIndex] = {
          type: 'bot',
          text: '⚠️ Oops! Something went wrong.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-5 py-15 md:gap-10 md:px-0 px-5 items-center justify-between h-[100vh] md:h-[100vh]"
      style={{ backgroundColor: 'cornsilk' }}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h3 className="md:text-5xl text-3xl text-center font-light text-black py-40">
            How Can We Assist You Today
          </h3>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto overflow-y-auto flex-grow pt-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] whitespace-pre-line ${
                message.type === 'user'
                  ? 'bg-[#520003] text-white text-right px-5 py-3 rounded-lg'
                  : 'text-black text-left'
              }`}
            >
              {typeof message.text === 'string' ? message.text : message.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="w-full max-w-3xl mx-auto mb-10">
        {selectedModel === 'Gemini' && (
          <div
            className={`flex flex-row items-center gap-2 mb-3 border-2 rounded-lg p-2 transition ${
              dragging ? 'border-dashed border-red-500 bg-red-100' : 'border-transparent'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              style={{ backgroundColor: '#713f3f26' }}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              disabled={loading}
              className="border px-3 py-2 rounded-lg text-sm"
            />
            {imagePreview && (
              <div className="flex items-center justify-center w-full bg-gray-200 rounded-lg p-3">
                <img src={imagePreview} alt="Preview" className="max-w-full h-auto" />
              </div>
            )}
            <select
              style={{ backgroundColor: '#713f3f26' }}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              disabled={loading}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="fantasy">Fantasy</option>
              <option value="horror">Horror</option>
              <option value="emotional">Emotional</option>
              <option value="mystery">Mystery</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            style={{ backgroundColor: '#713f3f26' }}
            type="text"
            placeholder="How can I help you?"
            className="flex-grow border px-4 py-2 rounded-lg text-black"
            value={inputText}
            onChange={handleInputChange}
            disabled={loading}
          />
          <button
            className="bg-[#520003] text-white rounded-lg px-4 py-2 text-sm"
            type="submit"
            disabled={loading || (!inputText && !image)}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      <footer className="w-full text-center py-2 text-sm text-black">
        © 2025 PixelToProse. All rights reserved.
      </footer>
    </div>
  );
};

export default Chatbox;
