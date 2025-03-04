"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatUI() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const [styles, setStyles] = useState({
    primaryColor: "#4A90E2",
    secondaryColor: "#ffffff",
    textColor: "#333333",
    accentColor: "#FFB948",
  })

  const updateStyles = (newStyles: any) => {
    const root = document.documentElement
    Object.entries(newStyles.customProperties || {}).forEach(([key, value]) => {
      root.style.setProperty(key, value as string)
    })
    setStyles((prev) => ({ ...prev, ...newStyles.customProperties }))
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <header className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <RobotIcon />
            <h1 className="text-3xl font-bold" style={{ color: styles.primaryColor }}>
              LearnBot
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your friendly study buddy! Ask me anything about science, technology, engineering, math, and computing!
          </p>
        </header>

        <div className="h-[50vh] overflow-y-auto bg-[#f8faff] rounded-lg p-6 border-2 border-[#e8eeff] mb-6">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me any question! I'm here to help 😊"
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

function RobotIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100">
      <rect x="25" y="30" width="50" height="40" rx="5" fill="currentColor" />
      <circle cx="40" cy="45" r="5" fill="#FFF" />
      <circle cx="60" cy="45" r="5" fill="#FFF" />
      <rect x="35" y="60" width="30" height="5" rx="2" fill="#FFF" />
      <rect x="45" y="70" width="10" height="15" fill="currentColor" />
      <rect x="35" y="15" width="30" height="15" rx="7" fill="currentColor" />
    </svg>
  )
}
