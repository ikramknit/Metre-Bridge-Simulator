export interface Observation {
  serial: number;
  R: number; // Known resistance
  l: number; // Balancing length
  s: number; // Calculated unknown resistance
}

export interface OhmsLawObservation {
    serial: number;
    V: number; // Voltmeter reading
    I: number; // Ammeter reading
}

export interface ResistanceCombinationObservation {
  serial: number;
  mode: 'Series' | 'Parallel';
  R_known: number; // The known resistance from the resistance box
  l: number; // Balancing length
  S_experimental: number; // Calculated equivalent resistance
}