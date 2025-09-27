"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, Shield, LineChart, Zap, Wallet, ChevronRight, Cpu, Bot } from "lucide-react";
import { Boxes } from "@/components/ui/background-boxes";
import { SparklesText } from "@/components/ui/sparkles-text";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <GridBackground />
      <NavBar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <InteractiveDemo />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function NavBar() {
  const [connected, setConnected] = useState(false);
  const [address] = useState("0xA1b2...9C3F");
  return (
    <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-emerald-400" />
            <span className="font-semibold tracking-tight">NovaNet</span>
            <Badge className="ml-1" variant="secondary">web3</Badge>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="#features">Features</a>
            <a className="hover:text-foreground transition-colors" href="#demo">Demo</a>
            <a className="hover:text-foreground transition-colors" href="#docs">Docs</a>
            <a className="hover:text-foreground transition-colors" href="#community">Community</a>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bot className="size-5" />
                    <span className="sr-only">AI Assistant</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Proactive AI Assistant</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={() => setConnected((v) => !v)} className="gap-2">
              <Wallet className="size-4" />
              {connected ? address : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <Boxes />
      </div>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <Badge variant="secondary" className="gap-2 w-fit">
            <Sparkles className="size-4 text-indigo-500" /> Proactive AI for Web3
          </Badge>
          <h1 className="text-4xl leading-tight font-semibold md:text-6xl md:leading-[1.1]">
            Trade ahead of the market with a <SparklesText>proactive AI</SparklesText> co-pilot
          </h1>
          <p className="text-muted-foreground text-lg max-w-prose">
            NovaNet watches chains, mempools, and social signals in real-time to anticipate moves before they happen. Get automated strategies, alerts, and insights that act proactively, not reactively.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="group">
              Launch App <ChevronRight className="ml-1 size-4 transition -translate-x-0 group-hover:translate-x-0.5" />
            </Button>
            <Button variant="secondary">Read Whitepaper</Button>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Shield className="size-4" /> Audited Agents</div>
            <div className="flex items-center gap-2"><Zap className="size-4" /> Millisecond Alerts</div>
            <div className="flex items-center gap-2"><LineChart className="size-4" /> On-chain Alpha</div>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-border bg-card/60 p-4 md:p-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_80%_-10%,rgba(99,102,241,0.25),transparent_50%),radial-gradient(800px_300px_at_20%_120%,rgba(236,72,153,0.2),transparent_50%)]" />
        <div className="relative grid gap-4">
          <MiniChart title="ETH/USD" color="#6366f1" />
          <MiniChart title="BTC Dominance" color="#22c55e" />
          <SignalCard />
        </div>
      </motion.div>
    </div>
  );
}

function MiniChart({ title, color }: { title: string; color: string }) {
  const path = useMemo(() => randomPath(), []);
  return (
    <Card className="bg-background/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          {title}
          <span className="text-xs font-normal text-muted-foreground">实时</span>
        </CardTitle>
        <CardDescription>Proactive AI monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 100 36" className="h-24 w-full">
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={path} fill={`url(#grad-${title})`} stroke="none" />
          <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
      </CardContent>
    </Card>
  );
}

