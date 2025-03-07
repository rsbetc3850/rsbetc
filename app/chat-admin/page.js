'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Send, LogOut, User, MessageSquare, Clock } from 'lucide-react';

export default function ChatAdmin() {
  // Skip rendering ChatBubble on admin page
  if (typeof window !== 'undefined') {
    // Client-side only code
    const chatBubbleElement = document.querySelector('.chat-bubble-container');
    if (chatBubbleElement) {
      chatBubbleElement.style.display = 'none';
    }
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const refreshInterval = useRef(null);

  // No auto-scrolling to avoid page jump

  // Poll for new sessions and messages
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        await fetchSessions();
        if (selectedSession) {
          await fetchMessages(selectedSession.id);
        }
      };

      // Initial fetch
      fetchData();
      
      // Set up more frequent polling (every 2 seconds) for better real-time experience
      refreshInterval.current = setInterval(fetchData, 2000);

      return () => {
        if (refreshInterval.current) {
          clearInterval(refreshInterval.current);
        }
      };
    }
  }, [isAuthenticated]);
  
  // Load employee status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const employeeId = localStorage.getItem('employeeId');
      if (employeeId) {
        fetch(`/api/chat/employee/${employeeId}`)
          .then(res => {
            if (res.status === 404) {
              // Employee not found, clear localStorage
              console.log("Employee not found, clearing ID from localStorage");
              localStorage.removeItem('employeeId');
              return null;
            }
            return res.json();
          })
          .then(data => {
            if (data && data.isAvailable !== undefined) {
              setIsAvailable(data.isAvailable);
              setEmployeeName(data.name || '');
            }
          })
          .catch(err => {
            console.error('Error fetching employee status:', err);
            // Clear employee ID if there was an error
            localStorage.removeItem('employeeId');
          });
      }
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (password === 'rsbetc3850') {
      // Check if employee exists with this name
      try {
        const storedName = localStorage.getItem('employeeName');
        if (storedName) {
          setEmployeeName(storedName);
        }
        
        setIsAuthenticated(true);
        setError('');
      } catch (err) {
        console.error('Login error:', err);
        setError('An error occurred. Please try again.');
      }
    } else {
      setError('Invalid password');
    }
  };

  const handleSetName = async (e) => {
    e.preventDefault();
    
    if (!employeeName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    try {
      // Register/update employee in the database
      const response = await fetch('/api/chat/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: employeeName, isAvailable })
      });
      
      if (!response.ok) throw new Error('Failed to update employee info');
      
      const data = await response.json();
      localStorage.setItem('employeeName', employeeName);
      localStorage.setItem('employeeId', data.id);
      
      // Fetch active sessions
      fetchSessions();
      
    } catch (err) {
      console.error('Error updating employee:', err);
      setError('Failed to update employee information');
    }
  };

  const handleAvailabilityChange = async (checked) => {
    // Update the local state immediately for UI feedback
    setIsAvailable(checked);
    
    try {
      if (!checked) {
        // If we're setting to unavailable, clear the employee name too
        setEmployeeName('');
        localStorage.removeItem('employeeName');
      }
      
      const employeeId = localStorage.getItem('employeeId');
      
      // Create a new employee if we don't have an ID and we're setting to available
      if (checked && !employeeId && employeeName.trim()) {
        // Register the employee first
        const createResponse = await fetch('/api/chat/employee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: employeeName, 
            isAvailable: true 
          })
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to create employee');
        }
        
        const employeeData = await createResponse.json();
        localStorage.setItem('employeeId', employeeData.id);
        console.log("Created new employee:", employeeData);
        
        // Force refresh sessions
        fetchSessions();
        return;
      }
      
      // DIRECT DATABASE UPDATE for guaranteed reliability
      const response = await fetch(`/api/chat/employee/force-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isAvailable: checked,
          employeeId: employeeId || null // Send null if employeeId is undefined
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update availability: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Employee update response:", data);
      
      // Clear local storage if unavailable
      if (!checked && employeeId) {
        localStorage.removeItem('employeeId');
      }
      
      // Force refresh sessions
      fetchSessions();
      
    } catch (err) {
      console.error('Error updating availability:', err);
      // Revert the state if the server update failed
      setIsAvailable(!checked);
      alert("Failed to update availability status. Please try again.");
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/chat/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      
      const data = await response.json();
      setSessions(data.sessions);
      
      // Filter active sessions
      const active = data.sessions.filter(session => session.status === 'active');
      setActiveSessions(active);
      
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data.messages);
      
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    fetchMessages(session.id);
    
    // If session is not assigned to an employee, assign it
    if (!session.employeeId) {
      try {
        await fetch('/api/chat/assign-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sessionId: session.id, 
            employeeId: localStorage.getItem('employeeId')
          })
        });
      } catch (err) {
        console.error('Error assigning session:', err);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || !selectedSession) return;
    
    try {
      const employeeId = localStorage.getItem('employeeId');
      
      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          employeeId: employeeId,
          content: currentMessage,
          isFromCustomer: false
        })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setCurrentMessage('');
      fetchMessages(selectedSession.id);
      
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const closeSession = async () => {
    if (!selectedSession) return;
    
    try {
      await fetch('/api/chat/close-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedSession.id })
      });
      
      fetchSessions();
      setSelectedSession(null);
      setMessages([]);
      
    } catch (err) {
      console.error('Error closing session:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-zinc-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Chat Admin Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button 
              type="submit" 
              className="w-full bg-red-700 hover:bg-red-800 text-white"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <header className="bg-zinc-800 border-b border-zinc-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Chat Admin Panel</h1>
            <button
              onClick={async () => {
                if (confirm('Reset all chat data? This will delete all messages and sessions.')) {
                  try {
                    const response = await fetch('/api/chat/reset-data', {
                      method: 'POST'
                    });
                    if (response.ok) {
                      alert('Chat data reset successfully');
                      window.location.reload();
                    } else {
                      alert('Failed to reset chat data');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Error resetting chat data');
                  }
                }
              }}
              className="px-2 py-1 rounded text-xs bg-zinc-700 hover:bg-zinc-600 ml-2"
            >
              Reset Data
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAvailabilityChange(!isAvailable)}
              className={`px-4 py-1 rounded-md text-white text-sm ${isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </button>
            
            {isAvailable && (
              <form onSubmit={handleSetName} className="flex gap-2">
                <Input 
                  value={employeeName} 
                  onChange={e => setEmployeeName(e.target.value)} 
                  placeholder="Your Name" 
                  className="w-40 bg-zinc-700 border-zinc-600"
                  required
                />
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  Set Name
                </Button>
              </form>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsAuthenticated(false)}
              className="text-zinc-400 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex flex-1 overflow-hidden">
        {/* Sessions sidebar */}
        <div className="w-80 border-r border-zinc-700 bg-zinc-800 flex flex-col">
          <div className="p-3 border-b border-zinc-700">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Active Sessions ({activeSessions.length})
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeSessions.length > 0 ? (
              <div className="divide-y divide-zinc-700">
                {activeSessions.map(session => (
                  <button
                    key={session.id}
                    className={`w-full text-left p-3 hover:bg-zinc-700 transition-colors ${
                      selectedSession?.id === session.id ? 'bg-zinc-700' : ''
                    }`}
                    onClick={() => handleSelectSession(session)}
                  >
                    <div className="font-medium">{session.customerName}</div>
                    <div className="text-sm text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatTime(session.createdAt)}
                    </div>
                    {session.customerPhone && (
                      <div className="text-sm text-zinc-400 mt-1">{session.customerPhone}</div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-zinc-500">
                No active chat sessions
              </div>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              <div className="p-4 border-b border-zinc-700 bg-zinc-800 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> 
                    {selectedSession.customerName}
                  </h2>
                  {selectedSession.customerPhone && (
                    <div className="text-sm text-zinc-400">{selectedSession.customerPhone}</div>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={closeSession}
                  className="text-red-400 hover:text-red-500 border-red-500"
                >
                  Close Chat
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isFromCustomer ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`px-3 py-2 rounded-lg max-w-[80%] ${
                        message.isFromCustomer 
                          ? 'bg-zinc-700 text-white' 
                          : message.aiGenerated
                            ? 'bg-zinc-600 text-zinc-200 border border-zinc-500'
                            : 'bg-red-700 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {formatTime(message.createdAt)}
                        {message.aiGenerated && ' • AI Generated'}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form 
                onSubmit={handleSendMessage} 
                className="border-t border-zinc-700 p-3 flex gap-2"
              >
                <Input
                  value={currentMessage}
                  onChange={e => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-zinc-800 border-zinc-700"
                />
                <Button 
                  type="submit" 
                  className="bg-red-700 hover:bg-red-800"
                  disabled={!currentMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>Select a chat to get started</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}