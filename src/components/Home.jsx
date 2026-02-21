import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiStar, HiClock, HiCheckBadge } from "react-icons/hi2";
import images from "../assets/assets";

const Home = () => {
    return (
        <div className="flex flex-col gap-24 pb-20">
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden rounded-[3.5rem] mt-4 shadow-2xl">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={images.alternate}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent"></div>
                </div>

                <div className="relative z-10 px-12 md:px-24 max-w-4xl text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-brand/20 border border-brand/30 rounded-full text-brand text-xs font-black uppercase tracking-[0.3em] mb-6">
                            Welcome to Excellence
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                            Flavor <br />
                            <span className="text-brand italic font-outfit">Untamed.</span>
                        </h1>
                        <p className="text-lg text-surface-200 mb-10 max-w-lg leading-relaxed font-medium">
                            Experience a symphony of tastes crafted by master chefs. From hearth to plate, we don't just serve food; we create memories.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <NavLink
                                to="/menu"
                                className="btn-primary px-10 py-5 text-base flex items-center gap-3 group shadow-2xl shadow-brand/40"
                            >
                                <span>Explore Menu</span>
                                <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                            </NavLink>
                            <NavLink
                                to="/dine"
                                className="px-10 py-5 rounded-full border-2 border-white/20 hover:border-white hover:bg-white/10 text-white font-bold transition-all duration-300"
                            >
                                Book a Table
                            </NavLink>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Stat Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute bottom-12 right-12 hidden lg:flex bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 items-center gap-6 shadow-2xl shadow-black/50"
                >
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-surface-950 bg-brand overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-yellow-400 mb-1">
                            {[1, 2, 3, 4, 5].map(i => <HiStar key={i} className="text-sm" />)}
                        </div>
                        <p className="text-white text-xs font-black uppercase tracking-widest">
                            4.9/5 Rating <span className="text-white/40 font-medium lowercase">from 2k+ guests</span>
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-6">
                <div className="bg-white p-10 rounded-[3rem] border border-surface-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand text-3xl mb-8 group-hover:scale-110 transition-transform">
                        <HiClock />
                    </div>
                    <h3 className="text-2xl mb-4">Fast Service</h3>
                    <p className="text-surface-400 leading-relaxed">Delicious meals prepared and served with surgical precision, ensuring you're never left waiting.</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-surface-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-3xl mb-8 group-hover:scale-110 transition-transform">
                        <HiCheckBadge />
                    </div>
                    <h3 className="text-2xl mb-4">Quality First</h3>
                    <p className="text-surface-400 leading-relaxed">Sourced from organic local farms, our ingredients are as fresh as the morning dew.</p>
                </div>

                <div className="bg-surface-950 p-10 rounded-[3rem] shadow-2xl text-white group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-[60px] rounded-full"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-brand text-3xl mb-8 group-hover:scale-110 transition-transform">
                            <HiStar />
                        </div>
                        <h3 className="text-2xl mb-4">Fine Dining</h3>
                        <p className="text-surface-300 leading-relaxed">An atmosphere designed for royalty. Elegant, quiet, and absolutely breathtaking.</p>
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            <section className="max-w-7xl mx-auto w-full px-6">
                <div className="relative rounded-[4rem] overflow-hidden bg-brand h-[400px] flex items-center justify-center text-center px-12">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="grid grid-cols-6 h-full w-full">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="border-r border-b border-white"></div>
                            ))}
                        </div>
                    </div>
                    <div className="relative z-10 text-white max-w-2xl">
                        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter shadow-sm">Ready to taste the excellence?</h2>
                        <p className="text-lg text-white/80 mb-10 font-medium">Join us tonight for a dinner experience that will change your perspective on food forever.</p>
                        <NavLink
                            to="/sign-up"
                            className="inline-block bg-white text-brand px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            Become a Member
                        </NavLink>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
