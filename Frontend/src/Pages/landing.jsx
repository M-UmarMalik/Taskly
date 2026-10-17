
import {
    ArrowRight,
    BellRing,
    Columns3,
    LayoutDashboard,
    ListChecks,
    Moon,
    Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------- Theme styles ---------- */

const text = { color: "var(--text-color)" };
const muted = { color: "var(--muted-text)" };
const accentText = { color: "var(--accent-text)" };

const card = {
    backgroundColor: "var(--card-glass)",
    borderColor: "var(--border-color)",
};

const cardStrong = {
    backgroundColor: "var(--card-solid)",
    borderColor: "var(--border-color)",
};

const chip = {
    backgroundColor: "var(--chip-bg)",
    borderColor: "var(--border-color)",
};

const primaryBtn = {
    backgroundColor: "var(--button-bg)",
    color: "var(--button-text)",
};

const ghostBtn = {
    ...chip,
    color: "var(--text-color)",
};

const btnBase =
    "inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:gap-2.5 sm:px-6 sm:py-3.5";

const pillTone = {
    progress: {
        backgroundColor: "var(--accent-soft)",
        color: "var(--accent-text)",
    },
    done: {
        backgroundColor: "var(--ok-bg, #d9f5e6)",
        color: "var(--ok, #168653)",
    },
    high: {
        backgroundColor: "var(--bad-bg, #ffe1e6)",
        color: "var(--bad, #d9485f)",
    },
};

const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
};

/* ---------- Logo ---------- */

const Logo = ({ className = "" }) => (
    <span
        className={`inline-flex shrink-0 items-center gap-2 font-jakarta text-xl font-semibold tracking-tight sm:gap-2.5 sm:text-[22px] ${className}`}
        style={text}
    >
        <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0"
            aria-hidden="true"
        >
            <path
                d="M12 3a9 9 0 1 0 0 18"
                fill="none"
                stroke="#6a86f2"
                strokeWidth="5"
            />
            <path
                d="M13 5.5h2.5A3.5 3.5 0 0 1 19 9v6a3.5 3.5 0 0 1-3.5 3.5H13"
                fill="none"
                stroke="#9fb1f7"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
        </svg>
        Taskly
    </span>
);

/* ---------- Mountain illustration ---------- */

const Mountain = ({ className = "" }) => (
    <svg
        viewBox="0 0 400 220"
        className={className}
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="mt1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#b9c6fb" />
                <stop offset="1" stopColor="#6a86f2" />
            </linearGradient>

            <linearGradient id="mt2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#4a5fcf" />
                <stop offset="1" stopColor="#1f2a73" />
            </linearGradient>
        </defs>

        <path
            d="M0 220L110 70l50 62 70-102 130 190z"
            fill="url(#mt1)"
            opacity=".75"
        />

        <path
            d="M90 220L220 20l180 200z"
            fill="url(#mt2)"
        />

        <path
            d="M220 20l-40 62 30-14 18 22 22-26 28 36z"
            fill="#eef1ff"
            opacity=".9"
        />
    </svg>
);

/* ---------- Status pill ---------- */

const Pill = ({ tone, children }) => (
    <span
        className="inline-block whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium sm:px-3 sm:text-xs"
        style={pillTone[tone]}
    >
        {children}
    </span>
);

/* ---------- Navbar ---------- */

const Nav = ({ isDark, toggleTheme, navigate }) => (
    <header className="flex w-full min-w-0 items-center justify-between gap-2 py-1.5">
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Taskly home"
            className="min-w-0"
        >
            <Logo />
        </button>

        <nav
            className="hidden items-center gap-8 font-medium md:flex"
            style={muted}
            aria-label="Sections"
        >
            <button
                type="button"
                onClick={() => scrollTo("features")}
                className="hover:opacity-70"
            >
                Features
            </button>

            <button
                type="button"
                onClick={() => scrollTo("how")}
                className="hover:opacity-70"
            >
                How it works
            </button>

            <button
                type="button"
                onClick={() => scrollTo("start")}
                className="hover:opacity-70"
            >
                Get started
            </button>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Light mode" : "Dark mode"}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors sm:h-10 sm:w-10"
                style={{ ...chip, color: "var(--text-color)" }}
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
                type="button"
                onClick={() => navigate("/login")}
                className={`${btnBase} hidden border !px-4 !py-2.5 sm:inline-flex`}
                style={ghostBtn}
            >
                Log in
            </button>

            <button
                type="button"
                onClick={() => navigate("/signup")}
                className={`${btnBase} whitespace-nowrap !px-3 !py-2.5 text-xs sm:!px-5 sm:text-sm`}
                style={primaryBtn}
            >
                Get started
            </button>
        </div>
    </header>
);

