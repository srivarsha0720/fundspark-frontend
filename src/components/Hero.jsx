// Hero section of homepage — introduces platform + CTA actions
import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  Users,
  Wrench,
  CreditCard,
  Headphones,
  LayoutDashboard,
  Wallet,
  Globe,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    navigate("/start");
  };

  return (
    <>
      {/* ===== HERO BACKGROUND ===== */}
      <section className="bg-gradient-to-b from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-[#020617]">

        {/* ===== MAIN HERO ===== */}
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-20 items-center">

          {/* ===== LEFT CONTENT ===== */}
          <div className="space-y-8">

            {/* trust badge */}
            <p className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-white/60 dark:bg-white/10 backdrop-blur border border-black/10 dark:border-white/40 text-indigo-600 dark:text-sky-400">
              Trusted by creators worldwide
            </p>

            {/* heading */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-800 dark:text-slate-200">
              Turn your ideas into <br />
              <span  className="animated-gradient-text">
                reality with FundSpark
              </span>
            </h1>

            {/* description */}
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Discover meaningful projects, support innovation, and help creators
              bring impactful ideas to life through community-powered funding.
            </p>

            {/* CTA */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/category/all")}
                className="px-7 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition"
              >
                Explore Projects
              </button>
            </div>

            {/* stats */}
            <div className="flex gap-12 pt-6 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">1,200+</p>
                <p>Projects funded</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">$2M+</p>
                <p>Funds raised</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">5K+</p>
                <p>Supporters</p>
              </div>
            </div>
          </div>

          {/* ===== RIGHT IMAGE ===== */}
          <div className="relative rounded-3xl overflow-hidden   dark:border-white/40 shadow-xl hover:shadow-2xl transition">
            <img
              src="https://ibo.pe/blog/wp-content/uploads/2019/12/cuales-son-los-tipos-de-crowdfunding-que-se-utilizan-1536x864.jpeg"
              alt="crowdfunding"
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ===== SUCCESS STORIES ===== */}
        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
              From Ideas to Reality
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3">
              Real creators. Real impact. See how ideas turned into success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {[ 
              {
                img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                title: "Night Owl Smart Lamp",
                text: "A smart productivity lamp now used in 40+ countries.",
                stat: "$125,000 raised",
              },
              {
                img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
                title: "Pocket Garden App",
                text: "A gardening app loved by urban plant enthusiasts.",
                stat: "$89,000 raised",
              },
              {
                img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                title: "Tales of Tomorrow Comic",
                text: "An indie comic turned award-winning graphic novel.",
                stat: "$45,000 raised",
              },
            ].map((card, i) => (
              <div
                key={i}
               className="group rounded-3xl overflow-hidden 
bg-white/60 dark:bg-white/5 
backdrop-blur-xl

shadow-md dark:shadow-lg
transition-all duration-300

hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
dark:hover:bg-white/10 dark:hover:shadow-sky-500/20"
              >
                <img
                  src={card.img}
                  className="h-52 w-full object-cover group-hover:scale-102 transition"
                />
                <div className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {card.text}
                  </p>
                  <span className="text-sm font-medium text-indigo-600 dark:text-sky-400">
                    {card.stat}
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

            {/* ================= SUCCESS STORY — STARTUP ================= */}
<div className="mt-20 max-w-6xl mx-auto px-6">

  {/* section title */}
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
    Startup Success Story 🚀
  </h2>

  {/* container */}
  <div className="
grid md:grid-cols-2 gap-10 items-center
p-6 md:p-10 rounded-2xl
backdrop-blur-lg
bg-white/70 dark:bg-white/5
border border-gray-200 dark:border-white/10
shadow-lg hover:shadow-xl
transition
">

    {/* ===== LEFT IMAGE ===== */}
    <div className="w-full">
      <img
        src="https://images.unsplash.com/photo-1556761175-b413da4baf72"
        alt="startup founders"
        className="w-full h-[260px] md:h-[340px] object-cover rounded-xl shadow-md"
      />
    </div>

    {/* ===== RIGHT STORY CONTENT ===== */}
    <div className="space-y-4">

      {/* headline */}
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
        From College Idea to Funded Startup
      </h3>

      {/* full story */}
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px] md:text-base">
        Three engineering students dreamed of building a smart eco-friendly
        hydration bottle that reminds users to drink water while reducing
        plastic waste. Despite having strong technical skills, they lacked
        funds for prototyping and production.
        Through FundSpark, early believers supported their vision and helped
        them reach their funding goal within weeks. Today, the product is live,
        customers are growing rapidly, and the team has successfully transformed
        their idea into a promising startup making real environmental impact.
      </p>

      {/* mini trust row */}
      <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
        <span>₹4.2L raised</span>
        <span>• 320 supporters</span>
        <span>• Fully funded</span>
      </div>

      {/* CTA */}
      <button onClick={handleStart}
      className="mt-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition">
        Start Your Startup
      </button>

    </div>
  </div>
</div>
{/* ================= END SUCCESS STORY ================= */}



      {/* ===== WHY FUNDSPARK ===== */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-[#020617]">
        <div className="text-center mb-16 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
            Why FundSpark?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            A trusted platform helping creators succeed globally.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-6">

          {[ShieldCheck, Users, Wrench, CreditCard, Headphones, LayoutDashboard, Wallet, Globe].map(
            (Icon, i) => (
              <div
                key={i}
                className="group rounded-3xl p-6 text-center 
bg-white/60 dark:bg-white/5 
backdrop-blur-xl 
border border-black/10 dark:border-white/10 
shadow-sm dark:shadow-none
transition-all duration-300

hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]
dark:hover:bg-white/10 dark:hover:border-sky-400/40 dark:hover:shadow-sky-500/20"
              >
               <Icon className="mx-auto mb-4 text-indigo-600 dark:text-sky-400 size-[36] transition group-hover:scale-110 group-hover:text-sky-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  Premium Feature
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Designed for creator success.
                </p>
              </div>
            )
          )}

        </div>
      </section>
    </>
  );
};

export default Hero;