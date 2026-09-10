// Chart color tokens — validated categorical palette (dataviz skill reference palette).
// Slots 1-3 (blue/orange/aqua) are the only three that pass all-pairs CVD
// separation for non-adjacent chart forms like scatter, so cluster colors are
// pinned to those slots in a fixed order — never reassigned by rank/filter.
export const CHART = {
  surface: '#ffffff',
  pagePlane: '#f9f9f7',
  textPrimary: '#0b0b0b',
  textSecondary: '#52514e',
  muted: '#898781',
  gridline: '#e1e0d9',
  axis: '#c3c2b7',
  border: 'rgba(11,11,11,0.10)',
};

export const CLUSTER_COLORS: Record<string, string> = {
  budget: '#2a78d6', // slot 1 — blue
  'mid-range': '#eb6834', // slot 2 — orange
  premium: '#1baf7a', // slot 3 — aqua
};

export const CLUSTER_LABEL_TH: Record<string, string> = {
  budget: 'BUDGET (ราคาถูก)',
  'mid-range': 'MID-RANGE (ราคากลาง)',
  premium: 'PREMIUM (ราคาแพง)',
};