/* ---------- Dashboard preview data ---------- */

const previewRows = [
    ["Prepare presentation", "Work", "progress", "In Progress", "Dec 20"],
    ["Review project plan", "Work", "done", "Completed", "Dec 21"],
    ["Budget approval", "Finance", "high", "High", "Dec 25"],
];

const miniColumns = [
    ["To Do", "var(--muted-text)", ["Chapter 5 revision", "Book dentist"]],
    ["In Progress", "var(--accent-color)", ["Fix login bug"]],
    ["Completed", "var(--ok, #168653)", ["Weekly report"]],
];

/* ---------- Dashboard preview ---------- */

const Preview = () => (
    <div className="relative min-w-0 pt-1 lg:pb-14">
        {/* Main tasks panel */}

        <div
            className="min-w-0 rounded-[22px] border p-3 shadow-[0_36px_70px_-34px_rgba(50,55,120,.5)] backdrop-blur sm:rounded-[26px] sm:p-6"
            style={card}
        >
            <div className="mb-3 flex items-center justify-between gap-2">
                <h2
                    className="font-jakarta text-base font-medium sm:text-[19px]"
                    style={text}
                >
                    Tasks list
                </h2>

                <span className="text-xs sm:text-[13px]" style={muted}>
                    See all
                </span>
            </div>

            <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
                <colgroup>
                    <col className="w-[53%] sm:w-[45%]" />
                    <col className="w-[47%] sm:w-[35%]" />
                    <col className="hidden sm:table-column sm:w-[20%]" />
                </colgroup>

                <thead>
                    <tr
                        className="text-left text-[10px] font-medium sm:text-xs"
                        style={muted}
                    >
                        <th className="pb-2 pr-1.5 sm:pr-2.5">Name</th>
                        <th className="pb-2 pr-1 sm:pr-2.5">Status</th>
                        <th className="hidden pb-2 sm:table-cell">Due</th>
                    </tr>
                </thead>

                <tbody>
                    {previewRows.map(([name, category, tone, label, due]) => (
                        <tr
                            key={name}
                            className="border-t border-dashed"
                            style={{ borderColor: "var(--border-color)" }}
                        >
                            <td className="break-words py-3 pr-1.5 font-medium sm:pr-2.5">
                                <span style={text}>{name}</span>

                                <span
                                    className="block text-[10px] font-normal sm:text-xs"
                                    style={muted}
                                >
                                    {category}
                                </span>
                            </td>

                            <td className="py-3 pr-1 sm:pr-2.5">
                                <Pill tone={tone}>{label}</Pill>
                            </td>

                            <td className="hidden py-3 sm:table-cell" style={text}>
                                {due}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Completion ring */}

        <div
            className="mt-3.5 animate-[floaty_7s_ease-in-out_infinite] rounded-[20px] border p-3.5 shadow-lg motion-reduce:animate-none sm:rounded-[22px] sm:p-4 lg:absolute lg:-right-2.5 lg:-top-1.5 lg:mt-0"
            style={cardStrong}
        >
            <div className="flex items-center gap-3">
                <svg viewBox="0 0 64 64" className="h-14 w-14 flex-none sm:h-16 sm:w-16">
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="var(--border-color)"
                        strokeWidth="7"
                    />

                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="var(--accent-color)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray="163.4"
                        strokeDashoffset="49"
                        transform="rotate(-90 32 32)"
                    />
                </svg>

                <div>
                    <b
                        className="block font-jakarta text-2xl font-semibold leading-none sm:text-[28px]"
                        style={text}
                    >
                        70%
                    </b>

                    <span className="text-xs" style={muted}>
                        completed
                    </span>
                </div>
            </div>
        </div>

        {/* Mini Kanban board */}

        <div
            className="mt-3.5 animate-[floaty_7s_ease-in-out_infinite] rounded-[20px] border p-3 shadow-lg [animation-delay:-3s] motion-reduce:animate-none sm:rounded-[22px] sm:p-4 lg:absolute lg:-left-5 lg:bottom-0 lg:mt-0 lg:w-[min(330px,76%)]"
            style={cardStrong}
        >
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {miniColumns.map(([title, dot, cards]) => (
                    <div key={title} className="flex min-w-0 flex-col gap-1.5">
                        <h4
                            className="flex min-w-0 items-center gap-1 text-[10px] font-semibold sm:gap-1.5 sm:text-[11px]"
                            style={muted}
                        >
                            <i
                                className="h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2"
                                style={{ backgroundColor: dot }}
                            />

                            <span className="break-words">{title}</span>
                        </h4>

                        {cards.map((c) => (
                            <div
                                key={c}
                                className="break-words rounded-[10px] border px-1.5 py-1.5 text-[10px] font-medium leading-tight sm:px-2 sm:text-[11px]"
                                style={{
                                    ...chip,
                                    color: "var(--text-color)",
                                    ...(c === "Fix login bug"
                                        ? { borderLeft: "3px solid var(--bad, #d9485f)" }
                                        : {}),
                                }}
                            >
                                {c}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/* ---------- Hero section ---------- */

const Hero = ({ navigate }) => (
    <section className="grid min-w-0 grid-cols-1 items-center gap-7 sm:gap-11 lg:grid-cols-[1fr_1.08fr]">
        <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
            <span
                className="max-w-full rounded-full border px-3 py-1.5 text-xs sm:px-4 sm:text-[13px]"
                style={{ ...chip, color: "var(--text-color)" }}
            >
                <b
                    className="mr-1 font-jakarta text-sm font-semibold sm:text-[15px]"
                    style={accentText}
                >
                    70%
                </b>
                of tasks completed today
            </span>

            <h1
                className="break-words font-jakarta text-[clamp(32px,8vw,70px)] font-semibold leading-[1.03] tracking-[-0.03em]"
                style={text}
            >
                Get more done with{" "}
                <span style={accentText}>less noise.</span>
            </h1>

            <p
                className="max-w-[44ch] text-sm leading-6 sm:text-[17px]"
                style={muted}
            >
                Taskly keeps every task, deadline and priority in one calm place.
                Add a task, move it across the board and watch your day clear.
            </p>

            <div className="flex w-full flex-wrap gap-2.5 sm:gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className={btnBase}
                    style={primaryBtn}
                >
                    <span>Get started free</span>
                    <ArrowRight size={16} className="shrink-0" />
                </button>
            </div>

            <p className="text-xs sm:text-[12.5px]" style={muted}>
                No card needed. Set up in under a minute.
            </p>
        </div>

        <Preview />
    </section>
);

/* ---------- Features ---------- */

const features = [
    [
        ListChecks,
        "Task management",
        "Create, view, edit and delete tasks with a title, description, category, priority, status, dates and tags.",
    ],
    [
        Columns3,
        "Kanban board",
        "See To Do, In Progress and Completed side by side. Drag a card to change its status.",
    ],
    [
        LayoutDashboard,
        "Dashboard",
        "Your week at a glance: workload per day, what is due next and how much you have finished.",
    ],
    [
        BellRing,
        "Priorities and reminders",
        "Mark tasks Low, Medium or High and get notified when something is due today or overdue.",
    ],
];

const Features = () => (
    <section id="features" className="min-w-0 scroll-mt-6">
        <div className="flex max-w-[56ch] flex-col gap-2.5">
            <h2
                className="break-words font-jakarta text-[clamp(26px,6vw,42px)] font-semibold leading-[1.1] tracking-[-0.025em]"
                style={text}
            >
                Everything you need to run your day
            </h2>

            <p className="text-sm sm:text-base" style={muted}>
                Four things done well, with nothing extra to learn.
            </p>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([Icon, title, body]) => (
                <article
                    key={title}
                    className="flex min-w-0 flex-col gap-3 rounded-[22px] border p-4 shadow-lg backdrop-blur sm:rounded-[26px] sm:p-6"
                    style={card}
                >
                    <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px]"
                        style={{
                            backgroundColor: "var(--accent-soft)",
                            color: "var(--accent-text)",
                        }}
                    >
                        <Icon size={21} />
                    </span>

                    <h3
                        className="break-words font-jakarta text-lg font-semibold sm:text-[19px]"
                        style={text}
                    >
                        {title}
                    </h3>

                    <p className="break-words text-sm leading-6 sm:text-base" style={muted}>
                        {body}
                    </p>
                </article>
            ))}
        </div>
    </section>
);

/* ---------- How it works ---------- */

const steps = [
    [
        "Add a task",
        "Give it a title, a category, a priority and a due date. Add tags to find it later.",
    ],
    [
        "Move it along",
        "Start it, drag it across the board and mark it completed when it is done.",
    ],
    [
        "Track your progress",
        "The dashboard shows what is due, what is running and how your week is going.",
    ],
];

const HowItWorks = () => (
    <section id="how" className="min-w-0 scroll-mt-6">
        <h2
            className="max-w-[56ch] break-words font-jakarta text-[clamp(26px,6vw,42px)] font-semibold leading-[1.1] tracking-[-0.025em]"
            style={text}
        >
            From idea to done in three steps
        </h2>

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 sm:mt-7 md:grid-cols-3">
            {steps.map(([title, body], i) => (
                <div
                    key={title}
                    className="flex min-w-0 flex-col gap-2.5 border-t-2 pt-[18px]"
                    style={{ borderColor: "var(--border-color)" }}
                >
                    <span
                        className="grid h-[30px] w-[30px] place-items-center rounded-full font-jakarta text-sm font-semibold"
                        style={{
                            backgroundColor: "var(--accent-soft)",
                            color: "var(--accent-text)",
                        }}
                    >
                        {i + 1}
                    </span>

                    <h3
                        className="break-words font-jakarta text-lg font-semibold sm:text-xl"
                        style={text}
                    >
                        {title}
                    </h3>

                    <p className="max-w-[36ch] text-sm leading-6 sm:text-base" style={muted}>
                        {body}
                    </p>
                </div>
            ))}
        </div>
    </section>
);

/* ---------- CTA section ---------- */

const CtaBand = ({ navigate }) => (
    <section id="start" className="min-w-0 scroll-mt-6">
        <div
            className="relative flex min-w-0 flex-col items-start gap-4 overflow-hidden rounded-[26px] border px-4 pb-32 pt-7 sm:gap-5 sm:rounded-[32px] sm:px-12 sm:pb-14 sm:pt-14"
            style={{
                borderColor: "var(--border-color)",
                background:
                    "linear-gradient(160deg, var(--accent-soft), var(--card-solid) 78%)",
            }}
        >
            <h2
                className="relative z-10 max-w-[15ch] break-words font-jakarta text-[clamp(27px,6vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em]"
                style={text}
            >
                Ready to clear your list?
            </h2>

            <p
                className="relative z-10 max-w-[40ch] text-sm leading-6 sm:text-base"
                style={muted}
            >
                Create your free account, or open the demo to look around first.
            </p>

            <div className="relative z-10 flex w-full flex-wrap gap-2.5 sm:gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className={btnBase}
                    style={primaryBtn}
                >
                    <span>Get started free</span>
                    <ArrowRight size={16} className="shrink-0" />
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className={`${btnBase} border`}
                    style={ghostBtn}
                >
                    Log in
                </button>
            </div>

            <Mountain className="pointer-events-none absolute -bottom-2.5 -right-4 w-[85%] max-w-[480px] opacity-70 sm:w-[46%] sm:opacity-90" />
        </div>
    </section>
);

/* ---------- Footer ---------- */

const Footer = () => (
    <footer
        className="flex min-w-0 flex-wrap items-center justify-between gap-3.5 border-t pt-5 text-xs sm:text-[13px]"
        style={{
            borderColor: "var(--border-color)",
            ...muted,
        }}
    >
        <Logo className="!text-lg" />
        <span>© 2026 Taskly</span>
    </footer>
);

/* ---------- Landing page ---------- */

const Landing = ({ isDark, toggleTheme }) => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen w-full min-w-0 overflow-x-clip transition-colors duration-300"
            style={{
                backgroundColor: "var(--page-bg)",
                color: "var(--text-color)",
            }}
        >
            <div className="mx-auto flex w-full max-w-[1180px] min-w-0 flex-col gap-10 px-3 pb-6 pt-3 sm:gap-16 sm:px-4 sm:pb-7 sm:pt-4 md:gap-[84px]">
                <Nav
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    navigate={navigate}
                />

                <Hero navigate={navigate} />

                <Features />

                <HowItWorks />

                <CtaBand navigate={navigate} />

                <Footer />
            </div>
        </div>
    );
};

export default Landing;
