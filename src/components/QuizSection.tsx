import { useState, useEffect, useCallback, useMemo } from "react";
import ScrollRevealItem from "@/components/ScrollRevealItem";
import { type Difficulty, type QuizQuestion, allQuestions, getRandomQuestions } from "@/data/quizQuestions";

const difficultyConfig: Record<Difficulty, { label: string; emoji: string; color: string; bg: string; time: number }> = {
  mudah: { label: "Mudah", emoji: "🟢", color: "text-success", bg: "bg-success/15 border-success/30", time: 20 },
  sedang: { label: "Sedang", emoji: "🟡", color: "text-secondary", bg: "bg-secondary/15 border-secondary/30", time: 30 },
  sulit: { label: "Sulit", emoji: "🔴", color: "text-warming", bg: "bg-warming/15 border-warming/30", time: 45 },
};

const QUESTIONS_PER_QUIZ = 10;
const LEADERBOARD_KEY = "quiz_leaderboard";
const MAX_LEADERBOARD_ENTRIES = 10;

interface LeaderboardEntry {
  username: string;
  score: number;
  total: number;
  percentage: number;
  difficulty: Difficulty;
  date: string;
}

function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToLeaderboard(entry: LeaderboardEntry) {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.percentage - a.percentage || new Date(b.date).getTime() - new Date(a.date).getTime());
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board.slice(0, 50)));
}

function getTopByDifficulty(difficulty: Difficulty): LeaderboardEntry[] {
  return getLeaderboard()
    .filter((e) => e.difficulty === difficulty)
    .slice(0, MAX_LEADERBOARD_ENTRIES);
}

