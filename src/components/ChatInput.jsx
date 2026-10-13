import { useState } from 'react'
import {
    Mic,
    Paperclip,
    Send,
    Zap,
    MessageSquare,
    Code2,
    FileText,
    Presentation,
    ImageIcon,
    Globe
} from 'lucide-react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { updateConversation } from '../features/updateConversation'
import { setSelectedConversation, addConversation, setConvTitle } from '../redux/conversationSlice'

function ChatInput() {
    const [value, setValue] = useState("")
    const [selectedAgent, setSelectedAgent] = useState("Auto")
    const [loading, setLoading] = useState(false)
    const { selectedConversation } = useSelector(state => state.conversation)
    const dispatch = useDispatch()

    const handleSendMessage = async () => {
        if (!value.trim() || loading) return

        const userPrompt = value.trim()
        let conversation = selectedConversation

        setValue("")
        setLoading(true)

        try {
            if (!conversation) {
                const conv = await createConversation()
                if (conv) {
                    dispatch(setSelectedConversation(conv))
                    dispatch(addConversation(conv))
                    conversation = conv
                }
            }

            if (conversation?.title === "New Chat") {
                await updateConversation({ id: conversation?._id, title: userPrompt.slice(0, 40) })
                dispatch(setConvTitle({ conversationId: conversation?._id, title: userPrompt.slice(0, 40) }))
            }

            const payload = {
                prompt: userPrompt,
                conversationId: conversation?._id,
                agent: selectedAgent.toLowerCase()
            }

            dispatch(addMessage({ role: "user", content: userPrompt }))

            const data = await sendMessage(payload)
            if (data) {
                dispatch(addMessage({
                    role: "assistant",
                    content: data?.answer || "No response received",
                    images: data?.images || []
                }))
            }
        } catch (error) {
            console.error("Failed to send message:", error)
            dispatch(addMessage({
                role: "assistant",
                content: "An error occurred while generating a response. Please try again."
            }))
        } finally {
            setLoading(false)
        }
    }

    const agents = [
        {
            id: "auto",
            icon: Zap,
            label: "Auto"
        },
        {
            id: "chat",
            icon: MessageSquare,
            label: "chat"
        },
        {
            id: "coding",
            icon: Code2,
            label: "coding"
        },
        {
            id: "pdf",
            icon: FileText,
            label: "PDF"
        },
        {
            id: "ppt",
            icon: Presentation,
            label: "PPT"
        },
        {
            id: "image",
            icon: ImageIcon,
            label: "Image"
        },
        {
            id: "search",
            icon: Globe,
            label: "Search"
        }
    ]

    return (
        <div className='w-full overflow-hidden px-3 py-4 border-t border-white/[0.06] bg-[#0d0f14]'>
            <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>
                <div className='flex w-full gap-2 pr-2 flex-wrap'>
                    {agents.map((agent) => {
                        const isActive = selectedAgent === agent.label
                        const Icon = agent.icon
                        return (
                            <button
                                key={agent.id}
                                type="button"
                                onClick={() => setSelectedAgent(agent.label)}
                                className={`
                                    flex-shrink-0
                                    cursor-pointer
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    px-3
                                    py-2
                                    rounded-full
                                    text-xs
                                    font-medium
                                    border
                                    transition-all
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                                            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                                    }
                                `}
                            >
                                <Icon
                                    size={14}
                                    className={isActive ? "text-white" : "text-slate-500"}
                                />
                                {agent.label}
                            </button>
                        )
                    })}
                </div>

                <textarea
                    placeholder='Ask Anything...'
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                        }
                    }}
                    value={value}
                    disabled={loading}
                    className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed no-scrollbar disabled:opacity-50"
                    rows={3}
                />
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <button
                            type="button"
                            aria-label="Attach file"
                            className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'
                        >
                            <Paperclip size={16} />
                        </button>
                        <button
                            type="button"
                            aria-label="Voice input"
                            className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'
                        >
                            <Mic size={16} />
                        </button>
                    </div>
                    <button
                        type="button"
                        aria-label="Send message"
                        disabled={!value.trim() || loading}
                        onClick={handleSendMessage}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg border-none transition-all duration-150 ${
                            value.trim() && !loading
                                ? "bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white cursor-pointer"
                                : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
                        }`}
                    >
                        <Send size={15} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatInput