import React from "react";
import { motion } from "framer-motion";
import { MdEventSeat, MdOutlinePeople, MdOutlineAccessTime } from "react-icons/md";

const Dine = () => {
  const tableStats = [
    { label: "Available Tables", value: "12", icon: MdEventSeat, color: "text-green-500" },
    { label: "Total Capacity", value: "48", icon: MdOutlinePeople, color: "text-brand" },
    { label: "Wait Time", value: "15m", icon: MdOutlineAccessTime, color: "text-accent" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl mb-4 tracking-tight">Reserve Your <span className="text-brand">Experience</span></h1>
        <p className="text-surface-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Whether it's a romantic dinner or a family gathering, TFC offers the perfect setting for your next meal.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {tableStats.map((stat, ind) => (
          <motion.div
            key={ind}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: ind * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-surface-200 shadow-sm flex items-center gap-6"
          >
            <div className={`p-4 rounded-2xl bg-surface-50 ${stat.color}`}>
              <stat.icon className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-surface-950">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reservation Card Placeholder */}
      <div className="bg-surface-950 rounded-[3rem] p-12 text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand opacity-10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h2 className="text-4xl mb-6">Planning a <span className="text-brand">Group Event?</span></h2>
            <p className="text-surface-300 mb-8 leading-relaxed">
              We offer exclusive packages for private parties, corporate events, and celebrations. Get in touch with our event management team.
            </p>
            <button className="bg-white text-surface-950 px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-brand hover:text-white transition-all transform hover:scale-105 shadow-xl shadow-brand/10">
              Inquire Now
            </button>
          </div>
          <div className="flex-1 w-full lg:w-auto grid grid-cols-2 gap-4">
            <div className="h-48 rounded-3xl bg-surface-800 rotate-2 group-hover:rotate-0 transition-transform duration-700 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7ed934c4a3?auto=format&fit=crop&q=80')] bg-cover"></div>
            <div className="h-48 rounded-3xl bg-surface-800 -rotate-3 group-hover:rotate-0 transition-transform duration-700 mt-8 bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80')] bg-cover"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dine