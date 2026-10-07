/*
 * Registry of LPs. Each entry becomes a page at /<slug>.
 * To add an LP: copy downsizing.ts, change slug, scene, copy and section order,
 * then add it to this list.
 */
import type { LandingPage } from '../types';
import { downsizing } from './downsizing';

export const landingPages: LandingPage[] = [downsizing];
