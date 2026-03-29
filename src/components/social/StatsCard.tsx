interface StatsCardProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export default function StatsCard({ label, value, highlight = false }: StatsCardProps) {
  return (
    <div className={`rounded-card p-3 text-center ${highlight ? "bg-brand-light" : "bg-surface-secondary"}`}>
      <p className={`text-xl font-bold ${highlight ? "text-brand" : "text-text-primary"}`}>
        {value}
      </p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  );
}
