import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const BirthdayMessage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 400);
  }, []);

  return (
    <div
      className={`min-h-screen flex justify-center p-6 transition-all duration-1000 bg-gradient-to-b ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <Card className="max-w-2xl w-full p-8 md:p-12   border-pink-200  rounded-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6 animate-bounce-slow">
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500 drop-shadow-[0_0_15px_rgba(255,0,100,0.5)] animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 animate-fade-in">
            မွေးနေ့ကို အမြဲအတွက်မှတ်သားဖို့ပါ 💖
          </h1>

          <div className="space-y-4 text-lg text-gray-700 animate-fade-in [animation-delay:200ms]">
            <p className="leading-relaxed">
              ဒီနေ့ဟာ မင်းအတွက် အထူးဆုံးနေ့လေးပါ။  
              မင်းနဲ့အတူဖြတ်သန်းခဲ့တဲ့ နာရီတိုင်း မိနစ်တိုင်းဟာ ငါ့အတွက် အမှတ်တရလေးတွေဖြစ်နေတယ်။  
              ဒီနေ့မှာတော့ မင်းကိုပဲ ဂုဏ်ပြုချင်တယ်။ 💐
            </p>

            <p className="leading-relaxed">
              မင်းဝင်လာတဲ့နေရာတိုင်းအေးချမ်းသွားတယ်။  
              မင်းရဲ့အပြုံးက ငါ့နေ့တိုင်းကို အလှတရားနဲ့ပြည့်စေတယ်။  
              ဒီနှစ်ဟာ မင်းအတွက် မေးမှမပြောနိုင်တဲ့ ပျော်ရွှင်မှုတွေနဲ့ ပြည့်စုံပါစေ။
            </p>

            <p className="leading-relaxed font-semibold text-pink-600">
              မင်းရဲ့စိတ်ထဲက ဆန္ဒတိုင်း အပြည့်အဝဖြစ်လာပါစေ။ ✨
            </p>
          </div>

          <div className="pt-6 border-t border-pink-200 mt-8">
            <p className="text-sm text-gray-500 italic">
              “မင်းနဲ့ဖြတ်သန်းတဲ့နေ့တိုင်းပဲ ပျော်ရွှင်မှုဖြစ်ပေမဲ့ — ဒီနေ့ကတော့ အထူးအဆန်းဆုံးနေ့ပါ။ 🎂”
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
