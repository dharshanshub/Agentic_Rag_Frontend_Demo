interface Props { alive: boolean | null; }

export default function ConnectionStatus({ alive }: Props) {
  if (alive === null) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span className="h-2 w-2 rounded-full bg-slate-600 animate-pulse" />
        Checking…
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${alive ? 'text-emerald-400' : 'text-coral-400'}`}>
      <span className={`h-2 w-2 rounded-full ${alive ? 'bg-emerald-400' : 'bg-coral-500'}`} />
      {alive ? 'Connected' : 'Unreachable'}
    </span>
  );
}
