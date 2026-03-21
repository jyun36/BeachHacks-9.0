import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Scanner } from "./components/Scanner";
import { PileTracker } from "./components/PileTracker";
import { PileHealth } from "./components/PileHealth";
import { ScanResult } from "./components/ScanResult";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/scanner",
    Component: Scanner,
  },
  {
    path: "/pile",
    Component: PileTracker,
  },
  {
    path: "/health",
    Component: PileHealth,
  },
  {
    path: "/result/:itemType",
    Component: ScanResult,
  },
]);
