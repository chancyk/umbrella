import { clamp01 } from "@thi.ng/math";
import { setC4 } from "@thi.ng/vectors";
import type { Color } from "./api";
import type { Hue } from "./constants";
import { ensureHue } from "./internal/ensure-hue";

/**
 * Converts a normalized hue to RGBA with given optional `alpha`
 * value (default: 1).
 *
 * @param out - result
 * @param hue - normalized hue
 */
export const hueRgba = (out: Color | null, hue: number, alpha = 1): Color => {
    hue = ensureHue(hue) * 6;
    return setC4(
        out || [],
        clamp01(Math.abs(hue - 3) - 1),
        clamp01(2 - Math.abs(hue - 2)),
        clamp01(2 - Math.abs(hue - 4)),
        alpha
    );
};

export const namedHueRgba = (out: Color | null, hue: Hue, alpha = 1) =>
    hueRgba(out, hue / 12, alpha);
