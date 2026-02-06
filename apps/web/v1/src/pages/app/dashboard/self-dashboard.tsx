import React from 'react';
import {
    Edit,
    Trophy,
    AlertTriangle,
    DollarSign,
    Scale,
    Play,
    ArrowRight,
    LogIn,
    LogOut,
    Clock,
    CalendarDays
} from 'lucide-react';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-[#202020] rounded-xl border border-gray-200 dark:border-[#333333] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${className}`}>
        {children}
    </div>
);

const DonutChart = () => (
    <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"></path>
            <path className="text-purple-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="90, 100" strokeWidth="3.8"></path>
            <path className="text-emerald-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="60, 100" strokeDashoffset="-20" strokeWidth="3.8"></path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white dark:bg-[#202020] rounded-full"></div>
        </div>
    </div>
);

const StatBadge = ({ color, count, label }: { color: string; count: number; label: string }) => (
    <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
        <span className="text-gray-900 dark:text-white font-medium">{count}</span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">{label}</span>
    </div>
);

const StatCard = ({ icon: Icon, value, label, colorClass, textClass }: { icon: any; value: string; label: string; colorClass: string; textClass: string }) => (
    <Card className="p-4 flex items-center gap-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass} ${textClass}`}>
            <Icon size={20} />
        </div>
        <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{value}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    </Card>
);

const ProgressBar = ({ label, value, color, iconColor }: { label: string; value: string; color: string; iconColor: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${iconColor}`}></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white ml-4">{value}</p>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full ml-4 overflow-hidden">
            <div className={`h-full ${color} w-0`}></div>
        </div>
    </div>
);

export default function SelfDashboard() {
    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 overflow-hidden p-0">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-black dark:to-gray-800 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/20">
                                    DH
                                </div>
                                <div>
                                    <h2 className="text-white font-semibold">Department Head</h2>
                                    <p className="text-gray-300 text-xs flex items-center gap-1">
                                        Legal Advisor <span className="w-1 h-1 rounded-full bg-gray-400"></span> Customer Support
                                    </p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <Edit size={16} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                                <p className="text-sm text-gray-900 dark:text-white">-</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email</p>
                                <p className="text-sm text-gray-900 dark:text-white">department@example.com</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                                <p className="text-sm text-gray-900 dark:text-white">-</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-[#333333]">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Joining Date</p>
                                <p className="text-sm text-gray-900 dark:text-white font-medium">2022-03-20</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="lg:col-span-1 p-5 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Attendance Details</h3>
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                            <div className="space-y-3 text-sm w-1/2">
                                <StatBadge color="bg-purple-600" count={121} label="Total" />
                                <StatBadge color="bg-emerald-500" count={115} label="Present" />
                                <StatBadge color="bg-red-500" count={6} label="Leaves" />
                                <StatBadge color="bg-blue-500" count={0} label="Half Day" />
                                <StatBadge color="bg-orange-500" count={33} label="Late" />
                            </div>
                            <DonutChart />
                        </div>
                    </Card>

                    <Card className="lg:col-span-1 p-5 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Leave Details</h3>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-2">
                            {[
                                { label: 'Total Leaves', value: '9', color: 'text-gray-900 dark:text-white' },
                                { label: 'Approved', value: '6', color: 'text-emerald-600 dark:text-emerald-400' },
                                { label: 'Rejected', value: '0', color: 'text-red-600 dark:text-red-400' },
                                { label: 'Pending', value: '3', color: 'text-orange-600 dark:text-orange-400' },
                                { label: 'Paid Leaves', value: '0', color: 'text-gray-900 dark:text-white' },
                                { label: 'Unpaid Leaves', value: '9', color: 'text-gray-900 dark:text-white' },
                            ].map((item, index) => (
                                <div key={index}>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                                    <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
                            Apply New Leave
                        </button>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 p-6 flex flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Attendance</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">10:03 AM, 04 Feb 2026</p>
                        <div className="relative w-32 h-32 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-700"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">N/A</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 text-xs text-gray-500 dark:text-gray-400 mb-2 border border-gray-200 dark:border-gray-700">
                            Production: N/A
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-6">
                            <Clock size={14} />
                            Clock In Time N/A
                        </div>
                        <div className="flex w-full gap-3">
                            <button className="flex-1 bg-blue-500 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center justify-center gap-2">
                                <LogIn size={16} /> Clock In
                            </button>
                            <button className="flex-1 bg-blue-500 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                                <LogOut size={16} /> Clock Out
                            </button>
                        </div>
                    </Card>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={Trophy} value="0" label="Appreciations" colorClass="bg-blue-100 dark:bg-blue-900/30" textClass="text-blue-600 dark:text-blue-400" />
                        <StatCard icon={AlertTriangle} value="0" label="Warnings" colorClass="bg-indigo-100 dark:bg-indigo-900/30" textClass="text-indigo-600 dark:text-indigo-400" />
                        <StatCard icon={DollarSign} value="0" label="Expenses" colorClass="bg-purple-100 dark:bg-purple-900/30" textClass="text-purple-600 dark:text-purple-400" />
                        <StatCard icon={Scale} value="0" label="Complaints" colorClass="bg-pink-100 dark:bg-pink-900/30" textClass="text-pink-600 dark:text-pink-400" />

                        <Card className="sm:col-span-2 lg:col-span-4 p-5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Working Hour Details</h3>
                                <button className="text-xs border border-gray-200 dark:border-[#333333] rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    <CalendarDays size={14} /> Today
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <ProgressBar label="Total office time" value="-" color="bg-black dark:bg-white" iconColor="bg-black dark:bg-white" />
                                <ProgressBar label="Total worked time" value="-" color="bg-emerald-500" iconColor="bg-emerald-500" />
                                <ProgressBar label="Total Late time" value="-" color="bg-red-500" iconColor="bg-red-500" />
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    <Card className="p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Assigned Survey</h3>
                        </div>
                        <div className="border border-gray-200 dark:border-[#333333] rounded-lg p-4 flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Employee Preferences for Remote Work</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">04-02-2026</p>
                            </div>
                            <button className="h-8 w-8 flex items-center justify-center rounded bg-blue-50 text-blue-500 dark:bg-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors">
                                <Play size={18} fill="currentColor" />
                            </button>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Increment/Promotion</h3>
                            <button className="text-xs border border-gray-200 dark:border-[#333333] rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Select Year... <CalendarDays size={12} />
                            </button>
                        </div>
                        <div className="border border-gray-200 dark:border-[#333333] rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full border border-red-500 bg-white dark:bg-transparent"></div>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">14-01-2026 Decrement/Demotion</span>
                            </div>
                            <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Department Head</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>Legal Advisor</span>
                                    <ArrowRight size={12} className="text-red-500" />
                                    <span>Customer Relationship Manager</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="mt-2 mb-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">© 2026 HRMIFLY. All rights reserved.</p>
                </div>
            </div>
        </>
    );
}