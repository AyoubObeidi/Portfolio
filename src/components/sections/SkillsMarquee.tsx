import { profile } from "@/lib/profile";
import { SkillChip } from "@/components/ui/SkillChip";
import { Marquee } from "@/components/animation/Marquee";

export function SkillsMarquee() {
  const half = Math.ceil(profile.skills.length / 2);
  const rows = [profile.skills.slice(0, half), profile.skills.slice(half)];

  return (
    <Marquee
      rows={rows.map((row) =>
        row.map((skill) => <SkillChip key={skill.label} skill={skill} />),
      )}
    />
  );
}
