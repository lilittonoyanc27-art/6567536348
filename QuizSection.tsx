import React, { useState } from 'react';
import { QuizQuestion } from './types';
import { QUIZ_QUESTIONS } from './quizData';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Film,
  Award,
  Sparkles,
  HelpCircle,
  Languages,
  Volume2,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface QuizSectionProps {
  onBackToVideo: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onBackToVideo }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Store user answers: { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  // Track revealed Armenian translations:
  // question translations: { [questionId]: boolean }
  const [revealedQuestionTrans, setRevealedQuestionTrans] = useState<Record<number, boolean>>({});
  // option translations: { [`${questionId}_${optionKey}`]: boolean }
  const [revealedOptionTrans, setRevealedOptionTrans] = useState<Record<string, boolean>>({});
  // explanation translation: { [questionId]: boolean }
  const [revealedExpTrans, setRevealedExpTrans] = useState<Record<number, boolean>>({});

  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [ttsSpeakingKey, setTtsSpeakingKey] = useState<string | null>(null);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentAnswer = userAnswers[currentQ.id];
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = isAnswered && currentAnswer === currentQ.correctOptionKey;

  // Toggle question translation
  const toggleQuestionTranslation = (qId: number) => {
    setRevealedQuestionTrans((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Toggle option translation
  const toggleOptionTranslation = (qId: number, key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const token = `${qId}_${key}`;
    setRevealedOptionTrans((prev) => ({
      ...prev,
      [token]: !prev[token],
    }));
  };

  // Toggle explanation translation
  const toggleExpTranslation = (qId: number) => {
    setRevealedExpTrans((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Handle option selection
  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return; // Answer already locked in
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key,
    }));
  };

  // Move to next question
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Reset / Repeat quiz
  const handleRestart = () => {
    setUserAnswers({});
    setRevealedQuestionTrans({});
    setRevealedOptionTrans({});
    setRevealedExpTrans({});
    setCurrentIndex(0);
    setIsQuizFinished(false);
  };

  // Audio pronunciation
  const speakSpanish = (text: string, key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setTtsSpeakingKey(key);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.onend = () => setTtsSpeakingKey(null);
    utterance.onerror = () => setTtsSpeakingKey(null);

    window.speechSynthesis.speak(utterance);
  };

  // Calculate score
  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctOptionKey ? acc + 1 : acc;
  }, 0);

  // If user completed all questions and is on results screen
  if (isQuizFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Results Card */}
        <div className="bg-[#781C32] rounded-3xl p-8 md:p-12 border-2 border-[#F6C453] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#E97928]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#F6C453]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4A1028] border-2 border-[#F6C453] text-[#F6C453] shadow-xl mx-auto">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[#F6C453] text-xs font-semibold uppercase tracking-widest font-mono">
                Resultado Final · Վերջնական արդյունք
              </span>
              <h2 className="font-cinzel text-3xl md:text-5xl font-extrabold text-white">
                {score} / {totalQuestions}
              </h2>
              <div className="text-amber-200/90 text-sm font-medium">
                {percentage >= 80 ? (
                  <span>¡Excelente dominio de la escena! / Գերազանց իմացություն:</span>
                ) : percentage >= 50 ? (
                  <span>¡Buen trabajo! Puedes repasar los subtítulos. / Լավ աշխատանք, բայց կարելի է կրկնել:</span>
                ) : (
                  <span>Sigue practicando con el vídeo y los subtítulos. / Շարունակիր պարապել տեսանյութով:</span>
                )}
              </div>
            </div>

            {/* Score progress bar */}
            <div className="w-full max-w-md mx-auto bg-[#4A1028] h-3.5 rounded-full overflow-hidden border border-[#F6C453]/30">
              <div
                className="h-full bg-gradient-to-r from-[#E97928] to-[#F6C453] rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Breakdown of questions */}
            <div className="pt-4 border-t border-[#F6C453]/20">
              <div className="text-xs text-[#F6C453] uppercase font-semibold tracking-wider mb-3">
                Resumen de preguntas (clic para revisar cada una)
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const answered = userAnswers[q.id];
                  const correct = answered === q.correctOptionKey;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsQuizFinished(false);
                      }}
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        correct
                          ? 'bg-emerald-700/80 text-white border border-emerald-400'
                          : 'bg-red-800/80 text-white border border-red-400'
                      }`}
                      title={`Pregunta ${idx + 1}: ${correct ? 'Correcta' : 'Incorrecta'}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons as required: "Volver al vídeo", "Repetir" */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#E97928] hover:bg-[#d66b1e] text-white font-semibold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repetir cuestionario</span>
              </button>

              <button
                onClick={onBackToVideo}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#4A1028] hover:bg-[#5a1431] border-2 border-[#F6C453] text-[#F6C453] hover:text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Film className="w-4 h-4" />
                <span>Volver al vídeo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isQuestionTransRevealed = !!revealedQuestionTrans[currentQ.id];
  const isExpTransRevealed = !!revealedExpTrans[currentQ.id];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Bar with Navigation and Progress */}
      <div className="bg-[#781C32] rounded-2xl p-4 md:p-6 border border-[#F6C453]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToVideo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#4A1028] hover:bg-[#5a1431] text-amber-100 hover:text-white text-xs font-semibold border border-[#F6C453]/30 transition-colors"
          >
            <Film className="w-3.5 h-3.5 text-[#F6C453]" />
            <span>Volver al vídeo</span>
          </button>

          <div>
            <span className="text-[#F6C453] text-xs font-mono font-semibold block">
              Pregunta {currentIndex + 1} de {totalQuestions}
            </span>
            <span className="text-amber-200/80 text-xs">
              Puntuación actual: {score} acertada{score === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const answered = userAnswers[q.id];
            const isCorrectAnswer = answered === q.correctOptionKey;

            let badgeStyle = 'bg-[#4A1028] text-amber-200/60 border border-[#F6C453]/20';
            if (isCurrent) {
              badgeStyle = 'bg-[#F6C453] text-[#4A1028] font-bold border-2 border-white scale-110 shadow-md';
            } else if (answered !== undefined) {
              badgeStyle = isCorrectAnswer
                ? 'bg-emerald-700 text-white border border-emerald-400'
                : 'bg-red-800 text-white border border-red-400';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-all ${badgeStyle}`}
                title={`Ir a pregunta ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#781C32] rounded-3xl p-6 md:p-10 border-2 border-[#F6C453]/40 shadow-2xl space-y-7 relative">
        {/* Question Header & Spanish Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs md:text-sm text-amber-200/80">
            <span className="font-bold uppercase tracking-wider text-[#F6C453] font-mono">
              Pregunta {currentQ.number} de {totalQuestions}
            </span>
            {currentQ.relatedTimestamp && (
              <span className="bg-[#4A1028] px-3 py-1 rounded-lg text-xs md:text-sm font-mono text-amber-200 border border-[#F6C453]/30">
                Minuto {currentQ.relatedTimestamp} del vídeo
              </span>
            )}
          </div>

          {/* Interactive Question Box: Strictly Spanish initially; clicking reveals Armenian translation */}
          <div
            onClick={() => toggleQuestionTranslation(currentQ.id)}
            className="cursor-pointer group bg-[#5f1628] hover:bg-[#521323] p-6 md:p-7 rounded-2xl border-2 border-[#F6C453]/30 hover:border-[#F6C453] transition-all relative"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-cinzel text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide leading-snug flex-1">
                {currentQ.questionSpanish}
              </h3>

              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Audio button for question */}
                <button
                  onClick={(e) => speakSpanish(currentQ.questionSpanish, `q_${currentQ.id}`, e)}
                  title="Escuchar pregunta en español"
                  className={`p-2.5 rounded-xl bg-[#4A1028] hover:bg-[#E97928] text-amber-200 hover:text-white transition-colors ${
                    ttsSpeakingKey === `q_${currentQ.id}` ? 'text-[#E97928] animate-pulse' : ''
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                {/* Translation toggle button */}
                <button
                  onClick={() => toggleQuestionTranslation(currentQ.id)}
                  title="Mostrar / ocultar traducción armenia"
                  className="p-2.5 rounded-xl bg-[#4A1028] hover:bg-[#E97928] text-amber-200 hover:text-white transition-colors"
                >
                  {isQuestionTransRevealed ? (
                    <EyeOff className="w-5 h-5 text-[#F6C453]" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Armenian Translation for Question (only when clicked, LARGE FONT) */}
            {isQuestionTransRevealed && (
              <div className="mt-4 pt-4 border-t border-[#F6C453]/25 animate-fadeIn">
                <p className="font-armenian text-xl md:text-2xl text-[#FEF08A] font-semibold leading-relaxed">
                  {currentQ.questionArmenian}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4 Interactive Options */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5">
            {currentQ.options.map((opt) => {
              const optionToken = `${currentQ.id}_${opt.key}`;
              const isOptionTransRevealed = !!revealedOptionTrans[optionToken];
              const isSelected = currentAnswer === opt.key;
              const isCorrectOpt = opt.key === currentQ.correctOptionKey;

              // Compute styles based on selection state
              let containerStyle = 'bg-[#4A1028] border-[#F6C453]/30 hover:border-[#F6C453] hover:bg-[#521323]';
              let badgeStyle = 'bg-[#781C32] text-[#F6C453] border border-[#F6C453]/30';

              if (isAnswered) {
                if (isCorrectOpt) {
                  containerStyle = 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/40';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-400';
                } else if (isSelected && !isCorrectOpt) {
                  containerStyle = 'bg-red-950/70 border-red-400 ring-2 ring-red-500/40';
                  badgeStyle = 'bg-red-600 text-white border-red-400';
                } else {
                  containerStyle = 'bg-[#4A1028]/60 border-stone-700/50 opacity-60';
                }
              } else if (isSelected) {
                containerStyle = 'bg-[#E97928]/30 border-[#E97928] ring-2 ring-[#E97928]/50';
                badgeStyle = 'bg-[#E97928] text-white';
              }

              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className={`rounded-2xl p-5 md:p-6 border-2 transition-all relative ${containerStyle} ${
                    !isAnswered ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Option Key Letter (A, B, C, D) */}
                      <span className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center font-bold text-base md:text-lg shrink-0 transition-colors ${badgeStyle}`}>
                        {opt.key}
                      </span>

                      {/* Spanish option text - LARGE FONT */}
                      <div className="flex-1 pt-1">
                        <p className="text-white font-semibold text-lg md:text-xl leading-snug">
                          {opt.spanish}
                        </p>

                        {/* Armenian translation for this specific option (strictly when clicked, LARGE FONT) */}
                        {isOptionTransRevealed && (
                          <div className="mt-3 pt-3 border-t border-[#F6C453]/25 animate-fadeIn">
                            <p className="font-armenian text-[#FEF08A] font-semibold text-base md:text-lg leading-relaxed">
                              {opt.armenian}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Secondary Actions for Option */}
                    <div className="flex items-center gap-2 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                      {/* Pronunciation */}
                      <button
                        onClick={(e) => speakSpanish(opt.spanish, `opt_${currentQ.id}_${opt.key}`, e)}
                        title="Escuchar opción en español"
                        className={`p-2 rounded-lg hover:bg-[#781C32] text-amber-200/70 hover:text-white transition-colors ${
                          ttsSpeakingKey === `opt_${currentQ.id}_${opt.key}` ? 'text-[#E97928] animate-pulse' : ''
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Armenian translate toggle button */}
                      <button
                        onClick={(e) => toggleOptionTranslation(currentQ.id, opt.key, e)}
                        title={isOptionTransRevealed ? 'Ocultar traducción' : 'Ver traducción armenia'}
                        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                          isOptionTransRevealed
                            ? 'bg-[#F6C453] text-[#4A1028] border-[#F6C453]'
                            : 'bg-[#4A1028] text-amber-200 border-[#F6C453]/30 hover:border-[#F6C453]'
                        }`}
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span className="font-armenian">{isOptionTransRevealed ? 'Թաքցնել' : 'Հայերեն'}</span>
                      </button>

                      {/* State Checkmark or Cross if answered */}
                      {isAnswered && (
                        <div className="ml-1">
                          {isCorrectOpt ? (
                            <CheckCircle className="w-7 h-7 text-emerald-400" />
                          ) : isSelected ? (
                            <XCircle className="w-7 h-7 text-red-400" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immediate Feedback & Explanation Box (After selection) */}
        {isAnswered && (
          <div
            className={`rounded-2xl p-6 border-2 animate-fadeIn space-y-4 ${
              isCorrect
                ? 'bg-emerald-950/60 border-emerald-400 text-white'
                : 'bg-red-950/60 border-red-400 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold text-emerald-200 text-lg md:text-xl">
                      ¡Correcto! / Ճիշտ է։
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-400" />
                    <span className="font-bold text-red-200 text-lg md:text-xl">
                      Incorrecto / Սխալ է։ (Respuesta: {currentQ.correctOptionKey})
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() => toggleExpTranslation(currentQ.id)}
                className="text-xs md:text-sm underline text-[#F6C453] hover:text-white flex items-center gap-1.5 font-armenian font-semibold"
              >
                <Languages className="w-4 h-4" />
                <span>{isExpTransRevealed ? 'Թաքցնել բացատրությունը' : 'Բացատրությունը հայերեն'}</span>
              </button>
            </div>

            {/* Spanish Explanation - LARGE FONT */}
            <div className="space-y-1.5">
              <span className="text-xs md:text-sm text-amber-200/90 font-semibold uppercase tracking-wider block">
                Explicación en español:
              </span>
              <p className="text-white text-base md:text-lg leading-relaxed">
                {currentQ.explanationSpanish}
              </p>
            </div>

            {/* Armenian Explanation (toggleable) */}
            {isExpTransRevealed && (
              <div className="pt-3 border-t border-white/20 animate-fadeIn space-y-1">
                <span className="text-xs md:text-sm text-[#F6C453] font-semibold uppercase tracking-wider block">
                  Բացատրություն հայերենով՝
                </span>
                <p className="font-armenian text-[#FEF08A] text-base md:text-lg leading-relaxed">
                  {currentQ.explanationArmenian}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Footer: «Siguiente pregunta», «Volver al vídeo», «Repetir» */}
        <div className="pt-4 border-t border-[#F6C453]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex-1 sm:flex-none px-5 py-3 rounded-xl border border-[#F6C453]/30 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-stone-400'
                  : 'bg-[#4A1028] hover:bg-[#5a1431] text-amber-100 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-xl bg-[#4A1028] hover:bg-[#5a1431] border border-[#F6C453]/30 text-amber-100 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              title="Reiniciar cuestionario"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Repetir</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onBackToVideo}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#4A1028] hover:bg-[#5a1431] border border-[#F6C453]/30 text-amber-100 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Film className="w-4 h-4 text-[#F6C453]" />
              <span>Volver al vídeo</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`flex-1 sm:flex-none px-7 py-3 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all shadow-xl ${
                isAnswered
                  ? 'bg-[#E97928] hover:bg-[#d66b1e] text-white cursor-pointer active:scale-95'
                  : 'bg-stone-700/60 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Ver resultados' : 'Siguiente pregunta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
