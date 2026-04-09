interface MessageSelectorProps {
  messages: string[];
  onSelect: (msg: string) => void;
}

export function MessageSelector({ messages, onSelect }: MessageSelectorProps) {
  return (
    <div className="flex flex-col w-full max-w-sm mx-auto space-y-4 animate-label-up mt-8 px-6">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">
        Choose a message to send
      </h3>
      
      {messages.map((msg, i) => (
        <button
          key={`idx-${i}`}
          onClick={() => onSelect(msg)}
          className="w-full p-6 text-left rounded-[32px] bg-white border border-orange-50 text-gray-700 font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100/20 hover:border-orange-200 hover:bg-gradient-to-r hover:from-white hover:to-orange-50/30"
        >
          {msg}
        </button>
      ))}
    </div>
  );
}
