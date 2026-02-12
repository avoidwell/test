import React, { useState } from 'react';
import ShelfItem from './components/ShelfItem';
import Modal from './components/Modal';
import { 
  HoroscopeView, 
  PsychTestView, 
  LuckyColorView, 
  DecisionHelperView,
  JokeView,
  StoryAdventureView
} from './components/ActivityViews';
import { ShelfItemData, ActivityType } from './types';

// Constants for our content
const SHELF_1_ITEMS: ShelfItemData[] = [
  {
    id: '1',
    title: 'Tử Vi (운세)',
    subtitle: 'Vũ trụ nói gì về bạn? (우주의 메시지)',
    type: ActivityType.HOROSCOPE,
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    coverImage: 'https://picsum.photos/seed/astro/400/400'
  },
  {
    id: 'new-1',
    title: 'Check Simp (짝사랑)',
    subtitle: 'Bạn có lụy tình không? (당신의 순정지수는?)',
    type: ActivityType.LOVE_SIMP_TEST,
    color: 'bg-gradient-to-br from-pink-500 to-red-500',
    coverImage: 'https://picsum.photos/seed/love/400/400'
  },
  {
    id: '6',
    title: 'Tâm Hồn (심리)',
    subtitle: 'Phiêu lưu ký ức (영혼의 여행)',
    type: ActivityType.STORY_ADVENTURE,
    color: 'bg-gradient-to-br from-violet-600 to-fuchsia-600',
    coverImage: 'https://picsum.photos/seed/magic/400/400'
  },
  {
    id: '2',
    title: 'Màu May Mắn (행운색)',
    subtitle: 'Bùa hộ mệnh hôm nay (오늘의 컬러)',
    type: ActivityType.LUCKY_COLOR,
    color: 'bg-gradient-to-br from-pink-500 to-rose-400',
    coverImage: 'https://picsum.photos/seed/color/400/400'
  }
];

const SHELF_2_ITEMS: ShelfItemData[] = [
  {
    id: 'new-2',
    title: 'Tuổi Tâm Hồn (정신연령)',
    subtitle: 'Già hay ngây thơ? (애늙은이? 응애?)',
    type: ActivityType.MENTAL_AGE_TEST,
    color: 'bg-gradient-to-br from-amber-400 to-orange-500',
    coverImage: 'https://picsum.photos/seed/child/400/400'
  },
  {
    id: '4',
    title: 'Trắc Nghiệm (퀴즈)',
    subtitle: 'Khám phá bản thân (자아 탐구)',
    type: ActivityType.PSYCH_TEST,
    color: 'bg-gradient-to-br from-blue-400 to-cyan-300',
    coverImage: 'https://picsum.photos/seed/mind/400/400'
  },
  {
    id: '5',
    title: 'Phán Xử (결정)',
    subtitle: 'Để AI quyết định (AI 결정장애 해결)',
    type: ActivityType.DECISION_HELPER,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-400',
    coverImage: 'https://picsum.photos/seed/path/400/400'
  },
  {
    id: '3',
    title: 'Chuyện Cười (아재개그)',
    subtitle: 'Cẩn thận kẻo rớt hàm (썰렁 주의)',
    type: ActivityType.JOKE_GENERATOR,
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    coverImage: 'https://picsum.photos/seed/laugh/400/400'
  }
];

const FlowerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 35 C55 15 70 15 75 35 C90 30 90 50 75 55 C90 65 70 85 50 65 C30 85 10 65 25 55 C10 50 10 30 25 35 C30 15 45 15 50 35 Z" />
    <circle cx="50" cy="50" r="10" className="text-white" fill="currentColor" />
  </svg>
);

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<ShelfItemData | null>(null);

  const handleItemClick = (item: ShelfItemData) => {
    setActiveItem(item);
  };

  const handleRandomClick = () => {
    const allItems = [...SHELF_1_ITEMS, ...SHELF_2_ITEMS];
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    setActiveItem(randomItem);
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
      case ActivityType.STORY_ADVENTURE: return <StoryAdventureView />;
      // New Specific Tests reusing the Story Engine
      case ActivityType.LOVE_SIMP_TEST: 
        return <StoryAdventureView forcedTheme="Kiểm tra mức độ lụy tình (Simp)" activityType={ActivityType.LOVE_SIMP_TEST} />;
      case ActivityType.MENTAL_AGE_TEST: 
        return <StoryAdventureView forcedTheme="Kiểm tra độ tuổi tâm hồn" activityType={ActivityType.MENTAL_AGE_TEST} />;
      default: return <div>Tính năng đang phát triển</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex flex-col items-center py-20 overflow-x-hidden">
      
      {/* Header / Brand */}
      <header className="mb-16 text-center w-full max-w-md px-4 relative">
        
        {/* Flower Left Top */}
        <div className="absolute -top-6 -left-4 md:left-0 text-yellow-300 animate-bounce" style={{ animationDuration: '3s' }}>
          <FlowerIcon className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md" />
        </div>

        {/* Flower Right Bottom */}
        <div className="absolute -bottom-4 -right-4 md:right-0 text-blue-300 animate-bounce" style={{ animationDuration: '4s' }}>
          <FlowerIcon className="w-10 h-10 md:w-14 md:h-14 drop-shadow-md" />
        </div>

        {/* Random Button (Pill Shape) */}
        <div className="flex justify-center mb-6">
           <button 
             onClick={handleRandomClick}
             className="group flex items-center space-x-2 bg-white px-5 py-2 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 border border-gray-100"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-indigo-400 group-hover:rotate-180 transition-transform duration-500">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
             </svg>
             <span className="text-gray-500 font-bold text-sm tracking-wide group-hover:text-indigo-500">random</span>
           </button>
        </div>

        {/* Title with Cute Colors */}
        <h1 className="text-6xl md:text-8xl tracking-wide mb-2 drop-shadow-sm select-none" style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700 }}>
          <span className="text-blue-400">SIM</span>
          <span className="text-yellow-400">SIM</span>
        </h1>
        <p className="text-gray-400 font-bold text-sm md:text-base tracking-widest uppercase">
          Góc Giải Trí AI
        </p>
      </header>

      {/* Shelf 1 */}
      <div className="w-full max-w-6xl mb-24 px-4 md:px-12 relative z-10">
        <div className="flex justify-center items-end space-x-4 md:space-x-12 pb-4 px-8 overflow-x-auto no-scrollbar py-10">
          {SHELF_1_ITEMS.map(item => (
            <ShelfItem key={item.id} item={item} onClick={handleItemClick} />
          ))}
        </div>
        {/* The Shelf Visual */}
        <div className="absolute bottom-0 left-4 right-4 h-4 bg-gray-100 rounded-sm shelf-shadow z-[-1] transform skew-x-12 origin-bottom-left"></div>
        <div className="absolute bottom-0 left-4 right-4 h-full max-h-[16px] bg-gradient-to-b from-gray-200 to-gray-300 z-[-2]"></div>
      </div>

      {/* Shelf 2 */}
      <div className="w-full max-w-6xl px-4 md:px-12 relative z-10">
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
      <footer className="mt-32 text-gray-400 text-sm font-medium text-center">
        <p>Tuyển chọn bởi AI • 2024 <br/> (Curated by AI)</p>
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