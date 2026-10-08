/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VideoSubtitlesPlayer } from './VideoSubtitlesPlayer';
import { QuizSection } from './QuizSection';
import { VocabularyReference } from './VocabularyReference';
import { SUBTITLES_DATA } from './subtitlesData';
import { QUIZ_QUESTIONS } from './quizData';
import {
  Film,
  HelpCircle,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  Flame,
  Volume2,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'video' | 'quiz'>('video');
  const [isVocabModalOpen, setIsVocabModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#4A1028] text-white flex flex-col selection:bg-[#E97928] selection:text-white">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#4A1028]/95 backdrop-blur-md border-b border-[#F6C453]/25 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('video')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E97928] to-[#781C32] border border-[#F6C453] flex items-center justify-center font-cinzel font-black text-2xl text-[#F6C453] shadow-md group-hover:scale-105 transition-transform">
              Z
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-white block leading-none">
                El Zorro
              </span>
              <span className="text-xs text-[#F6C453] tracking-wider uppercase font-semibold">
                Español Interactivo
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links / Segmented Control */}
        <nav className="flex items-center gap-2 bg-[#781C32]/70 p-1.5 rounded-xl border border-[#F6C453]/25">
          <button
            onClick={() => setCurrentView('video')}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-bold transition-all whitespace-nowrap ${
              currentView === 'video'
                ? 'bg-[#E97928] text-white shadow-md'
                : 'text-amber-100/90 hover:text-white hover:bg-[#4A1028]/60'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Vídeo y Subtítulos</span>
          </button>

          <button
            onClick={() => setCurrentView('quiz')}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-bold transition-all whitespace-nowrap ${
              currentView === 'quiz'
                ? 'bg-[#E97928] text-white shadow-md'
                : 'text-amber-100/90 hover:text-white hover:bg-[#4A1028]/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Cuestionario (10)</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Helper Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVocabModalOpen(true)}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[#781C32] hover:bg-[#8d213b] text-[#F6C453] hover:text-white border border-[#F6C453]/40 rounded-xl text-xs sm:text-sm font-bold shadow transition-colors whitespace-nowrap"
            title="Abrir diccionario de expresiones"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Vocabulario</span>
          </button>
        </div>
      </header>

      {/* Main Educational Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {currentView === 'video' ? (
          <VideoSubtitlesPlayer
            onStartQuiz={() => setCurrentView('quiz')}
          />
        ) : (
          <QuizSection
            onBackToVideo={() => setCurrentView('video')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F6C453]/20 bg-[#3a0d20] py-6 px-4 text-center text-xs text-amber-200/70 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-amber-100">
          <span>26 frases subtituladas con traducción al armenio</span>
          <span aria-hidden="true">·</span>
          <span>10 preguntas interactivas de comprensión</span>
          <span aria-hidden="true">·</span>
          <span>Basado en «La Máscara del Zorro» (1998)</span>
        </div>
        <p className="text-amber-200/50 text-[11px]">
          Հայերեն թարգմանություններով իսպաներենի ինտերակտիվ ուսումնական հարթակ
        </p>
      </footer>

      {/* Vocabulary Modal */}
      <VocabularyReference
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
      />
    </div>
  );
}
