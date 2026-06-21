import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookHeart,
  BookOpen,
  Check,
  Feather,
  Heart,
  HeartHandshake,
  Home,
  LayoutGrid,
  Leaf,
  Lock,
  Menu,
  Music2,
  MoonStar,
  NotebookPen,
  Pause,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Trash2,
  Users,
  Volume2,
  VolumeX,
  Wind,
  X,
} from "lucide-react";

/*
 * RuangJeda
 * “Ruang kecil untuk berhenti sebentar, menaruh rasa, dan melanjutkan hari.”
 *
 * Prototype satu file. Seluruh data hidup di state lokal selama halaman terbuka.
 * Pasang dengan: import RuangJeda from "./ruangjeda/RuangJeda.jsx";
 */

export const MOODS = [
  { key: "bahagia", label: "Bahagia", emoji: "😊", color: "#F4C977" },
  { key: "tenang", label: "Tenang", emoji: "😌", color: "#79AE9C" },
  { key: "biasa", label: "Biasa saja", emoji: "😐", color: "#A9B1AA" },
  { key: "sedih", label: "Sedih", emoji: "😢", color: "#7EA7C4" },
  { key: "cemas", label: "Cemas", emoji: "😟", color: "#9C91B8" },
  { key: "marah", label: "Marah", emoji: "😠", color: "#DE8E73" },
  { key: "lelah", label: "Lelah", emoji: "😴", color: "#819B91" },
  { key: "bersyukur", label: "Bersyukur", emoji: "🙏", color: "#D5A24F" },
];

export const COLORS = [
  { key: "cream", label: "Cream", hex: "#FFF8E9", tape: "#E9B85F" },
  { key: "sage", label: "Sage", hex: "#E2F0E8", tape: "#72A48E" },
  { key: "teal", label: "Teal", hex: "#DDF0ED", tape: "#5F9C92" },
  { key: "coral", label: "Coral", hex: "#FBE6D9", tape: "#E8916A" },
  { key: "sky", label: "Sky", hex: "#E2EFF6", tape: "#75A5C0" },
  { key: "butter", label: "Butter", hex: "#FFF0BE", tape: "#D9A847" },
];

export const QUOTES = {
  default: [
    "Kamu tidak harus membereskan semuanya hari ini.",
    "Kadang, jeda adalah cara paling jujur untuk tetap melanjutkan.",
    "Tidak perlu menjadi versi terbaikmu setiap saat. Hadir saja sudah cukup.",
  ],
  bahagia: [
    "Simpan hangatnya hari ini, tanpa takut besok akan berbeda.",
    "Bahagia yang kecil tetap layak dirayakan pelan-pelan.",
  ],
  tenang: [
    "Nikmati tenang ini tanpa merasa harus segera melakukan sesuatu.",
    "Ada hari yang cukup dijalani dengan napas yang lebih lapang.",
  ],
  biasa: [
    "Hari yang biasa pun tetap bagian penting dari hidupmu.",
    "Tidak setiap hari harus berkesan. Hari ini boleh sekadar lewat.",
  ],
  sedih: [
    "Sedih tidak membuatmu lemah. Ia hanya sedang meminta ruang.",
    "Tidak apa-apa jika hari ini kamu hanya bisa berjalan pelan.",
    "Kamu boleh menangis tanpa harus menjelaskan semuanya.",
  ],
  cemas: [
    "Kembali ke napasmu. Untuk saat ini, kamu hanya perlu berada di sini.",
    "Tidak semua yang dikhawatirkan harus dijawab malam ini.",
    "Ambil hari ini dalam bagian-bagian kecil yang bisa kamu pegang.",
  ],
  marah: [
    "Marahmu boleh hadir tanpa harus melukai dirimu atau orang lain.",
    "Beri jarak sebentar. Tidak semua rasa perlu langsung menjadi tindakan.",
  ],
  lelah: [
    "Istirahat bukan hadiah setelah selesai; ia bagian dari perjalanan.",
    "Tubuhmu bukan mesin. Berhenti sebentar bukan sebuah kegagalan.",
    "Hari ini mungkin cukup dengan makan, bernapas, lalu tidur lebih awal.",
  ],
  bersyukur: [
    "Syukur tidak menghapus hal yang berat; ia hanya menyalakan satu lampu kecil.",
    "Hal sederhana yang kamu sadari hari ini boleh tinggal lebih lama.",
  ],
};

export const PROMPTS = [
  "Apa yang paling berat hari ini?",
  "Hal kecil apa yang masih bisa kamu syukuri?",
  "Apa yang ingin kamu lepaskan sebelum tidur?",
  "Bagian mana dari dirimu yang sedang butuh didengarkan?",
  "Kalau hari ini punya warna, warna apa dan mengapa?",
  "Apa satu hal yang bisa kamu lakukan dengan lebih lembut?",
];

const SOUNDSCAPES = [
  { key: "soft-rain", label: "Hujan lembut", icon: "🌧️" },
  { key: "slow-waves", label: "Ombak pelan", icon: "🌊" },
  { key: "night-air", label: "Malam hening", icon: "🌙" },
  { key: "warm-piano", label: "Nada hangat", icon: "🎹" },
];

const MOOD_MAP = Object.fromEntries(MOODS.map((mood) => [mood.key, mood]));
const COLOR_MAP = Object.fromEntries(COLORS.map((color) => [color.key, color]));

const relativeDate = (offset) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
};

export const initialNotes = [
  {
    id: 1,
    text: "Hari ini lelah, tapi aku masih mau bertahan pelan-pelan.",
    mood: "lelah",
    color: "sage",
    date: relativeDate(-1),
    visibility: "public",
    isMine: false,
    reactions: { hug: 8, support: 5, relate: 11, inspire: 1 },
  },
  {
    id: 2,
    text: "Semoga besok terasa sedikit lebih ringan dari hari ini.",
    mood: "cemas",
    color: "sky",
    date: relativeDate(-1),
    visibility: "public",
    isMine: false,
    reactions: { hug: 5, support: 7, relate: 6, inspire: 0 },
  },
  {
    id: 3,
    text: "Aku bangga sudah melewati hari ini, walau langkahnya kecil.",
    mood: "bersyukur",
    color: "butter",
    date: relativeDate(0),
    visibility: "public",
    isMine: true,
    reactions: { hug: 7, support: 3, relate: 4, inspire: 6 },
  },
  {
    id: 4,
    text: "Capek berpura-pura baik-baik saja. Di sini aku mau jujur sebentar.",
    mood: "sedih",
    color: "coral",
    date: relativeDate(-2),
    visibility: "public",
    isMine: false,
    reactions: { hug: 10, support: 9, relate: 14, inspire: 0 },
  },
  {
    id: 5,
    text: "Akhirnya tidur cukup. Kepala terasa lebih jernih pagi ini.",
    mood: "tenang",
    color: "teal",
    date: relativeDate(0),
    visibility: "public",
    isMine: false,
    reactions: { hug: 4, support: 2, relate: 3, inspire: 2 },
  },
  {
    id: 6,
    text: "Catatan untuk diri sendiri: kamu sudah berusaha cukup keras hari ini.",
    mood: "tenang",
    color: "cream",
    date: relativeDate(0),
    visibility: "private",
    isMine: true,
    reactions: { hug: 0, support: 0, relate: 0, inspire: 0 },
  },
];

export const initialJournal = [
  { id: 11, date: relativeDate(-5), mood: "bahagia", note: "Sempat tertawa lama bersama teman." },
  { id: 12, date: relativeDate(-4), mood: "biasa", note: "Hari berjalan biasa dan cukup." },
  { id: 13, date: relativeDate(-3), mood: "marah", note: "Banyak hal menumpuk. Aku memilih diam sebentar." },
  { id: 14, date: relativeDate(-2), mood: "sedih", note: "Hari terasa berat, tapi aku tidak memaksa diri terlihat ceria." },
  { id: 15, date: relativeDate(-1), mood: "lelah", note: "Pekerjaan padat. Malam ini mau istirahat lebih awal." },
];

const NAV_ITEMS = [
  { key: "home", label: "Beranda", icon: Home },
  { key: "wall", label: "Confession Wall", icon: LayoutGrid },
  { key: "journal", label: "Mood Journal", icon: BookOpen },
  { key: "calm", label: "Mind Space", icon: Wind },
  { key: "release", label: "Release Box", icon: Feather },
];

const REACTIONS = [
  { key: "hug", label: "Peluk", icon: Heart },
  { key: "support", label: "Dukung", icon: HeartHandshake },
  { key: "relate", label: "Aku juga", icon: Smile },
  { key: "inspire", label: "Menginspirasi", icon: Sparkles },
];

