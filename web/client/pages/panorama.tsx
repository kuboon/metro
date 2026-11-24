import type { Handle } from "@remix-run/component";

import { base } from "../base.ts";
import {
  CalendarTile,
  FlipTile,
  Panorama,
  PanoramaSection,
  PhotoTile,
  Tile,
  TileGroup,
} from "../components/metro/mod.ts";
import { routes } from "../routes.ts";

export const title = "photos — metro";
export const description = "Panorama: sideways sections with parallax.";

const photo = (name: string, alt: string) => ({
  src: `${base}/static/photos/${name}.svg`,
  alt,
});

const dusk = photo("dusk", "Mountains at dusk");
const sea = photo("sea", "A sail on the sea");
const forest = photo("forest", "A forest in mist");

export default function PanoramaPage(_handle: Handle) {
  return () => (
    <Panorama
      id="photos"
      title="photos"
      background={dusk.src}
      back={routes.home.href()}
    >
      <PanoramaSection heading="favourites">
        <TileGroup>
          <PhotoTile size="large" photos={[sea, forest, dusk]} />
        </TileGroup>
      </PanoramaSection>
      <PanoramaSection heading="albums">
        <TileGroup>
          <PhotoTile photos={[dusk]} label="evenings" />
          <PhotoTile photos={[sea]} label="coast" />
          <PhotoTile photos={[forest]} label="woods" />
          <Tile icon="photo" label="camera roll" count={128} />
        </TileGroup>
      </PanoramaSection>
      <PanoramaSection heading="what's new">
        <TileGroup>
          <FlipTile
            size="wide"
            front={{ icon: "people", label: "shared with you", count: 2 }}
            back={{
              label: "shared with you",
              lines: ["Haru", "Added twelve photos to coast"],
            }}
          />
          <CalendarTile size="wide" label="today" />
        </TileGroup>
      </PanoramaSection>
    </Panorama>
  );
}
