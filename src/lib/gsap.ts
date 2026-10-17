"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

// Named eases for UI motion. "ui-out" matches the --ease-out token in globals.css;
// "ui-move" is a strong ease-in-out for things travelling across the screen;
// "drawer" is the iOS sheet curve.
CustomEase.create("ui-out", "0.23, 1, 0.32, 1");
CustomEase.create("ui-move", "0.77, 0, 0.175, 1");
CustomEase.create("drawer", "0.32, 0.72, 0, 1");

export { gsap, ScrollTrigger, useGSAP };
