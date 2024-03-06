import { NotFoundException } from "@exceptions/not-fount.exception";
import { IncomingMessage } from "http";

export type RouteSegment = string | null;

/**
 * Removes empty segments from a list of segments.
 * @param segments List of segments.
 * @returns List of segments without empty segments.
 */
export function removeEmptySegments(segments: string[]): string[] {
  return segments.filter(Boolean);
}

/**
 * Splits a URL into segments.
 * @param url URL to split.
 * @returns List of URL segments.
 */
export function splitUrlIntoSegments(url?: string): string[] {
  return url?.split('/') ?? [];
}

/**
 * Checks if two segments match.
 * @param route_url_segment Route segment.
 * @param request_url_segment Request segment.
 * @returns true if the segments match, false otherwise.
 */
export function segmentsMatch(route_url_segment: RouteSegment, request_url_segment: RouteSegment): boolean {
  if (route_url_segment === null || request_url_segment === null) {
    return false;
  }

  return route_url_segment.startsWith(':') || route_url_segment === request_url_segment;
}

/**
 * Checks if a route matches the request URL.
 * @param route_url_segments Route segments.
 * @param request_url_segments Request segments.
 * @returns true if the route matches the request URL, false otherwise.
 */
export function routeMatchesRequest(route_url_segments: string[], request_url_segments: string[]): boolean {
  if (route_url_segments.length !== request_url_segments.length) {
    return false;
  }

  return route_url_segments.every((route_url_segment, index) => segmentsMatch(route_url_segment, request_url_segments[index]));
}

/**
 * Checks if a route matches the request URL.
 * @param route_url Route path.
 * @param request_url Request URL.
 * @param prefix Route prefix.
 * @returns true if the route matches the request URL, false otherwise.
 */
export function routeMatchesUrl(route_url?: string, request_url?: string): boolean {
  const route_url_segments = splitUrlIntoSegments(route_url);
  const request_url_segments = splitUrlIntoSegments(request_url);
  const non_empty_route_url_segments = removeEmptySegments(route_url_segments);
  const non_empty_request_url_segments = removeEmptySegments(request_url_segments);
  return routeMatchesRequest(non_empty_route_url_segments, non_empty_request_url_segments);
}

/**
 * Checks if a route matches the request.
 * @param request URL and method of the request.
 * @param route URL and method of the route.
 * @returns A string representing the route match key, or undefined if no match is found.
 */
export function getRouteMatchKey(
  request: { url?: string, method: string },
  route: { url: string, method: string },
): string | undefined {
  if (route.method && route.method.toLowerCase() !== request.method.toLowerCase()) {
    return undefined;
  }

  const route_match = routeMatchesUrl(route.url, request.url);

  return route_match ? `${route.method}|${route.url}` : undefined;
}
