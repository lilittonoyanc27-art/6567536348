import React, { useState, useEffect, useRef } from 'react';
import { SubtitleItem } from './types';
import { SUBTITLES_DATA } from './subtitlesData';
import {
  Play,
  Volume2,
  Languages,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  BookOpen,
  Eye,
  EyeOff
} from 'lucide-react';

interface VideoSubtitlesPlayerProps {
  onStartQuiz: () => void;
  quizCompletedCount?: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoSubtitlesPlayer: React.FC<VideoSubtitlesPlayerProps> = ({
  onStartQuiz,
  quizCompletedCount = 0,
}) => {
  // Track open translations per subtitle ID
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});
  const [activeSubtitleId, setActiveSubtitleId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ttsSpeakingId, setTtsSpeakingId] = useState<number | null>(null);

  const playerRef = useRef<any>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Toggle single translation
  const toggleTranslation = (id: number) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Load YouTube IFrame API
  useEffect(() => {
    let intervalId: any = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player('youtube-player-frame', {
        videoId: 'eXKpU3prOSc',
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          },
        },
      });

      // Poll current time to highlight active subtitle
      intervalId = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const time = playerRef.current.getCurrentTime();
            setCurrentTime(time);

            // Find matching subtitle
            const currentSub = SUBTITLES_DATA.slice().reverse().find((item) => time >= item.timeSeconds);
            if (currentSub) {
              setActiveSubtitleId(currentSub.id);
            }
          } catch (e) {
            // Ignore cross-origin tick errors
          }
        }
      }, 500);
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Jump to specific timestamp
  const seekTo = (seconds: number, id: number) => {
    setActiveSubtitleId(id);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(seconds, true);
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.error('Error seeking video', e);
      }
    }
  };

  // Web Speech API for Spanish pronunciation
  const speakSpanish = (text: string, id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setTtsSpeakingId(id);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.onend = () => setTtsSpeakingId(null);
    utterance.onerror = () => setTtsSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const filteredSubtitles = SUBTITLES_DATA.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return sub.spanish.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Educational Guide Header Banner */}
      <div className="bg-[#781C32] rounded-3xl p-6 md:p-8 border border-[#F6C453]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#E97928]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#F6C453] text-sm font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Etapa 1: Visualización y Subtítulos en Español</span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-4xl font-bold text-white tracking-wide">
              La Escena: El Encuentro de Don Alejandro y Helena
            </h2>
            <p className="text-amber-100/90 text-base md:text-lg max-w-3xl leading-relaxed">
              Mira el vídeo a continuación. Los subtítulos están inicialmente <strong className="text-white">solo en español</strong>.
              Haz clic sobre cualquier frase en español para abrir su traducción al armenio.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onStartQuiz}
              className="group flex items-center gap-2.5 px-6 py-3.5 bg-[#E97928] hover:bg-[#d66b1e] text-white font-bold text-base rounded-xl shadow-xl hover:shadow-orange-950/40 transition-all transform active:scale-95 whitespace-nowrap"
            >
              <span>Ir al Cuestionario</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Video Player + Subtitles Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Video & Controls (7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Responsive 16:9 Video Container */}
          <div className="bg-black rounded-3xl overflow-hidden border-2 border-[#F6C453]/40 shadow-2xl relative">
            <div className="relative w-full pb-[56.25%] bg-stone-950" ref={iframeContainerRef}>
              <div id="youtube-player-frame" className="absolute top-0 left-0 w-full h-full" />
            </div>

            {/* Video Footer Info Bar */}
            <div className="bg-[#5c152a] px-6 py-3.5 border-t border-[#F6C453]/25 flex items-center justify-between text-sm text-amber-200/90">
              <div className="flex items-center gap-2.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-sm md:text-base">«La Máscara del Zorro» (1998)</span>
              </div>
              <a
                href="https://www.youtube.com/watch?v=eXKpU3prOSc"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs md:text-sm hover:text-[#F6C453] transition-colors"
              >
                <span>Abrir en YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Scene Milestones bar */}
          <div className="bg-[#781C32] rounded-2xl p-5 border border-[#F6C453]/25 shadow-lg space-y-3">
            <div className="text-xs md:text-sm font-semibold text-[#F6C453] uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>Momentos clave de la escena (clic para saltar)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => seekTo(0, 1)}
                className="text-left p-3 rounded-xl bg-[#4A1028] hover:bg-[#E97928]/30 border border-[#F6C453]/20 hover:border-[#F6C453] transition-all"
              >
                <div className="text-sm text-[#F6C453] font-mono font-bold">0:07</div>
                <div className="text-sm text-white font-medium truncate">Helena</div>
              </button>
              <button
                onClick={() => seekTo(18, 5)}
                className="text-left p-3 rounded-xl bg-[#4A1028] hover:bg-[#E97928]/30 border border-[#F6C453]/20 hover:border-[#F6C453] transition-all"
              >
                <div className="text-sm text-[#F6C453] font-mono font-bold">0:18</div>
                <div className="text-sm text-white font-medium truncate">El obsequio</div>
              </button>
              <button
                onClick={() => seekTo(74, 10)}
                className="text-left p-3 rounded-xl bg-[#4A1028] hover:bg-[#E97928]/30 border border-[#F6C453]/20 hover:border-[#F6C453] transition-all"
              >
                <div className="text-sm text-[#F6C453] font-mono font-bold">1:14</div>
                <div className="text-sm text-white font-medium truncate">A la mesa</div>
              </button>
              <button
                onClick={() => seekTo(107, 16)}
                className="text-left p-3 rounded-xl bg-[#4A1028] hover:bg-[#E97928]/30 border border-[#F6C453]/20 hover:border-[#F6C453] transition-all"
              >
                <div className="text-sm text-[#F6C453] font-mono font-bold">1:47</div>
                <div className="text-sm text-white font-medium truncate">El bandido</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Subtitles List (5 cols on large screens) */}
        <div className="lg:col-span-5 bg-[#781C32] rounded-3xl border-2 border-[#F6C453]/35 shadow-2xl flex flex-col h-[700px]">
          {/* Header of Subtitles Panel */}
          <div className="p-5 border-b border-[#F6C453]/20 space-y-3 shrink-0 bg-[#65172a] rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Languages className="w-6 h-6 text-[#F6C453]" />
                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-white">
                  Subtítulos (Español)
                </h3>
              </div>
              <span className="text-xs md:text-sm text-[#F6C453] font-mono font-bold bg-[#4A1028] px-3 py-1 rounded-lg border border-[#F6C453]/30">
                {SUBTITLES_DATA.length} frases
              </span>
            </div>

            {/* Search Input in Spanish */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar palabra en español..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#4A1028] text-white placeholder-amber-200/50 text-sm md:text-base rounded-xl px-4 py-2.5 border border-[#F6C453]/30 focus:outline-none focus:border-[#F6C453]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-amber-200/70 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Subtitles Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3">
            {filteredSubtitles.length === 0 ? (
              <div className="text-center py-12 text-amber-200/60 text-sm">
                No se encontraron frases con «{searchQuery}».
              </div>
            ) : (
              filteredSubtitles.map((sub) => {
                const isRevealed = !!revealedIds[sub.id];
                const isActive = activeSubtitleId === sub.id;

                return (
                  <div
                    key={sub.id}
                    onClick={() => toggleTranslation(sub.id)}
                    className={`cursor-pointer rounded-2xl p-4 md:p-5 transition-all duration-200 ${
                      isActive
                        ? 'bg-[#4A1028] border-2 border-[#F6C453] shadow-lg ring-1 ring-[#F6C453]/50'
                        : isRevealed
                        ? 'bg-[#551424] border border-[#F6C453]/40'
                        : 'bg-[#6b182d] hover:bg-[#5f1528] border border-stone-800/20 hover:border-[#F6C453]/30'
                    }`}
                  >
                    {/* Top row: Timestamp, Speaker, Audio */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        {/* Timestamp Button - seeks video */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            seekTo(sub.timeSeconds, sub.id);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs md:text-sm font-mono font-bold bg-[#4A1028] text-[#F6C453] border border-[#F6C453]/40 hover:bg-[#E97928] hover:text-white hover:border-[#E97928] transition-colors"
                          title="Reproducir desde este punto"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{sub.timeDisplay}</span>
                        </button>

                        {sub.speaker && (
                          <span className="text-xs md:text-sm text-amber-200/80 font-medium">
                            {sub.speaker}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Audio Pronunciation */}
                        <button
                          onClick={(e) => speakSpanish(sub.spanish, sub.id, e)}
                          title="Escuchar pronunciación"
                          className={`p-2 rounded-lg bg-[#4A1028] hover:bg-[#E97928] transition-colors ${
                            ttsSpeakingId === sub.id ? 'text-[#E97928] animate-pulse' : 'text-amber-200/80 hover:text-white'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Spanish sentence - LARGE FONT, prominent, strictly Spanish */}
                    <p className="text-white font-semibold text-lg md:text-xl leading-snug tracking-wide">
                      {sub.spanish}
                    </p>

                    {/* Armenian Translation (ONLY opens when clicked, LARGE FONT in soft yellow) */}
                    {isRevealed && (
                      <div className="mt-3 pt-3 border-t border-[#F6C453]/25 animate-fadeIn space-y-1">
                        <p className="font-armenian text-[#FEF08A] font-semibold text-base md:text-lg leading-relaxed">
                          {sub.armenian}
                        </p>
                        {sub.contextNote && (
                          <p className="font-armenian text-amber-200/70 text-xs md:text-sm italic pt-1">
                            💡 {sub.contextNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Subtitles Panel Bottom Action */}
          <div className="p-4 md:p-5 bg-[#65172a] border-t border-[#F6C453]/20 rounded-b-3xl flex items-center justify-between">
            <span className="text-xs md:text-sm text-amber-100/90 font-medium">
              Haz clic en cualquier frase para traducir
            </span>
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E97928] hover:bg-[#d66b1e] text-white text-sm font-bold rounded-xl shadow transition-colors"
            >
              <span>Cuestionario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
