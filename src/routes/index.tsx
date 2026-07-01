import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/")({
  component: BirthdayExperience,
});

type Stage = "gate" | "play" | "letter";

const CORRECT_DOB = { d: 2, m: 7, y: 2001 };

const LETTER = `I don't even remember how we became friends. We were strangers for almost a year, same classroom, different worlds. And then one day, we weren't strangers anymore.

After all these years, we keep the same bond. You are the main reason for that. You were a good friend, a good motivator, a good well-wisher. I still think about our old conversations, when we were kids, no responsibilities, just going with the flow. Good old days.

Now everything has changed. But you are the one thing that is still constant. I'm so happy that you're still here, still the same, still you.

You were the one who made me realize there was a good listener inside me. From strangers to this, it's been a long journey. And we didn't even spend that much time together. Still, we kept it. That says everything about who you are.

I know you are going through a hard time right now. And I want you to know, this will pass. Hard times always do. I believe in you. I have seen your strength up close, and you are one of the strongest people I have ever known.

Don't think about others' lives. Live yours. The old you, I can already see her coming back.

You have been a constant in my life for a long time. And I want that for a long time further. Thank you for being my constant. Be strong. Be bold. You have so much ahead of you, and you can do all of it.`;

function BirthdayExperience() {
  const [stage, setStage] = useState<Stage>("gate");
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingHearts />
      <AnimatePresence mode="wait">
        {stage === "gate" && <Gate key="gate" onPass={() => setStage("play")} />}
        {stage === "play" && <Game key="play" onWin={() => setStage("letter")} />}
        {stage === "letter" && <Letter key="letter" />}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Background ---------------- */
function FloatingHearts() {
  const items = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 10,
        size: 12 + Math.random() * 18,
        opacity: 0.25 + Math.random() * 0.35,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-rose"
          style={{ left: `${h.left}%`, bottom: -40, fontSize: h.size, opacity: h.opacity }}
          animate={{ y: [0, -900], x: [0, 30, -30, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "linear" }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- Stage 1: DOB Gate ---------------- */
function Gate({ onPass }: { onPass: () => void }) {
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [y, setY] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  const dRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const dn = +d, mn = +m, yn = +y;
    if (!d || !m || !y) return "Please fill in all fields";
    if (dn < 1 || dn > 31) return "Day must be between 1 and 31";
    if (mn < 1 || mn > 12) return "Month must be between 1 and 12";
    if (yn < 1900 || yn > new Date().getFullYear()) return "Please enter a valid year";
    // Check actual days in month
    const daysInMonth = new Date(yn, mn, 0).getDate();
    if (dn > daysInMonth) return `That month only has ${daysInMonth} days`;
    return null;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setPulse((p) => p + 1);
      return;
    }
    if (+d === CORRECT_DOB.d && +m === CORRECT_DOB.m && +y === CORRECT_DOB.y) {
      setError(null);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#f8bbd0", "#f48fb1", "#ec407a", "#fff0f5"] });
      setTimeout(onPass, 500);
    } else {
      setError("Hmm, that's not the one. Try again 💭");
      setPulse((p) => p + 1);
    }
  };

  const handleDay = (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 2);
    setD(clean);
    setError(null);
    if (clean.length === 2) mRef.current?.focus();
  };
  const handleMonth = (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 2);
    setM(clean);
    setError(null);
    if (clean.length === 2) yRef.current?.focus();
  };
  const handleYear = (v: string) => {
    setY(v.replace(/\D/g, "").slice(0, 4));
    setError(null);
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && m === "") dRef.current?.focus();
  };
  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && y === "") mRef.current?.focus();
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card/80 p-8 backdrop-blur-md"
        style={{ boxShadow: "var(--shadow-petal)" }}
      >
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{ background: "var(--gradient-rose)" }}
          >
            🎀
          </motion.div>
          <h1 className="font-display text-3xl italic text-foreground">A little surprise</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your date of birth to unlock ✨
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <FancyInput ref={dRef} label="Day" value={d} onChange={handleDay} max={2} placeholder="DD" />
            <FancyInput
              ref={mRef}
              label="Month"
              value={m}
              onChange={handleMonth}
              onKeyDown={handleMonthKeyDown}
              max={2}
              placeholder="MM"
            />
            <FancyInput
              ref={yRef}
              label="Year"
              value={y}
              onChange={handleYear}
              onKeyDown={handleYearKeyDown}
              max={4}
              placeholder="YYYY"
            />
          </div>

          <div className="min-h-[20px]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key={pulse}
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-center text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            className="w-full rounded-full py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-rose)", boxShadow: "var(--shadow-soft)" }}
          >
            Unlock ✨
          </button>
        </form>
      </div>
    </motion.section>
  );
}

