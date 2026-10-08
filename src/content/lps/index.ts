/*
 * Registry of LPs. Each entry becomes a page at /<slug>.
 * To add an LP: copy downsizing.ts, change slug, scene, copy and section order,
 * then add it to this list.
 */
import type { LandingPage } from '../types';
import { downsizing } from './downsizing';

// /home-value has its own route and request flow in pages/home-value.astro.
export const landingPages: LandingPage[] = [downsizing];
