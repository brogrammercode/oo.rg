import React from 'react';
import {
    Clock,
    Timer,
    TimerOff,
    Users,
    Smile,
    Tag,
    Landmark,
    Bell,
    Eye,
    Check,
    X,
    Calendar,
    CalendarDays,
    Cake,
    PartyPopper,
    Badge
} from 'lucide-react';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-[#202020] rounded-lg border border-[#E5E7EB] dark:border-[#2F2F2F] shadow-sm ${className}`}>
        {children}
    </div>
);

const StatCard = ({ icon: Icon, value, label, colorClass }: { icon: any; value: string; label: string; colorClass: string }) => (
    <Card className="p-5 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClass}`}>
            <Icon size={24} />
        </div>
        <div>
            <h4 className="text-2xl font-semibold text-[#37352F] dark:text-[#D4D4D4]">{value}</h4>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{label}</p>
        </div>
    </Card>
);

const AttendanceGauge = () => (
    <div className="relative flex flex-col items-center justify-center h-[180px] w-full">
        <div className="w-[200px] h-[100px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[200px] rounded-full border-[20px] border-[#FB923C] box-border"></div>
        </div>
        <div className="absolute bottom-12 text-center">
            <span className="text-xs font-semibold text-[#37352F] dark:text-[#D4D4D4]">Total Attendance: 3</span>
        </div>
    </div>
);

