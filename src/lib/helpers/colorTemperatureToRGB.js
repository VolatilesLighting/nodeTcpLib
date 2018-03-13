import tinycolor from 'tinycolor2';

const color_temperatureRange = [1500, 10000];
color_temperatureRange[2] = (color_temperatureRange[1] - color_temperatureRange[0]) / 100;

export default function colorTemperatureToRGB(color_temperature, rgb) {
    if (!rgb && color_temperature === 50)
        return null;

    const ct = (color_temperatureRange[0] + color_temperature * color_temperatureRange[2]);
    const {r, g, b} = tinycolor(rgb || 'white').toRgb();

    console.log(r,g,b,rgb)

    let rNew = r,
        gNew = g,
        bNew = b;

    if (ct > 6000) {
        rNew = (r * (255 - 55 * (ct - 6000) / 4000)) / 255;
        gNew = (g * (255 - 35 * (ct - 6000) / 4000)) / 255;
    }
    else {
        bNew = (b * (255 * (ct - 1500) / 4500)) / 255;
        gNew = (g * (80 + 175 * (ct - 1500) / 4500)) / 255;
    }


    const rgbPre = {
        r: clamp(rNew, 0, 255),
        g: clamp(gNew, 0, 255),
        b: clamp(bNew, 0, 255)
    };

    return `rgb(${rgbPre.r},${rgbPre.g},${rgbPre.b})`;


}


function clamp(x, min, max) {

    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }

    return x;

}