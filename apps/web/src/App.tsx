import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { BottomNav } from './components/layout/BottomNav';
import { SideNav } from './components/layout/SideNav';
import { useAuthStore } from './store/useAuthStore';
import { ToastContainer } from './components/ui/ToastContainer';

// Main Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Rooms = lazy(() => import('./pages/Rooms').then(m => ({ default: m.Rooms })));
const CreateRoom = lazy(() => import('./pages/CreateRoom').then(m => ({ default: m.CreateRoom })));
const Lobby = lazy(() => import('./pages/Lobby').then(m => ({ default: m.Lobby })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const LocalGameFlow = lazy(() => import('./pages/LocalMode/LocalGameFlow').then(m => ({ default: m.LocalGameFlow })));

// Dev pages (lazy loaded, only defined in development)
const DatabaseAdmin = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Admin/DatabaseAdmin').then(m => ({ default: m.DatabaseAdmin })))
  : () => null;

const BrandIdentity = import.meta.env.DEV
  ? React.lazy(() => import('./pages/BrandIdentity').then(m => ({ default: m.BrandIdentity })))
  : () => null;

const PlayingPrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/PlayingPrototype').then(m => ({ default: m.PlayingPrototype })))
  : () => null;

const VotingPrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/VotingPrototype').then(m => ({ default: m.VotingPrototype })))
  : () => null;

const TieRevealPrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/TieRevealPrototype').then(m => ({ default: m.TieRevealPrototype })))
  : () => null;

const RevealImpostorPrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/RevealImpostorPrototype').then(m => ({ default: m.RevealImpostorPrototype })))
  : () => null;

const RevealAgentePrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/RevealAgentePrototype').then(m => ({ default: m.RevealAgentePrototype })))
  : () => null;

const RevealInfiltradoPrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/RevealInfiltradoPrototype').then(m => ({ default: m.RevealInfiltradoPrototype })))
  : () => null;

const RevealCaosEmpatePrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/RevealCaosEmpatePrototype').then(m => ({ default: m.RevealCaosEmpatePrototype })))
  : () => null;

const RevealCaosRevealPrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/RevealCaosRevealPrototype').then(m => ({ default: m.RevealCaosRevealPrototype })))
  : () => null;

const RevealCaosReveal2Prototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/RevealCaosReveal2Prototype').then(m => ({ default: m.RevealCaosReveal2Prototype })))
  : () => null;

const RevealCaosVinculadosPrototype = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/RevealCaosVinculadosPrototype').then(m => ({ default: m.RevealCaosVinculadosPrototype })))
  : () => null;

const TmpCaosFound = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/TmpCaosFound').then(m => ({ default: m.TmpCaosFound })))
  : () => null;

const TmpCaosVictory = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/TmpCaosVictory').then(m => ({ default: m.TmpCaosVictory })))
  : () => null;

const TmpCaosTie = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/TmpCaosTie').then(m => ({ default: m.TmpCaosTie })))
  : () => null;

const TmpImpostorReveal = import.meta.env.DEV
  ? React.lazy(() => import('./pages/Prototype/TmpImpostorReveal').then(m => ({ default: m.TmpImpostorReveal })))
  : () => null;

/** Pages where the nav (bottom on mobile, side on desktop) should be visible */
const NAV_PAGES = ['/', '/rooms', '/profile', '/settings'];

function AppContent() {
  const location = useLocation();
  const { playerId } = useAuthStore();

  const showNav = NAV_PAGES.includes(location.pathname) && !!playerId;

  return (
    <div className="flex w-full h-dvh overflow-hidden">
      {/* Desktop sidebar – only shown on nav pages */}
      {showNav && <SideNav />}

      {/* Main layout area */}
      <AppLayout showNav={showNav} fullWidth={location.pathname.startsWith('/admin')}>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center bg-paper">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/room/:code" element={<Lobby />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/local/:code" element={<LocalGameFlow />} />
            {/* Development Routes - Automatically excluded from production build */}
            {import.meta.env.DEV && (
              <>
                <Route path="/admin" element={<DatabaseAdmin />} />
                <Route path="/test/brand" element={<BrandIdentity />} />
                <Route path="/prototypes/pistas" element={<PlayingPrototype />} />
                <Route path="/prototypes/votacion" element={<VotingPrototype />} />
                <Route path="/prototypes/reveal-empate" element={<TieRevealPrototype />} />
                <Route path="/prototypes/reveal-impostor" element={<RevealImpostorPrototype />} />
                <Route path="/prototypes/reveal-agente" element={<RevealAgentePrototype />} />
                <Route path="/prototypes/reveal-infiltrado" element={<RevealInfiltradoPrototype />} />
                <Route path="/prototypes/reveal-caos-empate" element={<RevealCaosEmpatePrototype />} />
                <Route path="/prototypes/reveal-caos-reveal" element={<RevealCaosRevealPrototype />} />
                <Route path="/prototypes/reveal-caos-reveal2" element={<RevealCaosReveal2Prototype />} />
                <Route path="/prototypes/reveal-caos-vinculados" element={<RevealCaosVinculadosPrototype />} />
                <Route path="/prototypes/tmp/caos-encontrado" element={<TmpCaosFound />} />
                <Route path="/prototypes/tmp/caos-victoria" element={<TmpCaosVictory />} />
                <Route path="/prototypes/tmp/caos-empate" element={<TmpCaosTie />} />
                <Route path="/prototypes/tmp/impostor" element={<TmpImpostorReveal />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        {showNav && <BottomNav />}
      </AppLayout>
    </div>
  );
}

function App() {
  return (
    <div className="antialiased min-h-screen">
      <BrowserRouter>
        <AppContent />
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
