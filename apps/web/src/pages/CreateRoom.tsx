import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { roomService } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { Stepper } from '../components/ui/Stepper';
import { Button } from '../components/ui/Button';

// Modular Components
import { Step1Connection } from '../components/create-room/Step1Connection';
import { Step2Categories } from '../components/create-room/Step2Categories';
import { Step3GameMode } from '../components/create-room/Step3GameMode';
import { Step4FinalConfig } from '../components/create-room/Step4FinalConfig';
import { RoomSummaryModal } from '../components/create-room/RoomSummaryModal';
import { RegistrationModal } from '../components/auth/RegistrationModal';
import { PageTransition } from '../components/layout/PageTransition';
import CloseIcon from '../components/icons/close';
import ArrowBackIcon from '../components/icons/arrow-back';
import AddCircleIcon from '../components/icons/add-circle';

import type { ConnectionType, GameMode } from '../constants/game';




export const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, avatar } = useAuthStore();
  const location = useLocation();
  const presetHandled = useRef(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  // State
  const [step, setStep] = useState(1);
  const [connection, setConnection] = useState<ConnectionType>(null);


  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [activeSheetCategory, setActiveSheetCategory] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [roomName, setRoomName] = useState(`La guarida de ${nickname || 'Jugador'}`);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [clueTime, setClueTime] = useState(45);
  const [discussionTime, setDiscussionTime] = useState(120);
  const [votingTime, setVotingTime] = useState(30);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);

  // Reset scroll on step change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [step]);

  // Handle preset state from home (e.g. "Explore Caos")
  useEffect(() => {
    if (presetHandled.current) return;
    const state = location.state as { presetMode?: GameMode; presetConnection?: ConnectionType };
    if (state?.presetMode || state?.presetConnection) {
      presetHandled.current = true;
      if (state.presetConnection) setConnection(state.presetConnection);
      if (state.presetMode) setGameMode(state.presetMode);
      
      // If we have both, we can jump to the category step (Step 3 in the new order)
      if (state.presetMode && state.presetConnection) {
        setStep(3);
      }
    }
  }, [location.state]);


  const canNext = () => {
    if (step === 1) return connection !== null;
    if (step === 2) return gameMode !== null;
    if (step === 3) return selectedCategory !== null && selectedSubcategories.length > 0;
    if (step === 4) return roomName.trim().length > 0;
    return false;
  };

  const handleNext = () => step < 4 ? setStep(step + 1) : setShowSummary(true);
  const handleBack = () => step > 1 ? setStep(step - 1) : navigate('/');

  const toggleSubcategory = (id: string) => setSelectedSubcategories((prev) =>
    prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
  );

  const handleCategoryClick = (catId: string) => {
    if (selectedCategory !== catId) {
      setSelectedCategory(catId);
      setSelectedSubcategories([]);
    }
    setActiveSheetCategory(catId);
  };

  const handleCreate = async () => {
    if (connection === 'local') {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const settings = { 
        mode: gameMode === 'TRADICIONAL' ? 'TRADICIONAL' : 'CERCANAS' as any,
        categories: selectedSubcategories,
        timers: { clues: clueTime, discuss: discussionTime, vote: votingTime }
      };
      
      // Initialize the local game in the store
      import('../store/useLocalGameStore').then(({ useLocalGameStore }) => {
        useLocalGameStore.getState().createGame(code, settings, roomName.trim());
        navigate(`/local/${code}`);
      });
      return;
    }

    // Use getState() to avoid stale closures in recursive calls from Success callbacks
    const currentIsRegistered = useAuthStore.getState().isRegistered;
    if (!currentIsRegistered) {
      setRegistrationOpen(true);
      return;
    }

    const currentPlayerId = useAuthStore.getState().playerId;
    setLoading(true);
    try {
      // Active verification if online
      if (currentPlayerId && !currentPlayerId.startsWith('guest_')) {
        await useAuthStore.getState().verifySession(currentPlayerId);
      }
      const data = await roomService.createRoom(currentPlayerId!, {
        name: roomName.trim(), maxPlayers, mode: gameMode!,
        mainCategory: selectedCategory || 'general', subcategories: selectedSubcategories,
        timers: { clues: clueTime, discuss: discussionTime, vote: votingTime }, isPublic: !isPrivate,
      });
      navigate(`/room/${data.code}`);
    } catch (err: any) {
      console.error(err);
      if (err.status === 404 && err.url?.includes('/auth/verify')) {
        useToastStore.getState().addToast('Usuario no encontrado, regístrate de nuevo', 'error');
        useAuthStore.getState().clearAuth();
        setRegistrationOpen(true);
        return;
      }
      if (err.status === 403) {
        // Session invalidated (user deleted from DB)
        useToastStore.getState().addToast('Sesión inválida. Por favor, regístrate de nuevo.', 'error');
        useAuthStore.getState().clearAuth();
        setRegistrationOpen(true);
        return;
      }
    } finally { setLoading(false); }
  };

  const isBlurred = showSummary || registrationOpen;

  return (
    <PageTransition animation="slide-up">
      <div className={`flex flex-col h-full bg-paper pattern-dots transition-all duration-500 ${isBlurred ? 'blur-md grayscale-[0.2] brightness-75 scale-[0.98]' : ''}`}>

        {/* ── Desktop header (md+) ── */}
        <header className="hidden md:flex h-[64px] bg-white/80 backdrop-blur-md border-b-2 border-ink/5 px-8 items-center justify-between shrink-0 z-30 shadow-sm">
          {/* Left: back/exit + title */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 group"
            >
              <div className={`h-9 w-9 bg-white rounded-lg flex items-center justify-center shadow-hard-sm border-2 border-ink/5 transition-all ${
                step === 1
                  ? 'group-hover:bg-danger group-hover:text-white'
                  : 'group-hover:bg-ink group-hover:text-white'
              }`}>
                {step === 1 ? (
                  <CloseIcon className="w-4 h-4" />
                ) : (
                  <ArrowBackIcon className="w-4 h-4" />
                )}
              </div>
              <span className={`font-display text-sm uppercase tracking-tight transition-colors ${
                step === 1
                  ? 'text-ink group-hover:text-danger'
                  : 'text-ink group-hover:text-ink'
              }`}>
                {step === 1 ? 'Salir' : 'Volver'}
              </span>
            </button>
            <div className="h-5 w-px bg-ink/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary border-2 border-ink rounded-lg flex items-center justify-center text-white shadow-hard-sm rotate-3">
                <AddCircleIcon className="w-3.5 h-3.5" />
              </div>
              <h1 className="font-display text-base text-ink uppercase tracking-tight">
                Configuración de Sala
              </h1>
            </div>
          </div>

          {/* Right: step progress + avatar */}
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <div className="flex gap-2 mb-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-9 h-2 rounded-full transition-colors ${
                      i < step - 1
                        ? 'bg-accent'
                        : i === step - 1
                        ? 'bg-primary'
                        : 'bg-ink/10'
                    }`}
                  />
                ))}
              </div>
              <span className="font-display text-primary text-[9px] uppercase tracking-widest font-bold">
                Paso {step} de 4
              </span>
            </div>
            {/* Avatar */}
            <div className="w-11 h-11 bg-white rounded-full border-4 border-white shadow-hard flex items-center justify-center overflow-hidden text-lg select-none">
              {avatar || '🎭'}
            </div>
          </div>
        </header>

        {/* ── Mobile header (Stepper overlay) ── */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-20 pointer-events-none flex justify-center">
          <div className="w-full max-w-md pointer-events-auto">
            <Stepper currentStep={step} totalSteps={4} onBack={handleBack} onClose={step === 1 ? () => navigate('/') : undefined} />
          </div>
        </div>
  
        {/* ── Scrollable content ── */}
        <div className={`flex-1 flex flex-col min-h-0 relative ${activeSheetCategory ? 'mask-none [-webkit-mask-image:none] z-30' : 'md:mask-none md:[-webkit-mask-image:none] mask-[linear-gradient(to_bottom,transparent,black_140px,black_calc(100%-140px),transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_140px,black_calc(100%-140px),transparent)]'}`}>
          <main 
            ref={scrollRef as any}
            className={`flex-1 overflow-y-auto no-scrollbar ${activeSheetCategory ? 'overflow-hidden' : ''}`}
          >
            {/* Mobile: extra top padding for floating Stepper */}
            {/* Desktop: centered max-width container */}
            <div className="md:py-8 md:px-8">
              <div className="md:max-w-3xl md:mx-auto">
                {/* Mobile top padding to clear floating header */}
                <div className="pt-32 md:pt-0 w-full mb-30 md:mb-0 px-6 md:px-0">
                  {step === 1 && <PageTransition animation="fade"><Step1Connection connection={connection} setConnection={setConnection} /></PageTransition>}
                  {step === 2 && <PageTransition animation="fade"><Step3GameMode gameMode={gameMode} setGameMode={setGameMode} connection={connection} /></PageTransition>}
                  {step === 3 && (
                    <PageTransition animation="fade">
                      <Step2Categories
                        selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick}
                        activeSheetCategory={activeSheetCategory} setActiveSheetCategory={setActiveSheetCategory}
                        selectedSubcategories={selectedSubcategories} toggleSubcategory={toggleSubcategory}
                        onConfirm={handleNext}
                      />
                    </PageTransition>
                  )}
                  {step === 4 && (
                    <PageTransition animation="fade">
                      <Step4FinalConfig
                        gameMode={gameMode}
                        roomName={roomName} setRoomName={setRoomName} maxPlayers={maxPlayers} setMaxPlayers={setMaxPlayers}
                        clueTime={clueTime} setClueTime={setClueTime} discussionTime={discussionTime} setDiscussionTime={setDiscussionTime}
                        votingTime={votingTime} setVotingTime={setVotingTime} isPrivate={isPrivate} setIsPrivate={setIsPrivate}
                      />
                    </PageTransition>
                  )}
                </div>

                {/* ── Desktop CTA (inside content flow) ── */}
                {step !== 3 && (
                  <div className="hidden md:flex justify-end mt-6 px-0">
                    {canNext() ? (
                      <button
                        onClick={handleNext}
                        className="px-12 bg-primary text-white font-display text-lg py-3.5 rounded-btn shadow-hard hover:translate-y-0.5 hover:shadow-hard-sm active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest"
                      >
                        {step < 4 ? 'Siguiente' : '¡Crear Sala!'}
                      </button>
                    ) : (
                      <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-btn text-center text-[9px] font-extrabold text-ink/30 uppercase tracking-[0.2em] border border-ink/5">
                        {step === 1 && 'Selecciona un tipo de conexión'}
                        {step === 2 && 'Selecciona un modo de juego'}
                        {step === 4 && 'Completa los campos'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* ── Mobile CTA footer ── */}
        <footer className="md:hidden absolute bottom-0 left-0 right-0 w-full p-6 pb-10 pointer-events-none flex justify-center z-20">
          <div className="w-full max-w-md pointer-events-auto">
            {canNext() && step !== 3 ? (
              <Button variant="primary" size="lg" fullWidth onClick={handleNext} noOutline className="shadow-hard-lg">
                {step < 4 ? 'Siguiente' : '¡Crear Sala!'}
              </Button>
            ) : step !== 3 && (
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-btn text-center text-[10px] font-extrabold text-ink/30 uppercase tracking-[0.2em] border border-ink/5">
                {step === 1 && 'Selecciona un tipo de conexión'}
                {step === 2 && 'Selecciona un modo de juego'}
              </div>
            )}
          </div>
        </footer>
      </div>

      <RoomSummaryModal
        isOpen={showSummary} onClose={() => setShowSummary(false)}
        roomName={roomName} gameMode={gameMode} maxPlayers={maxPlayers}
        clueTime={clueTime} discussionTime={discussionTime} votingTime={votingTime}
        isPrivate={isPrivate} onConfirm={handleCreate} loading={loading}
      />

      <RegistrationModal
        isOpen={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
        onSuccess={handleCreate}
      />
    </PageTransition>
  );
};
