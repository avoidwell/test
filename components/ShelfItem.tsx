import React from 'react';
import { ShelfItemData } from '../types';

interface ShelfItemProps {
  item: ShelfItemData;
  onClick: (item: ShelfItemData) => void;
}

const ShelfItem: React.FC<ShelfItemProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative cursor-pointer w-40 h-40 md:w-56 md:h-56 flex-shrink-0 mx-4 transition-all duration-300"
    >
      {/* Album Art / Cover */}
      <div className={`w-full h-full ${item.color} rounded-md book-shadow overflow-hidden relative flex flex-col justify-between p-4`}>
        {item.coverImage && (
          <img 
            src={item.coverImage} 
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        )}
        
        {/* Vinyl/CD Groove Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/vinyl.png')] pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10">
            {/* Sticker effect */}
            <div className="bg-white/90 text-black text-[10px] font-bold px-2 py-1 inline-block rounded-full shadow-sm mb-2 transform -rotate-2">
                NEW
            </div>
            <h3 className="text-white text-xl md:text-2xl font-black leading-tight tracking-tight drop-shadow-md">
                {item.title}
            </h3>
        </div>

        <div className="relative z-10 mt-auto">
            <p className="text-white/90 text-sm font-medium tracking-wide border-t border-white/30 pt-2">
                {item.subtitle}
            </p>
        </div>
      </div>
      
      {/* Reflection effect below shelf (optional visual flair) */}
      <div 
        className={`absolute -bottom-14 left-0 w-full h-full ${item.color} rounded-md opacity-20 blur-xl transform scale-y-[-0.5] mask-image-gradient`}
        style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}
      ></div>
    </div>
  );
};

export default ShelfItem;