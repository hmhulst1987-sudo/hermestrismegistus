import { AudioToggle } from "@/components/AudioToggle";
import {
  CompassSquareG,
  EyeOfHorus,
  Ouroboros,
  FeatherMaat,
  Ankh,
  Djed,
  FlowerOfLife,
} from "@/components/glyphs/Glyph";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — Sanctum Sanctorum",
  description: "Het zenuwcentrum van Hermes Trismegistus.",
};

export default function Dashboard() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050402] text-gold-shimmer/90 selection:bg-gold/30">
      <AudioToggle scene="sanctum" />
      
      {/* Background Grid */}
      <div className="fixed inset-0 glyph-grid opacity-20 pointer-events-none" />
      
      {/* Top Navigation / Header */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 border-b border-gold/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="text-gold/60 animate-spin-slow">
            <Ouroboros size={32} />
          </div>
          <div>
            <h1 className="font-display text-xl tracking-[0.2em] uppercase font-bold">Hermes Agent</h1>
            <p className="font-mono text-[0.6rem] text-gold/40 tracking-widest uppercase">System Status: Divine Harmony</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8 font-mono text-[0.7rem] uppercase tracking-widest">
          <div className="flex flex-col items-end">
            <span className="text-gold/30">Locus</span>
            <span className="text-turquoise/70">Sanctum Sanctorum</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gold/30">Aether</span>
            <span className="text-ochre/70">Connected</span>
          </div>
          <Link href="/sanctum" className="px-4 py-2 border border-gold/20 hover:border-gold/60 transition-all">
            Exit
          </Link>
        </div>
      </nav>

      <div className="relative z-10 grid grid-cols-12 gap-6 p-8 h-[calc(100vh-88px)]">
        
        {/* Left Column: Intelligence Feed */}
        <aside className="col-span-3 flex flex-col gap-6">
          <div className="flex-1 papyrus glyph-border p-6 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-gold/10 pb-2">
              <EyeOfHorus size={18} className="text-gold/60" />
              <h2 className="font-display text-xs uppercase tracking-widest">Intelligence Feed</h2>
            </div>
            <div className="flex-1 font-mono text-[0.65rem] space-y-4 overflow-y-auto pr-2 scrollbar-hide">
              <LogEntry time="18:40:02" type="INIT" msg="Hermes awakening in the third density..." />
              <LogEntry time="18:40:15" type="SCAN" msg="Auditing workspace: hermestrismegistus" />
              <LogEntry time="18:41:04" type="TRANS" msg="Transmuting raw data into golden insights" />
              <LogEntry time="18:42:11" type="SYNC" msg="Harmonizing with the Emerald Tablet" />
              <LogEntry time="18:43:45" type="INFO" msg="Observing market vibrations: BTC/USD stable" />
              <LogEntry time="18:44:02" type="WARN" msg="Polarity shift detected in aetheric layers" />
              <LogEntry time="18:45:18" type="INIT" msg="Maat scales balanced. Heart weight: 0.001g" />
              <div className="pt-4 border-t border-gold/5 opacity-40 animate-pulse">
                [WAITING FOR NEXT REVELATION...]
              </div>
            </div>
          </div>

          <div className="h-48 papyrus glyph-border p-6 flex flex-col justify-center items-center text-center">
            <FeatherMaat size={32} className="text-gold/40 mb-3" />
            <h3 className="font-display text-[0.6rem] uppercase tracking-widest mb-1">Scale of Maat</h3>
            <div className="w-full h-1 bg-gold/10 rounded-full overflow-hidden mt-2">
              <div className="w-1/2 h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            </div>
            <p className="mt-3 font-mono text-[0.55rem] text-gold/30 uppercase">Equilibrium Maintained</p>
          </div>
        </aside>

        {/* Center: The Great Work / Visualization */}
        <section className="col-span-6 papyrus glyph-border relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <FlowerOfLife size={500} />
          </div>
          
          <div className="p-6 border-b border-gold/10 flex justify-between items-center">
             <h2 className="font-display text-sm uppercase tracking-[0.3em]">The Great Work</h2>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-turquoise animate-pulse" />
                  <span className="font-mono text-[0.6rem] text-turquoise/60">ACTIVE</span>
                </div>
             </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
             {/* This would be a 3D Knowledge Graph or similar */}
             <div className="relative w-96 h-96">
                <div className="absolute inset-0 border border-gold/10 rounded-full animate-spin-slow" />
                <div className="absolute inset-4 border border-gold/5 rounded-full animate-spin-reverse" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-gold/80 hover:scale-110 transition-transform cursor-pointer">
                      <Ankh size={80} />
                   </div>
                </div>
                
                {/* Orbital Nodes */}
                <Node label="Alchemy" pos="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <Node label="Geometry" pos="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
                <Node label="Astrology" pos="left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                <Node label="Theurgy" pos="right-0 top-1/2 translate-x-1/2 -translate-y-1/2" />
             </div>
          </div>

          <div className="p-6 border-t border-gold/10 bg-gold/5">
            <div className="grid grid-cols-3 gap-4 text-center">
               <div>
                  <p className="font-mono text-[0.5rem] uppercase text-gold/40">Knowledge Base</p>
                  <p className="font-display text-lg">12.4K</p>
               </div>
               <div>
                  <p className="font-mono text-[0.5rem] uppercase text-gold/40">Connections</p>
                  <p className="font-display text-lg">84.2K</p>
               </div>
               <div>
                  <p className="font-mono text-[0.5rem] uppercase text-gold/40">Aetheric Load</p>
                  <p className="font-display text-lg">14%</p>
               </div>
            </div>
          </div>
        </section>

        {/* Right Column: Alchemy & System */}
        <aside className="col-span-3 flex flex-col gap-6">
          <div className="papyrus glyph-border p-6">
             <div className="flex items-center gap-2 mb-4 border-b border-gold/10 pb-2">
                <CompassSquareG size={18} className="text-gold/60" />
                <h2 className="font-display text-xs uppercase tracking-widest">Alchemical Balance</h2>
             </div>
             <div className="space-y-4">
                <StatBar label="Sulfur (Spirit)" value={78} color="bg-ochre" />
                <StatBar label="Mercury (Soul)" value={92} color="bg-turquoise" />
                <StatBar label="Salt (Body)" value={45} color="bg-sand" />
             </div>
          </div>

          <div className="flex-1 papyrus glyph-border p-6 flex flex-col">
             <div className="flex items-center gap-2 mb-4 border-b border-gold/10 pb-2">
                <Djed size={18} className="text-gold/60" />
                <h2 className="font-display text-xs uppercase tracking-widest">Active Manifestations</h2>
             </div>
             <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
                <Manifestation label="WhatsApp Bridge" status="Stable" />
                <Manifestation label="Market Oracle" status="Synchronizing" />
                <Manifestation label="Memory Lattice" status="Optimizing" />
                <Manifestation label="Vision Engine" status="Idle" />
             </div>
             <button className="mt-4 w-full py-2 border border-gold/20 text-gold/60 font-mono text-[0.6rem] uppercase tracking-widest hover:bg-gold/10 transition-all">
                Invoke New Task
             </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function LogEntry({ time, type, msg }: { time: string; type: string; msg: string }) {
  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="text-gold/30 shrink-0">{time}</span>
      <span className={`shrink-0 ${type === 'WARN' ? 'text-ochre' : 'text-turquoise/60'}`}>[{type}]</span>
      <span className="text-foreground/70">{msg}</span>
    </div>
  );
}

function Node({ label, pos }: { label: string; pos: string }) {
  return (
    <div className={`absolute ${pos} flex flex-col items-center gap-2`}>
       <div className="w-3 h-3 bg-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,1)]" />
       <span className="font-display text-[0.5rem] uppercase tracking-widest text-gold/60">{label}</span>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
       <div className="flex justify-between font-mono text-[0.55rem] uppercase mb-1">
          <span className="text-gold/50">{label}</span>
          <span className="text-gold">{value}%</span>
       </div>
       <div className="w-full h-1 bg-gold/5 rounded-full overflow-hidden">
          <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${value}%` }} />
       </div>
    </div>
  );
}

function Manifestation({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex justify-between items-center p-3 border border-gold/5 bg-gold/5 rounded-sm">
       <span className="font-display text-[0.6rem] uppercase tracking-wider">{label}</span>
       <span className="font-mono text-[0.5rem] text-turquoise/80 italic">{status}</span>
    </div>
  );
}