function SignalCard() {
  return (
    <Card className="bg-background/70 border-emerald-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Cpu className="size-4 text-emerald-500" /> Proactive Signal
        </CardTitle>
        <CardDescription>AI generated entry window</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Long ETH</div>
          <div className="text-sm text-muted-foreground">Confidence 87%</div>
        </div>
        <Button className="gap-2">
          Mirror Trade <ChevronRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function Features() {
  const items = [
    {
      icon: <LineChart className="size-5" />,
      title: "AI-Powered Analytics",
      text: "Multi-chain inference over mempool, DEX, and NFT flows for predictive alpha.",
    },
    {
      icon: <Zap className="size-5" />,
      title: "Automated Strategies",
      text: "Deploy agentic strategies that execute ahead of time with guardrails.",
    },
    {
      icon: <Shield className="size-5" />,
      title: "Smart Risk Controls",
      text: "Built-in limits, anomaly detection, and circuit breakers for safety.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-semibold">Built for on-chain speed</h2>
        <p className="text-muted-foreground mt-3">Everything you need to act before the market does.</p>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {items.map((f) => (
          <Card key={f.title} className="group relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-foreground/[0.02]" />
            <CardHeader>
              <div className="mb-2 inline-flex items-center justify-center rounded-lg bg-secondary p-2 text-primary">
                {f.icon}
              </div>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-400"
                  initial={{ x: "-100%" }}
                  whileInView={{ x: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function InteractiveDemo() {
  return (
    <section id="demo" className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="grid gap-6 md:grid-cols-2">
        <AIPredictionWidget />
        <StrategyPlayground />
      </div>
    </section>
  );
}

function AIPredictionWidget() {
  const [risk, setRisk] = useState([60]);
  const [horizon, setHorizon] = useState("24h");
  const predicted = useMemo(() => {
    const base = horizon === "1h" ? 0.6 : horizon === "24h" ? 1.9 : 4.2;
    const adj = (risk[0] / 100) * base * 1.2;
    return { roi: (base + adj).toFixed(2), conf: Math.min(98, 55 + risk[0] / 1.8).toFixed(0) };
  }, [risk, horizon]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="size-5 text-indigo-500" /> Proactive AI Prediction</CardTitle>
        <CardDescription>Simulated inference. Move the controls and see how the AI adapts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Time horizon</label>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select horizon" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1h scalp</SelectItem>
                <SelectItem value="24h">24h swing</SelectItem>
                <SelectItem value="7d">7d position</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Risk level: {risk[0]}%</label>
            <Slider value={risk} onValueChange={setRisk} max={100} step={1} className="w-full" />
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <Metric label="Projected ROI" value={`${predicted.roi}%`} hint="Annualized estimate based on on-chain regimes." />
            <Metric label="Confidence" value={`${predicted.conf}%`} hint="Blend of price, flow, and sentiment models." />
            <Metric label="Latency" value="~180ms" hint="Streaming inference from edge workers." />
          </div>
          <div className="pt-2">
            <Sparkline className="h-24" color="#a78bfa" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StrategyPlayground() {
  const [tab, setTab] = useState("alpha");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Playground</CardTitle>
        <CardDescription>Preview agent behaviors across chains.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alpha">Alpha</TabsTrigger>
            <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>
          <TabsContent value="alpha">
            <PlaygroundCard
              title="Momentum + Flow"
              imageUrl="https://images.unsplash.com/photo-1647725790351-4d0c6781f7ee?q=80&w=1470&auto=format&fit=crop"
              bullets={["DEX inflow surge", "NFT floor uptick", "Positive funding"]}
            />
          </TabsContent>
          <TabsContent value="arbitrage">
            <PlaygroundCard
              title="Triangular DEX Arb"
              imageUrl="https://images.unsplash.com/photo-1542228262-3d663b306a56?q=80&w=1470&auto=format&fit=crop"
              bullets={["Price skew > 0.8%", "Slippage < 0.2%", "Gas < 40 gwei"]}
            />
          </TabsContent>
          <TabsContent value="safety">
            <PlaygroundCard
              title="Anomaly Guardrails"
              imageUrl="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1470&auto=format&fit=crop"
              bullets={["Circuit breaker", "Depeg detector", "Reorg awareness"]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PlaygroundCard({ title, imageUrl, bullets }: { title: string; imageUrl: string; bullets: string[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 items-center">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-secondary">
        <img alt={title} src={imageUrl} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      <div className="space-y-3">
        <h4 className="text-xl font-semibold">{title}</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500" /> {b}
            </li>
          ))}
        </ul>
        <div className="pt-2 flex gap-3">
          <Button className="gap-2">
            Simulate <ChevronRight className="size-4" />
          </Button>
          <Button variant="secondary">Export Agent</Button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        {label}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function Sparkline({ className, color = "#22c55e" }: { className?: string; color?: string }) {
  const path = useMemo(() => randomPath(100, 36, 0.6), []);
  return (
    <svg viewBox="0 0 100 36" className={className}>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(800px_200px_at_10%_-10%,rgba(59,130,246,0.25),transparent_50%),radial-gradient(800px_200px_at_90%_120%,rgba(236,72,153,0.25),transparent_50%)]" />
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-2xl md:text-4xl font-semibold">Ready to trade with a proactive AI?</h3>
            <p className="text-muted-foreground mt-2">Join early access and get priority to new agent capabilities.</p>
          </div>
          <div className="flex md:justify-end gap-3">
            <Button className="gap-2">Get Early Access <ChevronRight className="size-4" /></Button>
            <Button variant="secondary">View Roadmap</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="size-5 rounded-md bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-emerald-400" />
            <span>© {new Date().getFullYear()} NovaNet AI</span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-6">
            <a id="docs" className="hover:text-foreground" href="#">Docs</a>
            <a id="community" className="hover:text-foreground" href="#">Community</a>
            <a className="hover:text-foreground" href="#">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2068&auto=format&fit=crop')] opacity-[0.06] bg-cover bg-center" />
      <motion.div
        className="absolute -inset-[20%] bg-[conic-gradient(from_0deg,rgba(99,102,241,0.15),rgba(236,72,153,0.15),rgba(16,185,129,0.15),rgba(99,102,241,0.15))] blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,transparent_95%,var(--border)_95%),linear-gradient(to_bottom,transparent,transparent_95%,var(--border)_95%)] bg-[size:20px_20px] opacity-40" />
    </div>
  );
}

function randomPath(width = 100, height = 36, volatility = 1) {
  let d = "M 0 " + (height / 2).toFixed(2);
  let y = height / 2;
  for (let x = 0; x <= width; x += 4) {
    y += (Math.random() - 0.5) * volatility * 2;
    y = Math.max(2, Math.min(height - 2, y));
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += ` L ${width} ${height} L 0 ${height} Z`;
  return d;
}