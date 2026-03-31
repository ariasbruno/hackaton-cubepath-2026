import type { RoomState, PlayerState } from './models';

interface ScoringResult {
  isGameOver: boolean;
  winnerTeam?: 'AGENTS' | 'IMPOSTOR'; // Extend to CHAOS if needed
}

export class ScoringRules {
  public getEliminationTarget(room: RoomState): string | null {
    if (room.settings.mode === 'CAOS') {
      const vinculados = room.players.filter(p => p.role === 'VINCULADO');
      const vinculadoIds = vinculados.map(p => p.id);

      // ── PASO 0 (PRIORIDAD ABSOLUTA): Vínculo mutuo ──
      // Los vinculados ganan siempre que AMBOS se vinculen mutuamente (A→B y B→A),
      // incluso si son descubiertos simultáneamente por los dispersos.
      const mutualLink = vinculados.length === 2 &&
        vinculados[0].hasVoted &&
        vinculados[0].votedAction === 'LINK' &&
        vinculados[0].votedFor === vinculados[1].id &&
        vinculados[1].hasVoted &&
        vinculados[1].votedAction === 'LINK' &&
        vinculados[1].votedFor === vinculados[0].id;

      if (mutualLink) {
        return vinculadoIds[0]; // Vinculados win
      }

      // ── PASO 1: Agrupar todos los votos por valor idéntico ──
      // Un "voto" puede ser: ACCUSE (par exacto), LINK (target), SKIP
      // Solo cuentan grupos de ≥2 personas que votaron lo mismo.
      const voteGroups = new Map<string, string[]>(); // voteKey → [playerId, ...]

      for (const player of room.players.filter(p => p.isAlive && p.hasVoted)) {
        let voteKey: string;

        if (player.votedAction === 'SKIP' || player.votedFor === null) {
          voteKey = '__SKIP__';
        } else if (player.votedAction === 'ACCUSE' && player.votedTargets?.length === 2) {
          // Normalize pair order so {A,B} == {B,A}
          const sorted = [...player.votedTargets].sort();
          voteKey = `ACCUSE:${sorted.join(',')}`;
        } else if (player.votedAction === 'LINK' && player.votedFor) {
          voteKey = `LINK:${player.votedFor}`;
        } else {
          voteKey = `VOTE:${player.votedFor}`;
        }

        const group = voteGroups.get(voteKey) ?? [];
        group.push(player.id);
        voteGroups.set(voteKey, group);
      }

      // ── PASO 2: Identificar el/los grupo(s) con mayor número de votos ──
      const significantGroups = [...voteGroups.entries()].filter(([, ids]) => ids.length >= 2);

      if (significantGroups.length === 0) {
        return null; // Empate — nadie se puso de acuerdo
      }

      const maxSize = Math.max(...significantGroups.map(([, ids]) => ids.length));
      const leadingGroups = significantGroups.filter(([, ids]) => ids.length === maxSize);

      // ── PASO 3: ¿Algún grupo líder votó correctamente? ──
      // Solo las ACUSACIONES al par correcto son "correctas" para los dispersos.
      const correctVoteKey = (() => {
        const sorted = [...vinculadoIds].sort();
        return `ACCUSE:${sorted.join(',')}`;
      })();

      const correctLeadingGroups = leadingGroups.filter(([key]) => key === correctVoteKey);

      if (correctLeadingGroups.length === 0) {
        return null; // Ningún grupo líder votó correctamente → empate
      }

      // ── Caso especial: empate de grupos donde VARIOS grupos son líderes ──
      // Si hay más de un grupo líder pero solo uno es correcto → ese gana.
      // Si todos los líderes son incorrectos → ya manejado arriba.
      // La presencia de un grupo correcto entre los líderes es suficiente para ganar.
      return vinculadoIds[0]; // Dispersos ganan: vinculados son revelados
    }

    const voteCounts: Record<string, number> = {};
    let skipVotes = 0;

    for (const player of room.players) {
      if (!player.hasVoted) continue;
      if (player.votedFor === null) {
        skipVotes++;
      } else {
        voteCounts[player.votedFor] = (voteCounts[player.votedFor] || 0) + 1;
      }
    }

    // Find max votes
    let maxVotes = 0;
    let targetId: string | null = null;
    let isTie = false;

    for (const [id, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        targetId = id;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    }

    // Tie or no votes or skip is majority
    if (isTie || skipVotes >= maxVotes || !targetId || maxVotes === 0) {
      return null;
    }

    return targetId;
  }

  public evaluateWinCondition(room: RoomState): ScoringResult {
    const alivePlayers = room.players.filter(p => p.isAlive);
    const impostorsAlive = alivePlayers.filter(p => p.role === 'IMPOSTOR' || p.role === 'INFILTRADO' || p.role === 'VINCULADO');
    const agentsAlive = alivePlayers.filter(p => p.role === 'AGENTE' || p.role === 'DISPERSO');

    if (room.settings.mode === 'CAOS') {
      const vinculados = room.players.filter(p => p.role === 'VINCULADO');
      const vinculadosAlive = vinculados.filter(p => p.isAlive);

      // Check if vinculados found each other (any correct LINK action in the last round)
      // This is a bit tricky because evaluateWinCondition is called AFTER handleVotingEnd
      // where room.lastEliminatedId was set.
      
      // If any vinculado was eliminated, it means the pair was "found" or they were voted out.
      // For Caos, "finding" the pair means they both are out/revealed.
      
      if (vinculadosAlive.length === 0) {
        // PRIORITY: Vinculados win if they found each other
        const anyVinculadoFoundPartner = vinculados.some(p =>
          p.hasVoted &&
          p.votedAction === 'LINK' &&
          p.votedFor &&
          vinculados.map(v => v.id).includes(p.votedFor) &&
          p.votedFor !== p.id
        );

        if (anyVinculadoFoundPartner) {
          return { isGameOver: true, winnerTeam: 'IMPOSTOR' }; // Vinculados (Chaos) won via Link
        } else {
          // If they were revealed but didn't link, it must be the Dispersos (Agents) who found them
          return { isGameOver: true, winnerTeam: 'AGENTS' }; // Dispersos (Agents) won via Accusal
        }
      }

      // Traditional survival win
      if (alivePlayers.length <= 2 && impostorsAlive.length > 0) {
        return { isGameOver: true, winnerTeam: 'IMPOSTOR' };
      }
      
      return { isGameOver: false };
    }

    // Agentes win if all impostors/infiltrados are gone
    if (impostorsAlive.length === 0) {
      return { isGameOver: true, winnerTeam: 'AGENTS' };
    }
    // Impostors win if agents are <= impostors
    if (agentsAlive.length <= impostorsAlive.length) {
      return { isGameOver: true, winnerTeam: 'IMPOSTOR' };
    }

    return { isGameOver: false };
  }

  public calculatePoints(room: RoomState, result: ScoringResult): void {
    const isCercanas = room.settings.mode === 'CERCANAS';
    const isCaos = room.settings.mode === 'CAOS';

    // Reset last match gain
    for (const p of room.players) {
      p.lastMatchPoints = 0;
    }

    for (const player of room.players) {
      let gain = 0;

      // Abstain / Skip vote
      if (player.hasVoted && player.votedFor === null && !isCaos) {
        gain += 5;
      }
      // Voted for someone
      else if (player.hasVoted && (player.votedFor || player.votedTargets?.length)) {
        const targets = player.votedTargets || (player.votedFor ? [player.votedFor] : []);
        
        if (isCaos) {
          const vinculados = room.players.filter(p => p.role === 'VINCULADO');
          const vinculadoIds = vinculados.map(v => v.id);
          
          if (player.role === 'DISPERSO') {
            if (player.votedAction === 'ACCUSE' && targets.length === 2 && targets.every(id => vinculadoIds.includes(id))) {
              gain += 30; // Correct accusation
            } else if (player.votedAction === 'SKIP') {
               gain += 5;
            }
          } else if (player.role === 'VINCULADO') {
            if (player.votedAction === 'LINK' && targets.length === 1 && vinculadoIds.includes(targets[0]) && targets[0] !== player.id) {
              gain += 40; // Correct link
            }
          }
        } else {
          const target = room.players.find(p => p.id === player.votedFor);
          if (target) {
            const targetIsImpostor = target.role === 'IMPOSTOR' || target.role === 'INFILTRADO' || target.role === 'VINCULADO';
            const playerIsAgent = player.role === 'AGENTE' || player.role === 'DISPERSO';
            const playerIsImpostor = player.role === 'IMPOSTOR' || player.role === 'INFILTRADO' || player.role === 'VINCULADO';

            if (playerIsAgent) {
              if (targetIsImpostor) {
                gain += isCercanas ? 15 : 10;
              } else {
                gain += isCercanas ? -10 : -5;
              }
            } else if (playerIsImpostor) {
              if (!targetIsImpostor) {
                gain += isCercanas ? 15 : 10;
              }
            }
          }
        }
      }

      // Survival & Win conditions
      const playerIsAgent = player.role === 'AGENTE' || player.role === 'DISPERSO';
      const playerIsImpostor = player.role === 'IMPOSTOR' || player.role === 'INFILTRADO' || player.role === 'VINCULADO';

      if (playerIsAgent && result.isGameOver && result.winnerTeam === 'AGENTS') {
        gain += (isCercanas || isCaos) ? 25 : 20;
      }

      if (playerIsImpostor && player.isAlive) {
        gain += (isCercanas || isCaos) ? 20 : 15;
      }

      if (result.isGameOver && result.winnerTeam === 'IMPOSTOR' && playerIsImpostor) {
        gain += (isCercanas || isCaos) ? 60 : 50;
      }

      player.lastMatchPoints = gain;
      player.pointsEarned += gain;

      // Increment stats for cross-game tracking
      if (playerIsAgent) {
        player.agentGames = (player.agentGames || 0) + 1;
        player.agentPoints = (player.agentPoints || 0) + gain;
      } else if (playerIsImpostor) {
        player.impostorGames = (player.impostorGames || 0) + 1;
        player.impostorPoints = (player.impostorPoints || 0) + gain;
      }
    }
  }
}
