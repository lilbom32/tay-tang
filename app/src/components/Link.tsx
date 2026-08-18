// preact-router@4's shipped types target an older Preact HTMLAttributes shape
// that no longer declares `href`. Re-typed thin wrapper so call sites get
// real prop checking instead of suppressing errors ad hoc everywhere.
import type { ComponentChildren, JSX } from "preact";
import { Link as RouterLink } from "preact-router/match";

interface LinkProps {
  href: string;
  class?: string;
  activeClassName?: string;
  role?: string;
  onClick?: () => void;
  children?: ComponentChildren;
}

const TypedLink = RouterLink as unknown as (props: LinkProps) => JSX.Element;

export function Link(props: LinkProps) {
  return <TypedLink {...props} />;
}
