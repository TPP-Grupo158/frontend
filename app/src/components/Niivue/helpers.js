import { SLICE_TYPE, DRAG_MODE, PEN_TYPE } from "@niivue/niivue"

export const getSliceName = (sliceType) => {
    switch (sliceType) {
        case SLICE_TYPE.MULTIPLANAR:
            return "Multiplanar";
        case SLICE_TYPE.AXIAL:
            return "Axial";
        case SLICE_TYPE.CORONAL:
            return "Coronal";
        case SLICE_TYPE.SAGITTAL:
            return "Sagittal";
        case SLICE_TYPE.RENDER:
            return "Render";
        default:
            return "Unknown";
    }
}

export const getDragModeName = (dragMode) => {
    switch (dragMode) {
        case DRAG_MODE.none:
            return "None";
        case DRAG_MODE.angle:
            return "Angle";
        case DRAG_MODE.measurement:
            return "Measurement";
        case DRAG_MODE.pan:
            return "Pan/Zoom";
        default:
            return "Unknown";
    }
}

export const getPenTypeName = (penType) => {
    switch (penType) {
        case PEN_TYPE.PEN:
            return "Pen";
        case PEN_TYPE.RECTANGLE:
            return "Rectangle";
        case PEN_TYPE.ELLIPSE:
            return "Ellipse";
        default:
            return "Unknown";
    }
}