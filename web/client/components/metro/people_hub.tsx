import { css, type Handle } from "@remix-run/component";

import { color, weight } from "../../tokens.ts";
import type { Contact, Post } from "./_lib/types.ts";
import { ContactMosaic } from "./contact_mosaic.tsx";
import { Panorama, PanoramaSection } from "./panorama.tsx";

export interface PeopleHubProps {
  id: string;
  title?: string;
  background?: string;
  back?: string;
  contacts: Contact[];
  posts: Post[];
}

/** The people panorama: recent faces, what they said, and everyone by name. */
export function PeopleHub(handle: Handle<PeopleHubProps>) {
  return () => {
    const { id, title = "people", background, back, contacts, posts } =
      handle.props;
    const sorted = contacts.toSorted((a, b) => a.name.localeCompare(b.name));
    return (
      <Panorama id={id} title={title} background={background} back={back}>
        <PanoramaSection heading="recent">
          <ContactMosaic contacts={contacts} />
        </PanoramaSection>
        <PanoramaSection heading="what's new">
          <ul>
            {posts.map((post) => (
              <PostRow key={`${post.author} ${post.when}`} {...post} />
            ))}
          </ul>
        </PanoramaSection>
        <PanoramaSection heading="all">
          <ul>
            {sorted.map(({ name }) => <li key={name} mix={nameStyle}>{name}
            </li>)}
          </ul>
        </PanoramaSection>
      </Panorama>
    );
  };
}

/** One post: who, what, when. */
export function PostRow(handle: Handle<Post>) {
  return () => (
    <li mix={postStyle}>
      <p mix={authorStyle}>{handle.props.author}</p>
      <p>{handle.props.text}</p>
      <p mix={whenStyle}>{handle.props.when}</p>
    </li>
  );
}

const postStyle = css({ marginBottom: "1.25rem" });

const authorStyle = css({
  fontSize: "1.35rem",
  fontWeight: weight.light,
  lineHeight: 1.25,
});

const whenStyle = css({ fontSize: "0.85rem", color: color.muted });

const nameStyle = css({
  paddingBlock: "0.3rem",
  fontSize: "1.6rem",
  fontWeight: weight.thin,
});
