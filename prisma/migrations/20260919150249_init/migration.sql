-- CreateTable
CREATE TABLE "Species" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scientificName" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "genus" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalUrl" TEXT NOT NULL,
    "optimizedUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "blurDataUrl" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "dateUploaded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datePhotographed" DATETIME,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "locationName" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "placeName" TEXT,
    "photographer" TEXT,
    "sourceUrl" TEXT,
    "license" TEXT,
    "speciesId" TEXT NOT NULL,
    CONSTRAINT "Photo_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Species_scientificName_key" ON "Species"("scientificName");

-- CreateIndex
CREATE INDEX "Species_genus_idx" ON "Species"("genus");

-- CreateIndex
CREATE INDEX "Species_family_idx" ON "Species"("family");

-- CreateIndex
CREATE INDEX "Species_order_idx" ON "Species"("order");

-- CreateIndex
CREATE INDEX "Photo_speciesId_idx" ON "Photo"("speciesId");

-- CreateIndex
CREATE INDEX "Photo_country_idx" ON "Photo"("country");

-- CreateIndex
CREATE INDEX "Photo_region_idx" ON "Photo"("region");