const ApprovalItem = ({ name, date, avatar, description }: { name: string; date: string; avatar: string; description: string }) => (
    <div className="flex gap-3 mb-6 relative group">
        <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-[#E5E7EB] dark:bg-[#2F2F2F] group-last:hidden"></div>
        <img alt="User" className="h-9 w-9 rounded-full bg-gray-200 z-10 relative object-cover" src={avatar} />
        <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
                <div>
                    <h5 className="text-sm font-semibold text-[#37352F] dark:text-[#D4D4D4]">{name}</h5>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{date}</p>
                </div>
                <div className="flex gap-1">
                    <button className="h-7 w-7 flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"><Eye size={16} /></button>
                    <button className="h-7 w-7 flex items-center justify-center rounded bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors"><Check size={16} /></button>
                    <button className="h-7 w-7 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-600 transition-colors"><X size={16} /></button>
                </div>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">{description}</p>
        </div>
    </div>
);

const EmptyStateCard = ({ icon: Icon, title, emptyText }: { icon: any; title: string; emptyText: string }) => (
    <Card className="p-0">
        <div className="p-4 border-b border-[#E5E7EB] dark:border-[#2F2F2F] flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Icon className="text-[#6B7280]" size={18} />
                <h3 className="font-medium text-[#37352F] dark:text-[#D4D4D4]">{title}</h3>
            </div>
            {title !== 'Employees By Department' && (
                <div className="flex gap-2">
                    <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F7F7F5] dark:hover:bg-[#191919] flex items-center">
                        Select Date... <Calendar size={14} className="ml-1" />
                    </button>
                    <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F7F7F5] dark:hover:bg-[#191919] flex items-center">
                        Select User... <CalendarDays size={14} className="ml-1" />
                    </button>
                </div>
            )}
        </div>
        <div className="p-8 text-center text-[#6B7280] dark:text-[#9CA3AF] text-sm">
            {emptyText}
        </div>
    </Card>
);

export default function ManagerDashboard() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Attendance Card */}
                <Card className="p-6 col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="text-[#6B7280]" size={18} />
                        <h3 className="font-medium text-[#37352F] dark:text-[#D4D4D4]">Attendances</h3>
                    </div>
                    <div className="flex justify-between mb-8">
                        <div>
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-1">Current IP Address</p>
                            <p className="text-lg font-mono text-[#37352F] dark:text-[#D4D4D4]">49.205.201.207</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-1">Current Time</p>
                            <p className="text-lg font-mono text-[#37352F] dark:text-[#D4D4D4]">10:03:12 am</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <Timer size={18} /> Clock In
                        </button>
                        <button className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <TimerOff size={18} /> Clock Out
                        </button>
                    </div>
                </Card>

                {/* Stats Grid */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        icon={Users}
                        value="35"
                        label="Total Employees"
                        colorClass="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    />
                    <StatCard
                        icon={Smile}
                        value="22"
                        label="Total Active Employees"
                        colorClass="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    />
                    <StatCard
                        icon={Tag}
                        value="13"
                        label="Total Inactive Employees"
                        colorClass="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                    />
                    <StatCard
                        icon={Landmark}
                        value="3"
                        label="Employee Under You"
                        colorClass="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Pending Approvals */}
                <Card className="p-0 flex flex-col h-full">
                    <div className="p-5 border-b border-[#E5E7EB] dark:border-[#2F2F2F] flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bell className="text-[#6B7280]" size={18} />
                            <h3 className="font-medium text-[#37352F] dark:text-[#D4D4D4]">Pending Approvals</h3>
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">62</span>
                        </div>
                    </div>
                    <div className="p-5 flex-1 overflow-y-auto max-h-[350px]">
                        <div className="bg-[#F7F7F5] dark:bg-[#191919] py-2 px-4 rounded mb-4 text-center">
                            <span className="text-sm font-medium text-[#3B82F6]">Leaves</span>
                        </div>
                        <ApprovalItem
                            name="Dr. Guiseppe Cummings"
                            date="27-09-2025 - 27-09-2025"
                            avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
                            description="Eveniet et maiores sit dolores est tenetur nulla. Et consequatur omnis nemo in explicabo dolores."
                        />
                        <ApprovalItem
                            name="Location Head"
                            date="29-09-2025 - 29-09-2025"
                            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                            description="Deleniti nulla tempore vel quis. Pariatur velit inventore iure ullam est."
                        />
                    </div>
                </Card>

                {/* Gauge Chart */}
                <Card className="p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="text-[#6B7280]" size={18} />
                            <h3 className="font-medium text-[#37352F] dark:text-[#D4D4D4]">Attendances</h3>
                        </div>
                        <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 flex items-center gap-1 hover:bg-[#F7F7F5] dark:hover:bg-[#191919]">
                            <Calendar size={14} /> Today
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <AttendanceGauge />
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-[#6B7280] dark:text-[#9CA3AF]">Present</span>
                            </div>
                            <span className="text-[#37352F] dark:text-[#D4D4D4] font-medium">0% (0)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-[#6B7280] dark:text-[#9CA3AF]">Absent</span>
                            </div>
                            <span className="text-[#37352F] dark:text-[#D4D4D4] font-medium">0% (0)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                <span className="text-[#6B7280] dark:text-[#9CA3AF]">Not Marked</span>
                            </div>
                            <span className="text-[#37352F] dark:text-[#D4D4D4] font-medium">100% (3)</span>
                        </div>
                    </div>
                </Card>

                {/* Clock Status */}
                <Card className="p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="text-[#6B7280]" size={18} />
                            <h3 className="font-medium text-[#37352F] dark:text-[#D4D4D4]">Clock-In/Out</h3>
                        </div>
                        <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 flex items-center gap-1 hover:bg-[#F7F7F5] dark:hover:bg-[#191919]">
                            <Calendar size={14} /> Today
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center mb-4 text-3xl shadow-lg shadow-blue-500/30 font-serif font-bold">
                            !
                        </div>
                        <h4 className="text-lg font-medium text-[#37352F] dark:text-[#D4D4D4] mb-1">No attendance mark yet</h4>
                    </div>
                    <button className="w-full mt-6 bg-[#3B82F6] hover:bg-blue-600 text-white py-2 rounded text-sm font-medium transition-colors">
                        View All Attendance
                    </button>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EmptyStateCard icon={Cake} title="Birthdays" emptyText="No birthdays found" />
                <EmptyStateCard icon={PartyPopper} title="Work Anniversary" emptyText="No anniversaries found" />
                <EmptyStateCard icon={Badge} title="Employees By Department" emptyText="Chart data loading..." />
            </div>
        </>
    );
}