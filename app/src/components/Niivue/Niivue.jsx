import { useRef, useEffect, useState } from "react";

import { 
    Niivue, 
    NVImage, 
    MULTIPLANAR_TYPE, 
} from "@niivue/niivue";

import {
    DEFAULT_NIIVUE_OPTIONS, 
    DEFAULT_VOLUME_OPTIONS,
    AVAILABLE_DRAG_MODES,
    AVAILABLE_PEN_TYPES,
    AVAILABLE_VIEWS,
    CROSSHAIR,
    PEN
} from "./constants.js";

import { 
    getSliceName, 
    getDragModeName, 
    getPenTypeName, 
    parseSegmentationStats 
} from "./helpers.js";

const labels = ["Label 1", "Label 2", "Label 3"];

const NiiVue = ({ images, segmentationUrl }) => {
    const canvas = useRef(null);
    const nvRef = useRef(null);

    const [currentVolume, setCurrentVolume] = useState(images[0]);

    const [isCrosshairChecked, setIsCrosshairChecked] = useState(false);

    const [availableColormaps, setAvailableColormaps] = useState([]); 
    const [currentColormap, setCurrentColormap] = useState(DEFAULT_VOLUME_OPTIONS.colormap);
    
    const [currentSliceView, setCurrentSliceView] = useState(DEFAULT_NIIVUE_OPTIONS.sliceType);

    const [isDrawModeActive, setIsDrawModeActive] = useState(false);
    const [penValue, setPenValue] = useState(PEN.RED);
    const [isFillerModeActive, setIsFillerModeActive] = useState(false);

    const [currentDragMode, setCurrentDragMode] = useState(DEFAULT_NIIVUE_OPTIONS.dragMode);

    const [currentPenType, setCurrentPenType] = useState(PEN.RED);

    const [currentPenSize, setCurrentPenSize] = useState(1);

    const [currentSlice, setCurrentSlice] = useState({ x: 0, y: 0, z: 0 });

    const[currentVolumeGamma, setCurrentVolumeGamma] = useState(1.0);
    const[currentDrawOpacity, setCurrentDrawOpacity] = useState(0.6);

    const [segmentationStats, setSegmentationStats] = useState("");

    useEffect(() => {

        async function setupAndLoad() {
            console.log("Setting up Niivue instance...");
            const nv = new Niivue(DEFAULT_NIIVUE_OPTIONS);

            //nv.opts.mouseEventConfig = defaultMouseConfig;
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
                ...DEFAULT_VOLUME_OPTIONS
            });
            await nv.addVolume(current);

            await nv.loadDrawing(await NVImage.loadFromFile({file: segmentationUrl.file, opacity: 0.6}));
            // await nv.loadDrawingFromUrl(segmentationUrl); //this will be used when fetching the segmentation from the server
            nvRef.current = nv
            
            labels.forEach((label, i) => {
                const labelColor = nv.drawLut.lut.slice((i+1)*4, (i+2)*4);
                nv.addLabel(label, {textScale: 1.0, bulletColor: labelColor, bulletScale: 1})
            })
            
            nv.setDrawOpacity(currentDrawOpacity);

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
            nvRef.current.opts.crosshairWidth = isChecked ? CROSSHAIR.HIDDEN : CROSSHAIR.VISIBLE;
            nvRef.current.opts.show3Dcrosshair = !isChecked;
            nvRef.current.drawScene();
            setIsCrosshairChecked(isChecked);
        }
    }

    const handleDrawOpacityChange = (event) => {
        const newOpacity = parseFloat(event.target.value);
        if (nvRef.current) {
            nvRef.current.setDrawOpacity(newOpacity);
            setCurrentDrawOpacity(newOpacity);
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
                ...DEFAULT_VOLUME_OPTIONS, 
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
            nvRef.current.opts.measureTextHeight = isChecked ? 0.0 : DEFAULT_NIIVUE_OPTIONS.measureTextHeight;
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

    const handleVolumeGammaChange = (event) => {
        const newGamma = parseFloat(event.target.value);
        if (nvRef.current) {
            nvRef.current.setGamma(newGamma);
            setCurrentVolumeGamma(newGamma);
        }
    }

    const updateSegmentationStats = () => {
        if (nvRef.current) {
            const stats = nvRef.current.getDescriptives({
                layer: 0,
                drawingIsMask: true,
            });
            setSegmentationStats(parseSegmentationStats(stats));
        }
    }
    
    return (
        <>  
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={updateSegmentationStats}>Update Segmentation Stats</button>
            <label>
                cmap
                <select value={currentColormap} onChange={handleColormapChange}>
                    {availableColormaps.map((colormap) => (
                            <option key={colormap} value={colormap}>{colormap}</option>
                        ))}
                </select>
            </label>

            <label>
                Slice view
                <select value={currentSliceView} onChange={handleSliceViewChange}>
                    {AVAILABLE_VIEWS.map((sliceView) => (
                        <option key={sliceView} value={sliceView}>{getSliceName(sliceView)}</option>
                    ))}
                </select>
            </label>

            <label>
                Volume shown
                <select value={currentVolume.name} onChange={handleVolumeChange}>
                    {images.map((volume) => (
                            <option key={volume.name} value={volume.name}>{volume.name}</option>
                        ))}
                </select>
            </label>

             <label>
                Drag Mode
                <select value={currentDragMode} onChange={handleDragModeChange}>
                    {AVAILABLE_DRAG_MODES.map((dragMode) => (
                            <option key={dragMode} value={dragMode}>{getDragModeName(dragMode)}</option>
                        ))}
                </select>
            </label>
            <button onClick={handleSaveDrawing}>Save Segmentation</button>
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
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                { } Gamma
                <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={currentVolumeGamma}
                    onChange={handleVolumeGammaChange}
                />
                {currentVolumeGamma}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                { } Draw opacity
                <input
                    type="range"
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    value={currentDrawOpacity}
                    onChange={handleDrawOpacityChange}
                />
                {parseInt(currentDrawOpacity * 100)}%
            </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isDrawModeActive && (
                <>
                <label>
                    Pen Color:
                    <select value={penValue} onChange={handlePenColorChange}>
                        <option value={PEN.ERASER}>Eraser</option>
                        <option value={PEN.RED}>Red</option>
                        <option value={PEN.GREEN}>Green</option>
                        <option value={PEN.BLUE}>Blue</option>
                        <option value={PEN.YELLOW}>Yellow</option>
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
                   { } Pen Type
                    <select value={currentPenType} onChange={handlePenTypeChange}>
                        {AVAILABLE_PEN_TYPES.map((penType) => (
                                <option key={penType} value={penType}>{getPenTypeName(penType)}</option>
                            ))}
                    </select>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    { } Pen Size
                    <input
                        type="range"
                        min={1}
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
                width: "100%", 
                height: 700
            }}>
            <canvas ref={canvas} style={{ width: "100%", height: "100%" }} />
        </div>
        <div>
            <strong>{`X: ${currentSlice.x}, Y: ${currentSlice.y}, Z: ${currentSlice.z}`}</strong>
        </div>
        {segmentationStats && (
        <div>
            
            <pre>
                <strong>Segmentation Stats (does not include per-label info)</strong>
                <br />
                {segmentationStats}
            </pre>
        </div>
    )}
        </>
    )
};


export default NiiVue;