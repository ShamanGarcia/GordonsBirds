export type LocationDraft = {
  locationName: string;
  country?: string;
  region?: string;
  lat: number;
  lng: number;
};

export type PhotoDraft = {
  file: File;
  previewUrl: string;
  location: LocationDraft | null;
};

export type SpeciesDraft = {
  scientificName: string;
  commonName: string;
  genus: string;
  family: string;
  order: string;
};
