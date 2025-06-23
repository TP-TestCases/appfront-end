import React from 'react'
import { Input } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { InMemoryMessageRepository } from '@renderer/infrastructure/chat/InMemoryMessageRepository'
import { ChatService } from '@renderer/application/chat/ChatService'
import { Message } from '@renderer/domain/chat/message'
import { Buttons } from '../shared/Button'

const repository = new InMemoryMessageRepository([
  { id: 1, sender: 'AI', content: '¡Hola! ¿En qué puedo ayudarte hoy?', timestamp: '10:30 AM' },
])
const chatService = new ChatService(repository)

const Chat: React.FC = () => {
  const [convos] = React.useState([
    { id: '1', title: 'Chat con IA', last: 'Justo ahora' },
    { id: '2', title: 'Resumen de datos', last: 'Hace 2h' },
  ])
  const [activeConvo, setActiveConvo] = React.useState(convos[0].id)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [newMessage, setNewMessage] = React.useState('')

  React.useEffect(() => {
    chatService.getMessages().then(setMessages)
  }, [activeConvo])

  const handleSend = async (): Promise<void> => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    await chatService.addMessage(msg)
    setMessages(await chatService.getMessages())
    setNewMessage('')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar fijo SIN scroll */}
      <aside className="w-64 bg-white border-r flex flex-col h-screen">
        <div className="p-4 flex-none">
          <Buttons flat tone="primary" rounded="md" fullWidth>
            <Icon icon="lucide:plus" className="mr-2" /> New Chat
          </Buttons>
        </div>
        <nav className="flex-1 overflow-hidden">
          <ul className="space-y-1 px-2">
            <li className="mt-2 text-xs font-semibold text-gray-500">Today</li>
            {convos.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveConvo(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center
                    ${activeConvo === c.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  <span className="font-medium">{c.title}</span>
                  <span className="text-xs text-gray-400">{c.last}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Área de chat */}
      <section className="flex-1 flex flex-col">
        {/* Header fijo */}
        <header className="flex-none px-6 py-4 border-b bg-white">
          <h1 className="text-lg font-semibold">TestCases AI</h1>
        </header>

        {/* ÚNICO scroll: mensajes */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-xl p-3 space-y-1 
                  ${m.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-white shadow'}`}
              >
                <p className="text-sm">{m.content}</p>
                <p className="text-xs text-right text-gray-400">{m.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input fijo */}
        <div className="flex-none px-6 py-4 border-t bg-white flex items-center space-x-2">
          <Input
            isClearable
            fullWidth
            placeholder="Ask me anything..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />

          <select className="h-10 px-3 border rounded-md bg-gray-50 text-sm">
            <option>All Sources</option>
            <option>Knowledge Base</option>
            <option>Web</option>
          </select>

          <Buttons flat={false} tone="primary" rounded="md" onClick={handleSend}>
            Send
          </Buttons>
        </div>
      </section>
    </div>
  )
}

export default Chat
