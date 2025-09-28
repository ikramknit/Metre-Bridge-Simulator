
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
