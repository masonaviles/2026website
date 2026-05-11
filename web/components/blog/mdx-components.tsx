import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { Aside } from "./Aside";
import { Achievement } from "./Achievement";

export const mdxComponents: NonNullable<MDXRemoteProps["components"]> = {
  Aside,
  Achievement,
};
