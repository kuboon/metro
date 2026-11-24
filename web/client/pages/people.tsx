import type { Handle } from "@remix-run/component";

import { base } from "../base.ts";
import { PeopleHub } from "../components/metro/mod.ts";
import { routes } from "../routes.ts";

export const title = "people — metro";
export const description = "PeopleHub: a panorama of contacts and posts.";

const photo = (name: string) => `${base}/static/photos/${name}.svg`;

export default function People(_handle: Handle) {
  return () => (
    <PeopleHub
      id="people"
      background={photo("forest")}
      back={routes.home.href()}
      contacts={[
        { name: "Aoi Mori", photo: photo("sea") },
        { name: "Haru Ito" },
        { name: "Ren Abe" },
        { name: "Mio Sato", photo: photo("dusk") },
        { name: "Sora Kato" },
        { name: "Yui Hara", photo: photo("forest") },
        { name: "Nao Endo" },
        { name: "Kai Ono" },
      ]}
      posts={[
        {
          author: "Haru Ito",
          text: "The last ferry back was worth the wait.",
          when: "12 minutes ago",
        },
        {
          author: "Mio Sato",
          text: "Set the whole poster in one weight. No regrets.",
          when: "an hour ago",
        },
        {
          author: "Kai Ono",
          text: "Anyone for the hills on Sunday?",
          when: "yesterday",
        },
      ]}
    />
  );
}
