import { diff, Diff } from "deep-diff";

export function hashDiffFormat(obj1: any, obj2: any) {
  const differences = diff(obj1, obj2);
  if (!differences) return [];

  return differences
    .map((d: Diff<any>) => {
      if (!d.path) return null;
      const path = d.path.join(".");
      switch (d.kind) {
        case "E":
          return ["~", path, d.lhs, d.rhs];
        case "N":
          return ["+", path, d.rhs];
        case "D":
          return ["-", path, d.lhs];
        default:
          return null;
      }
    })
    .filter(Boolean);
}
