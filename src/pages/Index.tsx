import { useState, useEffect, useRef } from "react";
import { GiftBox } from "@/components/GiftBox";
import { BirthdayScene3D } from "@/components/BirthdayScene3D";
import { Button } from "@/components/ui/button";
import { Gift, ArrowDown, Clock, Play, Pause, Volume2 } from "lucide-react";

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
    "images/couple.jpeg",
    "images/couple.jpeg",
    "images/couple.jpeg",
  ];

  // Target date: November 11, 2025
  const targetDate = new Date("2025-11-23T00:00:00").getTime();

  // Birthday song URL - replace with your actual birthday song
  const birthdaySong = "/musics/happy-birthday.mp3"; // or use a public URL

  useEffect(() => {
    const checkDate = () => {
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

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(birthdaySong);
    audioRef.current.loop = true;

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
      playBirthdaySong(); // Start playing music when gift opens
      setTimeout(() => setShowContent(true), 1500);
    }
  };

  const handleCountdownClick = () => {
    setShowCountdown(true);
  };

  return (
    <div className="relative bg-gradient-to-br from-background via-cream to-blush min-h-screen overflow-x-hidden">
      {/* Music Control Button */}
      {showMusicButton && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 bg-background/80 backdrop-blur-sm border-2 border-primary/20 hover:bg-primary/20 hover:scale-110 transition-all duration-300 shadow-lg"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary" />
            ) : (
              <Play className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>
      )}

      {/* Audio element for better mobile handling */}
      <audio preload="auto" loop style={{ display: "none" }}>
        <source src={birthdaySong} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Countdown View */}
      {showCountdown && !canOpenGift && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gradient-to-br from-background via-cream to-blush">
          <div className="text-center space-y-8 px-6 animate-fade-in">
            <Clock className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Coming Soon!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-md">
              Yadanar Oo's Special Birthday Surprise
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center gap-2 md:gap-6 mt-8">
              <div className="text-center">
                <div className="bg-primary/20 rounded-lg p-4 min-w-20">
                  <div className="text-2xl md:text-4xl font-bold text-primary">
                    {timeLeft.days || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-primary/20 rounded-lg p-4 min-w-20">
                  <div className="text-2xl md:text-4xl font-bold text-primary">
                    {timeLeft.hours || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Hours</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-primary/20 rounded-lg p-4 min-w-20">
                  <div className="text-2xl md:text-4xl font-bold text-primary">
                    {timeLeft.minutes || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-primary/20 rounded-lg p-4 min-w-20">
                  <div className="text-2xl md:text-4xl font-bold text-primary">
                    {timeLeft.seconds || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Seconds</div>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mt-8">
              Available on November 11, 2025
            </p>
          </div>
        </div>
      )}

      {/* Initial Gift View */}
      {!showContent && canOpenGift && (
        <div className="relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="text-center space-y-6 px-6 animate-fade-in">
              <Gift className="w-16 h-16 mx-auto text-primary animate-float" />
              <h1 className="text-cyan-400 text-5xl md:text-7xl font-bold text-foreground">
                Yadanar Oo
              </h1>
              <p className="text-teal-500 text-xl md:text-2xl text-muted-foreground max-w-md">
                A Special Birthday Surprise
              </p>
              {!isGiftOpened && (
                <div className="flex flex-col -auto item-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--glow-rose)] animate-scale-in flex items-center gap-2 group"
                    onClick={handleGiftOpen}
                  >
                    <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Click to Open Your Gift
                  </Button>
                  <div className="mt-4 animate-bounce">
                    <ArrowDown className="w-6 h-6 mx-auto text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <GiftBox onOpen={handleGiftOpen} isOpened={isGiftOpened} />
        </div>
      )}

      {/* Show countdown button if gift cannot be opened yet */}
      {!showCountdown && !canOpenGift && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-center space-y-6 px-6">
            <Gift className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              Yadanar Oo
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-md">
              A Special Birthday Surprise
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              onClick={handleCountdownClick}
            >
              <Clock className="w-5 h-5 mr-2" />
              Show Countdown
            </Button>
          </div>
        </div>
      )}

      {/* Content After Opening */}
      {showContent && canOpenGift && (
        <div className="relative animate-fade-in">
          <BirthdayScene3D photos={photos} birthdayName="Yadanar oo" />
        </div>
      )}
    </div>
  );
};

export default Index;
