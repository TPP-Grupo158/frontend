import { SLICE_TYPE, DRAG_MODE, MULTIPLANAR_TYPE } from "@niivue/niivue"

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


export const getMultiplanarLayoutName = (layoutType) => {
    switch (layoutType) {
        case MULTIPLANAR_TYPE.COLUMN:
            return "Column";
        case MULTIPLANAR_TYPE.ROW:
            return "Row";
        case MULTIPLANAR_TYPE.GRID:
            return "Grid";
        default:
            return "Unknown";
    }
}

export const parseSegmentationStats = (stats) => {
    let result = ""
    result += "Volume (mL): " + stats.volumeML.toFixed(2) + "\n";
    result += "Volume (mm3): " + stats.volumeMM3.toFixed(2) + "\n";
    result += "Intensity (max): " + stats.max.toFixed(2) + "\n";
    result += "Intensity (min) " + stats.min.toFixed(2) + "\n";
    result += "Intensity (mean): " + stats.mean.toFixed(2) + "\n";
    result += "Intensity (stdev): " + stats.stdev.toFixed(2) + "\n";
    return result;
}