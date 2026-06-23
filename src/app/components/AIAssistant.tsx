import { MessageSquare } from "lucide-react";

interface AIAssistantProps {
  dark: boolean;
}

export function AIAssistant({ dark }: AIAssistantProps) {
  const launchAIChat = () => {
    const event = new CustomEvent("changeView", { detail: "ai-chat" });
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={launchAIChat}
      title="Open AI ChatGPT Coach"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer border-none"
    >
      <MessageSquare size={22} className="text-white animate-pulse" />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#06b6d4] border-2 border-white animate-pulse" />
    </button>
  );
}
