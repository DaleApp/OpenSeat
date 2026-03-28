interface SocialHintProps {
  hint: string;
}

export default function SocialHint({ hint }: SocialHintProps) {
  return (
    <p className="text-xs text-brand font-medium bg-brand-light px-2 py-1 rounded-lg">
      &bull; {hint}
    </p>
  );
}
