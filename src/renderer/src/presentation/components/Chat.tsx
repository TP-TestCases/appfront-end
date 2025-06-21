import React from 'react'
import { Card, CardBody, CardHeader, Input, Button, Avatar } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { ChatService } from '@renderer/application/ChatService'
import { InMemoryMessageRepository } from '@renderer/infrastructure/InMemoryMessageRepository'
import { Message } from '@renderer/domain/message'

const repository = new InMemoryMessageRepository([
  { id: 1, sender: 'Alice', content: 'Hey, are you there?', timestamp: '10:30 AM' },
  { id: 2, sender: 'You', content: "Yes, I'm here. What's up?", timestamp: '10:31 AM' },
  {
    id: 3,
    sender: 'Alice',
    content: 'Just wanted to check on the progress of the new feature.',
    timestamp: '10:32 AM'
  }
])
const chatService = new ChatService(repository)

const Chat: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([])

  React.useEffect(() => {
    chatService.getMessages().then((m) => setMessages(m))
  }, [])

  const [newMessage, setNewMessage] = React.useState('')

  const handleSendMessage = async (): Promise<void> => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      await chatService.addMessage(message)
      const updated = await chatService.getMessages()
      setMessages(updated)
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-[calc(100vh-100px)]">
      <Card className="w-1/4 mr-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Conversations</h2>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 p-2 hover:bg-content1 rounded-md cursor-pointer">
              <Avatar size="sm" src="https://img.heroui.chat/image/avatar?w=200&h=200&u=2" />
              <div>
                <p className="font-semibold">Alice</p>
                <p className="text-small text-default-500">Online</p>
              </div>
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-content1 rounded-md cursor-pointer">
              <Avatar size="sm" src="https://img.heroui.chat/image/avatar?w=200&h=200&u=3" />
              <div>
                <p className="font-semibold">Bob</p>
                <p className="text-small text-default-500">Offline</p>
              </div>
            </li>
          </ul>
        </CardBody>
      </Card>
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <h2 className="text-lg font-semibold">Chat with Alice</h2>
        </CardHeader>
        <CardBody className="flex-grow overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${message.sender === 'You' ? 'bg-primary text-white' : 'bg-content2'} rounded-lg p-3`}
                >
                  <p className="font-semibold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-right mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
        <div className="p-4 border-t border-content3">
          <div className="flex items-center">
            <Input
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button color="primary" isIconOnly className="ml-2" onClick={handleSendMessage}>
              <Icon icon="lucide:send" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Chat
