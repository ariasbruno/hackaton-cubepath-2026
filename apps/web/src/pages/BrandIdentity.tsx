// @ts-nocheck
import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { PageTransition } from '../components/layout/PageTransition';
import SettingsIcon from '../components/icons/settings';
import ArrowBackIcon from '../components/icons/arrow-back';
import ArticleIcon from '../components/icons/article';
import TouchAppIcon from '../components/icons/touch-app';
import EditIcon from '../components/icons/edit';
import StarsIcon from '../components/icons/stars';

export const BrandIdentity: React.FC = () => {
  return (
    <PageTransition className="bg-paper pattern-dots p-8 overflow-y-auto h-full selection:bg-primary selection:text-white">
      <div className="max-w-4xl mx-auto flex flex-col gap-16 pb-32">
        {/* Intro */}
        <header className="flex flex-col gap-4 border-b-4 border-ink/5 pb-8">
          <Typography variant="h1" className="text-5xl text-ink uppercase leading-none">
            Brand <span className="text-primary">Identity</span>
          </Typography>
          <Typography variant="p" className="text-ink/60 font-bold uppercase tracking-[0.2em] text-sm">
            Sistema de Diseño "Party Pop" v1.0
          </Typography>
        </header>

        {/* 01. BOTONES */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-3xl uppercase text-ink">01. Botones</Typography>
            <Typography variant="p" className="text-ink/60">
              Nuestros botones utilizan un estilo <strong>Neubrutalista</strong>: bordes redondeados, sombras sólidas y un efecto de "presionado" al interactuar.
            </Typography>
          </div>

          {/* Variantes Principales */}
          <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5">
            <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Variantes de Color</Typography>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2 items-center">
                <Button variant="primary">Principal</Button>
                <span className="text-[10px] font-bold text-ink/30 uppercase">Primary</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button variant="secondary">Información</Button>
                <span className="text-[10px] font-bold text-ink/30 uppercase">Secondary</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button variant="accent">Éxito</Button>
                <span className="text-[10px] font-bold text-ink/30 uppercase">Accent</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button variant="danger">Peligro</Button>
                <span className="text-[10px] font-bold text-ink/30 uppercase">Danger</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button variant="purple">Especial</Button>
                <span className="text-[10px] font-bold text-ink/30 uppercase">Purple</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button variant="yellow">Aviso</Button>
                <span className="text-[10px] font-bold text-ink/30 uppercase">Yellow</span>
              </div>
            </div>
          </div>

          {/* Tamaños */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Jerarquía de Tamaños</Typography>
              <div className="flex flex-col gap-4 items-start">
                <Button size="xl" fullWidth>¡JUGAR AHORA!</Button>
                <Button size="lg">Botón Grande</Button>
                <Button size="md">Botón Normal</Button>
                <Button size="sm">Botón Pequeño</Button>
              </div>
            </div>

            {/* Casos de Uso Especiales */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Casos Especiales</Typography>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <Button variant="ghost" iconOnly>
                    <SettingsIcon className="w-6 h-6" />
                  </Button>
                  <span className="text-xs font-bold text-ink/60 uppercase">Icon Only (Ghost)</span>
                </div>
                <div className="flex gap-4 items-center">
                  <Button variant="paper">
                    <ArrowBackIcon className="w-6 h-6 mr-2" />
                    Volver
                  </Button>
                  <span className="text-xs font-bold text-ink/60 uppercase">Estilo Papel</span>
                </div>
                <div className="flex gap-4 items-center">
                  <Button variant="primary" disabled>
                    Bloqueado
                  </Button>
                  <span className="text-xs font-bold text-ink/60 uppercase">Estado Deshabilitado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guía de Uso */}
          <div className="bg-primary/5 border-l-8 border-primary p-6 rounded-r-card">
            <Typography variant="h4" className="text-primary uppercase mb-2">Cuándo usar cada uno:</Typography>
            <ul className="text-sm space-y-2 text-ink/70 font-bold uppercase tracking-tight">
              <li><span className="text-primary">Primary:</span> Acciones principales como "Iniciar Juego" o "Crear Sala".</li>
              <li><span className="text-secondary">Secondary:</span> Acciones de navegación o información secundaria.</li>
              <li><span className="text-danger">Danger:</span> Votaciones, expulsiones o acciones irreversibles.</li>
              <li><span className="text-ink">Paper:</span> Botones que deben sentirse como objetos físicos (cartas, notas).</li>
            </ul>
          </div>
        </section>

        {/* 02. TIPOGRAFÍAS */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-3xl uppercase text-ink">02. Tipografías</Typography>
            <Typography variant="p" className="text-ink/60">
              Nuestra tipografía combina la amabilidad de las formas redondeadas con la claridad de una sans-serif moderna.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fuentes Principales */}
            <div className="flex flex-col gap-8 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Fuentes Principales</Typography>
              
              {/* Display */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Display / Fredoka One</span>
                <div className="font-display text-4xl text-ink leading-none">Aa Bb Cc Dd</div>
                <p className="text-xs text-ink/40 font-bold uppercase">Títulos, botones gigantes y elementos de impacto.</p>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2 pt-4 border-t border-ink/5">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Body / Nunito</span>
                <div className="font-body text-2xl text-ink">Aa Bb Cc Dd 123</div>
                <p className="text-xs text-ink/40 font-bold uppercase">Cuerpo de texto, nombres de jugadores y descripciones.</p>
              </div>

              {/* Mono */}
              <div className="flex flex-col gap-2 pt-4 border-t border-ink/5">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Mono / Varela Round</span>
                <div className="font-mono text-2xl text-ink font-bold tracking-widest uppercase">CODE: XJ92</div>
                <p className="text-xs text-ink/40 font-bold uppercase">Códigos de sala, temporizadores y datos técnicos.</p>
              </div>
            </div>

            {/* Jerarquía */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5 overflow-hidden">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Jerarquía Visual</Typography>
              <div className="flex flex-col gap-4">
                <Typography variant="h1" className="text-ink uppercase">Título H1</Typography>
                <Typography variant="h2" className="text-ink uppercase">Título H2</Typography>
                <Typography variant="h3" className="text-ink uppercase">Título H3</Typography>
                <Typography variant="h4" className="text-ink uppercase">Título H4</Typography>
                <Typography variant="body" className="text-ink/80">Cuerpo de texto estándar (Body) con interlineado relajado.</Typography>
                <Typography variant="body-sm" className="text-ink/60 uppercase font-bold tracking-wider">Texto pequeño / Metadatos</Typography>
                <Typography variant="mono" className="text-primary font-bold">10:00 - MONO SPACE</Typography>
              </div>
            </div>
          </div>
        </section>

        {/* 03. PATRONES DE FONDO */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-3xl uppercase text-ink">03. Patrones de Fondo</Typography>
            <Typography variant="p" className="text-ink/60">
              Utilizamos texturas sutiles para dar profundidad y un toque "analógico" a las superficies digitales.
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dots */}
            <div className="flex flex-col gap-3">
              <div className="h-40 bg-white rounded-card shadow-hard border-2 border-ink/5 pattern-dots" />
              <div className="px-2">
                <Typography variant="h4" className="text-sm uppercase">Pattern Dots</Typography>
                <Typography variant="body-sm" className="text-[10px] uppercase font-bold">Fondo principal de la App</Typography>
              </div>
            </div>

            {/* Lines */}
            <div className="flex flex-col gap-3">
              <div className="h-40 bg-white rounded-card shadow-hard border-2 border-ink/5 pattern-lines" />
              <div className="px-2">
                <Typography variant="h4" className="text-sm uppercase">Pattern Lines</Typography>
                <Typography variant="body-sm" className="text-[10px] uppercase font-bold">Secciones de información</Typography>
              </div>
            </div>

            {/* Checkers */}
            <div className="flex flex-col gap-3">
              <div className="h-40 bg-secondary rounded-card shadow-hard border-2 border-ink/5 pattern-checkers" />
              <div className="px-2">
                <Typography variant="h4" className="text-sm uppercase">Pattern Checkers</Typography>
                <Typography variant="body-sm" className="text-[10px] uppercase font-bold">Elementos destacados / Épicos</Typography>
              </div>
            </div>

            {/* Checkers Danger */}
            <div className="flex flex-col gap-3">
              <div className="h-40 bg-danger rounded-card shadow-hard border-2 border-ink/5 pattern-checkers-danger" />
              <div className="px-2">
                <Typography variant="h4" className="text-sm uppercase">Checkers Danger</Typography>
                <Typography variant="body-sm" className="text-[10px] uppercase font-bold">Momentos críticos / Infiltrado</Typography>
              </div>
            </div>
          </div>
        </section>

        {/* 04. TARJETAS / CARDS */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-3xl uppercase text-ink">04. Tarjetas / Cards</Typography>
            <Typography variant="p" className="text-ink/60">
              Contenedores que organizan el contenido del juego. Siguen el mismo lenguaje Neubrutalista de bordes redondeados y sombras sólidas.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Variantes de Color */}
            <div className="flex flex-col gap-6">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Variantes de Estilo</Typography>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Solid */}
                <Card variant="solid" color="secondary" className="text-white">
                  <Typography variant="h4" className="uppercase">Tarjeta Solid</Typography>
                  <Typography variant="body-sm" className="text-white/70">Utilizada para estados de éxito o información crítica sobre fondos claros.</Typography>
                </Card>

                {/* Muted */}
                <Card variant="muted" color="primary">
                  <Typography variant="h4" className="uppercase text-primary">Tarjeta Muted</Typography>
                  <Typography variant="body-sm" className="text-primary/60">Utilizada para fondos de secciones o tarjetas secundarias con poco contraste.</Typography>
                </Card>

                {/* Paper */}
                <Card variant="paper" className="border-ink/10">
                  <div className="flex justify-between items-start mb-4">
                    <Typography variant="h4" className="uppercase">Tarjeta Paper</Typography>
                    <ArticleIcon className="w-6 h-6 text-ink/20" />
                  </div>
                  <Typography variant="body-sm">El estándar para la mayoría de los menús y listas. Se siente limpia sobre el patrón de puntos.</Typography>
                </Card>
              </div>
            </div>

            {/* Casos Especiales */}
            <div className="flex flex-col gap-6">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Interactividad y Efectos</Typography>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Pressable */}
                <Card variant="paper" pressable className="border-ink shadow-hard-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-muted text-accent rounded-full flex items-center justify-center">
                      <TouchAppIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <Typography variant="h4" className="uppercase">Interactivas</Typography>
                      <Typography variant="body-sm">Presiona esta tarjeta para ver el efecto de hundimiento.</Typography>
                    </div>
                  </div>
                </Card>

                {/* Sticky Note */}
                <div className="relative pt-4">
                  <div className="absolute top-0 right-8 z-10 bg-danger text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-hard-sm border-2 border-white rotate-12 uppercase">
                    ¡Pista!
                  </div>
                  <Card 
                    variant="sticky" 
                    className="rotate-2 paper-tear border-ink/5 shadow-hard-lg"
                  >
                    <Typography variant="h4" className="uppercase text-ink/80 mb-2">Sticky Note</Typography>
                    <Typography variant="body" className="text-ink/60 italic leading-snug">
                      "El efecto 'paper-tear' en la parte inferior le da un toque analógico de nota arrancada."
                    </Typography>
                    <div className="mt-4 flex justify-end">
                       <EditIcon className="w-8 h-8 text-ink/10" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05. AVATARES */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-3xl uppercase text-ink">05. Avatares</Typography>
            <Typography variant="p" className="text-ink/60">
              Representación visual de los jugadores. Utilizan iconos de animales con fondos de colores vibrantes y bordes suaves.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tamaños de Avatar */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Jerarquía de Tamaños</Typography>
              <div className="flex items-end gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <Avatar avatarId="noto--fox" size="2xl" bgColor="#4D9DE0" />
                  <span className="text-[10px] font-bold uppercase text-ink/40">2xl (128px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar avatarId="noto--bear" size="xl" bgColor="#FF8C42" />
                  <span className="text-[10px] font-bold uppercase text-ink/40">xl (80px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar avatarId="noto--cat-face" size="lg" bgColor="#87C38F" />
                  <span className="text-[10px] font-bold uppercase text-ink/40">lg (56px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar avatarId="noto--frog" size="md" bgColor="#E63946" />
                  <span className="text-[10px] font-bold uppercase text-ink/40">md (48px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar avatarId="noto--panda" size="sm" bgColor="#9D4EDD" />
                  <span className="text-[10px] font-bold uppercase text-ink/40">sm (32px)</span>
                </div>
              </div>
            </div>

            {/* Variantes y Estados */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Variantes y Badges</Typography>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Avatar 
                    avatarId="noto--lion" 
                    size="xl" 
                    bgColor="#FFD166"
                    badge={
                      <div className="bg-primary text-white p-2 rounded-full border-4 border-white shadow-hard-sm">
                        <StarsIcon className="w-4 h-4" />
                      </div>
                    } 
                  />
                  <div className="flex flex-col">
                    <Typography variant="h4" className="uppercase">Con Badge</Typography>
                    <Typography variant="body-sm">Utilizado para el líder de sala o el ganador.</Typography>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                    <Avatar avatarId="noto--bear" size="md" bgColor="#FF8C42" borderColor="border-white" className="shadow-hard-sm" />
                    <Avatar avatarId="noto--fox" size="md" bgColor="#4D9DE0" borderColor="border-white" className="shadow-hard-sm" />
                    <Avatar avatarId="noto--frog" size="md" bgColor="#87C38F" borderColor="border-white" className="shadow-hard-sm" />
                    <div className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center border-2 border-white font-bold text-xs shadow-hard-sm z-10">
                      +5
                    </div>
                  </div>
                  <div className="flex flex-col pl-4">
                    <Typography variant="h4" className="uppercase">Avatar Group</Typography>
                    <Typography variant="body-sm">Para listas de jugadores en el lobby.</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06. INPUTS / CAMPOS DE TEXTO */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-3xl uppercase text-ink">06. Inputs / Campos de Texto</Typography>
            <Typography variant="p" className="text-ink/60">
              Nuestros campos de entrada están diseñados para ser claros y fáciles de usar, con un estilo visual coherente con el resto de la interfaz.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Variantes de Input */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Estados y Variantes</Typography>
              <div className="flex flex-col gap-6">
                <Input label="Apodo del Jugador" placeholder="Ej. El Pro" fullWidth />
                <Input label="Código de Sala" placeholder="AAAA-BBBB" fullWidth defaultValue="KJ92-PX8" />
                <Input label="Email (con error)" placeholder="correo@ejemplo.com" fullWidth error="El formato del correo no es válido" />
              </div>
            </div>

            {/* Guía de Estilo de Input */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-card shadow-hard border-2 border-ink/5 overflow-hidden">
              <Typography variant="h4" className="uppercase text-sm tracking-widest text-ink/40">Guía de Estilo</Typography>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Bordes y Sombras</span>
                  <p className="text-sm text-ink/70">Bordes gruesos de 4px en color <strong>Ink</strong> y una sombra interna (<strong>shadow-inner-hard</strong>) para dar sensación de profundidad.</p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t border-ink/5">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Feedback Visual</span>
                  <p className="text-sm text-ink/70">Al hacer foco (<strong>focus</strong>), el input muestra un anillo de color <strong>Primary</strong> con opacidad reducida.</p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t border-ink/5">
                  <span className="text-[10px] font-bold text-danger uppercase tracking-widest">Estados de Error</span>
                  <p className="text-sm text-ink/70">En caso de error, el borde cambia a color <strong>Danger</strong> y se muestra un mensaje descriptivo debajo del campo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};
