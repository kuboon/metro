// Runs before first paint so a saved accent does not flash. The writer is
// components/metro/_lib/theme_store.ts; this only replays what it resolved.
try {
  const saved = JSON.parse(localStorage.getItem("metro-theme"));
  if (saved) {
    const root = document.documentElement;
    root.dataset.theme = saved.theme;
    root.style.setProperty("--metro-accent", saved.color);
    root.style.setProperty("--metro-on-accent", saved.on);
  }
} catch {
  // No storage, or nothing readable in it: the defaults in app.css stand.
}
