// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api';
import FolderOffIcon from '../../components/icons/folder-off';
import SportsEsportsIcon from '../../components/icons/sports-esports';
import GroupsIcon from '../../components/icons/groups';
import GroupIcon from '../../components/icons/group';
import PersonIcon from '../../components/icons/person';
import DatabaseIcon from '../../components/icons/database';

const TAB_CONFIG: Record<string, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
  matches: { label: 'Partidas', icon: SportsEsportsIcon },
  rooms: { label: 'Salas', icon: GroupsIcon },
  players: { label: 'Jugadores', icon: GroupIcon },
  auth_users: { label: 'Usuarios', icon: PersonIcon },
  default: { label: 'Tabla', icon: DatabaseIcon },
};

export const DatabaseAdmin: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [activeTable, setActiveTable] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient<string[]>('/admin/tables')
      .then(res => {
        setTables(res);
        if (res.length > 0) setActiveTable(res[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeTable) return;
    setLoading(true);
    apiClient<any[]>(`/admin/tables/${activeTable}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTable]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    try {
      await apiClient(`/admin/tables/${activeTable}/${id}`, { method: 'DELETE' });
      setData(prev => prev.filter(row => row.id !== id));
    } catch (err) {
      alert('Error eliminando: ' + err);
    }
  };

  return (
    <div className="flex flex-col h-screen text-ink pb-safe bg-paper">
      <PageHeader title="Panel de Administración" />

      {/* Modern Tabs */}
      <div className="flex px-8 border-b-4 border-ink bg-white overflow-x-auto no-scrollbar gap-1 pt-4">
        {tables.map(t => {
          const config = TAB_CONFIG[t] || { label: t, icon: DatabaseIcon };
          const isActive = activeTable === t;
          const IconComponent = config.icon;

          return (
            <button
              key={t}
              onClick={() => setActiveTable(t)}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-t-2xl font-display uppercase tracking-wider transition-all
                ${isActive
                  ? 'bg-ink text-white translate-y-0 shadow-[0_-4px_0_rgba(0,0,0,0.1)]'
                  : 'bg-paper text-ink/40 hover:bg-black/5 translate-y-1'
                }
              `}
            >
              <IconComponent className="w-4 h-4" />
              <span className="font-bold text-sm whitespace-nowrap">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <div className="font-display uppercase tracking-widest opacity-40">Accediendo a la base de datos...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center opacity-30">
            <FolderOffIcon className="w-9 h-9 mb-4" />
            <p className="font-display uppercase tracking-widest">Esta tabla no tiene registros</p>
          </div>
        ) : (
          <Card className="flex-1 p-0! border-width-thick overflow-hidden flex flex-col bg-white">
            <div className="overflow-auto flex-1 no-scrollbar">
              <table className="w-full text-left border-collapse min-w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-ink text-white">
                    {Object.keys(data[0]).map(key => (
                      <th key={key} className="p-4 border-r border-white/10 font-display uppercase text-xs tracking-widest">
                        {key}
                      </th>
                    ))}
                    <th className="p-4 font-display uppercase text-xs tracking-widest text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/10">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors group">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="p-4 border-r border-ink/5 text-sm font-medium">
                          <div className="max-w-md truncate group-hover:max-w-none group-hover:whitespace-normal transition-all">
                            {typeof val === 'object' ? (
                              <pre className="text-[10px] bg-black/5 p-2 rounded leading-tight max-h-32 overflow-auto">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            ) : String(val)}
                          </div>
                        </td>
                      ))}
                      <td className="p-4 text-center">
                        {row.id ? (
                          <Button
                            variant="primary"
                            size="sm"
                            className="bg-danger! border-ink! hover:scale-105 active:scale-95"
                            onClick={() => handleDelete(row.id)}
                          >
                            Eliminar
                          </Button>
                        ) : (
                          <span className="opacity-20">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
