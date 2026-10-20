/*
 * Registry of LPs. Each entry becomes a page at /<slug>.
 * To add an LP: copy downsizing.ts, change slug, scene, copy and section order,
 * then add it to this list.
 * Silver is not listed: it has its own page (src/pages/silver.astro, see content/lps/silver.ts).
 */
import type { LandingPage } from '../types';
import { downsizing } from './downsizing';

export const landingPages: LandingPage[] = [downsizing];
