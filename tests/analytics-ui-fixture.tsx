// Isolated test harness: never included in the production app or deployed.
import React from "react";
import { createRoot } from "react-dom/client";
import {
  AnalyticsConsent,
  AnalyticsPreferencesButton,
} from "../src/components/roty/AnalyticsConsent";
import { DemandeForm } from "../src/components/roty/DemandeForm";

createRoot(document.getElementById("fixture")!).render(
  <main>
    <AnalyticsPreferencesButton />
    <DemandeForm defaults={{}} />
    <AnalyticsConsent pathname="/demande/" allowedPaths={["/", "/demande/", "/vins/"]} />
  </main>,
);
