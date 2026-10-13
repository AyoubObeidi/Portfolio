interface TechTagsProps {
  tech: string[];
}

export function TechTags({ tech }: TechTagsProps) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tech.map((name) => (
        <li
          key={name}
          className="rounded-md bg-surface-raised px-2 py-1 font-mono text-xs text-fg-body"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
