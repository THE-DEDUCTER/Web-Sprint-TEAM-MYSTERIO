export const userInteractionHandlers = [
    /**
     * @property boxZoom
     * @type Maps.BoxZoomHandler
     * @description The BoxZoomHandler allows the user to zoom the map to fit within a bounding box.
     * The bounding box is defined by clicking and holding shift while dragging the cursor.
     */
    'boxZoom',

    /**
     * @property scrollZoom
     * @type Maps.ScrollZoomHandler
     * @description The ScrollZoomHandler allows the user to zoom the map by scrolling.
     */
    'scrollZoom',

    /**
     * @property dragRotate
     * @type Maps.DragRotateHandler
     * @description The DragRotateHandler allows the user to rotate the map by clicking and dragging
     * the cursor while holding the right mouse button or ctrl key.
     */
    'dragRotate',

    /**
     * @property dragPan
     * @type Maps.DragPanHandler
     * @description The DragPanHandler allows the user to pan the map by clicking and dragging the cursor.
     */
    'dragPan',

    /**
     * @property keyboard
     * @type Maps.KeyboardHandler
     * @description The KeyboardHandler allows the user to zoom, rotate, and pan the map using the
     * following keyboard shortcuts:
     * * = / +: Increase the zoom level by 1.
     * * Shift-= / Shift-+: Increase the zoom level by 2.
     * * -: Decrease the zoom level by 1.
     * * Shift--: Decrease the zoom level by 2.
     * * Arrow keys: Pan by 100 pixels.
     * * Shift+⇢: Increase the rotation by 15 degrees.
     * * Shift+⇠: Decrease the rotation by 15 degrees.
     * * Shift+⇡: Increase the pitch by 10 degrees.
     * * Shift+⇣: Decrease the pitch by 10 degrees.
     */
    'keyboard',

    /**
     * @property doubleClickZoom
     * @type Maps.DoubleClickZoomHandler
     * @description The DoubleClickZoomHandler allows the user to zoom the map at a point by double
     * clicking or double tapping.
     */
    'doubleClickZoom',

    /**
     * @property touchZoomRotate
     * @type Maps.TouchZoomRotateHandler
     * @description The TouchZoomRotateHandler allows the user to zoom and rotate the map by pinching on a touchscreen.
     */
    'touchZoomRotate',

    /**
     * @property touchPitch
     * @type Maps.TouchPitchHandler
     * @description The TouchPitchHandler allows the user to pitch the map with touch gestures.
     */
    'touchPitch'
];
