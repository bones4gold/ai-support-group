import { useState, useEffect, useRef } from "react";
import agents from "../agents/agents";
import { getAgentResponse } from "../agents/openai";
import { speak, loadVoices, toggleMute } from "../agents/speech";
import { getRandomQuote } from "../agents/quotes";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
}

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [quote, setQuote] = useState("");
  const [sharedAgents, setSharedAgents] = useState([]);
  const [mode, setMode] = useState("open");
  const [sessionEnded, setSessionEnded] = useState(false);
  const [speakingAgent, setSpeakingAgent] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceOptions, setVoiceOptions] = useState([]);
  const [agentVoices, setAgentVoices] = useState({});

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadVoices((voices) => {
      setVoiceOptions(voices);
    });

    const introQuote = getRandomQuote();
    setQuote(introQuote);

    const introMessages = [
      { sender: "Sam", text: `Welcome everyone. Let’s begin with an inspirational reading:` },
      { sender: "AA Big Book", text: introQuote },
      { sender: "Sam", text: `Thank you for being here. When you’re ready, please introduce yourself.` }
    ];

    setMessages(introMessages);

    handleSpeaking("Sam");
    speak(introMessages[0].text, "Sam", agentVoices);
    setTimeout(() => speak(introMessages[1].text, "Sam", agentVoices), 3000);
    setTimeout(() => speak(introMessages[2].text, "Sam", agentVoices), 6000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSpeaking(name) {
    setSpeakingAgent(name);
    setTimeout(() => setSpeakingAgent(null), 5000);
  }

  const shareNextAgent = async () => {
    const availableAgents = agents.filter(a => !sharedAgents.includes(a.name));
    if (availableAgents.length === 0) {
      const closing = "Thank you everyone for being here. We'll close the meeting now. Keep coming back.";
      setMessages(prev => [...prev, { sender: "Sam", text: closing }]);
      handleSpeaking("Sam");
      speak(closing, "Sam", agentVoices);
      setSessionEnded(true);
      return;
    }

    const nextAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
    const prompt = mode === "guided" ? "Today’s topic is acceptance. Please share your experience." : "Please share something with the group.";
    const reply = await getAgentResponse(nextAgent, prompt, messages);
    const newMessage = { sender: nextAgent.name, text: reply };

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      handleSpeaking(nextAgent.name);
      speak(reply, nextAgent.name, agentVoices);
      return updated;
    });

    setSharedAgents((prev) => [...prev, nextAgent.name]);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || sessionEnded) return;

    const newUserMessage = { sender: "You", text: userInput };
    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);
    setUserInput("");
    setLoading(true);

    const mentionedAgent = agents.find(agent =>
      userInput.toLowerCase().includes(agent.name.toLowerCase())
    );

    if (mentionedAgent) {
      try {
        const reply = await getAgentResponse(mentionedAgent, userInput, updatedHistory);
        const newMessage = { sender: mentionedAgent.name, text: reply };
        setMessages((prev) => {
          const newHistory = [...prev, newMessage];
          handleSpeaking(mentionedAgent.name);
          speak(reply, mentionedAgent.name, agentVoices);
          return newHistory;
        });
      } catch (err) {
        setMessages((prev) => [...prev, { sender: mentionedAgent.name, text: "Sorry, I had trouble replying." }]);
      }
    } else {
      const shuffledAgents = [...agents].sort(() => 0.5 - Math.random());
      const respondingAgents = shuffledAgents.slice(0, 2);

      for (const agent of respondingAgents) {
        try {
          const reply = await getAgentResponse(agent, userInput, updatedHistory);
          const newMessage = { sender: agent.name, text: reply };
          setMessages((prev) => {
            const newHistory = [...prev, newMessage];
            handleSpeaking(agent.name);
            speak(reply, agent.name, agentVoices);
            return newHistory;
          });
        } catch (err) {
          setMessages((prev) => [...prev, { sender: agent.name, text: "Sorry, I had trouble replying." }]);
        }
      }
    }

    setTimeout(async () => {
      const samPrompt = "Thank you for sharing. Would anyone like to go next?";
      const samMessage = { sender: "Sam", text: samPrompt };
      setMessages((prev) => {
        const updated = [...prev, samMessage];
        handleSpeaking("Sam");
        speak(samPrompt, "Sam", agentVoices);
        return updated;
      });

      setTimeout(() => {
        shareNextAgent();
      }, 3000);
    }, 1000);

    setLoading(false);
  };

  const handlePass = () => {
    const message = { sender: "You", text: "I’d like to pass for now." };
    setMessages(prev => [...prev, message]);
    setTimeout(() => {
      shareNextAgent();
    }, 2000);
  };

  const toggleListening = () => {
    if (!recognition) {
      console.warn("SpeechRecognition not supported.");
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.abort(); // clear any previous stuck session
      recognition.start();
      setListening(true);

      recognition.onstart = () => {
        console.log("🎙️ Voice recognition started");
      };

      recognition.onresult = (event) => {
        console.log("🎧 Raw event results:", event.results);
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        console.log("📝 Final transcript:", transcript);
        setUserInput(transcript);
        setListening(false);
      };

      recognition.onerror = (err) => {
        console.error("❌ Speech recognition error:", err);
        setListening(false);
      };

      recognition.onend = () => {
        console.log("🎤 Voice recognition ended");
        setListening(false);
      };
    }
  };

  const handleVoiceChange = (agentName, voiceURI) => {
    setAgentVoices(prev => ({ ...prev, [agentName]: voiceURI }));
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white font-sans">
      <div className="px-4 py-2 border-b border-zinc-700 shadow-sm bg-zinc-950 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-blue-400">AI Support Group</h1>
          <p className="text-sm text-zinc-400">Guided by shared experience and compassion.</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-zinc-800 text-white border border-zinc-600 rounded-md text-sm px-2 py-1"
          >
            <option value="open">🗣️ Open Sharing</option>
            <option value="guided">🧭 Guided Topic</option>
          </select>
          <button
            onClick={() => setMuted(toggleMute())}
            className="text-sm px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-md hover:bg-zinc-700 transition"
          >
            {muted ? "🔇 Muted" : "🔊 Voice On"}
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-800 flex flex-wrap gap-3">
        {agents.map((agent) => (
          <div key={agent.name} className="flex flex-col items-start">
            <div
              className={`text-sm px-3 py-1 rounded-full border transition ${
                sharedAgents.includes(agent.name)
                  ? 'bg-green-700 border-green-500'
                  : 'bg-zinc-800 border-zinc-600'
              } ${speakingAgent === agent.name ? 'ring-2 ring-blue-400' : ''}`}
            >
              {agent.name}
            </div>
            <select
              className="mt-1 text-xs bg-zinc-800 text-white border border-zinc-600 rounded px-2 py-1"
              value={agentVoices[agent.name] || ""}
              onChange={(e) => handleVoiceChange(agent.name, e.target.value)}
            >
              <option value="">Default</option>
              {voiceOptions.map((voice, idx) => (
                <option key={idx} value={voice.voiceURI}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl max-w-lg text-sm shadow-md transition-all ${
              msg.sender === "You"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-zinc-800 text-zinc-100 self-start mr-auto"
            }`}
          >
            <p className="font-semibold text-md mb-1 text-blue-300">{msg.sender}</p>
            <p className="leading-relaxed">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {loading && (
          <div className="text-zinc-400 italic flex items-center gap-2">
            <span>Thinking</span>
            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-700 flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={toggleListening}
          className={`px-3 py-2 rounded-xl font-semibold border ${
            listening
              ? 'bg-red-600 border-red-700 text-white'
              : 'bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600'
          }`}
        >
          {listening ? "🎙️ Listening..." : "🎤 Speak"}
        </button>
        <button
          onClick={sendMessage}
          disabled={loading || sessionEnded}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-50"
        >
          Share
        </button>
        <button
          onClick={handlePass}
          disabled={loading || sessionEnded}
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-xl border border-zinc-500"
        >
          Pass
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
