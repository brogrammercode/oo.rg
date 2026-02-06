import { Building2, Search, ChevronRight, Plus, Loader2, X, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../constants/routes";
import { useState, useEffect } from "react";
import Avatar from "../../components/ui/avatar";
import orgService from "../../services/org/org.service";
import EmployeeStatus from "../../constants/org";
import type { Employee, Org } from "../../types/org";
import { useOrgStore } from "../../stores/org";


const OrgItem = ({ org, onClick }: { org: Org, onClick: (org: Org) => void }) => {
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick(org);
            }}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#f7f7f5] dark:hover:bg-zinc-800 transition-colors duration-200 border border-transparent hover:border-[#e5e5e5] dark:hover:border-zinc-700"
        >
            <div className="flex items-center gap-4">
                <Avatar
                    initials={org.name.substring(0, 2).toUpperCase()}
                    size="md"
                    src={org.logo}
                    className="rounded-lg"
                />

                <div className="flex flex-col justify-center gap-0.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-[#1a1a1a] dark:text-white leading-none">
                            {org.name}
                        </span>
                    </div>
                    <span className="text-xs text-neutral-500">Owner: {org.owner?.name}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end gap-0.5">
                    <span className="text-xs text-neutral-400">
                        Created {new Date(org.createdAt!).toLocaleDateString()}
                    </span>
                </div>

                <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </div>
        </a>
    );
};

interface OrgPopupProps {
    org: Org;
    onClose: () => void;
}

const OrgPopup = ({ org, onClose }: OrgPopupProps) => {
    const [employee, setEmployeee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const setOrg = useOrgStore((state) => state.setOrg);
    const setEmployee = useOrgStore((state) => state.setEmployee);

    useEffect(() => {
        const fetchEmployeeStatus = async () => {
            try {
                const res = await orgService.getMyEmployee(org._id);
                console.log(res.data);
                setEmployeee(res.data.data.employee);
            } catch (err: any) {
                if (err.response && err.response.status !== 404) {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEmployeeStatus();
    }, []);

    const handleRequestJoin = async () => {
        setRequesting(true);
        setError("");
        try {
            await orgService.requestToJoin(org._id);
            const res = await orgService.getMyEmployee(org._id);
            if (res.data.data.employee) {
                setEmployeee(res.data.data.employee);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send request");
        } finally {
            setRequesting(false);
        }
    };

    const handleEnterOrg = () => {
        setOrg(org);
        setEmployee(employee!);
        navigate(AppRoutes.APP);
    };

    let actionButton;

    if (loading) {
        actionButton = (
            <button disabled className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 rounded-lg text-neutral-400 text-sm font-medium cursor-not-allowed">
                <Loader2 className="w-4 h-4 animate-spin" /> Check status...
            </button>
        );
    } else if (employee) {
        if (employee.status === EmployeeStatus.REQUESTED) {
            actionButton = (
                <button disabled className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium cursor-default">
                    <Loader2 className="w-4 h-4 animate-spin" /> Request submitted
                </button>
            );
        } else if (employee.status === EmployeeStatus.REJECTED) {
            actionButton = (
                <button disabled className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium cursor-default">
                    <AlertCircle className="w-4 h-4" /> Request Rejected
                </button>
            );
        } else {
            actionButton = (
                <button onClick={handleEnterOrg} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-black text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Enter {org.name} <ArrowRight className="w-4 h-4" />
                </button>
            );
        }
    } else {
        actionButton = (
            <button
                onClick={handleRequestJoin}
                disabled={requesting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-black text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Request to join
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#191919] w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-100 dark:border-zinc-800 p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center gap-5 mt-2">
                    <Avatar
                        initials={org.name.substring(0, 2).toUpperCase()}
                        size="lg"
                        src={org.logo}
                        className="shadow-md"
                    />

                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-[#1a1a1a] dark:text-white tracking-tight">
                            {org.name}
                        </h2>
                        <p className="text-sm text-neutral-500">
                            Owned by {org.owner?.name}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 py-2 px-4 bg-neutral-50 dark:bg-zinc-800/50 rounded-lg border border-neutral-100 dark:border-zinc-800">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-[#1a1a1a] dark:text-white">{0}</span>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Members</span>
                        </div>
                        <div className="w-px h-8 bg-neutral-200 dark:bg-zinc-700"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-[#1a1a1a] dark:text-white">{new Date(org.createdAt!).getFullYear()}</span>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Est.</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3 mt-2">
                        {actionButton}
                        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function FindOrg() {
    const navigate = useNavigate();
    const [orgName, setOrgName] = useState("");
    const [loading, setLoading] = useState(false);
    const [organizations, setOrganizations] = useState<Org[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);

    useEffect(() => {
        const fetchOrgs = async () => {
            if (!orgName.trim()) {
                setOrganizations([]);
                return;
            }

            setLoading(true);
            try {
                const result = await orgService.find(orgName);
                setOrganizations(result.data.data.orgs);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchOrgs, 300);
        return () => clearTimeout(debounceTimer);
    }, [orgName]);

    const handleOrgClick = (org: Org) => {
        setSelectedOrg(org);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919] text-[#1a1a1a] dark:text-white antialiased flex flex-col items-center font-sans">
            <main className="w-full max-w-[720px] px-4 py-20 flex flex-col gap-8 h-full">
                <header className="flex flex-col items-center text-center gap-4 mb-6">
                    <div className="size-16 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-zinc-800 mb-2">
                        <Building2 className="w-9 h-9 text-neutral-400" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#1a1a1a] dark:text-white">
                        Find your organization
                    </h1>
                    <p className="text-neutral-500 text-sm max-w-md text-center leading-relaxed">
                        Search for an existing workspace to join your team, or create a new
                        one to get started.
                    </p>
                </header>

                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {loading ? (
                            <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5 text-neutral-400" />
                        )}
                    </div>
                    <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full py-3.5 pl-12 pr-4 text-sm bg-transparent border border-[#e5e5e5] dark:border-zinc-700 rounded-lg focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] dark:focus:border-white dark:focus:ring-white transition-all placeholder:text-neutral-400 text-[#1a1a1a] dark:text-white shadow-sm"
                        placeholder="Search for your organization..."
                    />
                </div>

                <div className="flex flex-col w-full gap-1">
                    {organizations.length > 0 && (
                        <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-3 mb-2">
                            Recent workspaces
                        </div>
                    )}
                    {organizations.map((org) => (
                        <OrgItem key={org._id} org={org} onClick={handleOrgClick} />
                    ))}
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => navigate(AppRoutes.ORG_CREATE)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition-opacity focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] dark:focus:ring-white focus:outline-none"
                    >
                        <Plus className="w-5 h-5" />
                        Create your organization
                    </button>
                </div>

                <div className="text-center mt-2">
                    <a
                        href="#"
                        className="text-xs text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors underline-offset-2 hover:underline"
                    >
                        Not sure where to start? Read the guide
                    </a>
                </div>
            </main>

            {selectedOrg && (
                <OrgPopup
                    org={selectedOrg}
                    onClose={() => setSelectedOrg(null)}
                />
            )}
        </div>
    );
}