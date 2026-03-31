import React from 'react';
import { CATEGORIES } from '../../constants/game';
import CheckCircleIcon from '../icons/check-circle';
import RestaurantIcon from '../icons/restaurant';
import MovieIcon from '../icons/movie';
import PetsIcon from '../icons/pets';
import TravelExploreIcon from '../icons/travel-explore';
import CategoryIcon from '../icons/category';
import CloseIcon from '../icons/close';

const CategoryIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  restaurant: RestaurantIcon,
  movie: MovieIcon,
  pets: PetsIcon,
  travel_explore: TravelExploreIcon,
  category: CategoryIcon,
};

interface Step2CategoriesProps {
  selectedCategory: string | null;
  onCategoryClick: (id: string) => void;
  activeSheetCategory: string | null;
  setActiveSheetCategory: (id: string | null) => void;
  selectedSubcategories: string[];
  toggleSubcategory: (id: string) => void;
  onConfirm: () => void;
}

export const Step2Categories: React.FC<Step2CategoriesProps> = ({
  selectedCategory,
  onCategoryClick,
  activeSheetCategory,
  setActiveSheetCategory,
  selectedSubcategories,
  toggleSubcategory,
  onConfirm,
}) => {
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [hasEntered, setHasEntered] = React.useState(false);
  const startYRef = React.useRef(0);
  const activeCat = CATEGORIES.find(c => c.id === activeSheetCategory);

  // ── Mobile bottom-sheet drag handlers ──
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = Math.max(0, e.clientY - startYRef.current);
    setDragY(deltaY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    try { target.releasePointerCapture(e.pointerId); } catch (_) {}
    if (dragY > 100) setActiveSheetCategory(null);
    setIsDragging(false);
    setDragY(0);
  };

  React.useEffect(() => {
    if (!activeSheetCategory) {
      setDragY(0);
      setIsDragging(false);
      setHasEntered(false);
    }
  }, [activeSheetCategory]);

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl md:text-5xl mb-2 uppercase tracking-tight leading-none">
          Elegí el Tema
        </h2>
        <p className="text-xs text-ink/40 font-bold uppercase tracking-widest">
          Toca una categoría para ver subtemas y personalizar tu mazo
        </p>
      </div>

      {/* Mobile: 2-col grid | Desktop: 4-col grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
        {CATEGORIES.map((cat) => {
          const CatIcon = CategoryIconMap[cat.icon] || CategoryIconMap['category'];
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className={`p-6 md:p-8 rounded-card border-4 shadow-hard paper-card flex flex-col items-center gap-3 md:gap-4 group transition-all ${
                selectedCategory === cat.id ? `border-${cat.color} bg-${cat.color}-muted` : 'bg-white border-ink/5'
              }`}
            >
              <div
                className={`w-16 h-16 md:w-24 md:h-24 bg-${cat.color}/10 text-${cat.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}
              >
                <CatIcon className="w-9 h-9 md:w-12 md:h-12" />
              </div>
              <p className="font-display text-lg md:text-2xl uppercase tracking-tight">{cat.name}</p>
            </button>
          );
        })}
      </div>

      {/* Placeholder when nothing selected */}
      {!selectedCategory && (
        <div className="mt-8 bg-ink/5 p-6 md:p-8 rounded-card text-center border-4 border-dashed border-ink/10">
          <p className="font-display text-lg md:text-xl text-ink/30 uppercase tracking-widest">
            Selecciona un tema para continuar
          </p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────
          Mobile: bottom sheet (unchanged)
      ────────────────────────────────────────────────────────────── */}
      {activeSheetCategory && (
        <>
          {/* Mobile bottom sheet */}
          <div className="md:hidden">
            <div
              className={`fixed inset-0 bg-ink/60 z-40 ${!hasEntered ? 'animate-pure-fade-in' : ''}`}
              style={{ opacity: hasEntered && (isDragging || dragY > 0) ? Math.max(0, 1 - dragY / 300) : undefined }}
              onClick={() => setActiveSheetCategory(null)}
            />
            <div
              className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-paper rounded-t-[40px] shadow-[0_-10px_40px_rgba(43,45,66,0.25)] z-50 p-8 pb-10 pt-4 ${!hasEntered ? 'animate-slide-in-bottom' : ''}`}
              style={{
                transform: hasEntered && (isDragging || dragY > 0) ? `translateY(${dragY}px)` : undefined,
                touchAction: 'none'
              }}
              onAnimationEnd={() => setHasEntered(true)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="w-16 h-1.5 bg-ink/10 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />
              <div className="flex justify-between items-center mb-8 px-2 pointer-events-none">
                <h3 className="font-display text-2xl uppercase tracking-tight" style={{ color: `var(--color-${activeCat?.color})` }}>
                  {activeCat?.name}
                </h3>
                <div style={{ color: `var(--color-${activeCat?.color})` }} className="opacity-20">
                  {activeCat && CategoryIconMap[activeCat.icon] ? (
                    React.createElement(CategoryIconMap[activeCat.icon], { className: 'w-9 h-9' })
                  ) : (
                    <CategoryIcon className="w-9 h-9" />
                  )}
                </div>
              </div>
              <div className="space-y-4 mb-10">
                {activeCat?.subcategories.map((sub) => {
                  const isSelected = selectedSubcategories.includes(sub.id);
                  return (
                    <label
                      key={sub.id}
                      className="flex justify-between items-center bg-white p-5 rounded-btn border-2 border-ink/5 shadow-hard-sm cursor-pointer active:translate-y-0.5 transition-all"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-accent/10 text-accent' : 'bg-ink/5 text-ink/20'}`}>
                          <CheckCircleIcon className="w-5 h-5" />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-[10px] opacity-70">{sub.name}</span>
                      </div>
                      <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleSubcategory(sub.id)} />
                      <div className={`w-14 h-8 rounded-full relative transition-colors ${isSelected ? 'bg-accent' : 'bg-ink/10'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all ${isSelected ? 'left-7' : 'left-1'}`} />
                      </div>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSheetCategory(null);
                  onConfirm();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={selectedSubcategories.length === 0}
                className="w-full bg-primary text-white font-display text-2xl py-6 rounded-btn shadow-hard-lg active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-center disabled:opacity-50 disabled:pointer-events-none"
              >
                Confirmar
              </button>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────
              Desktop: centered modal overlay
          ────────────────────────────────────────────────────────────── */}
          <div className="hidden md:flex fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 items-center justify-center animate-pure-fade-in">
            <div className="bg-paper w-full max-w-lg rounded-card border-4 border-ink shadow-hard-lg p-10 relative animate-scale-in">
              {/* Close button */}
              <button
                onClick={() => setActiveSheetCategory(null)}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-hard-sm border-2 border-ink/5 active:translate-y-0.5 transition-all"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              {/* Modal header */}
              <div className="flex items-center gap-6 mb-10">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `color-mix(in srgb, var(--color-${activeCat?.color}) 10%, transparent)`, color: `var(--color-${activeCat?.color})` }}
                >
                  {activeCat && CategoryIconMap[activeCat.icon] ? (
                    React.createElement(CategoryIconMap[activeCat.icon], { className: 'w-10 h-10' })
                  ) : (
                    <CategoryIcon className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-4xl uppercase tracking-tight" style={{ color: `var(--color-${activeCat?.color})` }}>
                    {activeCat?.name}
                  </h3>
                  <p className="text-xs font-bold text-ink/40 uppercase tracking-widest mt-1">
                    Configura los subtemas
                  </p>
                </div>
              </div>

              {/* Subcategory toggles */}
              <div className="space-y-4 mb-10">
                {activeCat?.subcategories.map((sub) => {
                  const isSelected = selectedSubcategories.includes(sub.id);
                  return (
                    <label
                      key={sub.id}
                      className="flex justify-between items-center bg-white p-6 rounded-btn border-2 border-ink/5 shadow-hard-sm cursor-pointer hover:bg-white transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${isSelected ? 'bg-accent/10 text-accent' : 'bg-ink/5 text-ink/20'}`}>
                          <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-display text-lg uppercase tracking-wide">{sub.name}</span>
                          <p className="text-[10px] font-bold text-ink/40 uppercase">Subtema de {activeCat?.name}</p>
                        </div>
                      </div>
                      <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleSubcategory(sub.id)} />
                      <div className={`w-16 h-9 rounded-full relative transition-colors shadow-inner ${isSelected ? 'bg-accent' : 'bg-ink/10'}`}>
                        <div className={`w-7 h-7 bg-white rounded-full absolute top-1 shadow-md transition-all ${isSelected ? 'left-8' : 'left-1'}`} />
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Confirm CTA */}
              <button
                onClick={() => {
                  setActiveSheetCategory(null);
                  onConfirm();
                }}
                disabled={selectedSubcategories.length === 0}
                className="w-full bg-primary text-white font-display text-2xl py-6 rounded-btn shadow-hard-lg hover:translate-y-0.5 hover:shadow-hard active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-center disabled:opacity-50 disabled:pointer-events-none"
              >
                Confirmar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
