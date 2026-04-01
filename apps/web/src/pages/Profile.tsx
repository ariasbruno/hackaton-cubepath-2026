import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { PageHeader } from '../components/layout/PageHeader';
import { authService } from '../services/api';
import { PageTransition } from '../components/layout/PageTransition'; 

import { ProfileHero } from '../components/profile/ProfileHero';
import { StatsGrid } from '../components/profile/StatsGrid';
import { RecentActivity } from '../components/profile/RecentActivity';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import ShareIcon from '../components/icons/share';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { 
    playerId, nickname, avatar, color, totalScore, 
    impostorGames, agenteGames, infiltradoGames, dispersoGames, vinculadoGames,
    voteEfficacy,
    globalRank, isRegistered, setProfile 
  } = useAuthStore();
  
  const [editOpen, setEditOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(nickname || '');
  const [editAvatar, setEditAvatar] = React.useState(avatar || 'noto--cat-face');
  const [editColor, setEditColor] = React.useState(color || '#FFD166');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!playerId) {
      navigate('/', { replace: true });
      return;
    }

    if (!playerId.startsWith('guest_')) {
      authService.getMe(playerId).then(data => {
        setProfile(data.id, data.nickname, data.avatar, data.color, {
          totalScore: data.totalScore,
          impostorGames: data.impostorGames,
          agenteGames: data.agenteGames,
          infiltradoGames: data.infiltradoGames,
          dispersoGames: data.dispersoGames,
          vinculadoGames: data.vinculadoGames,
          totalVotes: data.totalVotes,
          correctVotes: data.correctVotes,
          globalRank: data.globalRank,
          voteEfficacy: data.voteEfficacy,
          isRegistered: isRegistered 
        });
      }).catch(err => {
        console.error('Failed to sync profile stats:', err);
      });
    }
  }, [playerId, navigate, setProfile, isRegistered]);

  const handleEdit = () => {
    setEditName(nickname || '');
    setEditAvatar(avatar || 'noto--cat-face');
    setEditColor(color || '#FFD166');
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !playerId) return;
    
    setIsLoading(true);
    setErrorText(null);
    
    try {
      const response = await authService.updateProfile(playerId, {
        nickname: editName.trim(),
        avatar: editAvatar,
        color: editColor
      });
      
      setProfile(response.id, editName.trim(), editAvatar, editColor, {
        totalScore: response.totalScore,
        impostorGames: response.impostorGames,
        agenteGames: response.agenteGames,
        infiltradoGames: response.infiltradoGames,
        dispersoGames: response.dispersoGames,
        vinculadoGames: response.vinculadoGames,
        totalVotes: response.totalVotes,
        correctVotes: response.correctVotes,
        globalRank: response.globalRank,
        voteEfficacy: response.voteEfficacy,
        isRegistered: true
      });
      setEditOpen(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setErrorText(error.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="flex flex-col h-full bg-paper pattern-dots overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden">
        <PageHeader
          title="Tu Perfil"
          onBack={() => navigate('/')}
          rightAction={
            <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-hard border-2 border-ink/5 active:translate-y-0.5 active:shadow-none transition-all">
              <ShareIcon className="w-6 h-6" />
            </button>
          }
        />
      </div>

      {/* Desktop Header */}
      <header className="hidden md:flex h-[86px] bg-white/50 backdrop-blur-sm border-b-2 border-ink/5 px-9 items-center justify-between shrink-0">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-tight text-ink">Mi Perfil</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-white px-5 py-2.5 rounded-full shadow-hard-sm border-2 border-ink/5 flex items-center gap-3 hover:translate-y-0.5 transition-all group">
            <ShareIcon className="w-[18px] h-[18px] text-ink group-hover:text-primary transition-colors" />
            <span className="font-bold text-[11px] uppercase tracking-widest text-ink/60 group-hover:text-ink transition-colors">Compartir</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-9">
        <div className="max-w-md mx-auto md:max-w-[1152px]">
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-9">
            {/* Left Column (Mobile: top) */}
            <div className="md:col-span-5 space-y-8">
              <ProfileHero 
                nickname={nickname}
                avatar={avatar}
                color={color}
                totalScore={totalScore}
                globalRank={globalRank}
                isRegistered={isRegistered}
                onEdit={handleEdit}
              />
            </div>

            {/* Right Column (Mobile: bottom) */}
            <div className="md:col-span-7 space-y-8 md:space-y-10">
              <StatsGrid 
                impostorGames={impostorGames}
                agenteGames={agenteGames}
                voteEfficacy={voteEfficacy}
                vinculadoGames={vinculadoGames}
                infiltradoGames={infiltradoGames}
                dispersoGames={dispersoGames}
              />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal 
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
        editName={editName}
        setEditName={setEditName}
        editAvatar={editAvatar}
        setEditAvatar={setEditAvatar}
        editColor={editColor}
        setEditColor={setEditColor}
        isLoading={isLoading}
        errorText={errorText}
      />
    </PageTransition>
  );
};
