import { useState, useEffect } from "react";
import { Heart, X, Sparkles, Music } from "lucide-react";

export const BirthdayMessage = () => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    // Main Overlay with Animated Gradient Background
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-all duration-700 ease-out
      bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200
      ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Decorative Background Blobs for Glass Effect */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      {/* Glassmorphism Card */}
      <div
        className={`relative w-full max-w-md md:max-w-lg p-6 sm:p-8
        bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        rounded-3xl overflow-hidden transition-all duration-700 transform
        ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-10"}`}
      >
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 p-1 rounded-full bg-white/40 hover:bg-white/60 text-gray-600 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Icon Header */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          <div className="relative">
            <div className="absolute inset-0 bg-pink-400 blur-lg opacity-50 animate-pulse" />
            <Heart className="relative w-14 h-14 text-pink-600 fill-pink-500 animate-bounce-slow drop-shadow-lg" />
          </div>
          <Music className="w-6 h-6 text-purple-500 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-2 tracking-tight">
          Happy Birthday! ပါ<br />
          <span className="text-pink-600">Yadanar Oo ရေ... 🎂💖</span>
        </h1>

        {/* Scrollable Content for very small screens */}
        <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* Message Body */}
          <div className="space-y-5 text-center text-gray-700 mt-4 px-2">
            <p className="text-sm sm:text-base leading-relaxed font-medium text-gray-600">
              ဟိုတလောက ကိုယ့်မွေးနေ့တုန်းက ပေးခဲ့တဲ့ ဆုတောင်းတွေအားလုံးအတွက်
              ကျေးဇူးပါနော်။ အခု ညီမမွေးနေ့မှာ အဲ့ဒီဆုတောင်းတွေရဲ့ နှစ်ဆ၊
              သုံးဆလောက် ပိုပြီး ပျော်ရွှင်ပါစေလို့ ဆုတောင်းပေးလိုက်ပါတယ်။
              🍀
            </p>

            <div className="bg-white/40 p-4 rounded-2xl border border-white/50 shadow-sm">
              <p className="text-sm sm:text-base leading-relaxed">
                ဒီနှစ်ကစပြီး စိတ်ညစ်စရာတွေဝေးပြီး၊ လိုအင်ဆန္ဒအားလုံး ပြည့်ဝပါစေ။
                မုန့်တွေအများကြီးစားနိုင်ပါစေ။
              </p>
              <p className="text-sm sm:text-base leading-relaxed mt-3">
                ငါဆိုပြတဲ့သီချင်းတွေလည်း အများကြီး နားထောင်နိုင်ပါစေ{" "}
                <span className="text-purple-600 font-semibold">
                  (နားမထောင်ချင်လို့မရဘူး 😁)
                </span>
                ။
              </p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed">
              အမြဲတမ်း ပြော သမျှကို နားထောင်ပေးမယ့်
              <span className="font-bold text-indigo-600 mx-1">Bro</span>
              တစ်ယောက် အမြဲရှိနေမယ်ဆိုတာ မမေ့နဲ့နော်။ ✌️
            </p>

            <p className="text-lg sm:text-xl font-bold text-pink-600 mt-4 font-handwriting">
              Have the happiest birthday ever! 💙
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/40 text-center">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Made with 💙 by{" "}
            <span className="text-pink-500">Toewaioo</span>
          </p>
        </div>
      </div>
    </div>
  );
};
