import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { backend_url } from "../../utils/util";
function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post(`${backend_url}`, {
        text: input,
      });

      if (res.status === 200) {
        setMessages((prev) => [
          ...prev,
          { text: res.data.usermsg, sender: "user" },
          { text: res.data.botmsg, sender: "bot" },
        ]);
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }

    setInput("");
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">

      {/* Header */}
      <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d] z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4">
          <h1 className="text-base sm:text-lg font-bold">BotSpoof</h1>
          <FaUserCircle size={26} className="cursor-pointer sm:size-[30px]" />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto pt-16 sm:pt-20 pb-28 px-2 sm:px-4">
        <div className="max-w-5xl mx-auto flex flex-col space-y-3">

          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-sm sm:text-lg mt-10">
              👋 Hi, I'm{" "}
              <span className="text-green-500 font-semibold">BotSpoof</span>.
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base break-words max-w-[85%] sm:max-w-[70%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 self-end"
                      : "bg-gray-800 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="bg-gray-700 text-gray-300 px-3 py-2 rounded-xl text-sm max-w-[70%] self-start">
                  Bot is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input Bar */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d] z-10">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center bg-gray-900 rounded-full px-3 sm:px-4 py-2 gap-2">

            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm sm:text-base"
              placeholder="Ask BotSpoof..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <button
              onClick={handleSendMessage}
              className="bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-1.5 rounded-full text-sm sm:text-base font-medium transition-colors"
            >
              Send
            </button>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default Bot;
