import type { LessonSection } from "@/lib/lessons-data";

export function LessonRenderer({ sections }: { sections: LessonSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section, idx) => (
        <SectionView key={idx} section={section} />
      ))}
    </div>
  );
}

function SectionView({ section }: { section: LessonSection }) {
  switch (section.type) {
    case "paragraph":
      return (
        <section className="space-y-3">
          {section.heading && (
            <h2 className="text-xl font-bold text-gray-100 border-l-4 border-amber-500 pl-3">
              {section.heading}
            </h2>
          )}
          {section.text?.split("\n\n").map((para, i) => (
            <p key={i} className="text-gray-300 leading-relaxed text-[15px]">
              {para}
            </p>
          ))}
        </section>
      );

    case "bullets":
      return (
        <section className="space-y-3 p-5 rounded-xl bg-gray-900 border border-gray-800">
          {section.heading && (
            <h3 className="text-base font-bold text-amber-400">{section.heading}</h3>
          )}
          {section.text && (
            <p className="text-gray-300 text-sm leading-relaxed">{section.text}</p>
          )}
          <ul className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                <span className="text-amber-500 mt-1 shrink-0">●</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "numbered":
      return (
        <section className="space-y-3 p-5 rounded-xl bg-gray-900 border border-gray-800">
          {section.heading && (
            <h3 className="text-base font-bold text-amber-400">{section.heading}</h3>
          )}
          {section.text && (
            <p className="text-gray-300 text-sm leading-relaxed">{section.text}</p>
          )}
          <ol className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      );

    case "note":
      return (
        <section className="p-5 rounded-xl bg-amber-500/10 border-l-4 border-amber-500">
          {section.heading && (
            <p className="font-bold text-amber-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {section.heading}
            </p>
          )}
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
            {section.text}
          </p>
        </section>
      );

    case "warning":
      return (
        <section className="p-5 rounded-xl bg-red-500/10 border-l-4 border-red-500">
          <p className="font-bold text-red-400 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {section.heading ?? "注意"}
          </p>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
            {section.text}
          </p>
        </section>
      );

    case "definitions":
      return (
        <section className="space-y-3">
          {section.heading && (
            <h3 className="text-lg font-bold text-gray-100">{section.heading}</h3>
          )}
          <dl className="grid gap-3 sm:grid-cols-2">
            {section.definitions?.map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-800/60 border border-gray-700">
                <dt className="text-amber-400 font-semibold text-sm mb-1">{d.term}</dt>
                <dd className="text-gray-300 text-sm leading-relaxed">{d.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      );

    case "table":
      return (
        <section className="space-y-3 overflow-x-auto">
          {section.heading && (
            <h3 className="text-lg font-bold text-gray-100">{section.heading}</h3>
          )}
          <table className="w-full text-sm border border-gray-700 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-800">
                {section.table?.headers.map((h, i) => (
                  <th key={i} className="px-4 py-2 text-left text-amber-400 font-semibold border-b border-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table?.rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-800 last:border-b-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 text-gray-300 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );

    case "formula":
      return (
        <section className="p-5 rounded-xl bg-gray-900 border border-amber-500/30">
          {section.heading && (
            <p className="text-amber-400 font-bold text-sm mb-2">{section.heading}</p>
          )}
          <pre className="text-amber-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {section.text}
          </pre>
        </section>
      );

    default:
      return null;
  }
}
