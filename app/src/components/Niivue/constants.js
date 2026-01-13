import { DRAG_MODE, SHOW_RENDER, SLICE_TYPE, PEN_TYPE } from "@niivue/niivue"

export const DEFAULT_NIIVUE_OPTIONS = {
    logLevel: "debug",
    show3Dcrosshair: true,
    crosshairWidth: 1,
    crosshairWidthUnit: "mm",
    sliceType: SLICE_TYPE.MULTIPLANAR,
    multiplanarShowRender: SHOW_RENDER.NEVER,
    multiplanarEqualSize: true,
    dragMode: DRAG_MODE.none,
    measureTextJustify: "center",
    measureTextHeight: 0.05,
    maxDrawUndoBitmaps: 30,
}

//if using this, nv.setDragMode does not work fo changing the right click behavior
export const DEFAULT_MOUSE_CONFIG = {
    leftButton: { 
        primary:  DRAG_MODE.crosshair,
        withCtrl: DRAG_MODE.pan, 
        withShift: DRAG_MODE.slicer3D //zoom
    },
    centerButton: DRAG_MODE.crosshair,
    rightButton: DRAG_MODE.none
}

export const DEFAULT_VOLUME_OPTIONS = {
    colormap: "gray",
    opacity: 1,
}

export const CROSSHAIR = {
    HIDDEN: 0,
    VISIBLE: 1,
}

export const SEGMENTATION = {
    HIDDEN: 0.0,
    VISIBLE: 0.9,
}

export const PEN = {
    ERASER: 0,
    RED: 1,
    GREEN: 2,
    BLUE: 3,
    YELLOW: 4
};

export const AVAILABLE_VIEWS = [
    SLICE_TYPE.MULTIPLANAR,
    SLICE_TYPE.AXIAL,
    SLICE_TYPE.CORONAL,
    SLICE_TYPE.SAGITTAL,
    SLICE_TYPE.RENDER
];

export const AVAILABLE_DRAG_MODES = [
    DRAG_MODE.none,
    DRAG_MODE.measurement,
    DRAG_MODE.angle,
    DRAG_MODE.pan
];

export const AVAILABLE_PEN_TYPES = [
    PEN_TYPE.PEN,
    PEN_TYPE.ELLIPSE,
    PEN_TYPE.RECTANGLE
];
