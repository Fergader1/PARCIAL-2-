export interface PowerStats {
  magic: number;
  strength: number;
  spirit: number;
  total: number;
}

export interface Character {
  id: string;
  name: string;
  alias: string[];
  group: 'Pecado Capital' | 'Mandamiento';
  race: string;
  powerStats: PowerStats;
  abilities: string[];
  sacredTreasure: string;
  description: string;
  image: string;
}
