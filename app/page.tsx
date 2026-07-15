"use client";

import React, { useState, useEffect } from "react";
import {
LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
PieChart, Pie, Cell
} from "recharts";
import {
LayoutDashboard, Workflow, Activity, Database, Settings, Bell, Search,
ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, Zap, TerminalSquare, LogOut
} from "lucide-react";

// Fallback data in case the FastAPI backend is offline
const defaultPerformance = [
{ name: "Mon", requests: 4000, latency: 240, errors: 24 },
{ name: "Tue", requests: 3000, latency: 139, errors: 13 },
{ name: "Wed", requests: 2000, latency: 980, errors: 45 },
{ name: "Thu", requests: 2780, latency: 390, errors: 28 },
];
const defaultModelUsage = [
{ name: "Claude 3.5 Sonnet", value: 75 },
{ name: "Claude 3 Opus", value: 25 },
];
const defaultActivity = [
{ id: 1, task: "Backend Disconnected", status: "processing", time: "Just now", model: "System" }
];
const defaultWorkflows = [
{ name: "Awaiting Data", calls: "0", success: "0%", trend: "+0%" }
];

const COLORS = ["#6366f1", "#8b5cf6", "#3f3f46"];

export default function Dashboard() {
const [performanceData, setPerformanceData] = useState(defaultPerformance);
const [modelUsageData, setModelUsageData] = useState(defaultModelUsage);
const [recentActivity, setRecentActivity] = useState(defaultActivity);
const [topWorkflows, setTopWorkflows] = useState(defaultWorkflows);
const [isLoading, setIsLoading] = useState(true);

// Fetch real data from FastAPI backend
useEffect(() => {
fetch("https://ai-automation-platform-six.vercel.app/api/stats")
.then((res) => res.json())
.then((data) => {
setPerformanceData(data.performanceData);
setModelUsageData(data.modelUsageData);
setRecentActivity(data.recentActivity);
setTopWorkflows(data.topWorkflows);
setIsLoading(false);
})
.catch((err) => {
console.error("Failed to fetch backend data. Make sure FastAPI is running on port 8000.", err);
setIsLoading(false);
});
}, []);

return (
<div className="flex h-screen bg-[#09090b] text-zinc-300 font-sans overflow-hidden">
{/* SIDEBAR */}
<aside className="w-64 flex-shrink-0 border-r border-white/5 bg-[#09090b] flex flex-col justify-between hidden md:flex">
<div>
<div className="h-16 flex items-center px-6 border-b border-white/5">
<Zap className="w-5 h-5 text-indigo-500 mr-2" />
<span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
AiFlow
</span>
</div>
<nav className="p-4 space-y-1">
<p className="px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 mt-4">Overview</p>
<a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white/[0.04] text-zinc-100">
<LayoutDashboard className="w-4 h-4 mr-3 text-indigo-400" /> Dashboard
</a>
<a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-100 transition-colors">
<Workflow className="w-4 h-4 mr-3" /> Workflows
</a>
<a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-100 transition-colors">
<Activity className="w-4 h-4 mr-3" /> Executions
</a>
<p className="px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 mt-6">Configuration</p>
<a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-100 transition-colors">
<Database className="w-4 h-4 mr-3" /> Integrations
</a>
<a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-100 transition-colors">
<TerminalSquare className="w-4 h-4 mr-3" /> API Keys
</a>
<a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-100 transition-colors">
<Settings className="w-4 h-4 mr-3" /> Settings
</a>
</nav>
</div>
<div className="p-4 border-t border-white/5">
<div className="flex items-center w-full p-2 rounded-md hover:bg-white/[0.02] transition-colors cursor-pointer">
<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-medium text-white shadow-inner">
SM
</div>
<div className="ml-3 flex-1 overflow-hidden">
<p className="text-sm font-medium text-zinc-200 truncate">Syed Muizur</p>
<p className="text-xs text-zinc-500 truncate">Admin</p>
</div>
<LogOut className="w-4 h-4 text-zinc-500" />
</div>
</div>
</aside>

{/* MAIN CONTENT */}
<main className="flex-1 flex flex-col overflow-hidden relative">
<header className="h-16 flex-shrink-0 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
<div className="flex items-center flex-1">
<h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
Overview {isLoading && <span className="text-xs text-indigo-400 ml-3 animate-pulse">(Syncing...)</span>}
</h1>
</div>
<div className="flex items-center space-x-4">
<div className="relative group">
<Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
<input type="text" placeholder="Search workflows..." className="bg-zinc-900/50 border border-white/10 text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-zinc-200 placeholder-zinc-500 w-64" />
</div>
<button className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors relative">
<Bell className="w-5 h-5" />
<span className="absolute top-1 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-[#09090b]"></span>
</button>
</div>
</header>

<div className="flex-1 overflow-auto p-8">
<div className="max-w-7xl mx-auto space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<MetricCard title="Total AI Requests" value="124.5k" trend="+14.2%" isPositive={true} />
<MetricCard title="Avg Latency" value="342ms" trend="-12ms" isPositive={true} />
<MetricCard title="Error Rate" value="0.12%" trend="+0.02%" isPositive={false} />
<MetricCard title="Active Workflows" value="24" trend="+3" isPositive={true} />
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 p-5 rounded-xl bg-white/[0.015] border border-white/[0.05]">
<div className="flex items-center justify-between mb-6">
<h3 className="text-sm font-medium text-zinc-100">Execution Overview</h3>
<div className="flex items-center space-x-3 text-xs">
<span className="flex items-center text-zinc-400"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span> Requests</span>
<span className="flex items-center text-zinc-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span> Latency</span>
</div>
</div>
<div className="h-64 w-full">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
<XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
<YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
<Tooltip contentStyle={{ backgroundColor: 'rgba(9,9,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e4e4e7' }} />
<Line type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
<Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={false} />
</LineChart>
</ResponsiveContainer>
</div>
</div>

<div className="p-5 rounded-xl bg-white/[0.015] border border-white/[0.05] flex flex-col">
<h3 className="text-sm font-medium text-zinc-100 mb-6">AI Model Usage</h3>
<div className="flex-1 flex flex-col justify-center items-center">
<div className="h-48 w-full relative">
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie data={modelUsageData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
{modelUsageData.map((entry, index) => (
<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}
</Pie>
<Tooltip />
</PieChart>
</ResponsiveContainer>
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
<span className="text-2xl font-semibold text-zinc-100">Live</span>
</div>
</div>
<div className="w-full mt-4 space-y-2">
{modelUsageData.map((item, i) => (
<div key={item.name} className="flex items-center justify-between text-xs">
<div className="flex items-center">
<span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }}></span>
<span className="text-zinc-400">{item.name}</span>
</div>
<span className="text-zinc-200 font-medium">{item.value}%</span>
</div>
))}
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 p-5 rounded-xl bg-white/[0.015] border border-white/[0.05]">
<div className="flex items-center justify-between mb-4">
<h3 className="text-sm font-medium text-zinc-100">Top Workflows</h3>
<button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm text-left">
<thead className="text-xs text-zinc-500 border-b border-white/5">
<tr>
<th className="px-4 py-3 font-medium">Workflow Name</th>
<th className="px-4 py-3 font-medium text-right">API Calls</th>
<th className="px-4 py-3 font-medium text-right">Success Rate</th>
<th className="px-4 py-3 font-medium text-right">Trend</th>
</tr>
</thead>
<tbody>
{topWorkflows.map((wf, i) => (
<tr key={i} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01] transition-colors">
<td className="px-4 py-3 font-medium text-zinc-200">{wf.name}</td>
<td className="px-4 py-3 text-right text-zinc-400">{wf.calls}</td>
<td className="px-4 py-3 text-right text-zinc-400">{wf.success}</td>
<td className="px-4 py-3 text-right">
<span className={`inline-flex items-center ${wf.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
{wf.trend}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>

<div className="p-5 rounded-xl bg-white/[0.015] border border-white/[0.05]">
<h3 className="text-sm font-medium text-zinc-100 mb-5">Recent Executions</h3>
<div className="space-y-4">
{recentActivity.map((activity) => (
<div key={activity.id} className="flex items-start">
<div className="mt-0.5 mr-3">
{activity.status === 'success' ? (
<CheckCircle2 className="w-4 h-4 text-emerald-500" />
) : activity.status === 'processing' ? (
<Clock className="w-4 h-4 text-amber-500 animate-pulse" />
) : (
<div className="w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center">
<div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
</div>
)}
</div>
<div className="flex-1 min-w-0">
<p className="text-sm font-medium text-zinc-200 truncate">{activity.task}</p>
<p className="text-xs text-zinc-500 truncate">{activity.model} • {activity.time}</p>
</div>
</div>
))}
</div>
</div>
</div>
</div>
</div>
</main>
</div>
);
}

function MetricCard({ title, value, trend, isPositive }: { title: string, value: string, trend: string, isPositive: boolean }) {
return (
<div className="p-5 rounded-xl bg-white/[0.015] border border-white/[0.05] flex flex-col justify-between group hover:bg-white/[0.03] transition-all">
<h3 className="text-sm font-medium text-zinc-400">{title}</h3>
<div className="mt-2 flex items-baseline justify-between">
<span className="text-2xl font-semibold text-zinc-100 tracking-tight">{value}</span>
<span className={`text-xs font-medium flex items-center ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
{isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
{trend}
</span>
</div>
</div>
);
}
