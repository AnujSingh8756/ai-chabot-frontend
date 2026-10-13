import { useSelector, useDispatch } from 'react-redux'
import MessageBubble from './MessageBubble'
import { addMessage } from '../redux/messageSlice'
import sendMessage from '../features/sendMessage'
import { createConversation } from '../features/createConversation'
import { setSelectedConversation, addConversation, setConvTitle } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'

function MessageList() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages = [] } = useSelector(state => state.message)
    const dispatch = useDispatch()

    const handleSuggestionClick = async (suggestion) => {
        let conversation = selectedConversation
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
                await updateConversation({ id: conversation?._id, title: suggestion.slice(0, 40) })
                dispatch(setConvTitle({ conversationId: conversation?._id, title: suggestion.slice(0, 40) }))
            }

            dispatch(addMessage({ role: "user", content: suggestion }))
            const data = await sendMessage({
                prompt: suggestion,
                conversationId: conversation?._id,
                agent: "auto"
            })
            if (data) {
                dispatch(addMessage({
                    role: "assistant",
                    content: data?.answer || "No response received",
                    images: data?.images || []
                }))
            }
        } catch (error) {
            console.error("Suggestion click failed:", error)
        }
    }

    return (
        <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 no-scrollbar'>
            {(!messages || messages.length === 0 || !selectedConversation) ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <div className='flex flex-col gap-1.5 items-center'>
                        <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight'>
                            CortexAI
                        </h1>
                        <p className='text-[15px] font-semibold text-slate-400 tracking-tight'>
                            How can I help you?
                        </p>
                        <p className='text-[13px] text-slate-500 max-w-[280px] leading-relaxed'>
                            Ask me anything - code, ideas, explanations, or just a quick question.
                        </p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-2 max-w-md'>
                        {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => handleSuggestionClick(s)}
                                className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='space-y-5'>
                    {messages.map((msg, i) => (
                        <div key={msg?._id || `${msg?.role}-${i}`}>
                            <MessageBubble
                                role={msg?.role}
                                content={msg?.content}
                                images={msg?.images || []}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MessageList