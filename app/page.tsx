import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Zap, Database, BrainCircuit, GitBranch, Blocks } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500/30">
      <header className="h-20 flex items-center justify-between px-6 sm:px-12 border-b-2 border-black sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600"></div>
          <span className="text-2xl font-black tracking-tighter uppercase">Devora.</span>
        </div>
        <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
          <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/chat">
            <Button>
              Launch Portal
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="border-b-2 border-black flex flex-col items-center justify-center py-32 relative bg-slate-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rotate-45 translate-x-32 -translate-y-32 border-2 border-indigo-600/10"></div>
          <div className="container mx-auto relative px-4 sm:px-8 text-center max-w-4xl z-10">
            <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase tracking-[0.15em] w-fit mb-8">
              System Active
            </div>
            <h1 className="text-5xl md:text-[84px] font-bold leading-[0.85] mb-8 tracking-tighter text-slate-900 uppercase">
              Devora <span className="text-indigo-600">+</span><br/>AI.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Your AI Pair Programmer, Available Anytime. Debug code, understand concepts, and build faster with Geometric precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg">
                  Start Using Devora AI
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-b-2 border-black">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "AI Programming Assistant", desc: "Get help with syntax, logic, and architecture from an AI that understands software.", icon: Code },
                { title: "Smart Debugging", desc: "Paste your error logs and code to instantly find the root cause and the fix.", icon: Zap },
                { title: "Code Explanation", desc: "Understand complex codebases step-by-step with tailored explanations.", icon: BrainCircuit },
                { title: "Developer Research", desc: "Instantly fetch NPM packages and GitHub repository metadata.", icon: GitBranch },
                { title: "Conversation Memory", desc: "Devora remembers your project context so you don't have to repeat yourself.", icon: Database },
                { title: "Custom AI Modes", desc: "Switch between Explain, Debug, Build, and Brainstorm modes.", icon: Blocks },
              ].map((feature, i) => (
                <div key={i} className="p-12 border-b-2 border-black md:border-b-0 md:border-r-2 [&:nth-child(3n)]:border-r-0 hover:bg-slate-50 transition-colors flex flex-col group relative">
                  <div className="absolute inset-x-0 bottom-0 border-b-2 border-black md:hidden"></div>
                  {/* Since flex and grid wraps, we might need a better border strategy but let's stick to simple bottom/right borders */}
                  <div className="w-12 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-8 group-hover:shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] transition-all">
                    <feature.icon className="h-6 w-6 text-slate-900 group-hover:text-indigo-600" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-[0.2em]">Feature 0{i + 1}</div>
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="border-b-2 border-black bg-white flex flex-col xl:flex-row">
            <div className="xl:w-1/3 p-12 border-b-2 xl:border-b-0 xl:border-r-2 border-black bg-slate-50 flex flex-col justify-center">
              <h2 className="text-[48px] font-bold tracking-tighter mb-4 leading-none uppercase">Workflow<br/>Protocol</h2>
              <p className="text-slate-600">Three rigid steps to accelerate your development workflow.</p>
            </div>

            <div className="xl:w-2/3 grid grid-cols-1 md:grid-cols-3">
              <div className="p-10 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-indigo-50 transition-colors">
                <div className="text-4xl font-black text-slate-200 mb-6 tracking-tighter">01</div>
                <h3 className="font-bold text-sm leading-tight uppercase mb-2 tracking-wide">Ask</h3>
                <p className="text-slate-600 text-sm">Describe your problem, paste your code, or ask about a specific developer tool in natural language.</p>
              </div>
              <div className="p-10 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-indigo-50 transition-colors">
                <div className="text-4xl font-black text-slate-200 mb-6 tracking-tighter">02</div>
                <h3 className="font-bold text-sm leading-tight uppercase mb-2 tracking-wide">AI Understands</h3>
                <p className="text-slate-600 text-sm">Gemini processes your request along with your selected AI Mode and Programming Level settings.</p>
              </div>
              <div className="p-10 hover:bg-indigo-50 transition-colors">
                <div className="text-4xl font-black text-slate-200 mb-6 tracking-tighter">03</div>
                <h3 className="font-bold text-sm leading-tight uppercase mb-2 tracking-wide">Get Solution</h3>
                <p className="text-slate-600 text-sm">Receive streaming markdown responses, syntax-highlighted code, or live API data instantly.</p>
              </div>
            </div>
        </section>

      </main>

      <footer className="h-auto border-t-2 border-black grid grid-cols-1 md:grid-cols-4 bg-white mt-auto">
        <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-slate-50 transition-colors">
          <div className="text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-[0.2em]">Legal</div>
          <div className="flex flex-col gap-2">
            <Link href="#" className="font-bold text-sm leading-tight uppercase hover:text-indigo-600">Privacy Policy</Link>
            <Link href="#" className="font-bold text-sm leading-tight uppercase hover:text-indigo-600">Terms of Service</Link>
          </div>
        </div>
        <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-slate-50 transition-colors md:col-span-2 flex items-center justify-center">
           <span className="font-bold text-sm uppercase tracking-widest text-slate-400">&copy; {new Date().getFullYear()} Devora AI.</span>
        </div>
        <div className="p-8 bg-black text-white flex items-center justify-between group cursor-pointer hover:bg-indigo-600 transition-colors">
          <span className="text-xs font-black uppercase tracking-[0.2em]">System Status: Online</span>
          <span className="text-xl">&rarr;</span>
        </div>
      </footer>
    </div>
  );
}