const FancyInput = ({
  label,
  value,
  onChange,
  onKeyDown,
  max,
  placeholder,
  ref,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  max: number;
  placeholder: string;
  ref?: React.Ref<HTMLInputElement>;
}) => {
  return (
    <label className="block">
      <span className="mb-1 block text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        ref={ref}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background/70 px-3 py-2.5 text-center font-display text-lg text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
};

/* ---------------- Stage 2: Balloon Game ---------------- */
type Balloon = { id: number; x: number; delay: number; hue: number; letter: string };

const NAME = "SURYA";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function Game({ onWin }: { onWin: () => void }) {
  const [popped, setPopped] = useState<number[]>([]);
  const balloons = useMemo<Balloon[]>(() => {
    // Letters keep their id (so progress boxes reveal in name order), but get
    // shuffled onto random screen slots so popping left-to-right doesn't spell the name in order.
    const slots = shuffle(NAME.split("").map((_, i) => i));
    return NAME.split("").map((letter, i) => ({
      id: i,
      x: ((slots[i] + 1) * 100) / (NAME.length + 1),
      delay: slots[i] * 0.35,
      hue: 340 + slots[i] * 4,
      letter,
    }));
  }, []);

  useEffect(() => {
    if (popped.length === NAME.length) {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors: ["#f8bbd0", "#f48fb1", "#ec407a", "#fff0f5", "#ffd1dc"] });
      const t = setTimeout(onWin, 1400);
      return () => clearTimeout(t);
    }
  }, [popped, onWin]);

  const pop = (id: number, e: React.MouseEvent) => {
    if (popped.includes(id)) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 30,
      spread: 60,
      startVelocity: 25,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      colors: ["#f8bbd0", "#f48fb1", "#ec407a", "#fff0f5"],
    });
    setPopped((p) => [...p, id]);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 pt-10"
    >
      <div className="text-center">
        <h2 className="font-display text-3xl italic text-foreground">Pop the balloons</h2>
        <p className="mt-2 text-sm text-muted-foreground">Reveal each letter to unlock the letter 🎈</p>
        <div className="mt-4 flex justify-center gap-2">
          {NAME.split("").map((l, i) => (
            <motion.div
              key={i}
              animate={popped.includes(i) ? { scale: [0.5, 1.2, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 font-display text-xl transition-all ${
                popped.includes(i)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-dashed border-border text-muted-foreground"
              }`}
            >
              {popped.includes(i) ? l : "?"}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-6 h-[70vh] w-full max-w-4xl">
        {balloons.map((b) => {
          const isPopped = popped.includes(b.id);
          return (
            <motion.button
              key={b.id}
              onClick={(e) => pop(b.id, e)}
              disabled={isPopped}
              className="absolute cursor-pointer -translate-x-1/2"
              style={{ left: `${b.x}%`, bottom: 0 }}
              initial={{ y: 100, opacity: 0 }}
              animate={
                isPopped
                  ? { scale: [1, 1.6, 0], opacity: [1, 1, 0] }
                  : { y: [-40, -400, -40], opacity: 1 }
              }
              transition={
                isPopped
                  ? { duration: 0.35 }
                  : { y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: b.delay }, opacity: { duration: 0.6 } }
              }
              whileHover={{ scale: 1.08 }}
            >
              <BalloonSvg hue={b.hue} />
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

function BalloonSvg({ hue }: { hue: number }) {
  return (
    <svg width="72" height="140" viewBox="0 0 72 140">
      <defs>
        <radialGradient id={`g-${hue}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor={`hsl(${hue}, 100%, 92%)`} />
          <stop offset="60%" stopColor={`hsl(${hue}, 85%, 75%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 70%, 62%)`} />
        </radialGradient>
      </defs>
      <ellipse cx="36" cy="36" rx="28" ry="34" fill={`url(#g-${hue})`} />
      <ellipse cx="26" cy="24" rx="6" ry="9" fill="white" opacity="0.55" />
      <polygon points="32,69 40,69 36,78" fill={`hsl(${hue}, 60%, 55%)`} />
      <path d="M 36 78 Q 32 100 36 120 Q 40 135 36 140" stroke={`hsl(${hue}, 40%, 55%)`} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

/* ---------------- Stage 3: Letter ---------------- */
function Letter() {
  const [opened, setOpened] = useState(false);
  const cheeredRef = useRef(false);

  useEffect(() => {
    if (opened && !cheeredRef.current) {
      cheeredRef.current = true;
      const burst = () =>
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: ["#f8bbd0", "#f48fb1", "#ec407a", "#fff0f5"],
        });
      const burst2 = () =>
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: ["#f8bbd0", "#f48fb1", "#ec407a", "#fff0f5"],
        });
      burst();
      burst2();
      const t1 = setTimeout(burst, 600);
      const t2 = setTimeout(burst2, 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [opened]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16"
    >
      {!opened ? (
        <motion.button
          onClick={() => setOpened(true)}
          whileHover={{ scale: 1.04, rotate: -1 }}
          whileTap={{ scale: 0.97 }}
          className="group flex flex-col items-center gap-6"
        >
          <div className="relative">
            <Envelope />
            <div
              className="absolute right-2 top-3 rounded-full bg-rose px-3 py-1 font-hand text-lg text-white"
              style={{ boxShadow: "var(--shadow-soft)", transform: "rotate(6deg)" }}
            >
              for Surya
            </div>
          </div>
          <p className="font-hand text-2xl text-primary">tap to open</p>
        </motion.button>
      ) : (
        <motion.article
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 18 }}
          className="relative w-full max-w-2xl rounded-3xl bg-card p-8 sm:p-12"
          style={{
            boxShadow: "var(--shadow-petal)",
            backgroundImage:
              "linear-gradient(180deg, oklch(0.99 0.01 15) 0%, oklch(0.97 0.03 20) 100%)",
          }}
        >
          <div className="mb-6 text-center">
            <p className="font-hand text-2xl text-rose">Happy Birthday</p>
            <h1 className="mt-1 font-display text-5xl italic text-foreground sm:text-6xl">Surya</h1>
            <div className="mx-auto mt-4 h-px w-24 bg-border" />
          </div>

          <div className="space-y-4 font-body text-[15px] leading-relaxed text-foreground/90 sm:text-base">
            {LETTER.split("\n\n").map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.25, duration: 0.6 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + (LETTER.split("\n\n").length) * 0.25 }}
            className="mt-8 text-right"
          >
            <p className="font-hand text-3xl text-rose">— your friend 🤍</p>
          </motion.div>

          <div className="pointer-events-none absolute -left-3 -top-3 text-5xl">🌸</div>
          <div className="pointer-events-none absolute -bottom-3 -right-3 text-5xl">🎂</div>
        </motion.article>
      )}
    </motion.section>
  );
}

function Envelope() {
  return (
    <svg width="220" height="160" viewBox="0 0 220 160" className="drop-shadow-xl">
      <defs>
        <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce4ec" />
          <stop offset="100%" stopColor="#f8bbd0" />
        </linearGradient>
        <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f48fb1" />
          <stop offset="100%" stopColor="#ec407a" />
        </linearGradient>
      </defs>
      <rect x="10" y="30" width="200" height="120" rx="10" fill="url(#envBody)" />
      <polygon points="10,150 110,90 210,150" fill="#f8bbd0" opacity="0.9" />
      <polygon points="10,30 110,110 210,30" fill="url(#envFlap)" />
      <circle cx="110" cy="105" r="16" fill="#fff" opacity="0.95" />
      <text x="110" y="112" textAnchor="middle" fontSize="18" fill="#ec407a">♥</text>
    </svg>
  );
}
