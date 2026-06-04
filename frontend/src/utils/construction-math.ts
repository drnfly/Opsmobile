// Construction Master–style ft-in-fraction math helpers (imperial).
// Parses inputs like:  12, 12'6", 12-6, 12'6 1/2", 12.5
// All public funcs return either a number (decimal feet/inches) or formatted strings.

export function parseFeetInches(input: string): number {
  // returns total inches (decimal allowed).
  if (input == null) return 0;
  let s = String(input).trim().toLowerCase();
  if (!s) return 0;
  // strip surrounding quotes label
  s = s.replace(/[″"]/g, '"').replace(/[′']/g, "'");
  // Pure decimal: assume feet
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    return parseFloat(s) * 12;
  }
  let totalInches = 0;
  // foot portion
  const footMatch = s.match(/^(-?\d+(?:\.\d+)?)\s*'/);
  if (footMatch) {
    totalInches += parseFloat(footMatch[1]) * 12;
    s = s.slice(footMatch[0].length).trim();
  } else {
    // handle "12-6" => 12'6"
    const dashMatch = s.match(/^(-?\d+(?:\.\d+)?)\s*-\s*(.+)$/);
    if (dashMatch) {
      totalInches += parseFloat(dashMatch[1]) * 12;
      s = dashMatch[2].trim();
    }
  }
  if (s) {
    // remove trailing "
    s = s.replace(/"$/, "").trim();
    // whole + fraction
    const wholeFracMatch = s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    const fracMatch = s.match(/^(\d+)\s*\/\s*(\d+)$/);
    const decMatch = s.match(/^-?\d+(\.\d+)?$/);
    if (wholeFracMatch) {
      totalInches += parseFloat(wholeFracMatch[1]) + parseFloat(wholeFracMatch[2]) / parseFloat(wholeFracMatch[3]);
    } else if (fracMatch) {
      totalInches += parseFloat(fracMatch[1]) / parseFloat(fracMatch[2]);
    } else if (decMatch) {
      totalInches += parseFloat(s);
    }
  }
  return totalInches;
}

export function inchesToFeet(inches: number): number {
  return inches / 12;
}

export function formatFtInFrac(totalInches: number, fracDenom = 16): string {
  if (!isFinite(totalInches)) return "0\"";
  const neg = totalInches < 0;
  const abs = Math.abs(totalInches);
  const ft = Math.floor(abs / 12);
  let inches = abs - ft * 12;
  const whole = Math.floor(inches);
  let frac = inches - whole;
  // round to nearest 1/fracDenom
  let num = Math.round(frac * fracDenom);
  let den = fracDenom;
  if (num === den) {
    // bump up
    const w = whole + 1;
    const out = `${ft}' ${w}"`;
    return (neg ? "-" : "") + out;
  }
  // reduce
  while (num > 0 && num % 2 === 0 && den % 2 === 0) {
    num /= 2; den /= 2;
  }
  let inchStr: string;
  if (num === 0) inchStr = `${whole}"`;
  else if (whole === 0) inchStr = `${num}/${den}"`;
  else inchStr = `${whole} ${num}/${den}"`;
  const out = ft > 0 ? `${ft}' ${inchStr}` : inchStr;
  return (neg ? "-" : "") + out;
}

export function formatDecimalFt(totalInches: number): string {
  return (totalInches / 12).toFixed(4).replace(/\.?0+$/, "") + " ft";
}

export function formatTotalInches(totalInches: number): string {
  return totalInches.toFixed(3).replace(/\.?0+$/, "") + " in";
}

// ICF wall concrete: L × H × core thickness (in) -> cubic yards
export function icfConcreteCubicYards(lengthFt: number, heightFt: number, coreInches: number, wastePct: number): number {
  const cuFt = lengthFt * heightFt * (coreInches / 12);
  const cy = cuFt / 27;
  return cy * (1 + wastePct / 100);
}

// Area
export function areaSqFt(lengthFt: number, widthFt: number, wastePct: number): number {
  return lengthFt * widthFt * (1 + wastePct / 100);
}

// ICF block presets (block face dimensions in inches: width × height of one block face).
export const ICF_BLOCK_PRESETS: Record<string, { length_in: number; height_in: number }> = {
  Standard: { length_in: 48, height_in: 16 },
  NUDURA: { length_in: 96, height_in: 18 },
  Fox: { length_in: 48, height_in: 16 },
  Amvic: { length_in: 48, height_in: 16 },
  BuildBlock: { length_in: 48, height_in: 16 },
};

export function icfBlockCount(
  lengthFt: number,
  heightFt: number,
  blockLengthIn: number,
  blockHeightIn: number,
  openingsSqFt: number,
  wastePct: number,
): number {
  const wallSqFt = Math.max(lengthFt * heightFt - openingsSqFt, 0);
  const blockSqFt = (blockLengthIn / 12) * (blockHeightIn / 12);
  if (blockSqFt <= 0) return 0;
  return Math.ceil((wallSqFt / blockSqFt) * (1 + wastePct / 100));
}

// Rebar — weights lb/ft for #3..#8
export const REBAR_WEIGHT: Record<string, number> = {
  "3": 0.376, "4": 0.668, "5": 1.043, "6": 1.502, "7": 2.044, "8": 2.670,
};

export function rebarTakeoff(
  wallLengthFt: number,
  wallHeightFt: number,
  vertSpacingIn: number,
  horizSpacingIn: number,
  barSize: string,
  stickLengthFt: number,
): { vertBars: number; horizBars: number; totalLf: number; weightLb: number; sticks: number } {
  const vertBars = vertSpacingIn > 0 ? Math.ceil((wallLengthFt * 12) / vertSpacingIn) + 1 : 0;
  const horizBars = horizSpacingIn > 0 ? Math.ceil((wallHeightFt * 12) / horizSpacingIn) + 1 : 0;
  const totalLf = vertBars * wallHeightFt + horizBars * wallLengthFt;
  const wPerFt = REBAR_WEIGHT[barSize] ?? 0;
  const weightLb = totalLf * wPerFt;
  const sticks = stickLengthFt > 0 ? Math.ceil(totalLf / stickLengthFt) : 0;
  return { vertBars, horizBars, totalLf, weightLb, sticks };
}