const dateKey = (value) => new Date(value).toDateString();
const formatDate = (value) =>
  new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const rotationFor = (id) => ((Number(id) * 37) % 5) - 2;
const pick = (items, seed = new Date().getDate()) => items[Math.abs(seed) % items.length];

function quoteFor(mood) {
  const source = QUOTES[mood] || QUOTES.default;
  return pick(source, new Date().getDate() + new Date().getMonth());
}

export default function RuangJeda() {
  const [tab, setTab] = useState("home");
  const [notes, setNotes] = useState(initialNotes);
  const [journal, setJournal] = useState(initialJournal);
  const [filterMood, setFilterMood] = useState("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [myReactions, setMyReactions] = useState(() => new Set());
  const [toast, setToast] = useState("");

  const todayEntry = journal.find((entry) => dateKey(entry.date) === new Date().toDateString());
  const activeMood = todayEntry?.mood || null;

  const moodTrail = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return {
        date,
        entry: journal.find((item) => dateKey(item.date) === date.toDateString()),
      };
    });
  }, [journal]);

  const visibleNotes = useMemo(
    () =>
      notes
        .filter((note) => note.visibility === "public" || note.isMine)
        .filter((note) => filterMood === "all" || note.mood === filterMood)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filterMood, notes],
  );

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function navigate(nextTab) {
    setTab(nextTab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveFeeling({ text, mood, color, visibility }) {
    const date = new Date().toISOString();
    const id = Date.now();
    if (visibility !== "journal") {
      setNotes((current) => [
        {
          id,
          text,
          mood,
          color,
          date,
          visibility,
          isMine: true,
          reactions: { hug: 0, support: 0, relate: 0, inspire: 0 },
        },
        ...current,
      ]);
    }

    setJournal((current) => {
      const entry = { id: id + 1, date, mood, note: text };
      const hasToday = current.some((item) => dateKey(item.date) === new Date().toDateString());
      return hasToday
        ? current.map((item) => (dateKey(item.date) === new Date().toDateString() ? entry : item))
        : [entry, ...current];
    });

    setComposerOpen(false);
    setToast(
      visibility === "public"
        ? "Rasamu sudah dititipkan secara anonim."
        : visibility === "private"
          ? "Catatan ini hanya tersimpan untukmu."
          : "Refleksimu sudah masuk ke Mood Journal.",
    );
  }

  function toggleReaction(noteId, reaction) {
    const token = `${noteId}-${reaction}`;
    const isActive = myReactions.has(token);
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              reactions: {
                ...note.reactions,
                [reaction]: Math.max(0, note.reactions[reaction] + (isActive ? -1 : 1)),
              },
            }
          : note,
      ),
    );
    setMyReactions((current) => {
      const next = new Set(current);
      if (isActive) next.delete(token);
      else next.add(token);
      return next;
    });
  }

  function saveJournal(entry) {
    const date = new Date().toISOString();
    const nextEntry = { id: Date.now(), date, ...entry };
    setJournal((current) => {
      const hasToday = current.some((item) => dateKey(item.date) === new Date().toDateString());
      return hasToday
        ? current.map((item) => (dateKey(item.date) === new Date().toDateString() ? nextEntry : item))
        : [nextEntry, ...current];
    });
    setToast("Catatan hari ini sudah disimpan dengan lembut.");
  }

  return (
    <div className="rj-app">
      <style>{styles}</style>

      <header className="rj-header">
        <button className="rj-brand" onClick={() => navigate("home")} aria-label="Kembali ke Beranda">
          <span className="rj-brand-mark"><Leaf size={20} /></span>
          <span>
            <strong>RuangJeda</strong>
            <small>ruang kecil untuk berhenti sebentar</small>
          </span>
        </button>

        <nav className={menuOpen ? "rj-nav is-open" : "rj-nav"} aria-label="Navigasi utama">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => navigate(key)}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <button className="rj-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Buka menu">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {tab === "home" && (
        <HomePage
          todayEntry={todayEntry}
          moodTrail={moodTrail}
          onWrite={() => setComposerOpen(true)}
          onNavigate={navigate}
        />
      )}

      {tab === "wall" && (
        <WallPage
          notes={visibleNotes}
          filter={filterMood}
          onFilter={setFilterMood}
          onWrite={() => setComposerOpen(true)}
          onReact={toggleReaction}
          myReactions={myReactions}
        />
      )}

      {tab === "journal" && (
        <JournalPage journal={journal} moodTrail={moodTrail} onSave={saveJournal} />
      )}

      {tab === "calm" && <CalmPage mood={activeMood} />}
      {tab === "release" && <ReleasePage onReleased={() => setToast("Sudah dilepaskan. Ambil napas pelan.")} />}

      <SoundscapePlayer />

      <footer className="rj-footer">
        <div className="rj-footer-brand"><Leaf size={17} /> RuangJeda</div>
        <p>
          RuangJeda bukan layanan konseling profesional. Jika kamu merasa sangat tertekan atau tidak aman,
          segera hubungi orang terpercaya atau layanan bantuan profesional.
        </p>
      </footer>

      {composerOpen && <FeelingComposer onClose={() => setComposerOpen(false)} onSubmit={saveFeeling} />}

      {toast && (
        <div className="rj-toast" role="status">
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

function SoundscapePlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState("idle");
  const [audioMessage, setAudioMessage] = useState("");
  const [soundscape, setSoundscape] = useState(
    () => window.localStorage.getItem("ruangjeda-soundscape") || "soft-rain",
  );
  const [volume, setVolume] = useState(() => {
    const stored = Number(window.localStorage.getItem("ruangjeda-volume"));
    return Number.isFinite(stored) && stored >= 0 ? Math.min(stored, 1) : 0.55;
  });
  const audioRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem("ruangjeda-soundscape", soundscape);
  }, [soundscape]);

  useEffect(() => {
    window.localStorage.setItem("ruangjeda-volume", String(volume));
    if (audioRef.current?.master) {
      audioRef.current.master.gain.setTargetAtTime(
        volumeToGain(volume),
        audioRef.current.context.currentTime,
        0.08,
      );
    }
  }, [volume]);

  useEffect(() => {
    return () => stopAmbientEngine(audioRef);
  }, []);

  async function togglePlayback() {
    if (playing) {
      stopAmbientEngine(audioRef);
      setPlaying(false);
      setAudioStatus("paused");
      setAudioMessage("Audio dijeda.");
      return;
    }
    try {
      setAudioStatus("starting");
      setAudioMessage("Menyiapkan suara...");
      const engine = createAmbientEngine(soundscape, volume);
      audioRef.current = engine;
      await engine.context.resume();
      if (engine.context.state !== "running") {
        throw new Error("Browser belum mengizinkan audio.");
      }
      playStartChime(engine);
      setPlaying(true);
      setAudioStatus("playing");
      setAudioMessage(`${selected.label} sedang diputar.`);
    } catch (error) {
      stopAmbientEngine(audioRef);
      setPlaying(false);
      setAudioStatus("error");
      setAudioMessage("Audio belum dapat diputar. Klik Putar sekali lagi.");
      console.error("Jeda Suara tidak dapat dimulai:", error);
    }
  }

  async function changeSoundscape(next) {
    setSoundscape(next);
    if (playing) {
      stopAmbientEngine(audioRef);
      try {
        const engine = createAmbientEngine(next, volume);
        audioRef.current = engine;
        await engine.context.resume();
        playStartChime(engine);
        setAudioStatus("playing");
        setAudioMessage(`${SOUNDSCAPES.find((item) => item.key === next)?.label} sedang diputar.`);
      } catch (error) {
        setPlaying(false);
        setAudioStatus("error");
        setAudioMessage("Suasana baru belum dapat diputar.");
        console.error("Jeda Suara tidak dapat diganti:", error);
      }
    }
  }

  const selected = SOUNDSCAPES.find((item) => item.key === soundscape) || SOUNDSCAPES[0];

  return (
    <aside className={open ? "rj-soundscape is-open" : "rj-soundscape"} aria-label="Jeda Suara">
      {open && (
        <div className="rj-sound-panel">
          <div className="rj-sound-head">
            <div>
              <span className="rj-eyebrow"><Music2 size={13} /> Jeda Suara</span>
              <h2>Temani jedamu</h2>
              <p>Audio generatif tanpa vokal. Pilih hening kapan saja.</p>
            </div>
            <button className="rj-sound-close" onClick={() => setOpen(false)} aria-label="Tutup Jeda Suara">
              <X size={17} />
            </button>
          </div>

          <div className="rj-sound-options">
            {SOUNDSCAPES.map((item) => (
              <button
                key={item.key}
                className={soundscape === item.key ? "active" : ""}
                onClick={() => changeSoundscape(item.key)}
              >
                <span>{item.icon}</span>
                <small>{item.label}</small>
              </button>
            ))}
          </div>

          <div className="rj-sound-controls">
            <button className="rj-sound-play" onClick={togglePlayback} disabled={audioStatus === "starting"}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
              {audioStatus === "starting" ? "Memulai" : playing ? "Jeda" : "Putar"}
            </button>
            <VolumeX size={15} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Volume Jeda Suara"
            />
            <Volume2 size={16} />
            <b>{Math.round(volume * 100)}%</b>
          </div>

          <div className={`rj-sound-now ${playing ? "is-playing" : ""}`}>
            <div className="rj-sound-bars" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--bar": index }} />)}
            </div>
            <span className={audioStatus === "error" ? "error" : ""}>{audioMessage || "Tekan Putar untuk memulai."}</span>
          </div>
        </div>
      )}

      <button
        className={playing ? "rj-sound-trigger is-playing" : "rj-sound-trigger"}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{playing ? selected.icon : <Music2 size={18} />}</span>
        <span><strong>Jeda Suara</strong><small>{playing ? selected.label : "musik untuk menepi"}</small></span>
        {playing && <i />}
      </button>
    </aside>
  );
}

