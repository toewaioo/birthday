import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart, X } from "lucide-react";

export const BirthdayMessage = () => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-6 transition-all duration-700 bg-gradient-to-b from-pink-50 via-white to-pink-100 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <Card className="relative w-full max-w-lg sm:max-w-2xl p-6 sm:p-10 bg-white/80 backdrop-blur-xl border-pink-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-pink-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Heart Icon */}
        <div className="flex justify-center mb-6 animate-bounce-slow">
          <Heart className="w-14 h-14 sm:w-16 sm:h-16 text-pink-500 fill-pink-500 drop-shadow-[0_0_15px_rgba(255,0,100,0.4)] animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-pink-600 mb-4 animate-fade-in">
          မွေးနေ့ပျော်ရွှင်ပါစေ ညီမလေး 🎂💖
        </h1>

        {/* Message */}
        <div className="space-y-4 text-base sm:text-lg text-gray-700 text-center animate-fade-in [animation-delay:200ms]">
          <p className="leading-relaxed">
            Happy Birthday ပါ ညီမလေး။ 🎂🎉  
            ကိုယ့်မွေးနေ့တုန်းက ပေးခဲ့တဲ့ ဆုတောင်းတွေအားလုံးကို  
            တစ်လုံးမကျန်၊ အတိုးနဲ့ ပြန်လည်ဆုတောင်းပေးလိုက်ပါတယ်။ 🍀
          </p>

          <p className="leading-relaxed">
            ဒီမွေးနေ့ကစပြီး အစစအရာရာ အဆင်ပြေပါစေ။  
            နေ့တိုင်း ပျော်ရွှင်ပြီး၊ လိုအင်ဆန္ဒအားလုံး ပြည့်ဝပါစေ။ ✨  
            ဖြစ်ချင်တာမှန်သမျှ အကုန်ဖြစ်လာပါစေ။ 🙏
          </p>

          <p className="leading-relaxed">
            “မုန့်” တွေ အများကြီး စားရပါစေ (ကိုယ်ဝယ်ကျွေးပေးမယ် 😆)။  
            “သီချင်း” တွေ အများကြီး နားထောင်နိုင်ပါစေ (ကိုယ်ဆိုပြမယ် 😁)။  
            “လေပေါ” သမျှကို အမြဲနားထောင်ပေးမယ့်  
            “စိတ်တူကိုယ်တူ ဘရားသား” ကလည်း အမြဲရှိနေမှာပါ။ ✌️
          </p>

          <p className="leading-relaxed font-semibold text-pink-600"> 
            ဒီနှစ်ဟာ မင်းအတွက် မေးမှမပြောနိုင်တဲ့ ပျော်ရွှင်မှုတွေနဲ့ ပြည့်ပါစေ။ 💙
          </p>
        </div>

        {/* Footer Quote */}
        <div className="pt-6 border-t border-pink-200 mt-6">
          <p className="text-sm sm:text-base text-gray-500 italic text-center">
            “မင်းနဲ့ဖြတ်သန်းတဲ့နေ့တိုင်းပဲ ပျော်ရွှင်မှုဖြစ်ပေမဲ့ —  
            ဒီနေ့ကတော့ အထူးအဆန်းဆုံးနေ့ပါ။ 🎂”
          </p>
        </div>
      </Card>
    </div>
  );
};
