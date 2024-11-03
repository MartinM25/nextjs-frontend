<<<<<<< HEAD
"use client"

import React, { useState, useEffect, ReactNode } from 'react';
import { Button } from "@/components/ui/button";

import { getUserChats, fetchUserById, fetchUsersByRole } from '@/app/utils/axios';
import './dialog.css';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  users: User[];
}

interface Chat {
  other_participant: string;
  last_message_preview: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string>('');

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

        const currentUser = await fetchUserById(token);
        setRole(currentUser.role);

        const userPromises = chatData.map(chat =>
          fetchUserById(chat.other_participant)
        );

        const usersData = await Promise.all(userPromises);

        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isDialogOpen) {
        try {
          const currentUserId = localStorage.getItem('userId');
          if (!currentUserId) {
            console.error('User ID not found in local storage');
            return; // Exit if userId is not found
          }

          const fetchedUsers = await fetchUsersByRole(role, currentUserId);
          setUsers(fetchedUsers); // Assume this is now an array of User
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      }
    };

    fetchUsers();
  }, [isDialogOpen, role]);

  const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, users }) => {
    if (!isOpen) return null;

    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          <Button className="close-button" onClick={onClose}>
            &times;
          </Button>
          <h2>Select User to Chat</h2>
          <div>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.email} className="user-item">
                  <p>{user.name} - {user.email}</p>
                </div>
              ))
            ) : (
              <p>No users available</p>
            )}
          </div>
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
              <div key={index} className="chat-item mb-2 py-4 border-b">
                <p>{users.find(u => u.email === chat.other_participant)?.name}</p>
                <p>{chat.last_message_preview}</p>
              </div>
            ))
          ) : (
            <p>No chats</p>
          )}
        </div>
      )}

      {/* Render the Dialog */}
      <Dialog users={users} isOpen={isDialogOpen} onClose={closeDialog}>
        <h2>Dialog Title</h2>
        <p>This is the content of the dialog.</p>
        <Button onClick={closeDialog}>Close</Button>
      </Dialog>
    </div>
=======
import React from 'react'

const Page = () => {
  return (
    <div>Page</div>
>>>>>>> parent of ddaf4aa (Retrieve chats)
  )
}

export default Page