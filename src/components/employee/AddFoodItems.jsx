import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMenuItem } from "../../feature/addMenuItemSlice";
import { fetchCategories } from "../../feature/categorySlice";
import Loading from "../Loading";
import images from "../../assets/assets";
import { motion } from "framer-motion";
import { HiArrowLeft, HiCloudUpload, HiCheckCircle, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Alert from "../alert/Alert";

const AddFoodItems = () => {
  const { loading, error, massage } = useSelector(
    (state) => state.addMenuItemSlice
  );
  const { data: categories } = useSelector((state) => state.categories);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [formData, setformData] = useState({
    itemName: "",
    description: "",
    price: "",
    image: "",
    isveg: "true",
    category: "",
  });

  const handleInputChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRemoveImage = () => {
    setImageName("");
    setformData({ ...formData, image: "" });
    setPreviewUrl(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageName(file.name);
    setPreviewUrl(URL.createObjectURL(file));

    const imageData = new FormData();
    imageData.append("image", file);
    setformData({ ...formData, image: imageData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(addMenuItem(formData));
    if (res.meta.requestStatus === "fulfilled") {
      setSuccessMsg("Food item added successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/admin/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-6">
      {loading && <Loading />}

      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-500 ${successMsg ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <Alert type="success" message={successMsg} />
      </div>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-surface-400 hover:text-brand font-bold uppercase tracking-widest text-xs mb-8 transition-colors"
        >
          <HiArrowLeft /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-xl border border-surface-200 overflow-hidden"
        >
          <div className="md:grid md:grid-cols-5 h-full">
            {/* Left Side: Form */}
            <div className="md:col-span-3 p-12 border-r border-surface-100">
              <h1 className="text-4xl mb-8">Add New <span className="text-brand">Dish</span></h1>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Dish Name</label>
                  <input
                    type="text"
                    id="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder="e.g. Truffle Mushroom Risotto"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field mt-1 min-h-[100px] resize-none py-4"
                    placeholder="Briefly describe the ingredients and flavor profile..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Price (₹)</label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                      placeholder="299"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Category</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field mt-1 cursor-pointer"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.emoji} {cat.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-8 py-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="isveg"
                        value="true"
                        checked={formData.isveg === "true"}
                        onChange={handleInputChange}
                        id="isveg"
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-surface-200 rounded-full peer-checked:border-green-500 transition-colors"></div>
                      <div className="absolute inset-1 bg-green-500 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                    </div>
                    <span className="text-sm font-bold text-surface-600 group-hover:text-green-600 transition-colors">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="isveg"
                        value="false"
                        checked={formData.isveg === "false"}
                        onChange={handleInputChange}
                        id="isveg"
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-surface-200 rounded-full peer-checked:border-brand transition-colors"></div>
                      <div className="absolute inset-1 bg-brand rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                    </div>
                    <span className="text-sm font-bold text-surface-600 group-hover:text-brand transition-colors">Non-Vegetarian</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 mt-4 shadow-xl shadow-brand/20 active:scale-[0.98] transition-all"
                >
                  {loading ? "Adding to Menu..." : "Publish to Menu"}
                </button>
              </form>
            </div>

            {/* Right Side: Image Upload & Preview */}
            <div className="md:col-span-2 bg-surface-50 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-[240px]">
                <h3 className="text-lg font-bold mb-6">Dish Preview</h3>

                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white shadow-inner mb-6 group border-2 border-dashed border-surface-200 hover:border-brand transition-colors">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <div className="bg-white p-3 rounded-full text-brand shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <HiTrash className="text-2xl" />
                        </div>
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-6">
                      <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center text-surface-400 mb-4 group-hover:text-brand group-hover:scale-110 transition-all">
                        <HiCloudUpload className="text-3xl" />
                      </div>
                      <p className="text-sm font-bold text-surface-400">Upload Dish Image</p>
                      <p className="text-[10px] text-surface-300 mt-2">Recommended: 800x800px</p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept=".png, .jpg, .jpeg, .webp"
                        required
                      />
                    </label>
                  )}
                </div>

                {imageName && (
                  <div className="flex items-center gap-2 justify-center text-green-500 bg-green-50 py-2 px-4 rounded-full border border-green-100">
                    <HiCheckCircle className="text-lg flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{imageName}</span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-surface-300 mt-12 uppercase tracking-[0.2em] leading-loose">
                Your dish will be immediately visible<br />to all customers on the menu.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFoodItems;
