'use client';

import React, { useState } from 'react';
import { Home, BookOpen, User, Menu, PlusSquareIcon } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button (offset below navbar) */}
      <button
        className="fixed top-2 left-4 z-30 p-2 bg-[#520003] text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar (offset below navbar) */}
      <div
        className={`fixed left-0 top-15 h-[calc(100%-3rem)] bg-[#FFF8DC] border-r transition-all z-20 ${
          isOpen ? 'w-48' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="py-4">
          <SidebarItem icon={<Home size={20} />} label="Home" />
          <SidebarItem icon={<PlusSquareIcon size={20} />} label="New Chat" />
          <SidebarItem icon={<BookOpen size={20} />} label="History" />
          <SidebarItem icon={<User size={20} />} label="Profile" />

        </div>
      </div>
    </>
  );
};

const SidebarItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-3 w-full hover:bg-gray-200 cursor-pointer text-gray-800">
    <span>{icon}</span>
    <span className="hidden md:inline">{label}</span>
  </div>
);

export default Sidebar;
