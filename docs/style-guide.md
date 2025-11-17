# Style Guide: Two Pointer Visualization Component

## I. Overview

The Two Pointer Visualization component features a distinct "Cosmic Tech" or "Nebula Interactive" design language. It aims for a dark, modern, immersive, and interactive experience, optimized for data visualization.

## II. Core Design Principles

*   **Layout:**
    *   Centered main content area (`max-w-6xl mx-auto`).
    *   Spacious padding (`p-8`).
    *   Clear visual hierarchy.
*   **Typography:**
    *   Sans-serif font (likely Geist).
    *   Main Title: `text-5xl font-bold text-white` (with gradient)
    *   Subtitle: `text-xl text-purple-200`
    *   General Text: `text-white` or `text-purple-200`
*   **Key Visual Effects:**
    *   **Dynamic Background Gradient:** `linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(88, 28, 135) 50%, rgb(15, 23, 42) 100%)` (slate-900 to purple-900 to slate-900).
    *   **Interactive Mouse Lighting:** `radial-gradient(600px at mouseX mouseY, rgba(124, 58, 237, 0.15), transparent 80%)`.
    *   **Animated Background Blurs:** `bg-purple-500/10` and `bg-blue-500/10` with `blur-3xl`.
    *   **Glassmorphism:** `bg-white/10 hover:bg-white/20 backdrop-blur-sm`.
    *   **Gradient Text:** `bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent`.
*   **Animation:** Framer Motion is used for page load animations, hover effects, and transitions.

## III. Color Palette

*   **Core Background Palette (Dark & Cosmic):**
    *   `slate-900` (rgb(15, 23, 42) - Very dark desaturated blue/gray)
    *   `purple-900` (rgb(88, 28, 135) - Deep purple)
*   **Primary Accent Colors (Purples & Pinks):**
    *   `purple-500` (Vibrant purple)
    *   `purple-200` (Light purple)
    *   `purple-100` (Very light purple)
    *   `pink-500` (Vibrant pink)
    *   `rgba(124, 58, 237, 0.15)` (Transparent vibrant purple)
*   **Secondary Accent Colors (Blues):**
    *   `blue-500` (Vibrant blue)
*   **Neutral & UI Element Colors:**
    *   `white`
    *   `white/10` (White at 10% opacity)
    *   `white/20` (White at 20% opacity)
    *   `white/30` (White at 30% opacity)
*   **Functional/Semantic Colors:**
    *   **Success:**
        *   `green-500` (Vibrant green)
        *   `emerald-500` (Vibrant emerald/teal)
    *   **Secondary:**
        *   `slate-500` (Medium gray)
        *   `slate-600` (Darker medium gray)
    *   **Danger:**
        *   `red-500` (Vibrant red)
        *   `rose-500` (Vibrant rose/pink-red)

## IV. Key UI Elements & Styling

*   **Buttons:** Glassmorphic style with `white/10` background, `white` text, and hover effects. Gradient buttons are used for primary actions.
*   **Progress Bar:** `bg-white/10` track with a `blue-500` to `purple-500` gradient fill.
*   **Modals:** Follow the glassmorphic style with dark backgrounds and white/purple text.

## V. Animation

Framer Motion is used for smooth and engaging animations, including:

*   Page load animations (`FadeIn`, `StaggerContainer`).
*   Button hover effects (rotation, scaling).
*   Progress bar transitions.
