import { useMemo, useRef, useState } from "react";
import {
  READY_PROMPT,
  STEPS,
  thanksReply,
  type ContactAnswers,
} from "@/lib/contact";
import { prefersReducedMotion, wait } from "@/lib/motion";
import { sendContactMessage } from "@/lib/sendMessage";

// Where an answer bubble starts its flight from (a chip or the composer).
export interface Origin {
  left: number;
  top: number;
}

export type ChatItem =
  | { id: number; kind: "them"; step: number; text: string }
  | { id: number; kind: "me"; step: number; text: string; origin?: Origin }
  | { id: number; kind: "chips"; step: 0 }
  | { id: number; kind: "typing" };

export type ChatPhase =
  | "waiting"
  | "answering"
  | "review"
  | "sending"
  | "sent"
  | "failed";

export type ChatStatus = "idle" | "typing" | "sent";

export type Conversation = ReturnType<typeof useConversation>;

// The typing pause grows with the length of what Ayoub "writes".
function typingDelay(text: string) {
  if (prefersReducedMotion()) return 200;
  return Math.min(1100, Math.max(450, text.length * 16));
}

export function useConversation() {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [phase, setPhase] = useState<ChatPhase>("waiting");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  // Read only from event handlers and async steps, never during render.
  const flow = useRef({
    answers: {} as Partial<ContactAnswers>,
    step: 0,
    run: 0,
    nextId: 0,
    started: false,
    sent: false,
  });

  const actions = useMemo(() => {
    const newId = () => ++flow.current.nextId;

    // Shows the typing dots, then Ayoub's message. False if a reset happened meanwhile.
    async function say(text: string, at: number, withChips = false) {
      const run = flow.current.run;
      const typingId = newId();
      setItems((xs) => [...xs, { id: typingId, kind: "typing" }]);
      await wait(typingDelay(text));
      if (run !== flow.current.run) return false;
      const next: ChatItem[] = [{ id: newId(), kind: "them", step: at, text }];
      if (withChips) next.push({ id: newId(), kind: "chips", step: 0 });
      setItems((xs) => [...xs.filter((x) => x.kind !== "typing"), ...next]);
      return true;
    }

    async function ask(at: number) {
      setPhase("waiting");
      const text =
        at < STEPS.length ? STEPS[at].prompt(flow.current.answers) : READY_PROMPT;
      if (!(await say(text, at, at === 0))) return;
      setPhase(at < STEPS.length ? "answering" : "review");
    }

    function reset() {
      const f = flow.current;
      f.run += 1;
      f.answers = {};
      f.step = 0;
      f.sent = false;
      setItems([]);
      setStep(0);
      setDraft("");
      setPhase("waiting");
    }

    // Called on every open: greets once, and starts over after a sent message.
    function start() {
      const f = flow.current;
      if (f.sent) reset();
      else if (f.started) return;
      f.started = true;
      void wait(prefersReducedMotion() ? 0 : 350).then(() => ask(0));
    }

    async function answer(text: string, origin?: Origin) {
      const f = flow.current;
      const at = f.step;
      f.answers = { ...f.answers, [STEPS[at].key]: text };
      const meId = newId();
      setItems((xs) => [
        ...xs.filter((x) => x.kind !== "chips"),
        { id: meId, kind: "me", step: at, text, origin },
      ]);
      f.step = at + 1;
      setStep(at + 1);
      // Answers kept from before a rewind come back pre-filled.
      const nextKey = STEPS[at + 1]?.key;
      setDraft(nextKey ? (f.answers[nextKey] ?? "") : "");
      await wait(prefersReducedMotion() ? 0 : 250);
      await ask(at + 1);
    }

    // Back to an earlier question; later answers stay remembered for pre-filling.
    function rewind(to: number) {
      const f = flow.current;
      f.step = to;
      setStep(to);
      const chipsId = newId();
      setItems((xs) => {
        const kept = xs.filter(
          (x) =>
            (x.kind === "them" && x.step <= to) ||
            (x.kind === "me" && x.step < to),
        );
        return to === 0
          ? [...kept, { id: chipsId, kind: "chips", step: 0 }]
          : kept;
      });
      setDraft(f.answers[STEPS[to].key] ?? "");
      setPhase("answering");
    }

    async function send() {
      const f = flow.current;
      setPhase("sending");
      const result = await sendContactMessage(f.answers).catch(() => ({
        ok: false as const,
      }));
      if (!result.ok) {
        setPhase("failed");
        return false;
      }
      f.sent = true;
      setPhase("sent");
      void wait(prefersReducedMotion() ? 0 : 450).then(() =>
        say(thanksReply(f.answers), STEPS.length + 1),
      );
      return true;
    }

    return { start, answer, rewind, send };
  }, []);

  const status: ChatStatus = items.some((x) => x.kind === "typing")
    ? "typing"
    : phase === "sent"
      ? "sent"
      : "idle";
  const answered = phase === "sent" ? STEPS.length : Math.min(step, STEPS.length);

  return { items, phase, step, draft, setDraft, status, answered, ...actions };
}
