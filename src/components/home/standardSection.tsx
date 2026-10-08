import {
  ShieldCheck,
  Tags,
  CreditCard,
  RefreshCw,
  Zap,
  Users,
} from "lucide-react";

const standards = [
  {
    icon: ShieldCheck,
    title: "Quality inspected",
    description: "Multi-point checks before every vehicle is listed.",
  },
  {
    icon: Tags,
    title: "Transparent pricing",
    description: "Clear figures with no unnecessary surprises.",
  },
  {
    icon: CreditCard,
    title: "Financing options",
    description: "Flexible plans tailored to your budget.",
  },
  {
    icon: RefreshCw,
    title: "Trade-in available",
    description: "A straightforward path when you're ready to upgrade.",
  },
  {
    icon: Zap,
    title: "Fast transactions",
    description: "Efficient paperwork with dedicated support.",
  },
  {
    icon: Users,
    title: "Trusted experts",
    description: "Guidance from experienced automotive specialists.",
  },
];

/*
  Light section between dark ones: white page, black icon blocks, red accents.
  Left-aligned heading with the same red bar used on the other pages.
*/
export default function StandardSection() {
  return (
    <section className="bg-white py-16 text-[#0A0A0A] lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div className="border-l-8 border-[#E31B23] pl-5 sm:pl-7">
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              Trust, built into every detail.
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-[#0A0A0A]/70">
            Every car and every conversation at Auto-Prime Car Trading is
            handled to the same standard, from the first message to the day you
            drive away.
          </p>
        </div>

        {/* Six standards: open grid with a red rule over each one */}
        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {standards.map(({ icon: Icon, title, description }) => (
            <li key={title} className="border-t-4 border-[#0A0A0A] pt-6">
              <div className="flex items-center gap-4">
                <span className="chamfer flex size-12 shrink-0 items-center justify-center bg-[#0A0A0A]">
                  <Icon className="size-6 text-[#E31B23]" />
                </span>
                <h3 className="text-xl font-bold">{title}</h3>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#0A0A0A]/70">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
