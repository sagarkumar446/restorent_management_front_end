import React from "react";
import { TiShoppingCart } from "react-icons/ti";
import images from "../assets/assets";
import { useDispatch } from "react-redux";
import { cartActions } from "../feature/cartSlice";

const FoodItem = ({ props }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(cartActions.addToCart(props));
  };
  const base64Image = `data:image/png;base64,${props?.image?.toString("base64")}`;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-surface-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={base64Image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={props.itemName}
        />
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <img
            src={props.veg ? `${images.veg}` : `${images.non_veg}`}
            className="w-3.5 h-3.5"
            alt={props.veg ? "Veg" : "Non-Veg"}
          />
          <span className="text-[10px] font-black uppercase tracking-wider text-surface-950">
            {props.veg ? "Veg" : "Non-Veg"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold leading-tight group-hover:text-brand transition-colors">
            {props.itemName}
          </h3>
          <span className="text-lg font-black text-brand">₹{props.price}</span>
        </div>

        <p className="text-surface-400 text-sm line-clamp-2 mb-6 flex-1">
          {props.description}
        </p>

        <div className="mt-auto">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full btn-primary flex items-center justify-center gap-2 group/btn"
          >
            <span>Add to Cart</span>
            <TiShoppingCart className="text-xl group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
