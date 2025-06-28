'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react'; // ✅ Import session
import { Home, BookOpen, User, Menu, PlusSquareIcon } from 'lucide-react';
import { getUserHistory } from '@/api';


const Sidebar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = async () => {
    try {
      if (!session) {
        console.error('No user session found.');
        return;
      }

      const email = session.user.email; // ✅ Get user email from session
      const data = await getUserHistory(email);
      console.log("Requesting history for:", email);
      setHistory(data);
      setShowHistory(true);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <>
      {/* Toggle Button (offset below navbar) */}
      <button
        className="fixed top-2 left-4 z-30 p-2 bg-[#5F4B8BFF] text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-15 h-[calc(100%-3rem)] bg-[#FCF6F5FF] border-r transition-all z-20 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
      >
        <div className="py-4">
          <SidebarItem icon={<PlusSquareIcon size={20} />} label="New Chat" />
          <SidebarItem icon={<BookOpen size={20} />} label="History" onClick={fetchHistory} />
        </div>

        {/* History Section */}
        {showHistory && (
          <div className="p-3 overflow-y-auto max-h-[60vh]">
            {history.length === 0 ? (
              <p>No history found.</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="mb-3 p-2 ">
                  <h4 className="font-semibold truncate">{item.prompt}</h4>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

const SidebarItem = ({ icon, label, onClick }) => (
  <div
    className="flex items-center gap-3 p-3 w-full hover:bg-gray-200 cursor-pointer text-gray-800"
    onClick={onClick}
  >
    <span>{icon}</span>
    <span className="hidden md:inline">{label}</span>
  </div>
);

export default Sidebar;
