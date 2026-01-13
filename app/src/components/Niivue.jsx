import { useRef, useEffect, useState } from "react";
import { 
    Niivue, 
    NVImage, 
    SLICE_TYPE, 
    SHOW_RENDER, 
    MULTIPLANAR_TYPE, 
    DRAG_MODE, 
    PEN_TYPE, } from "@niivue/niivue";

const defaultNiivueOptions = {
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

const defaultVolumeOptions = {
    colormap: "gray",
    opacity: 1,
}

const HIDE_CROSSHAIR_SIZE = 0;
const SHOW_CROSSHAIR_SIZE = 1;

const DRAW_OPACITY_HIDDEN = 0.0;
const DRAW_OPACITY_VISIBLE = 0.9;

const PEN_ERASER = 0
const PEN_COLOR_RED = 1
const PEN_COLOR_GREEN = 2
const PEN_COLOR_BLUE = 3
const PEN_COLOR_YELLOW = 4

const MEASURE_TEXT_HEIGHT = 0.05;

const NiiVue = ({ images, segmentationUrl }) => {
    const canvas = useRef();
    const nvRef = useRef();

    const [currentVolume, setCurrentVolume] = useState(images[0]);

    const [isCrosshairChecked, setIsCrosshairChecked] = useState(false);
    const [isDrawOpacityChecked, setIsDrawOpacityChecked] = useState(false);

    const [availableColormaps, setAvailableColormaps] = useState([]); 
    const [currentColormap, setCurrentColormap] = useState("gray");
    
    const availibleViews = [SLICE_TYPE.MULTIPLANAR, SLICE_TYPE.AXIAL, SLICE_TYPE.CORONAL, SLICE_TYPE.SAGITTAL, SLICE_TYPE.RENDER];   
    const [currentSliceView, setCurrentSliceView] = useState(defaultNiivueOptions.sliceType);

    const [isDrawModeActive, setIsDrawModeActive] = useState(false);
    const [penValue, setPenValue] = useState(PEN_COLOR_RED);
    const [isFillerModeActive, setIsFillerModeActive] = useState(false);

    const availableDragModes = [DRAG_MODE.none, DRAG_MODE.measurement, DRAG_MODE.angle, DRAG_MODE.pan];
    const [currentDragMode, setCurrentDragMode] = useState(defaultNiivueOptions.dragMode);

    const availablePenTypes = [PEN_TYPE.PEN, PEN_TYPE.ELLIPSE, PEN_TYPE.RECTANGLE]
    const [currentPenType, setCurrentPenType] = useState(availablePenTypes[0]);

    const [currentPenSize, setCurrentPenSize] = useState(1);

    const [currentSlice, setCurrentSlice] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {

        async function setupAndLoad() {
            console.log("Setting up Niivue instance...");
            const nv = new Niivue(defaultNiivueOptions);
            const availableColormaps = nv.colormaps();
            setAvailableColormaps(availableColormaps);
            nv.setMultiplanarLayout(MULTIPLANAR_TYPE.ROW); 
            nv.attachToCanvas(canvas.current);

            nv.onLocationChange = (location) => {
                setCurrentSlice({
                    x: location.vox[0],
                    y: location.vox[1],
                    z: location.vox[2]
                });
            };
            
            const current = await NVImage.loadFromFile({
                file: currentVolume.file,
                name: currentVolume.name,
                ...defaultVolumeOptions
            });
            await nv.addVolume(current);

            await nv.loadDrawing(await NVImage.loadFromFile({file: segmentationUrl.file}));
            // await nv.loadDrawingFromUrl(segmentationUrl); //this will be used when fetching the segmentation from the server
            nvRef.current = nv

            const initialVox = nv.frac2vox(nv.scene.crosshairPos);
            setCurrentSlice({
                x: initialVox[0],
                y: initialVox[1],
                z: initialVox[2]
            });
        }

        if (!nvRef.current) {
            setupAndLoad();
        }
        
        return () => {
            console.log("Cleaning up Niivue instance...");
            nvRef.current = null;
        };

    }, []);

    const handleColormapChange = (event) => {
        const newColormap = event.target.value;
        if (nvRef.current && nvRef.current.volumes.length > 0) {
            const volumeId = nvRef.current.volumes[0].id;
            nvRef.current.setColormap(volumeId, newColormap);
            setCurrentColormap(newColormap);
        }
    };

    const handleSliceViewChange = (event) => {
        const view = parseInt(event.target.value);
        if (nvRef.current) {
            nvRef.current.setSliceType(view);
            setCurrentSliceView(view);
        }
    };

    const handleCrosshairChange = (event) => {
        const isChecked = event.target.checked;
        if (nvRef.current) {
            nvRef.current.opts.crosshairWidth = isChecked ? HIDE_CROSSHAIR_SIZE : SHOW_CROSSHAIR_SIZE;
            nvRef.current.opts.show3Dcrosshair = !isChecked;
            nvRef.current.drawScene();
            setIsCrosshairChecked(isChecked);
        }
    }

    const handleDrawOpacityChange = (event) => {
        const isChecked = event.target.checked;
        if (nvRef.current) {
            isChecked ? nvRef.current.setDrawOpacity(DRAW_OPACITY_HIDDEN) : nvRef.current.setDrawOpacity(DRAW_OPACITY_VISIBLE); 
            setIsDrawOpacityChecked(isChecked);
        }
    }

    const handleVolumeChange = async (event) => {
        const newVolumeName = event.target.value;
        const newVolume = images.find(v => v.name === newVolumeName);
        
        console.debug("Changing volume to:", newVolume.name);
        if (nvRef.current) {

            nvRef.current.setDrawingEnabled(false);
            setIsDrawModeActive(false)

            await nvRef.current.removeVolumeByIndex(0);
            console.log(nvRef.current.volumes)
            console.log(newVolume)
            const current = await NVImage.loadFromFile({
                file: newVolume.file,
                name: newVolume.name,
                ...defaultVolumeOptions, 
                colormap: currentColormap
            });
            await nvRef.current.addVolume(current);
            setCurrentVolume(newVolume);
        }
    }

    const handleSaveDrawing = () => {
        if (!nvRef.current) return;
            nvRef.current.saveImage({filename: 'segmentation.nii.gz', isSaveDrawing: true});
    }

    const handleDrawingActivation = (event) => {
        const isChecked = event.target.checked;
        if (nvRef.current) {
            nvRef.current.setDrawingEnabled(isChecked);
            setIsDrawModeActive(isChecked);
        }
    }

    const handlePenColorChange = (event) => {
        const newPenValue = parseInt(event.target.value);
        if (nvRef.current) {
            nvRef.current.setPenValue(newPenValue, isFillerModeActive);
            setPenValue(newPenValue);
        }
    }

    const handleFillerModeChange = (event) => {
        const isChecked = event.target.checked;
        if (nvRef.current) {
            nvRef.current.setPenValue(penValue, isChecked);
            setIsFillerModeActive(isChecked);
        }
    }

    const handleDrawingUndo = () => {
        if (nvRef.current) { nvRef.current.drawUndo(); }
    }

    const handleDragModeChange = (event) => {
        const newDragMode = parseInt(event.target.value)
        if (nvRef.current) {
            nvRef.current.setDragMode(newDragMode);
            setCurrentDragMode(newDragMode);
        }
    }

    const handleHideMeasurementFont = (event) => {
        const isChecked = event.target.checked;
        if (nvRef.current) {
            nvRef.current.opts.measureTextHeight = isChecked ? 0.0 : MEASURE_TEXT_HEIGHT;
            nvRef.current.drawScene();
        }
    }

    const handlePenTypeChange = (event) => {
        const newPenType = parseInt(event.target.value);
        if (nvRef.current) {
            nvRef.current.opts.penType = newPenType;
            nvRef.current.drawScene();
            setCurrentPenType(newPenType);
        }
    }

    const handlePenSizeChange = (event) => {
        const newPenSize = parseInt(event.target.value);
        if (nvRef.current) {
            nvRef.current.opts.penSize = newPenSize;
            nvRef.current.drawScene();
            setCurrentPenSize(newPenSize);
        }
    }

    const getSliceName = (sliceType) => {
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

    const getDragModeName = (dragMode) => {
        switch (dragMode) {
            case DRAG_MODE.none:
                return "None";
            case DRAG_MODE.angle:
                return "angle";
            case DRAG_MODE.measurement:
                return "measurement";
            case DRAG_MODE.pan:
                return "pan/zoom";
            default:
                return "Unknown";
        }
    }

    return (
        <>  
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label>
                cmap:
                <select value={currentColormap} onChange={handleColormapChange}>
                    {availableColormaps.map((colormap) => (
                            <option key={colormap} value={colormap}>{colormap}</option>
                        ))}
                </select>
            </label>

            <label>
                Slice view:
                <select value={currentSliceView} onChange={handleSliceViewChange}>
                    {availibleViews.map((sliceView) => (
                        <option key={sliceView} value={sliceView}>{getSliceName(sliceView)}</option>
                    ))}
                </select>
            </label>

            <label>
                Volume shown:
                <select value={currentVolume.name} onChange={handleVolumeChange}>
                    {images.map((volume) => (
                            <option key={volume.name} value={volume.name}>{volume.name}</option>
                        ))}
                </select>
            </label>

             <label>
                Drag Mode:
                <select value={currentDragMode} onChange={handleDragModeChange}>
                    {availableDragModes.map((dragMode) => (
                            <option key={dragMode} value={dragMode}>{getDragModeName(dragMode)}</option>
                        ))}
                </select>
            </label>

            <label>
                <input
                type="checkbox"
                checked={isCrosshairChecked}
                onChange={handleCrosshairChange}
                />
                Hide Crosshair
            </label>

            <label>
                <input
                type="checkbox"
                checked={isDrawOpacityChecked}
                onChange={handleDrawOpacityChange}
                />
                Hide Segmentation
            </label>
            <button onClick={handleSaveDrawing}>Save Segmentation</button>

            <label>
                <input
                    type="checkbox"
                    onChange={handleHideMeasurementFont}
                />
                Hide Text
            </label>

            <label>
                <input
                type="checkbox"
                checked={isDrawModeActive}
                onChange={handleDrawingActivation}
                />
                Draw Mode
            </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isDrawModeActive && (
                <>
                <label>
                    Pen Color:
                    <select value={penValue} onChange={handlePenColorChange}>
                        <option value={PEN_ERASER}>Eraser</option>
                        <option value={PEN_COLOR_RED}>Red</option>
                        <option value={PEN_COLOR_GREEN}>Green</option>
                        <option value={PEN_COLOR_BLUE}>Blue</option>
                        <option value={PEN_COLOR_YELLOW}>Yellow</option>
                    </select>
                </label>
                <label>
                <input
                    type="checkbox"
                    checked={isFillerModeActive}
                    onChange={handleFillerModeChange}
                    />
                    Fill mode
                </label>
                <label>
                   { } Pen Type:
                    <select value={currentPenType} onChange={handlePenTypeChange}>
                        {availablePenTypes.map((penType) => (
                                <option key={penType} value={penType}>{PEN_TYPE[penType]}</option>
                            ))}
                    </select>
                </label>
                <label>
                    { } Pen Size:
                    <input
                        type="range"
                        min={0}
                        max={20}
                        step={1}
                        value={currentPenSize}
                        onChange={handlePenSizeChange}
                    />
                    {currentPenSize}
                </label>

                <button onClick={handleDrawingUndo}>Undo</button>
                </>
            )}
        </div>  
        <div style={{ 
                border: "1px solid black", 
                display: "flex", 
                justifyContent: "center", 
                marginTop: "10px",
                width: "100%" 
            }}>
            <canvas ref={canvas} height={700} width={2000} />
        </div>
        <div>
            <strong>{`X: ${currentSlice.x}, Y: ${currentSlice.y}, Z: ${currentSlice.z}`}</strong>
        </div>
        </>
    )
};


export default NiiVue;