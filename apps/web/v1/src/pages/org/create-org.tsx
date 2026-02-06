import { useState } from 'react';
import {
    Layout,
    Building2,
    Pencil,
    Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/ui/avatar';
import { useAuthStore } from '../../stores/auth';
import { useOrgStore } from '../../stores/org';
import orgService from '../../services/org/org.service';
import { AppRoutes } from '../../constants/routes';

export default function CreateOrg() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [orgName, setOrgName] = useState('');
    const [loading, setLoading] = useState(false);
    const setOrg = useOrgStore((state) => state.setOrg);
    const setEmployee = useOrgStore((state) => state.setEmployee);

    const handleCreateOrg = async () => {
        setLoading(true);
        try {
            const res = await orgService.create(orgName);
            if (res.status == 201) {
                setOrg(res.data.data.org);
                setEmployee(res.data.data.employee);
                navigate(AppRoutes.APP);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919] font-sans text-[#1a1a1a] dark:text-white antialiased flex flex-col">
            <header className="w-full border-b border-[#ededed] dark:border-neutral-800 bg-white dark:bg-[#191919] sticky top-0 z-10">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-[#1a1a1a] dark:text-white">
                            <Layout size={20} strokeWidth={1.5} />
                        </div>
                        <nav className="hidden sm:flex items-center text-sm font-medium">
                            {/* <a href="#" className="text-neutral-500 hover:text-[#1a1a1a] dark:text-neutral-400 dark:hover:text-white transition-colors">
                                My Orgs
                            </a>
                            <span className="mx-2 text-neutral-300">/</span> */}
                            <span className="text-[#1a1a1a] dark:text-white">Create Organization</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar src={user?.image} name={user?.name} />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start pt-16 pb-20 px-4 sm:px-6">
                <div className="w-full max-w-[640px] flex flex-col gap-10">

                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="size-16 flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-800 mb-2 border border-neutral-100 dark:border-neutral-700 shadow-sm">
                            <Building2 className="w-9 h-9 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a] dark:text-white">
                            Create your organization
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-md leading-relaxed">
                            Name your new workspace and choose the tools you need to get started.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 w-full mt-2">

                        <div className="space-y-2">
                            <label htmlFor="org-name" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 ml-1">
                                Organization Name
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="org-name"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="block w-full rounded-lg border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#1a1a1a] dark:text-white shadow-sm focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-500 py-3 px-4 text-base placeholder-neutral-400 transition-colors focus:outline-none border"
                                    placeholder="e.g. Acme Inc."
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <Pencil size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="h-4"></div>

                        <div className="flex flex-col gap-3">
                            <button disabled={loading} onClick={handleCreateOrg} className="w-full flex items-center justify-center rounded-lg bg-[#1a1a1a] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black py-3.5 text-base font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 dark:focus:ring-offset-neutral-900">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create organization'}
                            </button>
                            <button onClick={() => navigate(-1)} className="w-full text-center text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300 py-2 transition-colors">
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            </main >
        </div >
    );
}