const QuizSection = () => {
  // Step: "username" → "difficulty" → quiz active → finished
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [step, setStep] = useState<"username" | "difficulty" | "quiz" | "finished">("username");

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showNav, setShowNav] = useState(false);

  // Leaderboard tab
  const [leaderboardTab, setLeaderboardTab] = useState<Difficulty>("mudah");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  const timePerQuestion = selectedDifficulty ? difficultyConfig[selectedDifficulty].time : 30;
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);

  const quizActive = step === "quiz";

  // Refresh leaderboard data when needed
  const refreshLeaderboard = useCallback((tab?: Difficulty) => {
    setLeaderboardData(getTopByDifficulty(tab ?? leaderboardTab));
  }, [leaderboardTab]);

  useEffect(() => {
    refreshLeaderboard();
  }, [leaderboardTab]);

  // Timer countdown effect
  useEffect(() => {
    if (!quizActive || answered) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAnswers((a) => {
            const copy = [...a];
            if (copy[currentQ] === null) copy[currentQ] = false;
            return copy;
          });
          setTimeout(() => handleNext(), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizActive, answered, currentQ]);

  useEffect(() => {
    setTimeLeft(timePerQuestion);
  }, [currentQ]);

  // Anti-copy protection during quiz
  useEffect(() => {
    if (!quizActive) return;

    const preventCopy = (e: Event) => {
      e.preventDefault();
    };

    const preventKeyboard = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "C" || e.key === "a" || e.key === "A" || e.key === "x" || e.key === "X")
      ) {
        e.preventDefault();
      }
      if (e.key === "PrintScreen") {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("selectstart", preventCopy);
    document.addEventListener("contextmenu", preventCopy);
    document.addEventListener("keydown", preventKeyboard);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("selectstart", preventCopy);
      document.removeEventListener("contextmenu", preventCopy);
      document.removeEventListener("keydown", preventKeyboard);
    };
  }, [quizActive]);

  const totalQuestions = quizQuestions.length;
  const q = quizQuestions[currentQ];

  const handleSelect = (optIdx: number) => {
    if (answered || timeLeft <= 0) return;
    setSelected(optIdx);
    setAnswered(true);
    const isCorrect = optIdx === quizQuestions[currentQ].correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => {
      const copy = [...a];
      copy[currentQ] = isCorrect;
      return copy;
    });
    setSelectedAnswers((a) => {
      const copy = [...a];
      copy[currentQ] = optIdx;
      return copy;
    });
  };

  const findNextUnanswered = (from: number): number => {
    for (let i = from + 1; i < totalQuestions; i++) {
      if (answers[i] === undefined || answers[i] === null) return i;
    }
    for (let i = 0; i <= from; i++) {
      if (answers[i] === undefined || answers[i] === null) return i;
    }
    return -1;
  };

  const handleNext = () => {
    const nextUnanswered = findNextUnanswered(currentQ);
    if (nextUnanswered === -1) {
      finishQuiz();
    } else {
      handleJumpTo(nextUnanswered);
    }
  };

  const handleJumpTo = (idx: number) => {
    setCurrentQ(idx);
    const prevAnswer = selectedAnswers[idx];
    if (prevAnswer !== null && prevAnswer !== undefined) {
      setSelected(prevAnswer);
      setAnswered(true);
    } else {
      setSelected(null);
      setAnswered(false);
    }
    setTimeLeft(timePerQuestion);
  };

  const finishQuiz = useCallback(() => {
    const finalScore = answers.filter((a) => a === true).length + (selected !== null && quizQuestions[currentQ]?.correctIndex === selected && !answers.includes(true) ? 0 : 0);
    // Use score state directly
    setStep("finished");

    if (selectedDifficulty && username.trim()) {
      const pct = Math.round((score / totalQuestions) * 100);
      saveToLeaderboard({
        username: username.trim(),
        score,
        total: totalQuestions,
        percentage: pct,
        difficulty: selectedDifficulty,
        date: new Date().toISOString(),
      });
      refreshLeaderboard(selectedDifficulty);
      setLeaderboardTab(selectedDifficulty);
    }
  }, [score, totalQuestions, selectedDifficulty, username, answers, refreshLeaderboard]);

  const handleFinishEarly = () => {
    // Calculate score from answers
    const finalScore = answers.filter((a) => a === true).length;
    setScore(finalScore);
    setTimeout(() => {
      setStep("finished");
      if (selectedDifficulty && username.trim()) {
        const pct = Math.round((finalScore / totalQuestions) * 100);
        saveToLeaderboard({
          username: username.trim(),
          score: finalScore,
          total: totalQuestions,
          percentage: pct,
          difficulty: selectedDifficulty,
          date: new Date().toISOString(),
        });
        refreshLeaderboard(selectedDifficulty);
        setLeaderboardTab(selectedDifficulty);
      }
    }, 0);
  };

  const handleRestart = () => {
    setSelectedDifficulty(null);
    setQuizQuestions([]);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setAnswers([]);
    setSelectedAnswers([]);
    setShowNav(false);
    setStep("difficulty");
  };

  const handleFullRestart = () => {
    handleRestart();
    setUsername("");
    setUsernameError("");
    setStep("username");
  };

  const handlePickDifficulty = (d: Difficulty) => {
    const randomized = getRandomQuestions(d, QUESTIONS_PER_QUIZ);
    setSelectedDifficulty(d);
    setQuizQuestions(randomized);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setAnswers(new Array(QUESTIONS_PER_QUIZ).fill(null));
    setSelectedAnswers(new Array(QUESTIONS_PER_QUIZ).fill(null));
    setShowNav(false);
    setTimeLeft(difficultyConfig[d].time);
    setStep("quiz");
  };

  const handleUsernameSubmit = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameError("Username tidak boleh kosong");
      return;
    }
    if (trimmed.length < 2) {
      setUsernameError("Username minimal 2 karakter");
      return;
    }
    if (trimmed.length > 20) {
      setUsernameError("Username maksimal 20 karakter");
      return;
    }
    if (!/^[a-zA-Z0-9_\s]+$/.test(trimmed)) {
      setUsernameError("Username hanya boleh huruf, angka, spasi, dan underscore");
      return;
    }
    setUsernameError("");
    setStep("difficulty");
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // === Username Input Step ===
  if (step === "username") {
    return (
      <section id="kuis" className="py-20 bg-gradient-section-cool">
        <div className="container max-w-3xl mx-auto px-4">
          <ScrollRevealItem className="text-center mb-14">
            <span className="text-5xl mb-4 block">📝</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Kuis Interaktif
            </h2>
            <p className="text-muted-foreground text-lg">
              Masukkan username untuk memulai kuis dan simpan skormu di leaderboard! 🏆
            </p>
          </ScrollRevealItem>

          <ScrollRevealItem variant="scale" delay={0.2}>
            <div className="max-w-md mx-auto bg-card rounded-xl border shadow-lg p-8">
              <div className="text-center mb-6">
                <span className="text-4xl block mb-3">👤</span>
                <h3 className="text-xl font-display font-bold text-foreground">Siapa Nama Kamu?</h3>
                <p className="text-sm text-muted-foreground mt-1">Username akan ditampilkan di leaderboard</p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
                    placeholder="Ketik username di sini..."
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors text-center text-lg font-semibold"
                  />
                  {usernameError && (
                    <p className="text-sm text-warming mt-2 text-center font-semibold">
                      ⚠️ {usernameError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {username.trim().length}/20 karakter
                  </p>
                </div>
                <button
                  onClick={handleUsernameSubmit}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg text-lg"
                >
                  Lanjutkan ➡️
                </button>
              </div>
            </div>
          </ScrollRevealItem>

          {/* Leaderboard Preview */}
          <LeaderboardPanel
            leaderboardTab={leaderboardTab}
            setLeaderboardTab={(tab) => setLeaderboardTab(tab)}
            leaderboardData={leaderboardData}
          />
        </div>
      </section>
    );
  }

  // === Difficulty Selection ===
  if (step === "difficulty") {
    return (
      <section id="kuis" className="py-20 bg-gradient-section-cool">
        <div className="container max-w-3xl mx-auto px-4">
          <ScrollRevealItem className="text-center mb-14">
            <span className="text-5xl mb-4 block">📝</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Kuis Interaktif
            </h2>
            <p className="text-muted-foreground text-lg">
              Halo <span className="font-bold text-primary">{username.trim()}</span>! Pilih tingkat kesulitan 🧠
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Setiap kuis menampilkan <span className="font-bold text-primary">{QUESTIONS_PER_QUIZ} soal acak</span> dari bank soal
            </p>
          </ScrollRevealItem>

          <ScrollRevealItem variant="scale" delay={0.2} className="grid md:grid-cols-3 gap-6">
            {(["mudah", "sedang", "sulit"] as Difficulty[]).map((d) => {
              const cfg = difficultyConfig[d];
              const count = allQuestions.filter((q) => q.difficulty === d).length;
              return (
                <button
                  key={d}
                  onClick={() => handlePickDifficulty(d)}
                  className={`rounded-xl border-2 p-8 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${cfg.bg}`}
                >
                  <span className="text-5xl block mb-4">{cfg.emoji}</span>
                  <h3 className={`text-2xl font-display font-bold mb-2 ${cfg.color}`}>
                    {cfg.label}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {d === "mudah" && "Konsep dasar & definisi"}
                    {d === "sedang" && "Penerapan rumus sederhana"}
                    {d === "sulit" && "Perhitungan & analisis lanjut"}
                  </p>
                  <p className="text-xs font-bold text-primary mb-2">
                    ⏱️ {difficultyConfig[d].time} detik/soal
                  </p>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {count} soal tersedia · {QUESTIONS_PER_QUIZ} soal acak
                  </span>
                </button>
              );
            })}
          </ScrollRevealItem>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Total {allQuestions.length} soal tersedia 📚
            </p>
            <button
              onClick={handleFullRestart}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Ganti username
            </button>
          </div>

          {/* Leaderboard */}
          <LeaderboardPanel
            leaderboardTab={leaderboardTab}
            setLeaderboardTab={(tab) => setLeaderboardTab(tab)}
            leaderboardData={leaderboardData}
          />
        </div>
      </section>
    );
  }

  // === Results ===
  if (step === "finished" && selectedDifficulty) {
    const cfg = difficultyConfig[selectedDifficulty];
    const currentLeaderboard = getTopByDifficulty(selectedDifficulty);
    return (
      <section id="kuis" className="py-20 bg-gradient-section-cool">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <span className="text-7xl mb-6 block">
            {percentage >= 80 ? "🏆" : percentage >= 50 ? "👏" : "💪"}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2">
            Hasil Kuis
          </h2>
          <p className="text-lg text-muted-foreground mb-1">
            Pemain: <span className="font-bold text-primary">{username.trim()}</span>
          </p>
          <p className={`text-sm font-semibold mb-6 ${cfg.color}`}>
            {cfg.emoji} Tingkat: {cfg.label}
          </p>
          <div className="bg-card rounded-xl border shadow-lg p-8 mb-6">
            <p className="text-6xl font-display font-bold text-primary mb-2">
              {score}/{totalQuestions}
            </p>
            <p className="text-xl text-muted-foreground mb-4">Skor: {percentage}%</p>
            <div className="flex justify-center gap-2 flex-wrap mb-6">
              {answers.map((correct, i) => (
                <span
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    correct ? "bg-quiz-correct/20 text-quiz-correct" : "bg-quiz-wrong/20 text-quiz-wrong"
                  }`}
                >
                  {correct ? "✓" : "✗"}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground">
              {percentage >= 80
                ? "Luar biasa! Kamu menguasai materi ini dengan sangat baik! 🌟"
                : percentage >= 50
                  ? "Bagus! Tapi masih bisa ditingkatkan lagi ya! 📚"
                  : "Jangan menyerah! Pelajari kembali materinya dan coba lagi! 🔄"}
            </p>
          </div>

          {/* Mini Leaderboard for this difficulty */}
          {currentLeaderboard.length > 0 && (
            <div className="bg-card rounded-xl border shadow-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-display font-bold text-foreground mb-4 text-center">
                🏅 Leaderboard — {cfg.emoji} {cfg.label}
              </h3>
              <div className="space-y-2">
                {currentLeaderboard.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      entry.username === username.trim() && entry.score === score
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/50"
                    }`}
                  >
                    <span className="text-lg font-bold w-8 text-center shrink-0">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className="font-semibold text-foreground flex-1 truncate">{entry.username}</span>
                    <span className="text-sm font-bold text-primary">{entry.percentage}%</span>
                    <span className="text-xs text-muted-foreground">{entry.score}/{entry.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handlePickDifficulty(selectedDifficulty)}
              className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              🔄 Ulangi (Soal Baru)
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              📋 Pilih Level Lain
            </button>
            <button
              onClick={handleFullRestart}
              className="px-6 py-3 bg-muted text-muted-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              👤 Ganti Username
            </button>
          </div>
        </div>
      </section>
    );
  }

  // === Quiz in progress ===
  if (!selectedDifficulty || !q) return null;
  const cfg = difficultyConfig[selectedDifficulty];

  return (
    <section
      id="kuis"
      className="py-20 bg-gradient-section-cool"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-5xl mb-4 block">📝</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Kuis Interaktif
          </h2>
          <p className="text-muted-foreground text-lg">
            Pemain: <span className="font-bold text-primary">{username.trim()}</span> — Uji pemahamanmu! 🧠
          </p>
        </div>

        {/* Anti-copy notice + nav toggle */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex-1 p-3 bg-warming/10 rounded-lg border border-warming/20 text-center">
            <p className="text-xs text-warming font-semibold">
              🔒 Mode kuis aktif — penyalinan teks dinonaktifkan
            </p>
          </div>
          <button
            onClick={() => setShowNav(!showNav)}
            className="px-4 py-3 bg-card rounded-lg border text-sm font-semibold text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            🗂️ {showNav ? "Sembunyikan" : "Navigasi Soal"}
          </button>
        </div>

        {/* Question Navigation Panel */}
        {showNav && (
          <div className="mb-4 p-4 bg-card rounded-xl border shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">📋 Navigasi Soal</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-quiz-correct/30 inline-block" /> Benar</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-quiz-wrong/30 inline-block" /> Salah</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-muted inline-block border" /> Belum</span>
              </div>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {quizQuestions.map((_, idx) => {
                const isActive = idx === currentQ;
                const result = answers[idx];
                let btnClass = "bg-muted border-border text-muted-foreground hover:border-primary";
                if (result === true) btnClass = "bg-quiz-correct/20 border-quiz-correct/40 text-quiz-correct";
                else if (result === false) btnClass = "bg-quiz-wrong/20 border-quiz-wrong/40 text-quiz-wrong";
                if (isActive) btnClass += " ring-2 ring-primary ring-offset-1";
                return (
                  <button
                    key={idx}
                    onClick={() => handleJumpTo(idx)}
                    className={`w-full aspect-square rounded-lg border-2 text-sm font-bold transition-all ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            {answeredCount > 0 && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Dijawab: {answeredCount}/{totalQuestions}
                </p>
                <button
                  onClick={handleFinishEarly}
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  ✅ Selesai & Lihat Hasil
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-card rounded-xl border shadow-lg overflow-hidden">
           {/* Header */}
           <div className="bg-muted px-6 py-3 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                 {cfg.emoji} {cfg.label}
               </span>
               <span className="text-sm font-semibold text-muted-foreground">
                 Soal {currentQ + 1}/{totalQuestions}
               </span>
             </div>
             <div className="flex items-center gap-4">
               <div className="text-center">
                 <p className={`text-xs font-semibold mb-1 ${timeLeft <= 10 ? "text-warming" : "text-muted-foreground"}`}>
                   ⏱️ Waktu
                 </p>
                 <p className={`text-2xl font-bold ${timeLeft <= 10 ? "text-warming animate-pulse" : "text-primary"}`}>
                   {timeLeft}s
                 </p>
               </div>
               <span className="text-sm font-semibold text-primary">Skor: {score} ⭐</span>
             </div>
           </div>
           {/* Progress bar */}
           <div className="h-2 bg-muted relative overflow-hidden">
             <div
               className={`h-full transition-all duration-300 ${timeLeft <= 10 ? "bg-warming" : "bg-primary"}`}
               style={{
                 width: `${(answeredCount / totalQuestions) * 100}%`,
               }}
             />
           </div>
           {/* Timer progress line */}
           <div className="h-1 bg-border">
             <div
               className={`h-full transition-all linear ${timeLeft <= 10 ? "bg-warming" : "bg-secondary"}`}
               style={{
                 width: `${(timeLeft / timePerQuestion) * 100}%`,
               }}
             />
           </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start gap-3 mb-6">
              <span className="text-4xl">{q.emoji}</span>
              <p className="text-lg font-semibold text-foreground leading-relaxed">
                {q.question}
              </p>
            </div>

             <div className="space-y-3 mb-6">
               {q.options.map((opt, oIdx) => {
                 let optionClass = "border-border hover:border-primary/50 hover:bg-primary/5";
                 if (answered || timeLeft <= 0) {
                   if (oIdx === q.correctIndex) {
                     optionClass = "border-quiz-correct bg-quiz-correct/10";
                   } else if (oIdx === selected) {
                     optionClass = "border-quiz-wrong bg-quiz-wrong/10";
                   } else {
                     optionClass = "border-border opacity-50";
                   }
                 }
                 return (
                   <button
                     key={oIdx}
                     onClick={() => handleSelect(oIdx)}
                     disabled={answered || timeLeft <= 0}
                     className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${optionClass}`}
                   >
                     <span className="font-semibold text-muted-foreground mr-3">
                       {String.fromCharCode(65 + oIdx)}.
                     </span>
                     <span className="text-foreground">{opt}</span>
                     {answered && oIdx === q.correctIndex && <span className="ml-2">✅</span>}
                     {answered && oIdx === selected && oIdx !== q.correctIndex && <span className="ml-2">❌</span>}
                   </button>
                 );
               })}
             </div>

             {answered && (
               <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                 <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                   <p className="text-sm font-semibold text-primary mb-1">💡 Penjelasan:</p>
                   <p className="text-sm text-foreground">{q.explanation}</p>
                 </div>
                 <button
                   onClick={handleNext}
                   className="w-full px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
                 >
                   {findNextUnanswered(currentQ) === -1 ? "Lihat Hasil 🏆" : "Soal Berikutnya ➡️"}
                 </button>
               </div>
             )}

             {timeLeft <= 0 && !answered && (
               <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                 <div className="p-4 bg-warming/10 rounded-lg border border-warming/20 mb-4 text-center">
                   <p className="text-sm font-semibold text-warming">⏰ Waktu Habis!</p>
                   <p className="text-xs text-muted-foreground mt-1">Melanjutkan ke soal berikutnya...</p>
                 </div>
               </div>
             )}
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto block"
        >
          ← Kembali pilih tingkat kesulitan
        </button>
      </div>
    </section>
  );
};

// === Leaderboard Panel Component ===
function LeaderboardPanel({
  leaderboardTab,
  setLeaderboardTab,
  leaderboardData,
}: {
  leaderboardTab: Difficulty;
  setLeaderboardTab: (tab: Difficulty) => void;
  leaderboardData: LeaderboardEntry[];
}) {
  return (
    <ScrollRevealItem delay={0.4} className="mt-12">
      <div className="bg-card rounded-xl border shadow-lg overflow-hidden">
        <div className="bg-muted px-6 py-4 text-center">
          <h3 className="text-xl font-display font-bold text-foreground">🏅 Leaderboard</h3>
          <p className="text-sm text-muted-foreground">Skor tertinggi dari semua pemain</p>
        </div>

        {/* Difficulty tabs */}
        <div className="flex border-b">
          {(["mudah", "sedang", "sulit"] as Difficulty[]).map((d) => {
            const cfg = difficultyConfig[d];
            return (
              <button
                key={d}
                onClick={() => setLeaderboardTab(d)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  leaderboardTab === d
                    ? `${cfg.color} border-b-2 border-current bg-muted/50`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cfg.emoji} {cfg.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {leaderboardData.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl block mb-3">🏜️</span>
              <p className="text-muted-foreground text-sm">Belum ada skor untuk tingkat ini.</p>
              <p className="text-muted-foreground text-xs mt-1">Jadilah yang pertama! 🚀</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboardData.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="text-lg font-bold w-8 text-center shrink-0">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <span className="font-semibold text-foreground flex-1 truncate">{entry.username}</span>
                  <span className="text-sm font-bold text-primary">{entry.percentage}%</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {entry.score}/{entry.total}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollRevealItem>
  );
}

export default QuizSection;
