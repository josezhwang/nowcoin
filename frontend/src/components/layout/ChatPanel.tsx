import { ArrowUp, X } from 'lucide-react'
import { Fragment, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useChat } from '@/api/queries'
import type { ChatMessage } from '@/api/types'
import { BrandMark } from '@/components/ui/BrandMark'

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the Nowcoin assistant. Ask me about our Wallet, Card, Exchange, Pay, Vault or Connect API, card tiers, security or the team.",
}

const SUGGESTIONS = ['Is my crypto safe?', 'Compare the card tiers', 'How do I get started?', 'Who founded Nowcoin?']

// The backend accepts up to 30 messages; older turns add little to a help chat.
const HISTORY_LIMIT = 20

// Site paths in a reply (e.g. /products/card) become in-app links.
const PATH = /(\/(?:products|team|company|contact)(?:[/#][\w-]+)*)/g

function RichText({ text }: { text: string }) {
  return text.split(PATH).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} to={part}>
        {part}
      </Link>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** The help chat: answers questions about the company via POST /api/chat. */
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [draft, setDraft] = useState('')
  const chat = useChat()
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => inputRef.current?.focus(), [])

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, chat.isPending, chat.isError])

  const ask = (conversation: ChatMessage[]) =>
    // The greeting is UI-only; the conversation sent to the API starts with the visitor.
    chat.mutate(conversation.slice(1).slice(-HISTORY_LIMIT), {
      onSuccess: ({ reply }) => setMessages((m) => [...m, { role: 'assistant', content: reply }]),
    })

  const send = (text: string) => {
    const question = text.trim()
    if (!question || chat.isPending) return
    const next = [...messages, { role: 'user' as const, content: question }]
    setMessages(next)
    setDraft('')
    ask(next)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(draft)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send(draft)
    }
  }

  return (
    <div className="chat-panel" role="dialog" aria-label="Nowcoin help chat">
      <header className="chat-head">
        <span className="help-avatar">
          <BrandMark size={14} />
        </span>
        <div>
          <strong>Nowcoin assistant</strong>
          <span>Answers about our products and company</span>
        </div>
        <button type="button" className="chat-close" onClick={onClose} aria-label="Close chat">
          <X size={18} aria-hidden />
        </button>
      </header>

      <div className="chat-log" ref={listRef} aria-live="polite" data-lenis-prevent>
        {messages.map((m, i) => (
          <p key={i} className={`chat-msg chat-msg-${m.role}`}>
            {m.role === 'assistant' ? <RichText text={m.content} /> : m.content}
          </p>
        ))}
        {messages.length === 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {chat.isPending && (
          <p className="chat-msg chat-msg-assistant chat-typing" aria-label="Assistant is typing">
            <i />
            <i />
            <i />
          </p>
        )}
        {chat.isError && (
          <p className="chat-error" role="alert">
            {chat.error.message}{' '}
            <button type="button" className="link-button" onClick={() => ask(messages)}>
              Try again
            </button>
          </p>
        )}
      </div>

      <form className="chat-form" onSubmit={onSubmit}>
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask a question…"
          aria-label="Your question"
          rows={1}
          maxLength={1000}
        />
        <button type="submit" disabled={!draft.trim() || chat.isPending} aria-label="Send">
          <ArrowUp size={18} aria-hidden />
        </button>
      </form>
    </div>
  )
}
