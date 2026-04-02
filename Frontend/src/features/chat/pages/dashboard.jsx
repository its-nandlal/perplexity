import { useChat } from "../hooks/useChat"
import { useEffect, useState, useRef, useCallback } from "react"
import NavBar from "../../../components/nav/NavBar"
import { Button } from "@/components/ui/button"
import { ArrowUp, Search, Image, Globe, Newspaper, Compass } from "lucide-react"
import { useSelector } from "react-redux"

const suggestedPrompts = [
  {
    icon: Compass,
    title: "What can I help with?",
    description: "Ask me anything",
  },
  {
    icon: Search,
    title: "Search the web",
    description: "Find current information",
  },
  {
    icon: Image,
    title: "Generate images",
    description: "Create AI art",
  },
  {
    icon: Newspaper,
    title: "Summarize articles",
    description: "Get key insights",
  },
]

export default function Dashboard() {
  const chat = useChat()
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)
  const MIN_ROWS = 4
  const MAX_ROWS = 20
  const LINE_HEIGHT = 24

  useEffect(() => {
    chat.initalizeSocketConnection()
  }, [])


  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  // Auto-resize textarea based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    const minHeight = MIN_ROWS * LINE_HEIGHT
    const maxHeight = MAX_ROWS * LINE_HEIGHT
    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight))

    textarea.style.height = `${newHeight}px`
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden"
  }, [])

  // Adjust height when input changes
  useEffect(() => {
    adjustHeight()
  }, [inputValue, adjustHeight])

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    chat.handleSendMessage({ message: inputValue, chatId: currentChatId })

    setInputValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handlePromptClick = (prompt) => {
    setInputValue(prompt.title)
    setTimeout(adjustHeight, 0)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <main className="w-full h-screen flex bg-[#0a0a0a]">
      <NavBar />

      <section className="max-w-3xl mx-auto flex-1 h-full flex flex-col relative overflow-hidden">
        <div className={`flex-1 flex flex-col items-center ${currentChatId ? 'justify-between ' : 'justify-center'} px-4 py-10`}>
          {!currentChatId && (
            <div className="mb-8 flex flex-col items-center">
              <h1 className="text-4xl font-medium text-zinc-100">
                Perplexity
              </h1>
            </div>
          )}

          <div className="w-full">
            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message._id}
                className={`w-full flex
            ${message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start '
                  }`}>
                <div className={`rounded-2xl px-4 py-2 text-sm md:text-base
              ${message.role === 'user'
                    ? 'bg-neutral-700/80 border-neutral-500/80 '
                    : 'bg-neutral-800/30 border-neutral-700/70'
                  }
                `}>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>


          <div className="w-full">
            <div
              className={`
                relative bg-zinc-900 rounded-2xl border transition-all duration-200
                ${isFocused
                  ? "border-teal-500/50 shadow-lg shadow-teal-500/10"
                  : "border-zinc-800 hover:border-zinc-700"
                }
              `}
            >
              <form onSubmit={handleSubmit} className="flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="
                    w-full bg-transparent text-zinc-100 placeholder:text-zinc-500
                    px-4 pt-4 pb-2 resize-none outline-none
                    text-base leading-6
                  "
                  style={{
                    minHeight: `${MIN_ROWS * LINE_HEIGHT}px`,
                    maxHeight: `${MAX_ROWS * LINE_HEIGHT}px`,
                    overflow: "hidden",
                  }}
                />

                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Pro</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Focus</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!inputValue.trim()}
                      className="
                        h-8 w-8 rounded-lg bg-zinc-100 hover:bg-white text-black
                        disabled:opacity-30 disabled:cursor-not-allowed
                        transition-all
                      "
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {!currentChatId && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="
                    flex flex-col items-start gap-2 p-3 rounded-xl
                    bg-zinc-900/50 border border-zinc-800/50
                    hover:bg-zinc-900 hover:border-zinc-700
                    transition-all group text-left
                  "
                  >
                    <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 group-hover:text-zinc-200">
                      <prompt.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">
                        {prompt.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {prompt.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </section>
    </main>
  )
}
