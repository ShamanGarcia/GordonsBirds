export type TaxonomyReferenceEntry = {
  scientificName: string;
  commonName: string;
  genus: string;
  family: string;
  order: string;
};

/**
 * A small curated, hand-authored reference of common bird taxonomy used to
 * auto-fill common name / genus / family / order when an admin enters a
 * scientific name during upload. Not exhaustive — when a species isn't
 * found here the admin can enter its classification manually (see the
 * upload wizard's Step 3), matching the spec's documented fallback.
 */
export const TAXONOMY_REFERENCE: TaxonomyReferenceEntry[] = [
  // Anseriformes
  { scientificName: "Aix sponsa", commonName: "Wood Duck", genus: "Aix", family: "Anatidae", order: "Anseriformes" },
  { scientificName: "Anas platyrhynchos", commonName: "Mallard", genus: "Anas", family: "Anatidae", order: "Anseriformes" },
  { scientificName: "Branta canadensis", commonName: "Canada Goose", genus: "Branta", family: "Anatidae", order: "Anseriformes" },
  { scientificName: "Cygnus columbianus", commonName: "Tundra Swan", genus: "Cygnus", family: "Anatidae", order: "Anseriformes" },
  { scientificName: "Bucephala clangula", commonName: "Common Goldeneye", genus: "Bucephala", family: "Anatidae", order: "Anseriformes" },

  // Galliformes
  { scientificName: "Meleagris gallopavo", commonName: "Wild Turkey", genus: "Meleagris", family: "Phasianidae", order: "Galliformes" },
  { scientificName: "Callipepla californica", commonName: "California Quail", genus: "Callipepla", family: "Odontophoridae", order: "Galliformes" },
  { scientificName: "Bonasa umbellus", commonName: "Ruffed Grouse", genus: "Bonasa", family: "Phasianidae", order: "Galliformes" },

  // Podicipediformes
  { scientificName: "Podilymbus podiceps", commonName: "Pied-billed Grebe", genus: "Podilymbus", family: "Podicipedidae", order: "Podicipediformes" },

  // Columbiformes
  { scientificName: "Zenaida macroura", commonName: "Mourning Dove", genus: "Zenaida", family: "Columbidae", order: "Columbiformes" },
  { scientificName: "Patagioenas fasciata", commonName: "Band-tailed Pigeon", genus: "Patagioenas", family: "Columbidae", order: "Columbiformes" },

  // Cuculiformes
  { scientificName: "Geococcyx californianus", commonName: "Greater Roadrunner", genus: "Geococcyx", family: "Cuculidae", order: "Cuculiformes" },
  { scientificName: "Coccyzus americanus", commonName: "Yellow-billed Cuckoo", genus: "Coccyzus", family: "Cuculidae", order: "Cuculiformes" },

  // Caprimulgiformes
  { scientificName: "Chordeiles minor", commonName: "Common Nighthawk", genus: "Chordeiles", family: "Caprimulgidae", order: "Caprimulgiformes" },

  // Apodiformes
  { scientificName: "Calypte anna", commonName: "Anna's Hummingbird", genus: "Calypte", family: "Trochilidae", order: "Apodiformes" },
  { scientificName: "Archilochus colubris", commonName: "Ruby-throated Hummingbird", genus: "Archilochus", family: "Trochilidae", order: "Apodiformes" },
  { scientificName: "Selasphorus rufus", commonName: "Rufous Hummingbird", genus: "Selasphorus", family: "Trochilidae", order: "Apodiformes" },
  { scientificName: "Chaetura pelagica", commonName: "Chimney Swift", genus: "Chaetura", family: "Apodidae", order: "Apodiformes" },

  // Gruiformes
  { scientificName: "Antigone canadensis", commonName: "Sandhill Crane", genus: "Antigone", family: "Gruidae", order: "Gruiformes" },
  { scientificName: "Fulica americana", commonName: "American Coot", genus: "Fulica", family: "Rallidae", order: "Gruiformes" },
  { scientificName: "Rallus limicola", commonName: "Virginia Rail", genus: "Rallus", family: "Rallidae", order: "Gruiformes" },

  // Charadriiformes
  { scientificName: "Fratercula arctica", commonName: "Atlantic Puffin", genus: "Fratercula", family: "Alcidae", order: "Charadriiformes" },
  { scientificName: "Charadrius vociferus", commonName: "Killdeer", genus: "Charadrius", family: "Charadriidae", order: "Charadriiformes" },
  { scientificName: "Larus argentatus", commonName: "Herring Gull", genus: "Larus", family: "Laridae", order: "Charadriiformes" },
  { scientificName: "Sterna hirundo", commonName: "Common Tern", genus: "Sterna", family: "Laridae", order: "Charadriiformes" },
  { scientificName: "Haematopus palliatus", commonName: "American Oystercatcher", genus: "Haematopus", family: "Haematopodidae", order: "Charadriiformes" },
  { scientificName: "Scolopax minor", commonName: "American Woodcock", genus: "Scolopax", family: "Scolopacidae", order: "Charadriiformes" },

  // Gaviiformes
  { scientificName: "Gavia immer", commonName: "Common Loon", genus: "Gavia", family: "Gaviidae", order: "Gaviiformes" },

  // Procellariiformes
  { scientificName: "Phoebastria nigripes", commonName: "Black-footed Albatross", genus: "Phoebastria", family: "Diomedeidae", order: "Procellariiformes" },

  // Suliformes
  { scientificName: "Phalacrocorax auritus", commonName: "Double-crested Cormorant", genus: "Phalacrocorax", family: "Phalacrocoracidae", order: "Suliformes" },
  { scientificName: "Fregata magnificens", commonName: "Magnificent Frigatebird", genus: "Fregata", family: "Fregatidae", order: "Suliformes" },

  // Pelecaniformes
  { scientificName: "Ardea herodias", commonName: "Great Blue Heron", genus: "Ardea", family: "Ardeidae", order: "Pelecaniformes" },
  { scientificName: "Ardea alba", commonName: "Great Egret", genus: "Ardea", family: "Ardeidae", order: "Pelecaniformes" },
  { scientificName: "Egretta thula", commonName: "Snowy Egret", genus: "Egretta", family: "Ardeidae", order: "Pelecaniformes" },
  { scientificName: "Nycticorax nycticorax", commonName: "Black-crowned Night Heron", genus: "Nycticorax", family: "Ardeidae", order: "Pelecaniformes" },
  { scientificName: "Platalea ajaja", commonName: "Roseate Spoonbill", genus: "Platalea", family: "Threskiornithidae", order: "Pelecaniformes" },
  { scientificName: "Eudocimus albus", commonName: "White Ibis", genus: "Eudocimus", family: "Threskiornithidae", order: "Pelecaniformes" },
  { scientificName: "Pelecanus occidentalis", commonName: "Brown Pelican", genus: "Pelecanus", family: "Pelecanidae", order: "Pelecaniformes" },
  { scientificName: "Pelecanus erythrorhynchos", commonName: "American White Pelican", genus: "Pelecanus", family: "Pelecanidae", order: "Pelecaniformes" },

  // Accipitriformes
  { scientificName: "Haliaeetus leucocephalus", commonName: "Bald Eagle", genus: "Haliaeetus", family: "Accipitridae", order: "Accipitriformes" },
  { scientificName: "Buteo jamaicensis", commonName: "Red-tailed Hawk", genus: "Buteo", family: "Accipitridae", order: "Accipitriformes" },
  { scientificName: "Accipiter cooperii", commonName: "Cooper's Hawk", genus: "Accipiter", family: "Accipitridae", order: "Accipitriformes" },
  { scientificName: "Pandion haliaetus", commonName: "Osprey", genus: "Pandion", family: "Pandionidae", order: "Accipitriformes" },
  { scientificName: "Cathartes aura", commonName: "Turkey Vulture", genus: "Cathartes", family: "Cathartidae", order: "Accipitriformes" },

  // Strigiformes
  { scientificName: "Bubo scandiacus", commonName: "Snowy Owl", genus: "Bubo", family: "Strigidae", order: "Strigiformes" },
  { scientificName: "Bubo virginianus", commonName: "Great Horned Owl", genus: "Bubo", family: "Strigidae", order: "Strigiformes" },
  { scientificName: "Megascops asio", commonName: "Eastern Screech-Owl", genus: "Megascops", family: "Strigidae", order: "Strigiformes" },
  { scientificName: "Athene cunicularia", commonName: "Burrowing Owl", genus: "Athene", family: "Strigidae", order: "Strigiformes" },
  { scientificName: "Tyto alba", commonName: "Barn Owl", genus: "Tyto", family: "Tytonidae", order: "Strigiformes" },

  // Coraciiformes
  { scientificName: "Megaceryle alcyon", commonName: "Belted Kingfisher", genus: "Megaceryle", family: "Alcedinidae", order: "Coraciiformes" },

  // Piciformes
  { scientificName: "Dryobates pubescens", commonName: "Downy Woodpecker", genus: "Dryobates", family: "Picidae", order: "Piciformes" },
  { scientificName: "Dryocopus pileatus", commonName: "Pileated Woodpecker", genus: "Dryocopus", family: "Picidae", order: "Piciformes" },
  { scientificName: "Melanerpes carolinus", commonName: "Red-bellied Woodpecker", genus: "Melanerpes", family: "Picidae", order: "Piciformes" },
  { scientificName: "Colaptes auratus", commonName: "Northern Flicker", genus: "Colaptes", family: "Picidae", order: "Piciformes" },

  // Falconiformes
  { scientificName: "Falco peregrinus", commonName: "Peregrine Falcon", genus: "Falco", family: "Falconidae", order: "Falconiformes" },
  { scientificName: "Falco sparverius", commonName: "American Kestrel", genus: "Falco", family: "Falconidae", order: "Falconiformes" },

  // Psittaciformes
  { scientificName: "Psittacus erithacus", commonName: "Grey Parrot", genus: "Psittacus", family: "Psittacidae", order: "Psittaciformes" },
  { scientificName: "Ara macao", commonName: "Scarlet Macaw", genus: "Ara", family: "Psittacidae", order: "Psittaciformes" },

  // Passeriformes
  { scientificName: "Cardinalis cardinalis", commonName: "Northern Cardinal", genus: "Cardinalis", family: "Cardinalidae", order: "Passeriformes" },
  { scientificName: "Passerina cyanea", commonName: "Indigo Bunting", genus: "Passerina", family: "Cardinalidae", order: "Passeriformes" },
  { scientificName: "Turdus migratorius", commonName: "American Robin", genus: "Turdus", family: "Turdidae", order: "Passeriformes" },
  { scientificName: "Sialia sialis", commonName: "Eastern Bluebird", genus: "Sialia", family: "Turdidae", order: "Passeriformes" },
  { scientificName: "Setophaga petechia", commonName: "Yellow Warbler", genus: "Setophaga", family: "Parulidae", order: "Passeriformes" },
  { scientificName: "Setophaga coronata", commonName: "Yellow-rumped Warbler", genus: "Setophaga", family: "Parulidae", order: "Passeriformes" },
  { scientificName: "Setophaga magnolia", commonName: "Magnolia Warbler", genus: "Setophaga", family: "Parulidae", order: "Passeriformes" },
  { scientificName: "Setophaga caerulescens", commonName: "Black-throated Blue Warbler", genus: "Setophaga", family: "Parulidae", order: "Passeriformes" },
  { scientificName: "Geothlypis trichas", commonName: "Common Yellowthroat", genus: "Geothlypis", family: "Parulidae", order: "Passeriformes" },
  { scientificName: "Mniotilta varia", commonName: "Black-and-white Warbler", genus: "Mniotilta", family: "Parulidae", order: "Passeriformes" },
  { scientificName: "Cyanocitta cristata", commonName: "Blue Jay", genus: "Cyanocitta", family: "Corvidae", order: "Passeriformes" },
  { scientificName: "Corvus brachyrhynchos", commonName: "American Crow", genus: "Corvus", family: "Corvidae", order: "Passeriformes" },
  { scientificName: "Corvus corax", commonName: "Common Raven", genus: "Corvus", family: "Corvidae", order: "Passeriformes" },
  { scientificName: "Pica hudsonia", commonName: "Black-billed Magpie", genus: "Pica", family: "Corvidae", order: "Passeriformes" },
  { scientificName: "Poecile atricapillus", commonName: "Black-capped Chickadee", genus: "Poecile", family: "Paridae", order: "Passeriformes" },
  { scientificName: "Baeolophus bicolor", commonName: "Tufted Titmouse", genus: "Baeolophus", family: "Paridae", order: "Passeriformes" },
  { scientificName: "Sitta carolinensis", commonName: "White-breasted Nuthatch", genus: "Sitta", family: "Sittidae", order: "Passeriformes" },
  { scientificName: "Certhia americana", commonName: "Brown Creeper", genus: "Certhia", family: "Certhiidae", order: "Passeriformes" },
  { scientificName: "Troglodytes aedon", commonName: "House Wren", genus: "Troglodytes", family: "Troglodytidae", order: "Passeriformes" },
  { scientificName: "Thryothorus ludovicianus", commonName: "Carolina Wren", genus: "Thryothorus", family: "Troglodytidae", order: "Passeriformes" },
  { scientificName: "Regulus satrapa", commonName: "Golden-crowned Kinglet", genus: "Regulus", family: "Regulidae", order: "Passeriformes" },
  { scientificName: "Polioptila caerulea", commonName: "Blue-gray Gnatcatcher", genus: "Polioptila", family: "Polioptilidae", order: "Passeriformes" },
  { scientificName: "Bombycilla cedrorum", commonName: "Cedar Waxwing", genus: "Bombycilla", family: "Bombycillidae", order: "Passeriformes" },
  { scientificName: "Sturnus vulgaris", commonName: "European Starling", genus: "Sturnus", family: "Sturnidae", order: "Passeriformes" },
  { scientificName: "Mimus polyglottos", commonName: "Northern Mockingbird", genus: "Mimus", family: "Mimidae", order: "Passeriformes" },
  { scientificName: "Dumetella carolinensis", commonName: "Gray Catbird", genus: "Dumetella", family: "Mimidae", order: "Passeriformes" },
  { scientificName: "Toxostoma rufum", commonName: "Brown Thrasher", genus: "Toxostoma", family: "Mimidae", order: "Passeriformes" },
  { scientificName: "Sturnella magna", commonName: "Eastern Meadowlark", genus: "Sturnella", family: "Icteridae", order: "Passeriformes" },
  { scientificName: "Agelaius phoeniceus", commonName: "Red-winged Blackbird", genus: "Agelaius", family: "Icteridae", order: "Passeriformes" },
  { scientificName: "Quiscalus quiscula", commonName: "Common Grackle", genus: "Quiscalus", family: "Icteridae", order: "Passeriformes" },
  { scientificName: "Icterus galbula", commonName: "Baltimore Oriole", genus: "Icterus", family: "Icteridae", order: "Passeriformes" },
  { scientificName: "Molothrus ater", commonName: "Brown-headed Cowbird", genus: "Molothrus", family: "Icteridae", order: "Passeriformes" },
  { scientificName: "Spinus tristis", commonName: "American Goldfinch", genus: "Spinus", family: "Fringillidae", order: "Passeriformes" },
  { scientificName: "Haemorhous mexicanus", commonName: "House Finch", genus: "Haemorhous", family: "Fringillidae", order: "Passeriformes" },
  { scientificName: "Haemorhous purpureus", commonName: "Purple Finch", genus: "Haemorhous", family: "Fringillidae", order: "Passeriformes" },
  { scientificName: "Passer domesticus", commonName: "House Sparrow", genus: "Passer", family: "Passeridae", order: "Passeriformes" },
  { scientificName: "Melospiza melodia", commonName: "Song Sparrow", genus: "Melospiza", family: "Passerellidae", order: "Passeriformes" },
  { scientificName: "Zonotrichia albicollis", commonName: "White-throated Sparrow", genus: "Zonotrichia", family: "Passerellidae", order: "Passeriformes" },
  { scientificName: "Junco hyemalis", commonName: "Dark-eyed Junco", genus: "Junco", family: "Passerellidae", order: "Passeriformes" },
  { scientificName: "Pipilo erythrophthalmus", commonName: "Eastern Towhee", genus: "Pipilo", family: "Passerellidae", order: "Passeriformes" },
  { scientificName: "Piranga olivacea", commonName: "Scarlet Tanager", genus: "Piranga", family: "Cardinalidae", order: "Passeriformes" },
  { scientificName: "Vireo olivaceus", commonName: "Red-eyed Vireo", genus: "Vireo", family: "Vireonidae", order: "Passeriformes" },
  { scientificName: "Tyrannus tyrannus", commonName: "Eastern Kingbird", genus: "Tyrannus", family: "Tyrannidae", order: "Passeriformes" },
  { scientificName: "Sayornis phoebe", commonName: "Eastern Phoebe", genus: "Sayornis", family: "Tyrannidae", order: "Passeriformes" },
  { scientificName: "Contopus virens", commonName: "Eastern Wood-Pewee", genus: "Contopus", family: "Tyrannidae", order: "Passeriformes" },
  { scientificName: "Hirundo rustica", commonName: "Barn Swallow", genus: "Hirundo", family: "Hirundinidae", order: "Passeriformes" },
  { scientificName: "Tachycineta bicolor", commonName: "Tree Swallow", genus: "Tachycineta", family: "Hirundinidae", order: "Passeriformes" },
  { scientificName: "Progne subis", commonName: "Purple Martin", genus: "Progne", family: "Hirundinidae", order: "Passeriformes" },

  // Sphenisciformes
  { scientificName: "Aptenodytes forsteri", commonName: "Emperor Penguin", genus: "Aptenodytes", family: "Spheniscidae", order: "Sphenisciformes" },
  { scientificName: "Spheniscus demersus", commonName: "African Penguin", genus: "Spheniscus", family: "Spheniscidae", order: "Sphenisciformes" },

  // Phoenicopteriformes
  { scientificName: "Phoenicopterus ruber", commonName: "American Flamingo", genus: "Phoenicopterus", family: "Phoenicopteridae", order: "Phoenicopteriformes" },

  // Trogoniformes
  { scientificName: "Trogon elegans", commonName: "Elegant Trogon", genus: "Trogon", family: "Trogonidae", order: "Trogoniformes" },
];

export function findTaxonomyReference(scientificName: string) {
  const q = scientificName.trim().toLowerCase();
  return TAXONOMY_REFERENCE.find((e) => e.scientificName.toLowerCase() === q);
}

export function searchTaxonomyReference(query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TAXONOMY_REFERENCE.filter(
    (e) =>
      e.scientificName.toLowerCase().includes(q) ||
      e.commonName.toLowerCase().includes(q),
  ).slice(0, limit);
}
