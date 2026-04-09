"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuthForm } from "../auth/AuthForm";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 pb-24">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-rose-200/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-8 lg:py-20">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              The Anti-Brain-Rot Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
            >
              Mindful energy, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">not brain rot.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg lg:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Mental health doesn't have to be clinical or boring. 
              We've built a world where mindfulness feels like play, 
              connecting you to your better self through immersive tech.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <div className="flex items-center -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-lg overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 42}`} alt="User" />
                  </div>
                ))}
                <div className="pl-6 text-sm text-gray-500 font-medium">
                  <span className="text-gray-900 font-bold">1.2k+</span> early adopters
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <AuthForm />
          </motion.div>
        </section>

        {/* Features Preview */}
        <section className="py-20 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🎮" 
              title="Immersive Feed" 
              description="A vertical, TikTok-style feed of mindful games. Scroll for your soul, not for dopamine."
              delay={0.4}
            />
            <FeatureCard 
              icon="🕊️" 
              title="Meaningful Ripples" 
              description="Share anonymous kindness. Watch your positive actions ripple through our global community."
              delay={0.5}
            />
            <FeatureCard 
              icon="📊" 
              title="Growth Visualization" 
              description="See your mental energy transform with beautiful stats and streak tracking that actually rewards consistency."
              delay={0.6}
            />
          </div>
        </section>

        {/* Closing Tagline */}
        <footer className="py-20 text-center space-y-4">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Designed for Serenity</p>
          <p className="text-2xl font-bold text-gray-800 italic">"Healing shouldn't feel like a chore."</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: string, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 group"
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
