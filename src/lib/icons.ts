import { Code2, GraduationCap, Layers, MapPin, Server, Wrench, type LucideIcon } from "lucide-react";

/**
 * Icons that `portfolio.json` can reference by name.
 * To use a new icon in the JSON, import it here and add it to the map.
 */
const icons: Record<string, LucideIcon> = {
  Code2,
  GraduationCap,
  Layers,
  MapPin,
  Server,
  Wrench,
};

export const getIcon = (name: string): LucideIcon => icons[name] ?? Code2;
