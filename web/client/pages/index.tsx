import type { Handle } from "@remix-run/component";

import { base } from "../base.ts";
import {
  AccentPicker,
  CalendarTile,
  FlipTile,
  type Photo,
  PhotoTile,
  PivotHub,
  StartScreen,
  Tile,
  TileGroup,
} from "../components/metro/mod.ts";
import { routes } from "../routes.ts";

export const title = "metro";
export const description =
  "A Metro / Modern UI design system for the web, in Remix 3 components.";

const photos: Photo[] = [
  { src: `${base}/static/photos/dusk.svg`, alt: "Mountains at dusk" },
  { src: `${base}/static/photos/sea.svg`, alt: "A sail on the sea" },
  { src: `${base}/static/photos/forest.svg`, alt: "A forest in mist" },
];

/** The Start screen: components with props, and no markup of its own. */
export default function Home(_handle: Handle) {
  return () => (
    <PivotHub
      id="start"
      title="metro"
      label="screens"
      items={[
        {
          name: "start",
          heading: "start",
          content: (
            <StartScreen>
              <TileGroup name="everyday">
                <FlipTile
                  front={{ icon: "message", label: "messages", count: 3 }}
                  back={{
                    label: "messages",
                    lines: ["Aoi", "See you at the station at six?"],
                  }}
                  interval={5000}
                />
                <CalendarTile
                  event="design review, 14:00"
                  href={routes.calendar.href()}
                />
                <FlipTile
                  size="wide"
                  front={{ icon: "mail", label: "mail", count: 12 }}
                  back={{
                    label: "mail",
                    lines: [
                      "Weekly digest",
                      "Grid, type and motion: what to read this week",
                    ],
                  }}
                  interval={7000}
                  delay={1200}
                />
                <Tile size="small" icon="phone" label="phone" />
                <Tile
                  size="small"
                  icon="people"
                  label="people"
                  href={routes.people.href()}
                />
                <Tile
                  size="small"
                  icon="photo"
                  label="photos"
                  href={routes.panorama.href()}
                />
                <Tile size="small" icon="mail" label="work mail" count={4} />
              </TileGroup>

              <TileGroup name="life">
                <PhotoTile
                  size="wide"
                  photos={photos}
                  label="photos"
                  href={routes.panorama.href()}
                />
                <FlipTile
                  front={{ icon: "music", label: "music" }}
                  back={{
                    label: "music",
                    lines: ["Now playing", "Night Train — The Grids"],
                  }}
                  interval={6000}
                  delay={2000}
                />
                <FlipTile
                  front={{
                    icon: "sun",
                    headline: "21°",
                    lines: ["sunny"],
                    label: "weather",
                  }}
                  back={{
                    label: "weather",
                    lines: ["Tomorrow 18°", "Cloudy, rain after noon"],
                  }}
                  interval={8000}
                  delay={600}
                />
                <Tile
                  size="wide"
                  icon="people"
                  label="people"
                  href={routes.people.href()}
                />
              </TileGroup>
            </StartScreen>
          ),
        },
        { name: "settings", heading: "settings", content: <AccentPicker /> },
      ]}
    />
  );
}
