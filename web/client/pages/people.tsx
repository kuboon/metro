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
        { name: "Ada Lovelace", photo: photo("sea") },
        { name: "Linus Torvalds" },
        { name: "Alan Turing" },
        { name: "Grace Hopper", photo: photo("dusk") },
        { name: "Dennis Ritchie" },
        { name: "Margaret Hamilton", photo: photo("forest") },
        { name: "Tim Berners-Lee" },
        { name: "Yukihiro Matsumoto" },
      ]}
      posts={[
        {
          author: "Linus Torvalds",
          text: "The last ferry back was worth the wait.",
          when: "12 minutes ago",
        },
        {
          author: "Grace Hopper",
          text: "Set the whole poster in one weight. No regrets.",
          when: "an hour ago",
        },
        {
          author: "Yukihiro Matsumoto",
          text: "Anyone for the hills on Sunday?",
          when: "yesterday",
        },
      ]}
    />
  );
}
