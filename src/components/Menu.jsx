import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenuItem } from "../feature/getMenuItemSlice";
import FoodItem from "./FoodItem";
import Loading from "./Loading";
import { motion, AnimatePresence } from "framer-motion";

const Menu = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(
    (state) => state.getAllMenuItemSlice
  );
  const [foodItemData, setFoodItemData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dietFilter, setDietFilter] = useState("all"); // 'all', 'veg', 'non-veg'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(getAllMenuItem());
      if (res.payload?.data) {
        setFoodItemData(res.payload.data);
      }
    };
    fetchData();
  }, [dispatch]);

  const categories = ["All", ...Array.from(new Set(foodItemData.map((val) => val.category)))];

  const filteredItems = foodItemData.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesDiet = dietFilter === "all" ||
      (dietFilter === "veg" && item.veg) ||
      (dietFilter === "non-veg" && !item.veg);
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDiet && matchesSearch;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-full">
      {loading && <Loading />}

      {/* Sidebar - Mobile/Desktop */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="md:sticky md:top-24">
          <h2 className="text-2xl mb-6 text-surface-950 hidden md:block px-2">Categories</h2>
          <nav className="flex flex-row md:flex-col gap-3 overflow-x-auto pb-6 md:pb-0 scrollbar-hide snap-x px-2">
            {categories.map((cat, ind) => (
              <button
                key={ind}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 snap-start flex-shrink-0 ${selectedCategory === cat
                  ? "bg-brand text-white shadow-xl shadow-brand/20 scale-105"
                  : "bg-white text-surface-950 hover:bg-surface-100 border border-surface-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Diet Filter Sidebar */}
          <div className="mt-8 px-2 hidden md:block">
            <h2 className="text-sm font-black uppercase tracking-widest text-surface-400 mb-4">Dietary Preference</h2>
            <div className="space-y-2">
              {['all', 'veg', 'non-veg'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDietFilter(type)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${dietFilter === type
                      ? "bg-surface-950 text-white shadow-lg"
                      : "bg-white text-surface-600 hover:bg-surface-50 border border-surface-200"
                    }`}
                >
                  <div className={`w-3 h-3 rounded-full ${type === 'veg' ? 'bg-green-500' : type === 'non-veg' ? 'bg-brand' : 'bg-surface-300'
                    }`} />
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <h1 className="text-4xl">Our <span className="text-brand">Menu</span></h1>

          <div className="flex flex-col sm:flex-row gap-4 flex-1 md:max-w-xl">
            {/* Search Bar */}
            <div className="relative flex items-center flex-1">
              <IoSearchSharp className="absolute left-3 text-surface-400 text-lg" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-full outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* Diet Filter Chips (Mobile/Small screens) */}
            <div className="flex bg-white p-1 rounded-full border border-surface-200 md:hidden">
              {['all', 'veg', 'non-veg'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDietFilter(type)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex-1 ${dietFilter === type
                      ? "bg-surface-950 text-white"
                      : "text-surface-400 hover:text-surface-950"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((val, ind) => (
              <motion.div
                key={val.menuItemId || ind}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <FoodItem props={val} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-surface-400">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-4">
              <IoSearchSharp className="text-3xl" />
            </div>
            <p className="text-xl font-medium">No dishes match your selection.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setDietFilter("all"); setSearchQuery(""); }}
              className="mt-4 text-brand font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Menu;
