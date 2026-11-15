"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface BackgroundMusicPlayerProps {
  autoPlayTrigger?: boolean;
}

const AUDIO_SRC = "/assets/audio/sai-pallavi-s-intro.wav";

export function BackgroundMusicPlayer({
  autoPlayTrigger = false,
}: BackgroundMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log("[BackgroundMusicPlayer] Playback waiting for interaction:", err);
      });
  }, []);

  const pauseMusic = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      startMusic();
    } else {
      pauseMusic();
    }
  }, [startMusic, pauseMusic]);

  // Autoplay trigger after opening the invitation cover
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && audioRef.current.paused) {
      startMusic();
    }
  }, [autoPlayTrigger, startMusic]);

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        className={`template-floating-music-btn ${
          isPlaying ? "is-playing" : "is-muted"
        }`}
        onClick={toggleMusic}
        title={isPlaying ? "Mute traditional music" : "Play traditional music"}
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
      >
        <span className="gold-equalizer-bars" aria-hidden="true">
          <span className="eq-bar bar-1" />
          <span className="eq-bar bar-2" />
          <span className="eq-bar bar-3" />
        </span>
      </button>
    </>
  );
}
