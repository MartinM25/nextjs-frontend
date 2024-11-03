"use client"

import React, { useState, useEffect, ReactNode } from 'react';
import { Button } from "@/components/ui/button";

import { getUserChats, fetchUserById  } from '@/app/utils/axios';
import './dialog.css';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface Chat {
  other_participant: string;
  last_message_preview: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  profilePicture?: string; // Optional if not always present
}

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ [key: string]: any }>({});

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const chatData: Chat[] = await getUserChats();
        setChats(chatData);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in local storage');
        }

        const userPromises = chatData.map(chat => 
          fetchUserById(chat.other_participant)
        );

        const usersData = await Promise.all(userPromises);
        const usersMap = chatData.reduce<{ [key: string]: User }>((acc, chat, index) => {
          acc[chat.other_participant] = usersData[index];
          return acc;
        }, {});

        setUsers(usersMap);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          <Button className="close-button" onClick={onClose}>
            &times;
          </Button>
          {children}
        </div>
      </div>
    );
  };


  return (
    <div className='lg:mx-16'>
      <div className="flex items-center justify-between mt-10">
        <h2 className="text-3xl font-bold tracking-tight">Chats</h2>
        <Button onClick={openDialog}>New Chat</Button>
      </div>

      {loading ? (
        <p>Loading chats...</p>
      ) : (
        <div className="chat-list mt-5">
          {chats.length > 0 ? (
            chats.map((chat, index) => (
              <div key={index} className="chat-item mb-2 p-2 border rounded">
                {/* Render chat details here; adjust fields as per your chat data */}
                
                <p>{users[chat.other_participant].name}</p>
                <p>{chat.last_message_preview}</p>
              </div>
            ))
          ) : (
            <p>No chats</p>
          )}
        </div>
      )}

      {/* Render the Dialog */}
      <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
        <h2>Dialog Title</h2>
        <p>This is the content of the dialog.</p>
        <Button onClick={closeDialog}>Close</Button>
      </Dialog>
    </div>
  )
}

export default Page