/**
 * GIGI FLOWERS - Types Definition
 */

export interface FlowerComponent {
  nameArabic: string;
  nameEnglish: string;
  color: string;
  percentage: number;
  symbolicMeaning: string;
}

export type KoshaStyle = "RoseWall" | "CrystalHarp" | "GardenArch" | "ModernGold";
export type TableStyle = "Round" | "Banqueting";
export type FlowerDensity = "moderate" | "dense" | "royal";

export interface FloorLayout {
  catwalkLength: number; // in meters (e.g., 10 to 25)
  hasFlowerArch: boolean;
  lightingColor: string; // Hex code of spotlighting
  koshaBackground: KoshaStyle;
  tableStyle: TableStyle;
  flowerDensity: FlowerDensity;
}

export interface SuggestedLighting {
  intensity: number; // 40 to 100
  ambientHex: string; // Hex for ambient wash
  spotlightHex: string; // Hex for focuses
  atmosphereName: string; // Poetic atmosphere name
}

export interface VenueDesign {
  themeName: string;
  themeEnglish: string;
  recommendedFlowers: FlowerComponent[];
  floorLayout: FloorLayout;
  aestheticDescription: string;
  suggestedLighting: SuggestedLighting;
  estimatedBudgetSAR: number;
  ksaSuitability: string;
}

export interface PresetVenue {
  id: string;
  title: string;
  titleEn: string;
  location: string;
  capacity: string;
  description: string;
  imgUrl: string;
  designer: string;
  defaultDesign: VenueDesign;
}
