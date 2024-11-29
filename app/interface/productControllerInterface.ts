export interface FilterQuery {
  size?: { $in: string[] };
  color?: { $in: string[] };
  brand?: string;
}
