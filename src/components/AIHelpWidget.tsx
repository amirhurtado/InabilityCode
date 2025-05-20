"use client";

import { useState } from "react";
import { CircleHelp, X } from "lucide-react";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/HoverCard";

export default function AIHelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      setResponse(data.answer || "No se pudo obtener respuesta.");
    } catch (err) {
      console.log("ENTROOO AAAA 1.3", err);
      setResponse("Hubo un error al contactar la IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-16 z-50">
      {!isOpen ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer">
              <CircleHelp
                size={38}
                strokeWidth={1}
                onClick={() => setIsOpen(true)}
                className="cursor-pointer"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="text-xs w-fit px-3 py-2 " side="top">
            Preguntarle a la IA
          </HoverCardContent>
        </HoverCard>
      ) : (
        <div className="w-[320px] flex flex-col gap-3 rounded-xl shadow-lg border bg-white dark:bg-slate-900 p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm">Pregúntale a la IA</h4>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <Textarea
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="text-sm"
          />
          <Button
            onClick={handleAsk}
            className="mt-2 w-full text-sm"
            disabled={loading}
          >
            {loading ? "Pensando..." : "Preguntar"}
          </Button>
          {response && (
            <div className="mt-3 p-2 rounded text-sm bg-muted text-muted-foreground ">
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
