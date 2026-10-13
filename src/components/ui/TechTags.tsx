interface TechTagsProps {
  tech: string[];
}

export function TechTags({ tech }: TechTagsProps) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {tech.map((name) => (
        <li
          key={name}
          className="rounded-md border border-border bg-surface-raised px-2 py-0.5 text-2xs font-medium"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
