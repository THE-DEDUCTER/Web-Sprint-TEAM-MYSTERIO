// this antiquate way of copying the style is to avoid using cloneDeep, which delays the render of the map in ~80ms
export default function(originalStyle) {
    const styleCopy = {
        version: 8,
        sources: {...originalStyle.sources},
        layers: originalStyle.layers.slice()
    };

    if (originalStyle.glyphs) {
        styleCopy.glyphs = originalStyle.glyphs;
    }
    if (originalStyle.sprite) {
        styleCopy.sprite = originalStyle.sprite;
    }
    return styleCopy;
}
