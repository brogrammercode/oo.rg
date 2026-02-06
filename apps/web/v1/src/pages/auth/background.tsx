import { ArrowUpRight } from 'lucide-react';

const Background = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg className="absolute top-[30%] left-[10%] w-32 h-16 text-slate-400 hidden lg:block opacity-50" viewBox="0 0 100 50">
            <path d="M10,25 Q30,5 50,25 T90,25" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="absolute top-[40%] left-[15%] w-24 h-20 border border-slate-400 bg-white hidden lg:flex flex-col gap-3 p-4 items-center justify-center opacity-60">
            <div className="w-12 h-0.5 bg-slate-400"></div>
            <div className="w-12 h-0.5 bg-slate-400"></div>
        </div>

        <div className="absolute top-[55%] left-[18%] w-8 h-8 rounded-full border border-slate-400 hidden lg:block opacity-60"></div>

        <div className="absolute top-[35%] right-[20%] w-16 h-12 border border-slate-400 bg-white hidden lg:flex flex-col gap-2 p-2 items-center justify-center opacity-60 rotate-6">
            <div className="w-8 h-0.5 bg-slate-400"></div>
            <div className="w-8 h-0.5 bg-slate-400"></div>
        </div>

        <svg className="absolute top-[38%] right-[10%] w-24 h-12 text-slate-400 hidden lg:block opacity-50" viewBox="0 0 100 50">
            <path d="M10,25 Q30,45 50,25 T90,25" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="absolute bottom-20 left-40 w-20 h-40 bg-[#FFD482] hidden lg:block rounded-md">
            <div className="w-full h-full flex flex-wrap gap-4 p-2 justify-center content-center overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-black opacity-80"></div>
                ))}
            </div>
        </div>
        <div className="absolute bottom-20 left-64 w-20 h-24 border border-slate-400 bg-white hidden lg:flex items-center justify-center">
            <ArrowUpRight className="text-slate-400 stroke-1" size={24} />
        </div>

        <div className="absolute bottom-20 right-40 w-20 h-32 bg-[#FFD482] hidden lg:block rounded-md">
            <div className="w-full h-full flex flex-wrap gap-4 p-2 justify-center content-center overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-black opacity-80"></div>
                ))}
            </div>
        </div>

        <div className="absolute bottom-20 left-20 right-20 h-px bg-slate-300 -z-10"></div>
    </div>
);




const Icons = {
    Google: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000000" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000000" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#000000" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000000" />
        </svg>
    ),
    Apple: () => (
        <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
        </svg>
    ),
    Facebook: () => (
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    )
};

export { Icons, Background };