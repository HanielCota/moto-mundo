interface ProductSpecsProps {
  specs: Record<string, string>;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-xs">
      <div className="bg-zinc-100 px-4 py-3 border-b border-zinc-200">
        <h3 className="font-bold text-sm text-zinc-950 uppercase tracking-wider">
          Especificações Técnicas
        </h3>
      </div>
      <table className="w-full text-xs text-left">
        <tbody>
          {entries.map(([key, value], idx) => (
            <tr
              key={key}
              className={`border-b border-zinc-100 last:border-0 ${
                idx % 2 === 0 ? "bg-white" : "bg-zinc-50/70"
              }`}
            >
              <td className="py-3 px-4 font-semibold text-zinc-600 w-1/3 sm:w-1/4">
                {key}
              </td>
              <td className="py-3 px-4 text-zinc-900 font-medium">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
