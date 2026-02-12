import React, { useState } from 'react';
import ShelfItem from './components/ShelfItem';
import Modal from './components/Modal';
import { 
  HoroscopeView, 
  PsychTestView, 
  LuckyColorView, 
  DecisionHelperView,
  JokeView
} from './components/ActivityViews';
import { ShelfItemData, ActivityType } from './types';

// Constants for our content
const SHELF_1_ITEMS: ShelfItemData[] = [
  {
    id: '1',
    title: 'Daily Horoscope',
    subtitle: 'What do the stars say?',
    type: ActivityType.HOROSCOPE,
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    coverImage: 'https://picsum.photos/seed/astro/400/400'
  },
  {
    id: '2',
    title: 'Lucky Color',
    subtitle: 'Your charm for today',
    type: ActivityType.LUCKY_COLOR,
    color: 'bg-gradient-to-br from-pink-500 to-rose-400',
    coverImage: 'https://picsum.photos/seed/color/400/400'
  },
  {
    id: '3',
    title: 'Dad Joke',
    subtitle: 'Warning: Cringe',
    type: ActivityType.JOKE_GENERATOR,
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    coverImage: 'https://picsum.photos/seed/laugh/400/400'
  }
];

const SHELF_2_ITEMS: ShelfItemData[] = [
  {
    id: '4',
    title: 'Psych Test',
    subtitle: 'Discover yourself',
    type: ActivityType.PSYCH_TEST,
    color: 'bg-gradient-to-br from-blue-400 to-cyan-300',
    coverImage: 'https://picsum.photos/seed/mind/400/400'
  },
  {
    id: '5',
    title: 'Decision Maker',
    subtitle: 'Stuck? Let AI decide',
    type: ActivityType.DECISION_HELPER,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-400',
    coverImage: 'https://picsum.photos/seed/path/400/400'
  }
];

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<ShelfItemData | null>(null);

  const handleItemClick = (item: ShelfItemData) => {
    setActiveItem(item);
  };

  const closeModal = () => {
    setActiveItem(null);
  };

  const renderActiveContent = () => {
    switch (activeItem?.type) {
      case ActivityType.HOROSCOPE: return <HoroscopeView />;
      case ActivityType.PSYCH_TEST: return <PsychTestView />;
      case ActivityType.LUCKY_COLOR: return <LuckyColorView />;
      case ActivityType.DECISION_HELPER: return <DecisionHelperView />;
      case ActivityType.JOKE_GENERATOR: return <JokeView />;
      default: return <div>Under Construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex flex-col items-center py-20 overflow-x-hidden">
      
      {/* Header / Brand */}
      <header className="mb-16 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6">
           <svg className="w-8 h-8 mr-2 text-black" fill="currentColor" viewBox="0 0 20 20">
             <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
           </svg>
           <span className="font-bold text-xl tracking-tight">Wonder Shelves</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">
          Playful Editions.
        </h1>
        <p className="text-gray-500 font-medium">
          A curated collection of AI experiences.
        </p>
      </header>

      {/* Shelf 1 */}
      <div className="w-full max-w-6xl mb-24 px-4 md:px-12 relative">
        <div className="flex justify-center items-end space-x-4 md:space-x-12 pb-4 px-8 overflow-x-auto no-scrollbar py-10">
          {SHELF_1_ITEMS.map(item => (
            <ShelfItem key={item.id} item={item} onClick={handleItemClick} />
          ))}
        </div>
        {/* The Shelf Visual - a simple white plank with shadow */}
        <div className="absolute bottom-0 left-4 right-4 h-4 bg-gray-100 rounded-sm shelf-shadow z-[-1] transform skew-x-12 origin-bottom-left"></div>
        <div className="absolute bottom-0 left-4 right-4 h-full max-h-[16px] bg-gradient-to-b from-gray-200 to-gray-300 z-[-2]"></div>
      </div>

      {/* Shelf 2 */}
      <div className="w-full max-w-6xl px-4 md:px-12 relative">
         <div className="flex justify-center items-end space-x-4 md:space-x-12 pb-4 px-8 overflow-x-auto no-scrollbar py-10">
          {SHELF_2_ITEMS.map(item => (
            <ShelfItem key={item.id} item={item} onClick={handleItemClick} />
          ))}
        </div>
         {/* The Shelf Visual */}
         <div className="absolute bottom-0 left-4 right-4 h-4 bg-gray-100 rounded-sm shelf-shadow z-[-1]"></div>
         <div className="absolute bottom-0 left-4 right-4 h-full max-h-[16px] bg-gradient-to-b from-gray-200 to-gray-300 z-[-2]"></div>
      </div>

      {/* Footer */}
      <footer className="mt-32 text-gray-400 text-sm font-medium">
        <p>Curated by AI • 2024</p>
      </footer>

      {/* Modal for Game/Activity */}
      <Modal 
        isOpen={!!activeItem} 
        onClose={closeModal} 
        title={activeItem?.title || ''}
        color={activeItem?.color || 'bg-gray-800'}
      >
        {renderActiveContent()}
      </Modal>

    </div>
  );
};

export default App;