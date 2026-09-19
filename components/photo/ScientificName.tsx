export function ScientificName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <em className={`font-serif italic ${className ?? ""}`}>{name}</em>
  );
}
