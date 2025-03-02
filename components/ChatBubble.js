'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStage, setChatStage] = useState('initial'); // initial -> info -> chat
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', query: '' });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Poll for new messages every 3 seconds when in chat mode
  useEffect(() => {
    let interval = null;
    
    const fetchNewMessages = async () => {
      if (sessionId && chatStage === 'chat') {
        try {
          const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            
            // Update messages if there are new ones
            if (data.messages.length > messages.length) {
              setMessages(data.messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                isFromCustomer: msg.isFromCustomer,
                aiGenerated: msg.aiGenerated || false,
                createdAt: msg.createdAt
              })));
            }
          }
        } catch (error) {
          console.error('Error polling for messages:', error);
        }
      }
    };
    
    if (sessionId && chatStage === 'chat') {
      // Initial fetch
      fetchNewMessages();
      
      // Set up polling
      interval = setInterval(fetchNewMessages, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, chatStage, messages.length]);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.name) {
      setError('Please provide your name');
      return;
    }

    setIsConnecting(true);
    
    try {
      // First, try to connect to an available employee
      const response = await fetch('/api/chat/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerInfo)
      });
      
      if (!response.ok) throw new Error('Failed to start chat session');
      
      const data = await response.json();
      setSessionId(data.sessionId);
      
      // If there's an employee available, add the welcome message
      if (data.employeeConnected) {
        setMessages([{ 
          id: Date.now(), 
          content: `Hello ${customerInfo.name}, you're connected with ${data.employeeName}. How can I help you today?`,
          isFromCustomer: false 
        }]);
        setChatStage('chat');
      } else {
        // If no employee is available, we'll show AI-powered responses
        setMessages([{ 
          id: Date.now(), 
          content: `Hello ${customerInfo.name}, all our agents are currently busy. I'm an AI assistant and I'll do my best to help you.`,
          isFromCustomer: false,
          aiGenerated: true
        }]);
        
        // If query was provided, send it to AI
        if (customerInfo.query) {
          sendMessageToAI(customerInfo.query);
        }
        
        setChatStage('chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to connect. Please try again later.');
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    // Optimistically add message to UI
    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      isFromCustomer: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content: inputMessage,
          isFromCustomer: true
        })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      
      // If we're using AI, send message to AI and get response
      if (data.useAI) {
        sendMessageToAI(inputMessage);
      }
      
      // For employee responses, we'll listen via polling or WebSocket in a real implementation
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const sendMessageToAI = async (message) => {
    try {
      // Show typing indicator
      setMessages(prev => [...prev, { 
        id: 'typing', 
        content: '...', 
        isFromCustomer: false,
        isTyping: true
      }]);

      // Get system prompt based on customer info
      const systemPrompt = `You are a helpful customer service representative for BATTERIESETCONLINE.COM, a business that sells batteries and related products. The customer's name is ${customerInfo.name}. ${customerInfo.phone ? `Their phone number is ${customerInfo.phone}.` : ''}
      
Be friendly, professional, and concise in your responses. Focus on helping the customer with their battery needs. If they ask questions you can't answer, offer to take their contact information and have a human representative get back to them.`;

      // Use our own API endpoint as a proxy to avoid CORS issues
      const response = await fetch(`/api/chat/ai?system=${encodeURIComponent(systemPrompt)}&user=${encodeURIComponent(message)}`);
      
      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      if (data && data.length > 0 && data[0].response) {
        // Add AI response to messages
        const aiResponse = {
          id: Date.now(),
          content: data[0].response.response,
          isFromCustomer: false,
          aiGenerated: true
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
        // Store the AI response in the backend
        await fetch('/api/chat/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            content: data[0].response.response,
            isFromCustomer: false,
            aiGenerated: true
          })
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Show error message
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        content: "I'm sorry, I'm having trouble connecting. Please try again or leave your contact information for a human representative to reach out to you.",
        isFromCustomer: false,
        aiGenerated: true
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderChatStage = () => {
    switch (chatStage) {
      case 'initial':
        return (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">Your Name*</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="bg-zinc-800 text-white border-zinc-600"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white font-medium">Phone Number (Optional)</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="bg-zinc-800 text-white border-zinc-600"
                placeholder="For follow-up if needed"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="query" className="text-white font-medium">How can we help you?</Label>
              <Textarea
                id="query"
                value={customerInfo.query}
                onChange={e => setCustomerInfo({...customerInfo, query: e.target.value})}
                className="bg-zinc-800 text-white border-zinc-600"
                placeholder="Describe your issue or question..."
                rows={3}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button 
              type="submit" 
              className="w-full bg-red-700 hover:bg-red-800 text-white"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Start Chat'}
            </Button>
          </form>
        );
        
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={message.id || index} 
                  className={`flex ${message.isFromCustomer ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`px-3 py-2 rounded-lg max-w-[80%] ${
                      message.isFromCustomer 
                        ? 'bg-red-700 text-white' 
                        : message.aiGenerated 
                          ? 'bg-zinc-700 text-white' 
                          : 'bg-zinc-800 text-white'
                    } ${message.isTyping ? 'animate-pulse' : ''}`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t border-zinc-700 p-3 flex gap-2">
              <Input
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-800 text-white border-zinc-600"
              />
              <Button 
                onClick={sendMessage} 
                className="bg-red-700 hover:bg-red-800 text-white"
                disabled={!inputMessage.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="rounded-full w-12 h-12 bg-red-700 hover:bg-red-800 shadow-lg"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom-right"
          className="h-[500px] sm:h-[500px] bg-zinc-900 text-white border-zinc-700 rounded-t-lg p-0 flex flex-col overflow-hidden"
        >
          <SheetHeader className="p-4 border-b border-zinc-700 text-left">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-white text-lg">
                {chatStage === 'chat' ? 'Live Chat' : 'Start a Conversation'}
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderChatStage()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}