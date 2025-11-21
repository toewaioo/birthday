import { useState, useEffect, useRef } from "react";
import { GiftBox } from "@/components/GiftBox";
import { BirthdayScene3D } from "@/components/BirthdayScene3D";
import { Button } from "@/components/ui/button";
import {
  Gift,
  ArrowDown,
  Clock,
  Play,
  Pause,
  Volume2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  type Time = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [canOpenGift, setCanOpenGift] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [timeLeft, setTimeLeft] = useState<Time>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showCountdown, setShowCountdown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const photos = [
    "images/photo_01.jpg",
    "images/photo_02.jpg",
    "images/photo_03.jpg",
    "images/photo_04.jpg",
    "images/photo_05.jpg",
    "images/photo_06.jpg",
  ];
  function getSpecialDate(): Date {
    const now = new Date();
    const currentYear = now.getFullYear();
    const target = new Date(currentYear, 10, 23, 0, 0, 0); // Nov 23
    const weekAfter = new Date(target);
    weekAfter.setDate(target.getDate() + 7);

    if (now >= target && now <= weekAfter) return target;
    if (now < target) return target;
    return new Date(currentYear + 1, 10, 23, 0, 0, 0);
  }

  // Target date logic
  useEffect(() => {
    const checkDate = () => {
      const targetDate = getSpecialDate().getTime();
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setCanOpenGift(true);
        setShowCountdown(false);
      } else {
        setCanOpenGift(false);
        setShowCountdown(true);

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkDate();
    const timer = setInterval(checkDate, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio("/musics/happy-birthday.mp3");
    audioRef.current.preload = "auto";
    audioRef.current.loop = true;
    setAudio(audioRef.current);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playBirthdaySong = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowMusicButton(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const handleGiftOpen = () => {
    if (!isGiftOpened && canOpenGift) {
      setIsGiftOpened(true);
      playBirthdaySong();
      setTimeout(() => setShowContent(true), 1500);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-background to-background">
      {/* Music Control */}
      <AnimatePresence>
        {showMusicButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-6 right-6 z-50"
          >
            <Button
              variant="outline"
              size="icon"
              className="glass-button w-14 h-14 rounded-full shadow-lg hover:scale-110 hover:shadow-xl border-primary/20"
              onClick={toggleMusic}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-primary" />
              ) : (
                <Play className="w-6 h-6 text-primary ml-1" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Countdown View */}
        {showCountdown && !canOpenGift && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            <div className="text-center space-y-12 px-6 max-w-4xl mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <Clock className="w-24 h-24 text-primary relative z-10" />
                </div>
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-gradient tracking-tight">
                  Coming Soon!
                </h1>
                <p className="text-2xl md:text-3xl text-muted-foreground font-light">
                  Yadanar Oo's Special Birthday Surprise
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-panel p-6 rounded-2xl min-w-[140px]"
                  >
                    <div className="text-4xl md:text-6xl font-bold text-primary mb-2 tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-lg text-muted-foreground/80">
                Available on November 23, {getSpecialDate().getFullYear()}
              </p>
            </div>
          </motion.div>
        )}

        {/* Initial Gift View */}
        {!showContent && canOpenGift && (
          <motion.div
            key="gift-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-screen w-full"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <div className="text-center space-y-8 px-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.8 }}
                  className="space-y-4"
                >
                  <h1 className="text-6xl md:text-8xl font-bold text-gradient bg-clip-text text-transparent drop-shadow-sm">
                    Yadanar Oo
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl text-muted-foreground">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <span className="font-light">
                      A Special Birthday Surprise
                    </span>
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </div>
                </motion.div>

                {!isGiftOpened && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="pointer-events-auto"
                  >
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(255,105,180,0.5)] text-lg px-8 py-6 rounded-full animate-pulse hover:animate-none transition-all duration-1000 hover:scale-105"
                      onClick={handleGiftOpen}
                    >
                      <Volume2 className="w-6 h-6 mr-2" />
                      Click to Open Your Gift
                    </Button>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="mt-8 text-primary/60"
                    >
                      <ArrowDown className="w-8 h-8 mx-auto" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
            <GiftBox onOpen={handleGiftOpen} isOpened={isGiftOpened} />
          </motion.div>
        )}

        {/* Content After Opening */}
        {showContent && canOpenGift && (
          <motion.div
            key="scene-3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative h-screen w-full"
          >
            <BirthdayScene3D photos={photos} birthdayName="Yadanar Oo" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
