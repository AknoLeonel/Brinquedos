import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Calendar, MapPin, X, ArrowRight, Star, Heart, CheckCircle, PartyPopper, Smile, Music, Gamepad2, ChevronRight, Trophy, Play, RotateCcw } from 'lucide-react';

// --- DATA ---
const TOYS = [
  {
    id: 1,
    name: "Castelo das Nuvens",
    category: "Pular & Brincar",
    price: 150,
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-600",
    button: "bg-blue-500",
    icon: "🏰",
    rotate: "rotate-1"
  },
  {
    id: 2,
    name: "Pista Veloz",
    category: "Velocidade",
    price: 80,
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-600",
    button: "bg-red-500",
    icon: "🏎️",
    rotate: "-rotate-1"
  },
  {
    id: 3,
    name: "Laboratório Jr.",
    category: "Ciência",
    price: 60,
    bg: "bg-green-100",
    border: "border-green-400",
    text: "text-green-600",
    button: "bg-green-500",
    icon: "🧪",
    rotate: "rotate-2"
  },
  {
    id: 4,
    name: "Arena Gamer",
    category: "Eletrônicos",
    price: 200,
    bg: "bg-purple-100",
    border: "border-purple-400",
    text: "text-purple-600",
    button: "bg-purple-500",
    icon: "🎮",
    rotate: "-rotate-2"
  }
];

const STEPS = [
  { icon: "📱", title: "Escolha", desc: "No celular mesmo!" },
  { icon: "🚚", title: "Receba", desc: "A gente leva até você." },
  { icon: "🎉", title: "Brinque", desc: "O fim de semana todo." },
  { icon: "👋", title: "Devolva", desc: "Buscamos na segunda." },
];

const TESTIMONIALS = [
  { name: "Maria (Mãe do Pedro)", text: "Salvação das férias! O Pedro amou o Pula-pula.", stars: 5 },
  { name: "João (Pai da Sofia)", text: "O atendimento no Zap foi super rápido. Recomendo!", stars: 5 },
];

// --- GAME COMPONENT: SNAKE ---
const GRID_SIZE = 15;
const SPEED = 150;

const SnakeGame = ({ onClose }) => {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const newHead = { ...prev[0] };
        
        if (direction === 'RIGHT') newHead.x += 1;
        if (direction === 'LEFT') newHead.x -= 1;
        if (direction === 'UP') newHead.y -= 1;
        if (direction === 'DOWN') newHead.y += 1;

        // Check Collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        // Eat Food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(moveSnake);
  }, [direction, food, gameOver, isPaused]);

  // Controls
  const handleDirection = (dir) => {
    if (gameOver) return;
    // Prevent reverse direction
    if (dir === 'UP' && direction === 'DOWN') return;
    if (dir === 'DOWN' && direction === 'UP') return;
    if (dir === 'LEFT' && direction === 'RIGHT') return;
    if (dir === 'RIGHT' && direction === 'LEFT') return;
    setDirection(dir);
  };

  const restart = () => {
    setSnake([{ x: 7, y: 7 }]);
    setScore(0);
    setGameOver(false);
    setDirection('RIGHT');
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="bg-purple-600 p-2 rounded-[2.5rem] shadow-2xl border-4 border-purple-800 w-full max-w-md relative overflow-hidden">
        {/* Game Case Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2 text-white">
            <Gamepad2 /> <span className="font-black tracking-widest">SNAKE.IO</span>
          </div>
          <button onClick={onClose} className="bg-purple-800 p-2 rounded-full text-white hover:bg-purple-900"><X size={20}/></button>
        </div>

        {/* Screen */}
        <div className="bg-[#9cba7f] rounded-2xl p-4 border-4 border-black/20 shadow-inner relative mx-2 mb-4 aspect-square">
          {/* Pixel Grid Layer (Optional visual) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {gameOver && (
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
               <h3 className="text-4xl font-black text-white mb-2 drop-shadow-md">GAME OVER</h3>
               <p className="text-white font-bold mb-4">Score: {score}</p>
               <button onClick={restart} className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 flex gap-2">
                 <RotateCcw /> TENTAR DE NOVO
               </button>
             </div>
          )}

          <div className="grid h-full w-full relative" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
            {/* Snake */}
            {snake.map((segment, i) => (
              <div 
                key={i} 
                className="bg-black rounded-sm border border-[#9cba7f]"
                style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1 }}
              />
            ))}
            {/* Food */}
            <div 
              className="bg-red-500 rounded-full animate-bounce"
              style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}
            >🍎</div>
          </div>
          
          <div className="absolute top-2 left-2 font-mono font-bold text-[#3d4c2f]">SCORE: {score}</div>
        </div>

        {/* Controls */}
        <div className="bg-purple-700 rounded-b-[2rem] p-4 flex flex-col items-center gap-4">
           <div className="grid grid-cols-3 gap-2 w-48">
              <div></div>
              <button onClick={() => handleDirection('UP')} className="h-14 bg-gray-200 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 flex items-center justify-center shadow-lg"><ArrowRight className="-rotate-90 text-gray-600" /></button>
              <div></div>
              <button onClick={() => handleDirection('LEFT')} className="h-14 bg-gray-200 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 flex items-center justify-center shadow-lg"><ArrowRight className="rotate-180 text-gray-600" /></button>
              <button onClick={() => handleDirection('DOWN')} className="h-14 bg-gray-200 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 flex items-center justify-center shadow-lg"><ArrowRight className="rotate-90 text-gray-600" /></button>
              <button onClick={() => handleDirection('RIGHT')} className="h-14 bg-gray-200 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 flex items-center justify-center shadow-lg"><ArrowRight className="text-gray-600" /></button>
           </div>
           <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Vanguarda Arcade</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- VISUAL COMPONENTS ---

const SkyBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#e0f7fa] overflow-hidden pointer-events-none">
    <motion.div 
      animate={{ scale: [1, 1.1, 1], rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-yellow-400 rounded-full border-8 border-yellow-200 opacity-80"
    />
    {[1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        initial={{ x: -200 }}
        animate={{ x: "120vw" }}
        transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear", delay: i * 2 }}
        className={`absolute rounded-full bg-white opacity-60 ${i % 2 === 0 ? 'top-20 h-16 w-32' : 'top-40 h-24 w-48'}`}
        style={{ top: `${10 + i * 15}%` }}
      />
    ))}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#22d3ee 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
  </div>
);

const BouncingLoader = ({ onComplete }) => {
  useEffect(() => { const timer = setTimeout(onComplete, 2000); return () => clearTimeout(timer); }, []);
  return (
    <motion.div className="fixed inset-0 z-[9999] bg-yellow-400 flex flex-col items-center justify-center">
      <motion.div animate={{ y: [-20, 0, -20], scaleY: [1, 0.8, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-6xl mb-4">🎈</motion.div>
      <h2 className="text-white font-black text-2xl tracking-wider uppercase">Preparando a festa...</h2>
    </motion.div>
  );
};

// --- UI COMPONENTS ---

const Header = () => (
  <header className="fixed top-0 w-full z-40 px-4 py-4">
    <div className="bg-white/90 backdrop-blur-md border-b-4 border-black/5 rounded-3xl px-4 md:px-6 py-3 flex justify-between items-center shadow-lg mx-auto max-w-6xl">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] border-2 border-black">V</div>
        <span className="font-black text-xl tracking-tight text-gray-800 hidden md:block">VANGUARDA <span className="text-red-500">KIDS</span></span>
      </div>
      <div className="flex gap-2 md:gap-3">
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-3 md:px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all text-xs md:text-sm">Clube</button>
        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-3 md:px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all text-xs md:text-sm">Entrar</button>
      </div>
    </div>
  </header>
);

const ToyCard = ({ toy, onClick }) => (
  <motion.div
    layoutId={`card-${toy.id}`} onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
    className={`relative group cursor-pointer ${toy.bg} rounded-[2rem] border-4 ${toy.border} p-6 h-[400px] flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,0.1)] transition-all overflow-hidden ${toy.rotate}`}
  >
    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white rounded-full opacity-30" />
    <div className="relative z-10">
      <span className={`inline-block px-3 py-1 bg-white rounded-full text-xs font-bold ${toy.text} border-2 ${toy.border} mb-3 shadow-sm`}>{toy.category}</span>
      <h3 className={`text-3xl font-black ${toy.text} leading-tight`}>{toy.name}</h3>
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-9xl drop-shadow-md filter grayscale-[0.2] group-hover:grayscale-0 transition-all transform scale-110 group-hover:scale-125">{toy.icon}</motion.div>
    </div>
    <div className="relative z-10 flex justify-between items-end bg-white/60 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/50">
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase">Final de Semana</p>
        <p className="text-2xl font-black text-gray-800">R$ {toy.price}</p>
      </div>
      <div className={`w-10 h-10 ${toy.button} rounded-full flex items-center justify-center text-white border-2 border-black shadow-[2px_2px_0px_black]`}><ShoppingBag size={18} /></div>
    </div>
  </motion.div>
);

const BookingModal = ({ toy, onClose }) => {
  const [step, setStep] = useState(1);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div layoutId={`card-${toy.id}`} className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-black">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-20 border-2 border-black transition-colors"><X size={20} className="text-black" /></button>
        <div className={`h-32 ${toy.bg} relative overflow-hidden flex items-center px-8 border-b-4 border-black`}>
           <div className="text-6xl mr-4">{toy.icon}</div>
           <div><h2 className={`text-3xl font-black ${toy.text}`}>{toy.name}</h2><p className="text-gray-600 font-bold opacity-70">Vamos brincar?</p></div>
        </div>
        <div className="p-8">
          {step === 1 ? (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><Calendar className="text-blue-500" /> Que dia a festa começa?</h3>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {['Sexta a Domingo (Promo!)', 'Somente Sábado', 'Escolher Data'].map((opt, i) => (
                  <button key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-yellow-50 border-2 border-gray-200 hover:border-yellow-400 transition-all text-left">
                    <span className="font-bold text-gray-600 group-hover:text-gray-900">{opt}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:bg-yellow-400 group-hover:border-black transition-all"></div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full py-4 bg-green-500 text-white font-black text-lg rounded-2xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all shadow-lg">CONTINUAR</button>
            </motion.div>
          ) : (
             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center py-6">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 border-4 border-yellow-300"><PartyPopper size={48} /></div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Pedido Criado!</h3>
                <p className="text-gray-500 mb-8 font-medium">O papai ou a mamãe receberá um Zap da nossa equipe agora mesmo.</p>
                <button onClick={onClose} className="w-full py-4 bg-blue-500 text-white font-black text-lg rounded-2xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all shadow-lg">OBA! FECHAR</button>
             </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [selectedToy, setSelectedToy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen font-sans selection:bg-yellow-300 selection:text-black">
      <AnimatePresence>
        {loading && <BouncingLoader onComplete={() => setLoading(false)} />}
        {isGameOpen && <SnakeGame onClose={() => setIsGameOpen(false)} />}
      </AnimatePresence>
      <SkyBackground />
      <Header />

      <main className="relative z-10 pt-32 pb-20 px-4 max-w-6xl mx-auto flex flex-col items-center">
        {/* HERO */}
        <div className="text-center mb-16 max-w-3xl">
          <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }} className="inline-block bg-yellow-300 text-yellow-800 px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider mb-6 border-2 border-yellow-500 shadow-[4px_4px_0px_rgba(234,179,8,1)] transform -rotate-2">Formosa do Rio Preto</motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight mb-6 drop-shadow-sm">A DIVERSÃO <br/> <span className="text-blue-500 relative inline-block">CHEGOU<svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg></span> NA CIDADE!</h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium mb-10 max-w-lg mx-auto">Alugue brinquedos incríveis para o final de semana. Pula-pulas, videogames e muito mais!</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center w-full md:w-auto">
             <button onClick={() => document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-red-500 text-white font-black text-lg rounded-2xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all shadow-xl flex items-center justify-center gap-2 hover:bg-red-400">VER BRINQUEDOS <ArrowRight size={24} /></button>
             <button onClick={() => setIsGameOpen(true)} className="px-8 py-4 bg-white text-gray-800 font-bold text-lg rounded-2xl border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"><Gamepad2 className="text-purple-500" /> JOGAR AGORA</button>
          </div>
        </div>

        {/* ARCADE BANNER (CALL TO ACTION) */}
        <div className="w-full bg-yellow-400 -skew-y-2 py-8 mb-20 shadow-lg border-y-4 border-yellow-600 overflow-hidden relative group cursor-pointer" onClick={() => setIsGameOpen(true)}>
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }}></div>
           <div className="skew-y-2 max-w-6xl mx-auto px-6 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-yellow-400 animate-pulse"><Gamepad2 size={32}/></div>
                 <div>
                    <h3 className="text-2xl font-black text-black leading-tight uppercase">Arcade Vanguarda</h3>
                    <p className="font-bold text-yellow-800">Jogue a cobrinha e divirta-se!</p>
                 </div>
              </div>
              <div className="bg-white px-6 py-2 rounded-full font-black border-2 border-black shadow-[4px_4px_0px_black] group-hover:scale-105 transition-transform flex items-center gap-2">PLAY <Play size={16} fill="black"/></div>
           </div>
        </div>

        {/* COMO FUNCIONA */}
        <div className="w-full mb-24">
           <div className="text-center mb-12">
             <span className="text-blue-500 font-black tracking-widest uppercase text-sm mb-2 block">Passo a Passo</span>
             <h2 className="text-4xl font-black text-gray-800">É Muito Fácil Brincar</h2>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STEPS.map((step, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border-4 border-gray-100 text-center relative hover:-translate-y-2 transition-transform">
                   <div className="text-5xl mb-4 bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">{step.icon}</div>
                   <div className="absolute top-0 right-0 w-8 h-8 bg-black text-white font-bold rounded-bl-xl rounded-tr-[1.5rem] flex items-center justify-center">{idx + 1}</div>
                   <h3 className="font-black text-xl mb-1 text-gray-800">{step.title}</h3>
                   <p className="text-gray-500 text-sm font-medium leading-tight">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* CATALOGO */}
        <div id="catalogo" className="w-full mb-24">
          <div className="flex justify-between items-end mb-8 px-2">
             <h2 className="text-3xl font-black text-gray-800">Nossos Brinquedos<div className="h-2 w-24 bg-blue-400 mt-2 rounded-full"></div></h2>
             <div className="hidden md:flex gap-2"><span className="w-3 h-3 bg-red-400 rounded-full animate-bounce"></span><span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100"></span><span className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-200"></span></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOYS.map((toy) => <ToyCard key={toy.id} toy={toy} onClick={() => setSelectedToy(toy)} />)}
          </div>
        </div>

        {/* DEPOIMENTOS */}
        <div className="w-full mb-24 bg-blue-50 rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-4 border-blue-100">
           <div className="text-center mb-10 relative z-10">
              <h2 className="text-3xl font-black text-blue-900">Quem já brincou, amou!</h2>
           </div>
           <div className="grid md:grid-cols-2 gap-6 relative z-10">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-sm flex flex-col gap-3">
                   <div className="flex text-yellow-400">{[...Array(t.stars)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                   <p className="text-gray-600 font-medium italic">"{t.text}"</p>
                   <p className="font-bold text-blue-500 text-sm mt-auto">- {t.name}</p>
                </div>
              ))}
           </div>
           {/* Decorative Blobs */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200 rounded-full opacity-30 translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* CLUB BANNER */}
        <div className="w-full bg-purple-500 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden border-b-8 border-purple-700 shadow-xl mx-4">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                 <h3 className="text-3xl md:text-5xl font-black mb-4">Clube de Assinatura</h3>
                 <p className="text-purple-100 font-bold text-lg max-w-md">Brinquedo novo toda semana sem ocupar espaço na sua casa!</p>
              </div>
              <button className="px-8 py-4 bg-yellow-400 text-purple-900 font-black text-xl rounded-2xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all shadow-lg whitespace-nowrap">QUERO PARTICIPAR</button>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full opacity-50 -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600 rounded-full opacity-50 translate-y-1/2 -translate-x-1/2" />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t-4 border-gray-100 py-12 relative z-10">
         <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="font-black text-gray-300 text-2xl mb-4">VANGUARDA KIDS</p>
            <div className="flex justify-center gap-6 mb-8">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 hover:scale-110 transition-transform cursor-pointer"><span className="text-xl">📷</span></div>
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 hover:scale-110 transition-transform cursor-pointer"><span className="text-xl">💬</span></div>
            </div>
            <p className="text-gray-400 text-sm font-bold">Feito com muito ❤️ em Formosa do Rio Preto</p>
         </div>
      </footer>

      <AnimatePresence>
        {selectedToy && <BookingModal toy={selectedToy} onClose={() => setSelectedToy(null)} />}
      </AnimatePresence>
    </div>
  );
}