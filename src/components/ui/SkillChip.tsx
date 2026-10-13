import { readableBrandColor } from "@/lib/icons";
import type { Skill } from "@/lib/profile";
import { BrandIcon } from "./BrandIcon";

interface SkillChipProps {
  skill: Skill;
}

export function SkillChip({ skill }: SkillChipProps) {
  const color = skill.icon.hex ? readableBrandColor(skill.icon.hex) : undefined;

  return (
    <span className="inline-flex items-center gap-2 text-md whitespace-nowrap text-fg-body">
      <BrandIcon icon={skill.icon} style={color ? { color } : undefined} />
      {skill.label}
    </span>
  );
}
