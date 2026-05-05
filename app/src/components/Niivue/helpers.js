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
            return "Render 3D";
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
    const result = {}
    result.volumeML = stats.volumeML.toFixed(2);
    result.volumeMM3 = stats.volumeMM3.toFixed(2);
    result.intensityMax = stats.max.toFixed(2);
    result.intensityMin = stats.min.toFixed(2);
    result.intensityMean = stats.mean.toFixed(2);
    result.intensityStdev = stats.stdev.toFixed(2);
    return result;
}