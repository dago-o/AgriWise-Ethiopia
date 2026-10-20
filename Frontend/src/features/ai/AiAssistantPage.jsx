import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bot, Send, Sprout } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Markdown } from "../../components/ui/Markdown.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { askAi } from "../../lib/endpoints.js";
import { getErrorMessage } from "../../lib/errorHandling.js";
import { CropPicker } from "../crops/CropPicker.jsx";

const contextLabels = {
  healthRecords: "health records",
  riskRecords: "risk reports",
  weather: "current weather",
  forecast: "forecast",
  weatherAlerts: "weather alerts",
  marketPrices: "market prices",
  economics: "costs and income",
};

const suggestions = [
  "What should I check on this crop this week?",
  "Is the weather a problem for this crop right now?",
  "How is this crop doing financially?",
];

function Conversation({ cropId }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  async function ask(text) {
    const q = text.trim();
    if (!q || busy) return;
    setError("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setBusy(true);
    try {
      const result = await askAi(cropId, q);
      setMessages((m) => [...m, { role: "assistant", text: result.answer, context: result.availableContext }]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-ivory-200 bg-white shadow-[var(--shadow-card)]">
      <div className="min-h-[18rem] space-y-6 p-5 sm:p-6" aria-live="polite">
        {messages.length === 0 ? (
          <div className="py-4">
            <p className="font-semibold text-forest-900">Ask about this crop</p>
            <p className="mt-1 text-sm text-ink-muted">The answer uses this crop’s health records, risks, costs, local weather and market prices, where they exist.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)} className="rounded-full bg-ivory-100 px-3.5 py-2 text-left text-sm hover:bg-forest-50">{s}</button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-forest-700 px-4 py-3 text-white">{m.text}</p>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-700"><Bot className="h-[17px] w-[17px]" /></span>
              <div className="min-w-0 max-w-[90%]">
                <div className="rounded-2xl rounded-tl-md bg-ivory-50 px-4 py-3"><Markdown>{m.text}</Markdown></div>
                {m.context ? (
                  <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
                    Based on:
                    {Object.entries(contextLabels).map(([key, label]) =>
                      m.context[key] ? <Badge key={key} tone="success">{label}</Badge> : <Badge key={key} tone="neutral" className="line-through opacity-60">{label}</Badge>,
                    )}
                  </p>
                ) : null}
              </div>
            </div>
          ),
        )}

        {busy ? (
          <div className="flex items-center gap-3 text-sm text-ink-soft" role="status">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-50 text-forest-700"><Bot className="h-[17px] w-[17px]" /></span>
            Reading your crop records…
          </div>
        ) : null}
        {error ? <Alert title="The assistant could not answer">{error}</Alert> : null}
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); ask(question); }} className="flex items-end gap-3 border-t border-ivory-200 p-4">
        <label htmlFor="ai-question" className="sr-only">Your question</label>
        <textarea
          id="ai-question"
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(question); } }}
          placeholder="Type your question…"
          className="block w-full resize-none rounded-lg border border-ivory-300 bg-white px-3.5 py-2.5 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100"
        />
        <Button type="submit" disabled={!question.trim()} loading={busy} aria-label="Send question"><Send className="h-[18px] w-[18px]" /></Button>
      </form>
      <p className="px-5 pb-4 text-xs text-ink-soft">Each question is answered on its own. AI advice can be wrong, so check important decisions with a local agricultural expert.</p>
    </div>
  );
}

export function AiAssistantPage() {
  useDocumentTitle("AI assistant");
  const [params, setParams] = useSearchParams();
  const cropId = params.get("crop") || "";
  const onChange = useCallback((id) => setParams(id ? { crop: id } : {}, { replace: true }), [setParams]);

  return (
    <>
      <PageHeader title="AI assistant" description="Practical advice for one of your crops, based on the records you keep in AgriWise." />
      <CropPicker cropId={cropId} onChange={onChange} />
      <div className="mt-8">
        {cropId ? <Conversation key={cropId} cropId={cropId} /> : <EmptyState icon={Sprout} title="Choose a crop" description="The assistant answers questions about one crop at a time." />}
      </div>
    </>
  );
}
