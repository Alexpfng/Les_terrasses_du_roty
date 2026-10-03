// Google is loaded only after an explicit, valid consent AND an authorization
// from our server. This module has no browser side effects when imported by SSR.
export const ANALYTICS_ORIGIN = "https://www.les-terrasses-du-roty.fr";
export const CONSENT_STORAGE_KEY = "roty-audience-choice-v1";
export const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000;
export const ANALYTICS_PREFERENCES_EVENT = "roty:audience-preferences";
export type AnalyticsChoice = "unknown" | "accepted" | "refused";
export type AnalyticsState = {
  ready: boolean;
  available: boolean;
  choice: AnalyticsChoice;
};
type ConsentRecord = {
  version: 1;
  choice: "accepted" | "refused";
  updatedAt: number;
  expiresAt: number;
};
type CategoryInput = { profile?: unknown; cuvee?: unknown };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean;
};

export function validMeasurementId(value: unknown): value is string {
  return typeof value === "string" && /^G-[A-Z0-9]{6,20}$/.test(value);
}

export function googleSiteVerificationMeta(token: unknown) {
  return typeof token === "string" && /^[A-Za-z0-9_-]{20,200}$/.test(token)
    ? [{ name: "google-site-verification", content: token }]
    : [];
}

export function parseConsentRecord(raw: string | null, now = Date.now()): ConsentRecord | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const record = value as Partial<ConsentRecord>;
    if (
      record.version !== 1 ||
      !["accepted", "refused"].includes(String(record.choice)) ||
      typeof record.updatedAt !== "number" ||
      !Number.isFinite(record.updatedAt) ||
      typeof record.expiresAt !== "number" ||
      !Number.isFinite(record.expiresAt) ||
      record.updatedAt > now ||
      record.expiresAt <= now ||
      record.expiresAt - record.updatedAt !== CONSENT_DURATION_MS
    )
      return null;
    return record as ConsentRecord;
  } catch {
    return null;
  }
}

export function safeAnalyticsPage(input: string, allowedPaths: readonly string[]) {
  try {
    const url = new URL(input, ANALYTICS_ORIGIN);
    // A whitelist also protects against names/e-mail addresses placed in a path.
    if (url.origin !== ANALYTICS_ORIGIN || !allowedPaths.includes(url.pathname)) return null;
    return {
      page_location: ANALYTICS_ORIGIN + url.pathname,
      page_title:
        url.pathname === "/"
          ? "Les Terrasses du Roty — accueil"
          : `Les Terrasses du Roty — ${url.pathname}`,
    };
  } catch {
    return null;
  }
}

export function safeAnalyticsCategories(input: CategoryInput) {
  const profile = ["particulier", "professionnel", "caviste", "restaurateur"].includes(
    String(input.profile),
  )
    ? String(input.profile)
    : undefined;
  const cuvee = ["2023", "2024", "a_conseiller"].includes(String(input.cuvee))
    ? String(input.cuvee)
    : undefined;
  return { ...(profile ? { visitor_profile: profile } : {}), ...(cuvee ? { cuvee } : {}) };
}

