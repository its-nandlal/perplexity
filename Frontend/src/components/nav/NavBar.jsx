import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Icons
import {
  Search,
  Pencil,
  MoreHorizontal,
  ChevronDown,
  MessageSquare,
  Settings,
  LogOut,
  Trash2,
  Edit3,
  User,
} from 'lucide-react'

// Mock thread data
const mockThreads = {
  today: [
    { id: '1', title: 'React hooks explained with examples', timestamp: '2 hours ago' },
    { id: '2', title: 'Tailwind CSS best practices for large projects', timestamp: '5 hours ago' },
    { id: '8', title: 'How to implement authentication in Node.js', timestamp: '3 hours ago' },
  ],
  yesterday: [
    { id: '3', title: 'Node.js async patterns and best practices', timestamp: 'Yesterday' },
    { id: '4', title: 'MongoDB aggregation pipeline examples', timestamp: 'Yesterday' },
  ],
  previous7Days: [
    { id: '5', title: 'Docker compose setup for development', timestamp: '3 days ago' },
    { id: '6', title: 'Redis caching strategies for high traffic', timestamp: '5 days ago' },
    { id: '7', title: 'WebSocket implementation with Socket.io', timestamp: '6 days ago' },
    { id: '9', title: 'Kubernetes deployment guide for beginners', timestamp: '7 days ago' },
  ],
}

export default function NavBar() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeThread, setActiveThread] = useState('1')
  const [threads, setThreads] = useState(mockThreads)

  // Dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedThread, setSelectedThread] = useState(null)
  const [newTitle, setNewTitle] = useState('')

  const handleNewThread = () => {
    navigate('/dashboard')
  }

  const handleThreadClick = (threadId) => {
    setActiveThread(threadId)
    navigate(`/dashboard?thread=${threadId}`)
  }

  const openRenameDialog = (thread) => {
    setSelectedThread(thread)
    setNewTitle(thread.title)
    setRenameDialogOpen(true)
  }

  const openDeleteDialog = (thread) => {
    setSelectedThread(thread)
    setDeleteDialogOpen(true)
  }

  const confirmRename = () => {
    if (!selectedThread || !newTitle.trim()) return

    const updateThread = (group) =>
      group.map((t) => (t.id === selectedThread.id ? { ...t, title: newTitle } : t))

    setThreads({
      today: updateThread(threads.today),
      yesterday: updateThread(threads.yesterday),
      previous7Days: updateThread(threads.previous7Days),
    })

    setRenameDialogOpen(false)
    setSelectedThread(null)
    setNewTitle('')
  }

  const confirmDelete = () => {
    if (!selectedThread) return

    const filterThread = (group) => group.filter((t) => t.id !== selectedThread.id)

    setThreads({
      today: filterThread(threads.today),
      yesterday: filterThread(threads.yesterday),
      previous7Days: filterThread(threads.previous7Days),
    })

    if (activeThread === selectedThread.id) {
      setActiveThread(null)
    }

    setDeleteDialogOpen(false)
    setSelectedThread(null)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="max-w-64 w-full h-screen bg-[#0a0a0a] border-r border-zinc-800 flex flex-col overflow-hidden">
        {/* Header - Logo & New Thread */}
        <div className="p-3 flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2 px-1 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-zinc-100 font-semibold text-sm">Perplexity</span>
          </div>

          {/* New Thread Button */}
          <Button
            onClick={handleNewThread}
            className="w-full h-9 flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50 rounded-lg text-sm font-medium"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>New Thread</span>
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 bg-zinc-900 border-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:border-zinc-600 text-sm rounded-lg"
            />
          </div>
        </div>

        {/* Thread History - Scrollable */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden min-h-0 px-2 py-1">
            {/* Today Section */}
            {threads.today.length > 0 && (
              <div className="w-full mb-4">
                <h3 className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Today
                </h3>
                <div className="w-full space-y-0.5">
                  {threads.today.map((thread) => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      isActive={activeThread === thread.id}
                      onClick={() => handleThreadClick(thread.id)}
                      onRename={() => openRenameDialog(thread)}
                      onDelete={() => openDeleteDialog(thread)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday Section */}
            {threads.yesterday.length > 0 && (
              <div className="mb-4">
                <h3 className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Yesterday
                </h3>
                <div className="space-y-0.5">
                  {threads.yesterday.map((thread) => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      isActive={activeThread === thread.id}
                      onClick={() => handleThreadClick(thread.id)}
                      onRename={() => openRenameDialog(thread)}
                      onDelete={() => openDeleteDialog(thread)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Previous 7 Days */}
            {threads.previous7Days.length > 0 && (
              <div className="mb-4">
                <h3 className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Previous 7 Days
                </h3>
                <div className="space-y-0.5">
                  {threads.previous7Days.map((thread) => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      isActive={activeThread === thread.id}
                      onClick={() => handleThreadClick(thread.id)}
                      onRename={() => openRenameDialog(thread)}
                      onDelete={() => openDeleteDialog(thread)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        {/* </div> */}

        {/* User Profile - Fixed at bottom */}
        <div className="w-full p-3 border-t border-zinc-800 shrink-0 bg-[#0a0a0a]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-60 flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-800/60 transition-colors text-left group overflow-hidden">
                <Avatar className="w-8 h-8 border border-zinc-700">
                  <AvatarImage src={user?.user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-medium">
                    {getInitials(user?.user?.username)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {user?.user?.username || 'User'}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    Free Plan
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </div>
              </button>                
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-zinc-900 border-zinc-800">
              <div className="px-2 py-2 border-b border-zinc-800 mb-1">
                <p className="text-xs text-zinc-500">Signed in as</p>
                <p className="text-sm text-zinc-300 truncate">{user?.user?.email || 'user@example.com'}</p>
              </div>
              <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-base">Rename Chat</DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              Enter a new name for this chat.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Chat name"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-teal-500 h-10"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setRenameDialogOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRename}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-base">Delete Chat</DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              Are you sure you want to delete "<span className="text-zinc-300 font-medium">{selectedThread?.title}</span>"? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

// Thread Row Component - Separate for cleaner code
function ThreadRow({ thread, isActive, onClick, onRename, onDelete }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={onClick}
          className={`group w-64 flex items-center justify-between gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            isActive
              ? 'bg-zinc-800 text-zinc-100'
              : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="max-w-full w-[calc(100%-20%)] truncate text-xs overflow-hidden leading-5 font-normal">
            {thread.title}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-6 w-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-zinc-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  className="w-36 -right-20! bg-zinc-900 border-zinc-800">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onRename()
                }}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 text-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 mr-2" />
                Rename Threds
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-red-400 focus:text-red-400 focus:bg-red-500/10 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete Threds
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10} className="max-w-xs">
        <p>{thread.title}</p>
      </TooltipContent>
    </Tooltip>
  )
}