function playStartChime(engine) {
  const { context, master, nodes } = engine;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const level = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(523.25, now);
  oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.45);
  level.gain.setValueAtTime(0.0001, now);
  level.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
  level.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
  oscillator.connect(level).connect(master);
  oscillator.start(now);
  oscillator.stop(now + 1);
  nodes.push(oscillator, level);
}

function stopAmbientEngine(reference) {
  const engine = reference.current;
  if (!engine) return;
  engine.timers.forEach((timer) => window.clearInterval(timer));
  engine.nodes.forEach((node) => {
    try {
      node.stop?.();
      node.disconnect?.();
    } catch {
      // Node mungkin sudah berhenti.
    }
  });
  engine.context.close?.();
  reference.current = null;
}

function volumeToGain(volume) {
  if (volume <= 0) return 0;
  return Math.pow(volume, 0.72) * 1.15;
}

function createAmbientEngine(kind, volume) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error("Browser tidak mendukung Web Audio.");

  const context = new AudioContext();
  const master = context.createGain();
  const warmth = context.createBiquadFilter();
  const limiter = context.createDynamicsCompressor();
  master.gain.value = volumeToGain(volume);
  warmth.type = "lowpass";
  warmth.frequency.value = 12500;
  warmth.Q.value = 0.2;
  limiter.threshold.value = -8;
  limiter.knee.value = 8;
  limiter.ratio.value = 14;
  limiter.attack.value = 0.004;
  limiter.release.value = 0.24;
  master.connect(warmth).connect(limiter).connect(context.destination);

  const nodes = [master, warmth, limiter];
  const timers = [];

  const rememberTimer = (timer) => {
    timers.push(timer);
    return timer;
  };

  const randomBuffer = (type = "pink", seconds = 6) => {
    const buffer = context.createBuffer(2, context.sampleRate * seconds, context.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel);
      let brown = 0;
      let pinkA = 0;
      let pinkB = 0;
      let pinkC = 0;
      for (let index = 0; index < data.length; index += 1) {
        const white = Math.random() * 2 - 1;
        if (type === "white") {
          data[index] = white * 0.55;
        } else if (type === "brown") {
          brown = (brown + 0.018 * white) / 1.018;
          data[index] = brown * 3.3;
        } else {
          pinkA = 0.99765 * pinkA + white * 0.099046;
          pinkB = 0.963 * pinkB + white * 0.2965164;
          pinkC = 0.57 * pinkC + white * 1.0526913;
          data[index] = (pinkA + pinkB + pinkC + white * 0.1848) * 0.11;
        }
      }
    }
    return buffer;
  };

  const addNoiseLayer = ({
    type = "pink",
    low = 40,
    high = 12000,
    gain = 0.2,
    pan = 0,
    lfoRate = 0,
    lfoDepth = 0,
  }) => {
    const source = context.createBufferSource();
    const lowpass = context.createBiquadFilter();
    const highpass = context.createBiquadFilter();
    const level = context.createGain();
    const panner = context.createStereoPanner();
    source.buffer = randomBuffer(type);
    source.loop = true;
    lowpass.type = "lowpass";
    lowpass.frequency.value = high;
    lowpass.Q.value = 0.35;
    highpass.type = "highpass";
    highpass.frequency.value = low;
    highpass.Q.value = 0.3;
    level.gain.value = gain;
    panner.pan.value = pan;
    source.connect(lowpass).connect(highpass).connect(level).connect(panner).connect(master);
    source.start();
    nodes.push(source, lowpass, highpass, level, panner);

    if (lfoRate && lfoDepth) {
      const lfo = context.createOscillator();
      const depth = context.createGain();
      lfo.type = "sine";
      lfo.frequency.value = lfoRate;
      depth.gain.value = lfoDepth;
      lfo.connect(depth).connect(level.gain);
      lfo.start();
      nodes.push(lfo, depth);
    }

    return { source, lowpass, highpass, level, panner };
  };

  const addPad = (frequencies, gain = 0.12, cutoff = 900) => {
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const level = context.createGain();
      const panner = context.createStereoPanner();
      oscillator.type = index % 2 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = (index - frequencies.length / 2) * 4;
      filter.type = "lowpass";
      filter.frequency.value = cutoff;
      level.gain.value = gain / frequencies.length;
      panner.pan.value = frequencies.length === 1 ? 0 : -0.55 + (index / (frequencies.length - 1)) * 1.1;
      oscillator.connect(filter).connect(level).connect(panner).connect(master);
      oscillator.start();
      nodes.push(oscillator, filter, level, panner);
    });
  };

  const playBell = (frequency, delay = 0, gain = 0.2, pan = 0) => {
    const now = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const overtone = context.createOscillator();
    const level = context.createGain();
    const overtoneLevel = context.createGain();
    const panner = context.createStereoPanner();
    oscillator.type = "sine";
    overtone.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.998, now + 4);
    overtone.frequency.setValueAtTime(frequency * 2.01, now);
    level.gain.setValueAtTime(0.0001, now);
    level.gain.exponentialRampToValueAtTime(gain, now + 0.06);
    level.gain.exponentialRampToValueAtTime(0.0001, now + 5);
    overtoneLevel.gain.setValueAtTime(0.0001, now);
    overtoneLevel.gain.exponentialRampToValueAtTime(gain * 0.18, now + 0.04);
    overtoneLevel.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
    panner.pan.value = pan;
    oscillator.connect(level).connect(panner);
    overtone.connect(overtoneLevel).connect(panner);
    panner.connect(master);
    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 5.2);
    overtone.stop(now + 3);
  };

  const playRainDrop = () => {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const level = context.createGain();
    const panner = context.createStereoPanner();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1600 + Math.random() * 2400, now);
    oscillator.frequency.exponentialRampToValueAtTime(600 + Math.random() * 500, now + 0.09);
    level.gain.setValueAtTime(0.0001, now);
    level.gain.exponentialRampToValueAtTime(0.035 + Math.random() * 0.045, now + 0.008);
    level.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    panner.pan.value = Math.random() * 1.8 - 0.9;
    oscillator.connect(level).connect(panner).connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.14);
  };

  const scheduleRainDrops = () => {
    playRainDrop();
    rememberTimer(window.setTimeout(scheduleRainDrops, 90 + Math.random() * 310));
  };

  const playCricket = () => {
    const start = context.currentTime;
    const oscillator = context.createOscillator();
    const level = context.createGain();
    const panner = context.createStereoPanner();
    oscillator.type = "triangle";
    oscillator.frequency.value = 3900 + Math.random() * 1200;
    panner.pan.value = Math.random() * 1.7 - 0.85;
    level.gain.setValueAtTime(0.0001, start);
    for (let pulse = 0; pulse < 4; pulse += 1) {
      const at = start + pulse * 0.11;
      level.gain.exponentialRampToValueAtTime(0.025 + Math.random() * 0.018, at + 0.02);
      level.gain.exponentialRampToValueAtTime(0.0001, at + 0.075);
    }
    oscillator.connect(level).connect(panner).connect(master);
    oscillator.start(start);
    oscillator.stop(start + 0.48);
  };

  const scheduleCrickets = () => {
    playCricket();
    rememberTimer(window.setTimeout(scheduleCrickets, 1500 + Math.random() * 3800));
  };

  if (kind === "soft-rain") {
    addNoiseLayer({ type: "pink", low: 420, high: 7600, gain: 0.5, pan: -0.18 });
    addNoiseLayer({ type: "white", low: 2400, high: 11800, gain: 0.16, pan: 0.24 });
    addNoiseLayer({ type: "brown", low: 45, high: 650, gain: 0.12, lfoRate: 0.07, lfoDepth: 0.035 });
    scheduleRainDrops();
  } else if (kind === "slow-waves") {
    addNoiseLayer({
      type: "brown",
      low: 70,
      high: 820,
      gain: 0.42,
      pan: -0.12,
      lfoRate: 0.075,
      lfoDepth: 0.3,
    });
    addNoiseLayer({
      type: "white",
      low: 850,
      high: 5200,
      gain: 0.17,
      pan: 0.22,
      lfoRate: 0.075,
      lfoDepth: 0.13,
    });
    addNoiseLayer({ type: "pink", low: 120, high: 1800, gain: 0.18, pan: 0.35, lfoRate: 0.043, lfoDepth: 0.1 });
  } else if (kind === "night-air") {
    addNoiseLayer({ type: "brown", low: 55, high: 520, gain: 0.17, lfoRate: 0.035, lfoDepth: 0.055 });
    addNoiseLayer({ type: "pink", low: 500, high: 2600, gain: 0.045, pan: -0.25 });
    addPad([98, 146.83, 196], 0.055, 480);
    scheduleCrickets();
  } else {
    addNoiseLayer({ type: "brown", low: 35, high: 380, gain: 0.035 });
    addPad([130.81, 164.81, 196, 261.63], 0.13, 760);
    [261.63, 329.63, 392, 329.63].forEach((note, index) =>
      playBell(note, index * 2.8, 0.18, index % 2 ? 0.3 : -0.3),
    );
    let noteIndex = 0;
    const notes = [261.63, 329.63, 392, 440, 392, 329.63];
    rememberTimer(window.setInterval(() => {
      playBell(notes[noteIndex % notes.length], 0, 0.2, noteIndex % 2 ? 0.34 : -0.34);
      noteIndex += 1;
    }, 7600));
  }

  return { context, master, nodes, timers };
}

