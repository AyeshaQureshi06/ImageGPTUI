'use client';

import { generateStoryFromImage, askQuestionAboutStory } from '@/api';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const Chatbox = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'guest@example.com';

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mood, setMood] = useState('fantasy');
  const [dragging, setDragging] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookStory, setBookStory] = useState('');

  const handleInputChange = (e) => setInputText(e.target.value);
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

  const handleDragLeave = () => setDragging(false);

  const extractTitleFromStory = (story) => {
  const match = story.match(/^## (.+)$/m); // Regex to find first heading
  if (match) {
    return match[1].trim();
  } else {
    return 'Untitled Story';
  }
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
            className="w-[250px] h-[250px] object-cover rounded-lg border"
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
      if (selectedModel === 'Gemini' && image) {
        const data = await generateStoryFromImage(image, mood, inputText, userEmail);
        
        setBookStory(data.story);
        setBookOpen(true);

          const extractedTitle = extractTitleFromStory(data.story);
    console.log('Extracted Title:', extractedTitle);

        response = (
          <div className="relative cursor-pointer" onClick={() => setBookOpen(true)}>
            <img
              src={imagePreview}
              alt="Book Cover"
              className="w-[250px] h-[250px] object-cover mx-auto border-4 border-[#5F4B8BFF] rounded shadow-lg hover:scale-105 transition duration-300"
            />
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center rounded">
      <p className="text-white text-center font-bold text-lg px-2">{extractedTitle}</p>
    </div>
            <p className="text-center mt-2 text-[#5F4B8BFF] font-semibold">Click to read your story</p>
          </div>
        );

        localStorage.setItem('lastGeneratedStory', JSON.stringify({
          text: data.story,
          audioUrl: data.audio_url,
          timestamp: new Date().toISOString()
        }));
      } else if (inputText) {
        const questionResponse = await askQuestionAboutStory(inputText, userEmail);
        response = <p className="whitespace-pre-line">{questionResponse.answer}</p>;
      } else {
        response = 'Please upload an image or ask a question to generate a story.';
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
    <div className="flex flex-col h-[100vh] bg-[#FCF6F5FF] pt-[80px] overflow-x-hidden">
      <div className="flex flex-col items-center gap-5 md:gap-10 px-4 md:px-0 flex-grow overflow-hidden">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-grow pt-[10rem]">
            <h3 className="md:text-5xl text-3xl text-center font-light text-[#5F4B8BFF] ">
              How May I Help You Craft a Story Today?
            </h3>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto overflow-y-auto flex-grow max-h-[70vh] px-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] whitespace-pre-line ${message.type === 'user'
                  ? 'bg-[#5F4B8BFF] text-white text-right px-5 py-3 rounded-lg'
                  : 'text-black text-left px-5 py-3 rounded-lg'
                  }`}
              >
                {typeof message.text === 'string' ? message.text : message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="w-full max-w-3xl mx-auto mb-6">
          {selectedModel === 'Gemini' && (
            <div
              className={`flex flex-col md:flex-row md:items-center gap-4 mb-3 border-2 rounded-lg p-4 transition ${dragging ? 'border-dashed border-[#5F4B8BFF] bg-purple-100' : 'border-transparent'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                style={{ backgroundColor: '#E4D6F1' }}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])}
                disabled={loading}
                className="border px-3 py-2 rounded-lg text-sm"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-[150px] h-[150px] object-cover rounded shadow-md"
                />
              )}
              <select
                style={{ backgroundColor: '#E4D6F1' }}
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
              style={{ backgroundColor: '#E4D6F1' }}
              type="text"
              placeholder="How can I help you?"
              className="flex-grow border px-4 py-2 rounded-lg text-black"
              value={inputText}
              onChange={handleInputChange}
              disabled={loading}
            />
            <button
              className="bg-[#5F4B8BFF] text-white rounded-lg px-4 py-2 text-sm"
              type="submit"
              disabled={loading || (!inputText && !image)}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      {bookOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-[#fdf6e3] w-[80%] max-w-3xl h-[80%] overflow-hidden shadow-2xl rounded-xl relative animate-[flipPages_0.7s_ease-in-out]">
            <button
              className="absolute top-2 right-4 text-black text-xl"
              onClick={() => setBookOpen(false)}
            >
              ✖
            </button>
            <div className="h-full overflow-y-auto px-10 py-6 font-serif text-lg text-[#5F4B8BFF] leading-relaxed">
              {bookStory.split('\n').map((line, idx) => (
                <p key={idx} className="mb-4">{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="w-full text-center py-2 text-sm text-black">
        © 2025 PixelToProse. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes flipPages {
          0% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbox;
