import Button from "./Button";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  subtitle,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-text-tertiary">🚗</span>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-text-secondary max-w-xs">{subtitle}</p>
      )}
      {actionLabel && (
        <div className="mt-4">
          <Button href={actionHref} onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