/** Browser dependencies are injected so tests can block every external request. */
export function createAnalyticsController({
  browser,
  allowedPaths,
  now = Date.now,
}: {
  browser: Window;
  allowedPaths: readonly string[];
  now?: () => number;
}) {
  const win = browser as AnalyticsWindow;
  const doc = win.document;
  let state: AnalyticsState = { ready: false, available: false, choice: "unknown" };
  let record: ConsentRecord | null = null;
  let measurementId = "";
  let disposed = false;
  let initialized = false;
  let configured = false;
  let script: HTMLScriptElement | null = null;
  let googleLoaded = false;
  let epoch = 0;
  let currentPath = win.location.pathname;
  let lastPage = "";
  let expiryTimer: number | undefined;
  let configAbort: AbortController | undefined;
  let command: ((...args: unknown[]) => void) | undefined;
  const listeners = new Set<(state: AnalyticsState) => void>();
  const isCanonical = () => win.location.origin === ANALYTICS_ORIGIN;
  const publish = () => listeners.forEach((listener) => listener({ ...state }));
  const canSend = () =>
    !disposed &&
    state.available &&
    state.choice === "accepted" &&
    isCanonical() &&
    Boolean(record && record.expiresAt > now());

  function readChoice() {
    try {
      const raw = win.localStorage.getItem(CONSENT_STORAGE_KEY);
      const saved = parseConsentRecord(raw, now());
      if (raw && !saved) win.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return saved;
    } catch {
      return null;
    }
  }

  function removeCookies() {
    const names = doc.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0].trim())
      .filter((name) => /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name));
    for (const name of names) {
      for (const domain of [
        "",
        "www.les-terrasses-du-roty.fr",
        ".www.les-terrasses-du-roty.fr",
        "les-terrasses-du-roty.fr",
        ".les-terrasses-du-roty.fr",
      ]) {
        doc.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? `; Domain=${domain}` : ""}`;
      }
    }
  }

  function stop() {
    epoch++;
    // This documented switch is checked by GA itself. Do not send a consent
    // update here: denied-mode pings would contradict our basic consent model.
    if (measurementId) win[`ga-disable-${measurementId}`] = true;
    configured = false;
    lastPage = "";
    script?.remove();
    script = null;
    if (win.dataLayer && command) win.dataLayer.length = 0;
    if (command && win.gtag === command) win.gtag = () => undefined;
    removeCookies();
  }

  function scheduleExpiry() {
    win.clearTimeout(expiryTimer);
    if (!record || disposed) return;
    expiryTimer = win.setTimeout(
      () => {
        if (record && record.expiresAt <= now()) {
          record = null;
          state = { ...state, choice: "unknown" };
          stop();
          publish();
        }
        scheduleExpiry();
      },
      Math.min(record.expiresAt - now(), 24 * 60 * 60 * 1000),
    );
  }

  function sendPage() {
    if (!canSend() || !configured || !command) return false;
    const page = safeAnalyticsPage(currentPath, allowedPaths);
    if (!page || lastPage === page.page_location) return false;
    const referrer = lastPage; // Never read document.referrer or an external URL.
    command("set", { ...page, page_referrer: referrer });
    command("event", "page_view", { ...page, page_referrer: referrer, send_to: measurementId });
    lastPage = page.page_location;
    return true;
  }

  function configureGoogle() {
    const page = safeAnalyticsPage(currentPath, allowedPaths);
    if (!canSend() || !page || !command) return;
    win[`ga-disable-${measurementId}`] = false;
    win.gtag = command;
    command("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    command("set", {
      ...page,
      page_referrer: "",
      send_page_view: false,
      ads_data_redaction: true,
      url_passthrough: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    command("js", new Date(now()));
    command("config", measurementId, {
      ...page,
      page_referrer: "",
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ignore_referrer: true,
      cookie_domain: "www.les-terrasses-du-roty.fr",
      cookie_path: "/",
      cookie_expires: CONSENT_DURATION_MS / 1000,
      cookie_update: false,
      cookie_flags: "SameSite=Lax;Secure",
    });
    configured = true;
    sendPage();
  }

  function start() {
    if (!canSend() || !safeAnalyticsPage(currentPath, allowedPaths)) return;
    if (configured) {
      sendPage();
      return;
    }
    if (googleLoaded) {
      configureGoogle();
      return;
    }
    if (script) return;
    const startingEpoch = ++epoch;
    win[`ga-disable-${measurementId}`] = true;
    win.dataLayer = win.dataLayer || [];
    command = function gtag(..._args: unknown[]) {
      // Google's queue expects the arguments object, not a custom event object.
      // eslint-disable-next-line prefer-rest-params -- Google documents this exact queue protocol.
      win.dataLayer!.push(arguments);
    };
    win.gtag = command;
    const tag = doc.createElement("script");
    script = tag;
    tag.id = "roty-google-analytics";
    tag.async = true;
    tag.referrerPolicy = "no-referrer";
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    tag.onload = () => {
      // An obsolete loader must never change the state of a later acceptance.
      if (startingEpoch !== epoch) {
        tag.remove();
        return;
      }
      if (disposed || !canSend()) {
        win[`ga-disable-${measurementId}`] = true;
        tag.remove();
        return;
      }
      googleLoaded = true;
      configureGoogle();
    };
    tag.onerror = () => {
      if (startingEpoch !== epoch) return;
      tag.remove();
      script = null;
      configured = false;
      win[`ga-disable-${measurementId}`] = true;
    };
    doc.head.append(tag);
  }

  function storageChanged(event: StorageEvent) {
    if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
    record = readChoice();
    state = { ...state, choice: record?.choice || "unknown" };
    if (state.choice === "accepted") start();
    else stop();
    scheduleExpiry();
    publish();
  }

  function visibilityChanged() {
    if (doc.visibilityState !== "visible" || !record || record.expiresAt > now()) return;
    record = null;
    state = { ...state, choice: "unknown" };
    stop();
    scheduleExpiry();
    publish();
  }

  return {
    getState: () => ({ ...state }),
    subscribe(listener: (value: AnalyticsState) => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async initialize() {
      if (initialized || disposed) return;
      initialized = true;
      record = readChoice();
      state = { ...state, choice: record?.choice || "unknown" };
      if (state.choice !== "accepted") removeCookies();
      win.addEventListener("storage", storageChanged);
      doc.addEventListener("visibilitychange", visibilityChanged);
      scheduleExpiry();
      if (!isCanonical()) {
        state = { ...state, ready: true };
        publish();
        return;
      }
      try {
        configAbort = new AbortController();
        const timeout = win.setTimeout(() => configAbort?.abort(), 5_000);
        let config: unknown;
        try {
          const response = await win.fetch("/api/analytics-config", {
            cache: "no-store",
            credentials: "same-origin",
            signal: configAbort.signal,
          });
          if (!response.ok) throw new Error("Analytics configuration unavailable");
          config = await response.json();
        } finally {
          win.clearTimeout(timeout);
        }
        if (
          !disposed &&
          config &&
          typeof config === "object" &&
          "enabled" in config &&
          config.enabled === true &&
          "measurementId" in config &&
          validMeasurementId(config.measurementId)
        ) {
          measurementId = config.measurementId;
          state = { ...state, available: true };
        }
      } catch {
        /* Fail closed: no Google script or event after a config failure. */
      }
      if (disposed) return;
      state = { ...state, ready: true };
      publish();
      start();
    },
    choose(choice: "accepted" | "refused") {
      if (disposed) return;
      const decidedAt = now();
      record = {
        version: 1,
        choice,
        updatedAt: decidedAt,
        expiresAt: decidedAt + CONSENT_DURATION_MS,
      };
      try {
        win.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
      } catch {
        /* Consent remains valid only in this document when storage is unavailable. */
      }
      state = { ...state, choice };
      if (choice === "accepted") start();
      else stop();
      scheduleExpiry();
      publish();
    },
    pageView(pathname: string) {
      currentPath = pathname;
      if (canSend()) start();
    },
    event(name: "form_start" | "generate_lead", categories: CategoryInput) {
      if (!canSend() || !configured || !command) return false;
      const page = safeAnalyticsPage(currentPath, allowedPaths);
      if (!page) return false;
      command("event", name, {
        ...safeAnalyticsCategories(categories),
        ...page,
        page_referrer: "",
        send_to: measurementId,
      });
      return true;
    },
    dispose() {
      disposed = true;
      configAbort?.abort();
      win.clearTimeout(expiryTimer);
      win.removeEventListener("storage", storageChanged);
      doc.removeEventListener("visibilitychange", visibilityChanged);
      stop();
      listeners.clear();
    },
  };
}

export type AnalyticsController = ReturnType<typeof createAnalyticsController>;
let activeController: AnalyticsController | null = null;
export function registerAnalyticsController(controller: AnalyticsController) {
  activeController = controller;
  return () => {
    if (activeController === controller) activeController = null;
  };
}
export function trackFormStart(categories: CategoryInput) {
  return activeController?.event("form_start", categories) || false;
}
export function trackAcceptedLead(categories: CategoryInput) {
  return activeController?.event("generate_lead", categories) || false;
}
