import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Rooms } from './pages/Rooms';
import { CreateRoom } from './pages/CreateRoom';
import { Lobby } from './pages/Lobby';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { AppLayout } from './components/layout/AppLayout';
import { BottomNav } from './components/layout/BottomNav';
import { SideNav } from './components/layout/SideNav';
import { useAuthStore } from './store/useAuthStore';
import { ToastContainer } from './components/ui/ToastContainer';
import { LocalGameFlow } from './pages/LocalMode/LocalGameFlow';

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
              <Route path="/admin" element={<Suspense><DatabaseAdmin /></Suspense>} />
              <Route path="/test/brand" element={<Suspense><BrandIdentity /></Suspense>} />
              <Route path="/prototypes/pistas" element={<Suspense><PlayingPrototype /></Suspense>} />
              <Route path="/prototypes/votacion" element={<Suspense><VotingPrototype /></Suspense>} />
              <Route path="/prototypes/reveal-empate" element={<Suspense><TieRevealPrototype /></Suspense>} />
              <Route path="/prototypes/reveal-impostor" element={<Suspense><RevealImpostorPrototype /></Suspense>} />
              <Route path="/prototypes/reveal-agente" element={<Suspense><RevealAgentePrototype /></Suspense>} />
              <Route path="/prototypes/reveal-infiltrado" element={<Suspense><RevealInfiltradoPrototype /></Suspense>} />
              <Route path="/prototypes/reveal-caos-empate" element={<Suspense><RevealCaosEmpatePrototype /></Suspense>} />
              <Route path="/prototypes/reveal-caos-reveal" element={<Suspense><RevealCaosRevealPrototype /></Suspense>} />
              <Route path="/prototypes/reveal-caos-reveal2" element={<Suspense><RevealCaosReveal2Prototype /></Suspense>} />
              <Route path="/prototypes/reveal-caos-vinculados" element={<Suspense><RevealCaosVinculadosPrototype /></Suspense>} />
              <Route path="/prototypes/tmp/caos-encontrado" element={<Suspense><TmpCaosFound /></Suspense>} />
              <Route path="/prototypes/tmp/caos-victoria" element={<Suspense><TmpCaosVictory /></Suspense>} />
              <Route path="/prototypes/tmp/caos-empate" element={<Suspense><TmpCaosTie /></Suspense>} />
              <Route path="/prototypes/tmp/impostor" element={<Suspense><TmpImpostorReveal /></Suspense>} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
