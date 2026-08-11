// Fixed, muted, desaturated colour per category. Order matches first
// appearance in the dataset; values chosen to stay legible in both themes.
export const categoryColor: Record<string, string> = {
  "Education and Student Movements": "#7a6a45",
  "Job Seekers and Employment Movements": "#4a6b7a",
  "Professional, Employee and Institutional Movements": "#6b5a7a",
  "Social, Political and Rights-Based Movements": "#2f4a3c",
  "Other Miscellaneous Movements": "#7a7a6a",
  "Transport and Communication Sector Movements": "#7a5545",
  "Garment and Industrial Workers' Movements": "#5a6b45",
};

export function colorFor(cat: string): string {
  return categoryColor[cat] ?? "#7a7a6a";
}

// short label for tight UI, e.g. filter chips
export const categoryShort: Record<string, string> = {
  "Education and Student Movements": "Education & Students",
  "Job Seekers and Employment Movements": "Job Seekers",
  "Professional, Employee and Institutional Movements": "Professional & Institutional",
  "Social, Political and Rights-Based Movements": "Social & Political",
  "Other Miscellaneous Movements": "Other",
  "Transport and Communication Sector Movements": "Transport & Communication",
  "Garment and Industrial Workers' Movements": "Garment & Industrial",
};

export function shortLabel(cat: string): string {
  return categoryShort[cat] ?? cat;
}