function HomePage({ todayEntry, moodTrail, onWrite, onNavigate }) {
  const mood = todayEntry ? MOOD_MAP[todayEntry.mood] : null;

  const shortcuts = [
    { key: "wall", title: "Confession Wall", text: "Titipkan rasa secara anonim.", icon: LayoutGrid, tone: "sage" },
    { key: "journal", title: "Mood Journal", text: "Catatan pribadi untukmu.", icon: BookHeart, tone: "sky" },
    { key: "calm", title: "Mind Space", text: "Bernapas dan menepi sebentar.", icon: Wind, tone: "teal" },
    { key: "release", title: "Release Box", text: "Tulis, lepaskan, lalu lanjutkan.", icon: Feather, tone: "coral" },
  ];

  return (
    <main className="rj-main">
      <section className="rj-hero">
        <div className="rj-hero-copy">
          <span className="rj-eyebrow"><Sparkles size={14} /> Ruang aman untuk merasa</span>
          <h1>Apa yang ingin kamu lepaskan hari ini?</h1>
          <p>Tak perlu rapi, tak perlu terlihat kuat. Taruh rasamu di sini sebentar.</p>
          <button className="rj-primary" onClick={onWrite}>
            <NotebookPen size={18} /> Tulis Perasaan
          </button>
        </div>
        <div className="rj-hero-note">
          <span className="rj-tape" />
          <small>Kata untuk hari ini</small>
          <blockquote>“{quoteFor(mood?.key)}”</blockquote>
          <span>— untukmu, pelan-pelan</span>
        </div>
      </section>

      <section className="rj-home-grid">
        <article className="rj-card rj-today-card">
          <div className="rj-section-head">
            <div>
              <span className="rj-eyebrow">Hari ini</span>
              <h2>Bagaimana rasanya?</h2>
            </div>
            {mood && <span className="rj-big-emoji">{mood.emoji}</span>}
          </div>
          {mood ? (
            <>
              <p>
                Kamu mencatat rasa <strong>{mood.label}</strong>. Tidak harus diubah—cukup dikenali.
              </p>
              <button className="rj-text-button" onClick={onWrite}>Perbarui catatan <ArrowRight size={15} /></button>
            </>
          ) : (
            <>
              <p>Belum ada catatan hari ini. Kamu bisa mulai dari satu kata saja.</p>
              <button className="rj-text-button" onClick={onWrite}>Pilih mood hari ini <ArrowRight size={15} /></button>
            </>
          )}
        </article>

        <article className="rj-card">
          <div className="rj-section-head">
            <div>
              <span className="rj-eyebrow">Jejak mood</span>
              <h2>7 hari terakhir</h2>
            </div>
          </div>
          <MoodTrail days={moodTrail} />
          <p className="rj-card-note">Bukan untuk menilai. Hanya untuk mengenali pola dengan lebih lembut.</p>
        </article>
      </section>

      <section>
        <div className="rj-section-title">
          <div><span className="rj-eyebrow">Pilih ruangmu</span><h2>Kamu ingin menepi ke mana?</h2></div>
        </div>
        <div className="rj-shortcuts">
          {shortcuts.map(({ key, title, text, icon: Icon, tone }) => (
            <button key={key} className={`rj-shortcut ${tone}`} onClick={() => onNavigate(key)}>
              <span className="rj-shortcut-icon"><Icon size={21} /></span>
              <span><strong>{title}</strong><small>{text}</small></span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
      </section>

      <section className="rj-gentle-reminder">
        <MoonStar size={22} />
        <div><strong>Pengingat kecil</strong><p>Kamu tidak perlu membagikan semuanya. Beberapa rasa boleh tetap menjadi milikmu.</p></div>
      </section>
    </main>
  );
}

function WallPage({ notes, filter, onFilter, onWrite, onReact, myReactions }) {
  return (
    <main className="rj-main">
      <PageIntro
        eyebrow="Confession Wall"
        title="Di sini, kamu tidak sendirian."
        text="Kumpulan rasa yang dititipkan tanpa nama. Hadir untuk saling menemani, bukan saling menilai."
        action={<button className="rj-primary" onClick={onWrite}><Plus size={18} /> Tempelkan Rasa</button>}
      />

      <section className="rj-filter-bar">
        <span>Lihat berdasarkan rasa</span>
        <div>
          <button className={filter === "all" ? "active" : ""} onClick={() => onFilter("all")}>Semua</button>
          {MOODS.map((mood) => (
            <button key={mood.key} className={filter === mood.key ? "active" : ""} onClick={() => onFilter(mood.key)}>
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>
      </section>

      {notes.length ? (
        <section className="rj-wall">
          {notes.map((note) => (
            <StickyNote key={note.id} note={note} onReact={onReact} myReactions={myReactions} />
          ))}
        </section>
      ) : (
        <EmptyState icon={LayoutGrid} text="Belum ada rasa dengan mood ini. Ruangnya masih lapang." />
      )}

      <div className="rj-safety-strip">
        <ShieldCheck size={18} />
        <span>Tanpa komentar bebas. Hanya reaksi empatik agar ruang ini tetap ringan dan aman.</span>
      </div>
    </main>
  );
}

function StickyNote({ note, onReact, myReactions }) {
  const mood = MOOD_MAP[note.mood] || MOOD_MAP.biasa;
  const color = COLOR_MAP[note.color] || COLOR_MAP.cream;

  return (
    <article className="rj-sticky" style={{ background: color.hex, transform: `rotate(${rotationFor(note.id)}deg)` }}>
      <span className="rj-sticky-tape" style={{ background: color.tape }} />
      <div className="rj-sticky-top">
        <span className="rj-sticky-mood">{mood.emoji} <small>{mood.label}</small></span>
        <span className="rj-visibility">
          {note.visibility === "private" ? <><Lock size={11} /> hanya saya</> : <><Users size={11} /> anonim</>}
        </span>
      </div>
      <p>{note.text}</p>
      <div className="rj-sticky-meta">{formatDate(note.date)}</div>
      {note.visibility === "public" && (
        <div className="rj-reactions">
          {REACTIONS.map(({ key, label, icon: Icon }) => {
            const active = myReactions.has(`${note.id}-${key}`);
            return (
              <button key={key} className={active ? "active" : ""} onClick={() => onReact(note.id, key)} title={label}>
                <Icon size={14} /><span>{label}</span><b>{note.reactions[key]}</b>
              </button>
            );
          })}
        </div>
      )}
    </article>
  );
}

function JournalPage({ journal, moodTrail, onSave }) {
  const current = journal.find((entry) => dateKey(entry.date) === new Date().toDateString());
  const [mood, setMood] = useState(current?.mood || "tenang");
  const [note, setNote] = useState(current?.note || "");

  function submit(event) {
    event.preventDefault();
    if (!note.trim()) return;
    onSave({ mood, note: note.trim() });
  }

  return (
    <main className="rj-main">
      <PageIntro
        eyebrow="Mood Journal"
        title="Catatan yang hanya menjadi milikmu."
        text="Tidak ada yang membaca atau bereaksi. Ini ruang untuk mengenali hari dengan caramu sendiri."
      />

      <section className="rj-journal-layout">
        <form className="rj-card rj-journal-form" onSubmit={submit}>
          <span className="rj-eyebrow">Catatan hari ini</span>
          <h2>Apa kabar, sungguh-sungguh?</h2>
          <label>Pilih rasa yang paling dekat</label>
          <MoodPicker value={mood} onChange={setMood} compact />
          <label htmlFor="journal-note">Refleksi singkat</label>
          <textarea
            id="journal-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Hari ini terasa..."
            maxLength={500}
            rows={6}
          />
          <div className="rj-field-foot"><span>{note.length}/500</span></div>
          <button className="rj-primary" disabled={!note.trim()}><BookHeart size={17} /> Simpan Catatan</button>
        </form>

        <div className="rj-journal-side">
          <article className="rj-card">
            <span className="rj-eyebrow">Jejak mood</span>
            <h2>Minggu ini</h2>
            <MoodTrail days={moodTrail} />
          </article>
          <article className="rj-private-note">
            <Lock size={17} />
            <p><strong>Sepenuhnya pribadi.</strong><br />Catatan jurnal tidak pernah muncul di Confession Wall.</p>
          </article>
        </div>
      </section>

      <section>
        <div className="rj-section-title">
          <div><span className="rj-eyebrow">Riwayat pribadi</span><h2>Catatan sebelumnya</h2></div>
        </div>
        <div className="rj-journal-history">
          {[...journal].sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry) => {
            const entryMood = MOOD_MAP[entry.mood];
            return (
              <article key={entry.id}>
                <span className="rj-history-emoji" style={{ background: `${entryMood.color}22` }}>{entryMood.emoji}</span>
                <div>
                  <div className="rj-history-head">
                    <strong>{entryMood.label}</strong><time>{formatDate(entry.date)}</time>
                  </div>
                  <p>{entry.note}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function CalmPage({ mood }) {
  const [promptIndex, setPromptIndex] = useState(new Date().getDate() % PROMPTS.length);
  const [encouragement, setEncouragement] = useState("");

  function nextEncouragement() {
    const source = QUOTES[mood] || QUOTES.default;
    setEncouragement((current) => {
      const index = source.indexOf(current);
      return source[(index + 1 + source.length) % source.length];
    });
  }

  return (
    <main className="rj-main">
      <PageIntro
        eyebrow="Mind Space"
        title="Tidak ada yang perlu kamu kejar di sini."
        text="Tinggal sebentar. Rasakan kakimu berpijak, bahumu turun, dan napasmu kembali."
      />

      <section className="rj-calm-grid">
        <BreathingCircle />

        <article className="rj-card rj-reflection-card">
          <span className="rj-eyebrow">Prompt refleksi</span>
          <Sparkles size={22} />
          <blockquote>“{PROMPTS[promptIndex]}”</blockquote>
          <p>Tidak harus dijawab sekarang. Biarkan pertanyaannya menemanimu sebentar.</p>
          <button className="rj-secondary" onClick={() => setPromptIndex((index) => (index + 1) % PROMPTS.length)}>
            Pertanyaan lain <ArrowRight size={15} />
          </button>
        </article>
      </section>

      <section className="rj-encouragement">
        <div>
          <span className="rj-eyebrow">Kalau kamu membutuhkannya</span>
          <h2>Satu kalimat untuk menemani</h2>
          <p>{encouragement ? `“${encouragement}”` : "Tekan tombolnya. Tidak ada nasihat panjang, hanya kata yang lembut."}</p>
        </div>
        <button className="rj-primary" onClick={nextEncouragement}><Heart size={17} /> Saya butuh kata penyemangat</button>
      </section>
    </main>
  );
}

function BreathingCircle() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState("Siap");

  useEffect(() => {
    if (!active) {
      setPhase("Siap");
      return undefined;
    }
    const phases = ["Tarik napas", "Tahan sebentar", "Hembuskan pelan"];
    let index = 0;
    setPhase(phases[index]);
    const timer = window.setInterval(() => {
      index = (index + 1) % phases.length;
      setPhase(phases[index]);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <article className="rj-breath-card">
      <span className="rj-eyebrow">Bernapas bersama</span>
      <div className={active ? "rj-breathing active" : "rj-breathing"}>
        <div><Wind size={24} /><strong>{phase}</strong><small>{active ? "ikuti lingkarannya" : "selama 1 menit"}</small></div>
      </div>
      <button className="rj-secondary" onClick={() => setActive((value) => !value)}>
        {active ? "Cukup untuk sekarang" : "Tarik napas sebentar"}
      </button>
    </article>
  );
}

function ReleasePage({ onReleased }) {
  const [text, setText] = useState("");
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  function release() {
    if (!text.trim() || releasing) return;
    setReleasing(true);
    window.setTimeout(() => {
      setText("");
      setReleasing(false);
      setReleased(true);
      onReleased();
    }, 1400);
  }

  function reset() {
    setReleased(false);
    setText("");
  }

  return (
    <main className="rj-main">
      <PageIntro
        eyebrow="Release Box"
        title="Ada hal yang tidak perlu dibawa terus."
        text="Tulis rasa marah, sedih, takut, kecewa, atau apa pun yang membebani. Tulisan ini tidak masuk ke Confession Wall dan tidak disimpan."
      />

      <section className="rj-release-wrap">
        {!released ? (
          <article className={releasing ? "rj-release-paper is-releasing" : "rj-release-paper"}>
            <span className="rj-release-tape" />
            <Feather size={25} />
            <h2>Apa yang ingin kamu lepaskan?</h2>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Aku ingin melepaskan..."
              maxLength={800}
              rows={9}
              disabled={releasing}
              autoFocus
            />
            <div className="rj-field-foot"><span>{text.length}/800</span><small>Tidak disimpan di mana pun.</small></div>
            <button className="rj-release-button" disabled={!text.trim() || releasing} onClick={release}>
              <Trash2 size={17} /> {releasing ? "Sedang melepaskan..." : "Lepaskan Tulisan Ini"}
            </button>
          </article>
        ) : (
          <article className="rj-release-done">
            <span><Feather size={29} /></span>
            <h2>Sudah dilepaskan.</h2>
            <p>Kamu tidak harus langsung merasa baik. Cukup beri sedikit ruang untuk napas berikutnya.</p>
            <button className="rj-secondary" onClick={reset}>Tulis hal lain</button>
          </article>
        )}
      </section>
    </main>
  );
}

function FeelingComposer({ onClose, onSubmit }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("tenang");
  const [color, setColor] = useState("sage");
  const [visibility, setVisibility] = useState("public");

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), mood, color, visibility });
  }

  const buttonLabel =
    visibility === "public" ? "Tempelkan secara Anonim" : visibility === "private" ? "Simpan untuk Saya" : "Simpan ke Jurnal";

  return (
    <div className="rj-overlay" onMouseDown={onClose}>
      <form className="rj-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="rj-modal-close" onClick={onClose} aria-label="Tutup"><X size={19} /></button>
        <span className="rj-eyebrow">Taruh rasa</span>
        <h2>Tulis Perasaan Hari Ini</h2>
        <p className="rj-modal-lead">Tidak perlu rapi atau menemukan kata yang sempurna.</p>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Hari ini aku merasa..."
          maxLength={300}
          rows={5}
          autoFocus
        />
        <div className="rj-field-foot"><span>{text.length}/300</span></div>

        <label>Pilih rasa yang paling dekat</label>
        <MoodPicker value={mood} onChange={setMood} />

        <label>Pilih warna catatan</label>
        <div className="rj-color-picker">
          {COLORS.map((item) => (
            <button
              type="button"
              key={item.key}
              className={color === item.key ? "active" : ""}
              style={{ background: item.hex, borderColor: item.tape }}
              onClick={() => setColor(item.key)}
              aria-label={item.label}
              title={item.label}
            />
          ))}
        </div>

        <label>Di mana rasa ini disimpan?</label>
        <div className="rj-visibility-picker">
          <button type="button" className={visibility === "public" ? "active" : ""} onClick={() => setVisibility("public")}>
            <Users size={17} /><span><strong>Public anonim</strong><small>Muncul tanpa nama di Confession Wall</small></span>
          </button>
          <button type="button" className={visibility === "private" ? "active" : ""} onClick={() => setVisibility("private")}>
            <Lock size={17} /><span><strong>Private</strong><small>Hanya dapat kamu lihat</small></span>
          </button>
          <button type="button" className={visibility === "journal" ? "active" : ""} onClick={() => setVisibility("journal")}>
            <BookOpen size={17} /><span><strong>Journal only</strong><small>Masuk ke jurnal, bukan Confession Wall</small></span>
          </button>
        </div>

        <button className="rj-primary rj-modal-submit" disabled={!text.trim()}>
          <Send size={17} /> {buttonLabel}
        </button>
      </form>
    </div>
  );
}

function MoodPicker({ value, onChange, compact = false }) {
  return (
    <div className={compact ? "rj-mood-picker compact" : "rj-mood-picker"}>
      {MOODS.map((mood) => (
        <button type="button" key={mood.key} className={value === mood.key ? "active" : ""} onClick={() => onChange(mood.key)}>
          <span>{mood.emoji}</span><small>{mood.label}</small>
        </button>
      ))}
    </div>
  );
}

function MoodTrail({ days }) {
  return (
    <div className="rj-trail">
      {days.map(({ date, entry }) => {
        const mood = entry ? MOOD_MAP[entry.mood] : null;
        return (
          <div key={date.toISOString()} title={mood ? mood.label : "Belum ada catatan"}>
            <small>{date.toLocaleDateString("id-ID", { weekday: "short" }).slice(0, 3)}</small>
            <span style={{ background: mood ? `${mood.color}22` : "#F0EEE8", borderColor: mood?.color || "#DDD8CD" }}>
              {mood?.emoji || "·"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PageIntro({ eyebrow, title, text, action }) {
  return (
    <section className="rj-page-intro">
      <div><span className="rj-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>
      {action}
    </section>
  );
}

function EmptyState({ icon: Icon, text }) {
  return <div className="rj-empty"><Icon size={26} /><p>{text}</p></div>;
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,400&display=swap');

.rj-app {
  --cream: #F8F5ED; --paper: #FFFDF8; --ink: #293832; --muted: #6E7973;
  --teal: #548F86; --teal-dark: #3F756D; --sage: #91B5A3; --coral: #E99470;
  --sky: #87ACC0; --line: #E4DFD3; --shadow: 0 18px 45px rgba(45, 63, 55, .08);
  min-height: 100vh; color: var(--ink); background:
    radial-gradient(circle at 10% 2%, rgba(145,181,163,.14), transparent 25rem),
    radial-gradient(circle at 95% 15%, rgba(233,148,112,.1), transparent 23rem), var(--cream);
  font-family: "DM Sans", system-ui, sans-serif; line-height: 1.5;
}
.rj-app * { box-sizing: border-box; }
.rj-app button, .rj-app textarea { font: inherit; }
.rj-app button { color: inherit; cursor: pointer; }
.rj-app h1, .rj-app h2, .rj-app p { margin-top: 0; }
.rj-app h1, .rj-app h2, .rj-app blockquote { font-family: "Newsreader", Georgia, serif; }

.rj-header {
  position: sticky; top: 0; z-index: 30; min-height: 76px; padding: 13px clamp(18px,4vw,58px);
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  background: rgba(255,253,248,.9); border-bottom: 1px solid rgba(228,223,211,.8);
  backdrop-filter: blur(15px);
}
.rj-brand { display: flex; align-items: center; gap: 11px; border: 0; background: transparent; text-align: left; padding: 0; }
.rj-brand-mark { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 14px; color: white; background: linear-gradient(145deg,var(--teal),var(--coral)); }
.rj-brand strong { display: block; font: 600 22px/1 "Newsreader",serif; }
.rj-brand small { display: block; margin-top: 4px; color: var(--muted); font-size: 10px; }
.rj-nav { display: flex; align-items: center; gap: 4px; }
.rj-nav button { display: flex; align-items: center; gap: 6px; padding: 9px 11px; border: 0; border-radius: 999px; background: transparent; color: var(--muted); font-size: 12.5px; }
.rj-nav button:hover, .rj-nav button.active { color: var(--teal-dark); background: #E5F0EB; }
.rj-menu { display: none; border: 0; background: transparent; }

.rj-main { width: min(1080px, calc(100% - 36px)); margin: 0 auto; padding: 42px 0 64px; display: flex; flex-direction: column; gap: 34px; }
.rj-eyebrow { display: flex; align-items: center; gap: 6px; color: var(--teal-dark); font-size: 10.5px; font-weight: 600; letter-spacing: .13em; text-transform: uppercase; }
.rj-primary, .rj-secondary, .rj-release-button {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: fit-content; border-radius: 999px; padding: 12px 19px; font-size: 13px; font-weight: 600; transition: .2s ease;
}
.rj-primary { color: white !important; border: 0; background: linear-gradient(135deg,var(--teal),var(--coral)); box-shadow: 0 8px 20px rgba(84,143,134,.2); }
.rj-primary:hover { transform: translateY(-2px); box-shadow: 0 11px 24px rgba(84,143,134,.27); }
.rj-primary:disabled, .rj-release-button:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.rj-secondary { border: 1px solid var(--line); background: var(--paper); color: var(--teal-dark); }
.rj-secondary:hover { border-color: var(--teal); }

.rj-hero { min-height: 360px; padding: clamp(30px,6vw,70px); border-radius: 32px; display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; gap: 58px; background: linear-gradient(130deg,#DDECE4 0%,#F4E6D6 100%); overflow: hidden; position: relative; }
.rj-hero:after { content:""; position:absolute; width:300px; height:300px; border-radius:50%; right:-90px; top:-130px; border:55px solid rgba(255,255,255,.22); }
.rj-hero-copy { position: relative; z-index: 1; }
.rj-hero h1 { max-width: 620px; margin: 13px 0 12px; font-size: clamp(37px,5vw,59px); line-height: .99; font-weight: 500; letter-spacing: -.025em; }
.rj-hero-copy > p { max-width: 520px; margin-bottom: 24px; color: #5B6A63; font-size: 15px; }
.rj-hero-note { position: relative; z-index: 1; min-height: 210px; padding: 40px 30px 24px; background: #FFF8E9; box-shadow: 0 20px 45px rgba(73,78,67,.13); transform: rotate(2deg); }
.rj-tape { position:absolute; width:84px; height:22px; top:-9px; left:50%; transform:translateX(-50%) rotate(-2deg); background:rgba(233,184,95,.8); }
.rj-hero-note small { color: var(--muted); text-transform: uppercase; letter-spacing: .13em; font-size: 10px; }
.rj-hero-note blockquote { margin: 15px 0 18px; font-size: 23px; font-style: italic; line-height: 1.3; }
.rj-hero-note > span:last-child { color: var(--muted); font-size: 11px; }

.rj-home-grid, .rj-calm-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.rj-card { padding: 25px; border: 1px solid var(--line); border-radius: 22px; background: rgba(255,253,248,.82); box-shadow: 0 8px 25px rgba(48,62,56,.035); }
.rj-card h2, .rj-section-title h2 { margin: 5px 0 10px; font-size: 25px; font-weight: 500; }
.rj-card p { color: var(--muted); font-size: 13px; }
.rj-section-head { display:flex; justify-content:space-between; gap:15px; }
.rj-big-emoji { font-size: 35px; }
.rj-text-button { display:inline-flex; align-items:center; gap:5px; padding:0; border:0; background:transparent; color:var(--teal-dark); font-size:12px; font-weight:600; }
.rj-card-note { margin: 16px 0 0 !important; font-size: 11px !important; }
.rj-trail { display:flex; justify-content:space-between; gap:7px; margin-top:17px; }
.rj-trail > div { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; }
.rj-trail small { color:var(--muted); font-size:10px; text-transform:capitalize; }
.rj-trail span { display:grid; place-items:center; width:37px; height:37px; border:1px solid; border-radius:50%; font-size:17px; }
.rj-section-title { display:flex; justify-content:space-between; align-items:end; margin-bottom:14px; }
.rj-shortcuts { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.rj-shortcut { min-height:125px; padding:18px; display:flex; flex-direction:column; align-items:flex-start; border:0; border-radius:18px; text-align:left; transition:.2s ease; }
.rj-shortcut:hover { transform:translateY(-3px); box-shadow:var(--shadow); }
.rj-shortcut.sage { background:#E4EFE7; }.rj-shortcut.sky { background:#E4EFF4; }.rj-shortcut.teal { background:#DDEDEA; }.rj-shortcut.coral { background:#F7E4DA; }
.rj-shortcut-icon { display:grid; place-items:center; width:35px; height:35px; border-radius:11px; background:rgba(255,255,255,.6); color:var(--teal-dark); }
.rj-shortcut > span:nth-child(2) { flex:1; margin-top:12px; }
.rj-shortcut strong, .rj-shortcut small { display:block; }.rj-shortcut strong { font-size:14px; }.rj-shortcut small { margin-top:3px; color:var(--muted); font-size:10.5px; }
.rj-shortcut > svg { align-self:flex-end; }
.rj-gentle-reminder, .rj-safety-strip { display:flex; gap:13px; align-items:flex-start; padding:20px 24px; border-radius:18px; color:#496158; background:#EEF3EA; }
.rj-gentle-reminder strong { font-family:"Newsreader",serif; }.rj-gentle-reminder p { margin:3px 0 0; font-size:12px; color:var(--muted); }

.rj-page-intro { display:flex; align-items:flex-end; justify-content:space-between; gap:28px; padding:15px 4px 8px; }
.rj-page-intro h1 { margin:8px 0 8px; max-width:680px; font-size:clamp(34px,5vw,50px); line-height:1.03; font-weight:500; }
.rj-page-intro p { max-width:700px; margin:0; color:var(--muted); font-size:14px; }
.rj-filter-bar { padding:16px 18px; border:1px solid var(--line); border-radius:17px; background:rgba(255,253,248,.8); }
.rj-filter-bar > span { display:block; margin-bottom:9px; color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:.1em; }
.rj-filter-bar > div { display:flex; flex-wrap:wrap; gap:6px; }
.rj-filter-bar button { padding:7px 11px; border:1px solid var(--line); border-radius:999px; background:white; color:var(--muted); font-size:11px; }
.rj-filter-bar button.active { color:white; border-color:var(--teal); background:var(--teal); }
.rj-wall { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; align-items:start; padding:8px; }
.rj-sticky { position:relative; min-height:235px; padding:30px 20px 15px; display:flex; flex-direction:column; border-radius:3px; box-shadow:0 12px 24px rgba(57,63,57,.1); transition:.2s ease; }
.rj-sticky:hover { transform:rotate(0deg) translateY(-3px) !important; box-shadow:0 17px 28px rgba(57,63,57,.14); }
.rj-sticky-tape { position:absolute; top:-8px; left:50%; transform:translateX(-50%) rotate(-2deg); width:66px; height:17px; opacity:.75; }
.rj-sticky-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.rj-sticky-mood { font-size:17px; }.rj-sticky-mood small { margin-left:3px; font-size:10px; color:var(--muted); }
.rj-visibility { display:flex; align-items:center; gap:4px; padding:3px 7px; border-radius:999px; color:var(--muted); background:rgba(255,255,255,.55); font-size:9px; }
.rj-sticky > p { flex:1; margin:18px 0 15px; font:italic 18px/1.4 "Newsreader",serif; }
.rj-sticky-meta { color:var(--muted); font-size:9px; }
.rj-reactions { display:flex; flex-wrap:wrap; gap:5px; padding-top:12px; margin-top:9px; border-top:1px solid rgba(50,60,55,.09); }
.rj-reactions button { display:flex; align-items:center; gap:3px; padding:5px 6px; border:0; border-radius:999px; background:rgba(255,255,255,.58); color:var(--muted); }
.rj-reactions button span { font-size:8.5px; }.rj-reactions button b { font-size:8px; }.rj-reactions button.active { color:white; background:var(--teal); }
.rj-safety-strip { align-items:center; justify-content:center; padding:14px; font-size:11px; }
.rj-empty { display:grid; place-items:center; min-height:230px; border:1px dashed var(--line); border-radius:22px; color:var(--muted); text-align:center; background:rgba(255,255,255,.4); }

.rj-journal-layout { display:grid; grid-template-columns:1.45fr .75fr; gap:18px; align-items:start; }
.rj-journal-form label, .rj-modal label { display:block; margin:19px 0 8px; color:var(--muted); font-size:10.5px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; }
.rj-app textarea { width:100%; padding:14px; border:1px solid var(--line); border-radius:14px; outline:0; resize:vertical; color:var(--ink); background:#FBF9F3; line-height:1.6; }
.rj-app textarea:focus { border-color:var(--teal); box-shadow:0 0 0 3px rgba(84,143,134,.1); }
.rj-field-foot { min-height:20px; display:flex; justify-content:space-between; color:var(--muted); font-size:9.5px; }
.rj-journal-side { display:flex; flex-direction:column; gap:14px; }
.rj-private-note { display:flex; gap:10px; padding:16px; border-radius:15px; color:var(--teal-dark); background:#E5F0EB; }
.rj-private-note p { margin:0; font-size:11px; }.rj-private-note strong { font-size:12px; }
.rj-journal-history { display:flex; flex-direction:column; gap:10px; }
.rj-journal-history article { display:grid; grid-template-columns:42px 1fr; gap:13px; padding:16px 18px; border:1px solid var(--line); border-radius:16px; background:var(--paper); }
.rj-history-emoji { display:grid; place-items:center; width:38px; height:38px; border-radius:12px; }
.rj-history-head { display:flex; justify-content:space-between; gap:15px; }.rj-history-head strong { font-size:12px; }.rj-history-head time { color:var(--muted); font-size:9.5px; }
.rj-journal-history p { margin:4px 0 0; color:var(--muted); font-size:12px; }

.rj-mood-picker { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
.rj-mood-picker button { padding:9px 4px; display:flex; flex-direction:column; align-items:center; gap:3px; border:1px solid var(--line); border-radius:11px; background:#FBF9F3; color:var(--muted); }
.rj-mood-picker span { font-size:18px; }.rj-mood-picker small { font-size:9px; }.rj-mood-picker button.active { border-color:var(--teal); color:var(--teal-dark); background:#E8F1ED; box-shadow:0 0 0 2px rgba(84,143,134,.08); }
.rj-mood-picker.compact { grid-template-columns:repeat(4,1fr); }

.rj-breath-card, .rj-reflection-card { min-height:390px; padding:28px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border-radius:25px; }
.rj-breath-card { background:linear-gradient(150deg,#DDEDE7,#E6F0F2); }
.rj-breathing { width:210px; height:210px; margin:25px 0; display:grid; place-items:center; border-radius:50%; background:rgba(255,255,255,.65); box-shadow:0 0 0 18px rgba(255,255,255,.22),0 0 0 36px rgba(255,255,255,.1); }
.rj-breathing.active { animation:rj-breathe 12s ease-in-out infinite; }
.rj-breathing > div { display:flex; flex-direction:column; align-items:center; color:var(--teal-dark); }
.rj-breathing strong { margin-top:8px; font:500 21px "Newsreader",serif; }.rj-breathing small { color:var(--muted); font-size:10px; }
@keyframes rj-breathe { 0%,100%{transform:scale(.82)} 33%{transform:scale(1.07)} 55%{transform:scale(1.07)} }
.rj-reflection-card > svg { margin-top:40px; color:var(--coral); }.rj-reflection-card blockquote { margin:19px 0 9px; font-size:28px; line-height:1.25; font-style:italic; }
.rj-reflection-card p { max-width:380px; }
.rj-encouragement { padding:28px 32px; display:flex; justify-content:space-between; align-items:center; gap:25px; border-radius:22px; background:linear-gradient(120deg,#F5E4D9,#F7EFD9); }
.rj-encouragement h2 { margin:6px 0; font-size:25px; font-weight:500; }.rj-encouragement p { max-width:610px; margin:0; color:var(--muted); font:italic 16px "Newsreader",serif; }

.rj-release-wrap { min-height:500px; display:grid; place-items:center; padding:25px; border-radius:30px; background:linear-gradient(145deg,#E2EEE8,#F4E6DD); overflow:hidden; }
.rj-release-paper { position:relative; width:min(650px,100%); padding:43px 42px 30px; border-radius:4px; background:#FFFDF8; box-shadow:0 22px 50px rgba(65,70,63,.13); transition:1.35s ease; }
.rj-release-paper.is-releasing { opacity:0; transform:translateY(-80px) scale(.76) rotate(5deg); filter:blur(10px); }
.rj-release-tape { position:absolute; top:-10px; left:50%; width:90px; height:23px; transform:translateX(-50%) rotate(-2deg); background:rgba(233,184,95,.7); }
.rj-release-paper > svg { color:var(--teal); }.rj-release-paper h2 { margin:10px 0 16px; font-size:28px; font-weight:500; }
.rj-release-button { width:100%; margin-top:12px; border:0; color:white !important; background:#C97762; }
.rj-release-done { text-align:center; animation:rj-rise .5s ease; }.rj-release-done > span { display:grid; place-items:center; width:70px; height:70px; margin:0 auto 17px; border-radius:50%; color:var(--teal); background:rgba(255,255,255,.65); }
.rj-release-done h2 { margin:0 0 8px; font-size:36px; font-weight:500; }.rj-release-done p { max-width:440px; margin:0 auto 20px; color:var(--muted); font-size:13px; }
@keyframes rj-rise { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:none} }

.rj-overlay { position:fixed; inset:0; z-index:60; display:grid; place-items:center; padding:18px; background:rgba(33,44,39,.4); backdrop-filter:blur(6px); }
.rj-modal { position:relative; width:min(560px,100%); max-height:92vh; overflow:auto; padding:29px; border-radius:24px; background:var(--paper); box-shadow:0 25px 80px rgba(30,40,35,.25); animation:rj-rise .25s ease; }
.rj-modal h2 { margin:6px 0 3px; font-size:28px; }.rj-modal-lead { margin-bottom:16px; color:var(--muted); font-size:12px; }
.rj-modal-close { position:absolute; top:18px; right:18px; display:grid; place-items:center; width:32px; height:32px; border:0; border-radius:50%; background:#F1EEE7; }
.rj-color-picker { display:flex; gap:10px; }.rj-color-picker button { width:31px; height:31px; border:2px solid; border-radius:50%; }.rj-color-picker button.active { outline:2px solid var(--ink); outline-offset:2px; }
.rj-visibility-picker { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; }
.rj-visibility-picker button { display:flex; align-items:flex-start; gap:7px; padding:10px; border:1px solid var(--line); border-radius:11px; background:#FBF9F3; text-align:left; }
.rj-visibility-picker button > span { flex:1; }.rj-visibility-picker strong, .rj-visibility-picker small { display:block; }.rj-visibility-picker strong { font-size:10.5px; }.rj-visibility-picker small { margin-top:2px; color:var(--muted); font-size:8px; line-height:1.35; }
.rj-visibility-picker button.active { border-color:var(--teal); color:var(--teal-dark); background:#E8F1ED; }
.rj-modal-submit { width:100%; margin-top:20px; }
.rj-toast { position:fixed; z-index:90; left:50%; bottom:25px; transform:translateX(-50%); display:flex; align-items:center; gap:8px; padding:12px 18px; border-radius:999px; color:white; background:#385D55; box-shadow:0 10px 35px rgba(25,40,35,.22); font-size:12px; animation:rj-rise .25s ease; }

.rj-soundscape { position:fixed; right:22px; bottom:22px; z-index:45; display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
.rj-sound-trigger { position:relative; min-width:170px; padding:9px 14px 9px 10px; display:flex; align-items:center; gap:9px; border:1px solid rgba(84,143,134,.24); border-radius:999px; color:var(--teal-dark); background:rgba(255,253,248,.94); box-shadow:0 12px 32px rgba(40,60,51,.14); backdrop-filter:blur(12px); }
.rj-sound-trigger > span:first-child { display:grid; place-items:center; width:34px; height:34px; border-radius:50%; background:#E5F0EB; font-size:16px; }
.rj-sound-trigger > span:nth-child(2) { flex:1; text-align:left; }
.rj-sound-trigger strong,.rj-sound-trigger small { display:block; }.rj-sound-trigger strong { font-size:11px; }.rj-sound-trigger small { margin-top:1px; color:var(--muted); font-size:8.5px; }
.rj-sound-trigger i { width:7px; height:7px; border-radius:50%; background:var(--coral); box-shadow:0 0 0 4px rgba(233,148,112,.16); animation:rj-sound-pulse 1.8s ease-in-out infinite; }
.rj-sound-trigger.is-playing > span:first-child { background:#F5E5D9; }
@keyframes rj-sound-pulse { 50% { transform:scale(.65); opacity:.65; } }
.rj-sound-panel { width:min(390px,calc(100vw - 28px)); padding:19px; border:1px solid var(--line); border-radius:21px; background:rgba(255,253,248,.97); box-shadow:0 22px 55px rgba(35,50,43,.2); backdrop-filter:blur(16px); animation:rj-rise .22s ease; }
.rj-sound-head { display:flex; justify-content:space-between; align-items:flex-start; gap:15px; }
.rj-sound-head h2 { margin:5px 0 2px; font-size:22px; font-weight:500; }.rj-sound-head p { margin:0; color:var(--muted); font-size:9.5px; }
.rj-sound-close { display:grid; place-items:center; width:30px; height:30px; border:0; border-radius:50%; background:#F1EEE7; }
.rj-sound-options { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin:17px 0; }
.rj-sound-options button { padding:9px 4px; display:flex; flex-direction:column; align-items:center; gap:4px; border:1px solid var(--line); border-radius:11px; color:var(--muted); background:#FAF8F2; }
.rj-sound-options button span { font-size:18px; }.rj-sound-options button small { font-size:8px; }.rj-sound-options button.active { color:var(--teal-dark); border-color:var(--teal); background:#E8F1ED; }
.rj-sound-controls { display:flex; align-items:center; gap:8px; padding-top:13px; border-top:1px solid var(--line); color:var(--muted); }
.rj-sound-play { min-width:82px; padding:8px 12px; display:flex; align-items:center; justify-content:center; gap:5px; border:0; border-radius:999px; color:white !important; background:var(--teal); font-size:10px; font-weight:600; }
.rj-sound-play:disabled { opacity:.6; cursor:wait; }
.rj-sound-controls input { flex:1; min-width:70px; accent-color:var(--teal); }
.rj-sound-controls > b { min-width:30px; color:var(--teal-dark); font-size:9px; text-align:right; }
.rj-sound-now { margin-top:12px; padding:10px 11px; border-radius:12px; background:#F4F1E9; }
.rj-sound-now > span { display:block; margin-top:7px; color:var(--muted); font-size:9px; text-align:center; }
.rj-sound-now > span.error { color:#A65343; }
.rj-sound-bars { height:25px; display:flex; align-items:center; justify-content:center; gap:3px; overflow:hidden; }
.rj-sound-bars i { width:3px; height:4px; border-radius:999px; background:linear-gradient(to top,var(--teal),var(--coral)); transform-origin:center; }
.rj-sound-now.is-playing .rj-sound-bars i { animation:rj-sound-bar .9s ease-in-out infinite alternate; animation-delay:calc(var(--bar) * -73ms); }
@keyframes rj-sound-bar {
  0% { height:4px; opacity:.55; }
  45% { height:21px; opacity:1; }
  100% { height:9px; opacity:.75; }
}

.rj-footer { padding:27px clamp(20px,5vw,70px); display:flex; justify-content:space-between; gap:25px; border-top:1px solid var(--line); color:var(--muted); background:#F2EFE7; }
.rj-footer-brand { display:flex; align-items:center; gap:7px; color:var(--teal-dark); font:600 16px "Newsreader",serif; white-space:nowrap; }
.rj-footer p { max-width:710px; margin:0; text-align:right; font-size:9.5px; }

@media (max-width: 920px) {
  .rj-menu { display:grid; place-items:center; }
  .rj-nav { position:absolute; display:none; top:67px; left:16px; right:16px; padding:10px; flex-direction:column; align-items:stretch; border:1px solid var(--line); border-radius:17px; background:var(--paper); box-shadow:var(--shadow); }
  .rj-nav.is-open { display:flex; }.rj-nav button { justify-content:flex-start; }
  .rj-hero { grid-template-columns:1fr; gap:38px; }.rj-hero-note { max-width:510px; }
  .rj-shortcuts { grid-template-columns:repeat(2,1fr); }.rj-wall { grid-template-columns:repeat(2,1fr); }
}
@media (max-width: 680px) {
  .rj-brand small { display:none; }.rj-main { width:min(100% - 24px,1080px); padding-top:25px; }
  .rj-hero { padding:34px 23px; border-radius:23px; }.rj-hero h1 { font-size:39px; }.rj-hero-note { padding:35px 23px 22px; }
  .rj-home-grid,.rj-calm-grid,.rj-journal-layout { grid-template-columns:1fr; }
  .rj-shortcuts,.rj-wall { grid-template-columns:1fr; }.rj-shortcut { min-height:115px; }
  .rj-page-intro { align-items:flex-start; flex-direction:column; }.rj-page-intro h1 { font-size:38px; }
  .rj-trail span { width:32px; height:32px; font-size:15px; }
  .rj-mood-picker,.rj-mood-picker.compact { grid-template-columns:repeat(4,1fr); }
  .rj-visibility-picker { grid-template-columns:1fr; }.rj-release-wrap { padding:18px 10px; }.rj-release-paper { padding:38px 20px 24px; }
  .rj-encouragement { align-items:flex-start; flex-direction:column; padding:24px; }
  .rj-footer { flex-direction:column; }.rj-footer p { text-align:left; }
  .rj-soundscape { right:12px; bottom:12px; }.rj-sound-trigger { min-width:154px; }
}
@media (max-width: 390px) {
  .rj-mood-picker,.rj-mood-picker.compact { grid-template-columns:repeat(2,1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .rj-app *, .rj-app *:before, .rj-app *:after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; transition-duration:.01ms !important; }
}
`;
