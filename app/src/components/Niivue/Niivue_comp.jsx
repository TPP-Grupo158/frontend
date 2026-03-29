import { useRef, useEffect, useState } from "react";
import styles from '../styles.js'
import PropTypes from 'prop-types';

import { 
    Niivue, 
    NVImage, 
} from "@niivue/niivue";

import {
    DEFAULT_NIIVUE_OPTIONS, 
    DEFAULT_VOLUME_OPTIONS,
    AVAILABLE_DRAG_MODES,
    AVAILABLE_VIEWS,
    AVAILABLE_MULTIPLANAR_LAYOUTS,
    CROSSHAIR,
} from "./constants.js";

import { 
    getSliceName, 
    getDragModeName, 
    parseSegmentationStats, 
    getMultiplanarLayoutName
} from "./helpers.js";

import { useLocation } from 'react-router-dom';


const NiiVue_comp = ({ images, segmentationUrl, labels }) => {
    const canvas = useRef(null);
    const nvRef = useRef(null);

    const [currentVolume, setCurrentVolume] = useState(images[0]);

    const [isCrosshairChecked, setIsCrosshairChecked] = useState(false);

    const [availableColormaps, setAvailableColormaps] = useState([]); 
    const [currentColormap, setCurrentColormap] = useState(DEFAULT_VOLUME_OPTIONS.colormap);
    
    const [currentSliceView, setCurrentSliceView] = useState(DEFAULT_NIIVUE_OPTIONS.sliceType);
    const [currentMultiplanarLayout, setCurrentMultiplanarLayout] = useState(DEFAULT_NIIVUE_OPTIONS.multiplanarLayout);

    const [currentDragMode, setCurrentDragMode] = useState(DEFAULT_NIIVUE_OPTIONS.dragMode);

    const [currentSlice, setCurrentSlice] = useState({ x: 0, y: 0, z: 0 });

    const[currentVolumeGamma, setCurrentVolumeGamma] = useState(1.0);
    const[currentDrawOpacity, setCurrentDrawOpacity] = useState(0.6);

    const [segmentationStats, setSegmentationStats] = useState("");

    const [worldspace, setWorldspace] = useState(false);

    useEffect(() => {

        async function setupAndLoad() {
            console.log("Setting up Niivue instance...");
            const nv = new Niivue(DEFAULT_NIIVUE_OPTIONS);

            //nv.opts.mouseEventConfig = defaultMouseConfig;
            const availableColormaps = nv.colormaps();
            setAvailableColormaps(availableColormaps);
            nv.attachToCanvas(canvas.current);

            nv.onLocationChange = (location) => {
                setCurrentSlice({
                    x: location.vox[0],
                    y: location.vox[1],
                    z: location.vox[2]
                });
            };
            if (currentVolume.file instanceof File) {
                const current = await NVImage.loadFromFile({
                    file: currentVolume.file,
                    name: currentVolume.name,
                    ...DEFAULT_VOLUME_OPTIONS
                })
                await nv.addVolume(current);
            }else{
                await nv.addVolumeFromUrl({
                    url: currentVolume.url || currentVolume.file, 
                    name: currentVolume.name,
                    ...DEFAULT_VOLUME_OPTIONS
                });
            }
            
            if (segmentationUrl.file instanceof File) {
                    const drawing = await NVImage.loadFromFile({ file: segmentationUrl.file });
                    await nv.loadDrawing(drawing);
                } else {
                    const url = typeof segmentationUrl === 'string' ? segmentationUrl : segmentationUrl.url;
                    await nv.loadDrawingFromUrl(url);
                }

            nvRef.current = nv;
            
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

    const handleDragModeChange = (event) => {
        const newDragMode = parseInt(event.target.value)
        if (nvRef.current) {
            nvRef.current.setDragMode(newDragMode);
            setCurrentDragMode(newDragMode);
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
    const handleMultiplanarLayoutChange = (event) => {
        const newLayout = parseInt(event.target.value);
        if (nvRef.current) {
            nvRef.current.setMultiplanarLayout(newLayout);
            setCurrentMultiplanarLayout(newLayout);
        }
    }

    const handleWorldspaceChange = (event) => {
        const isChecked = event.target.checked;
        if (nvRef.current) {
            nvRef.current.setSliceMM(isChecked);
            setWorldspace(isChecked);
        }
    }
    
    return (  
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",  gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={updateSegmentationStats} style={styles.button}>Update Segmentation Stats</button>
            <label>
                cmap
                <select value={currentColormap} onChange={handleColormapChange}>
                    {availableColormaps.map((colormap) => (
                            <option key={colormap} value={colormap}>{colormap}</option>
                        ))}
                </select>
            </label>

            <label>
                Slice view { }
                <select value={currentSliceView} onChange={handleSliceViewChange}>
                    {AVAILABLE_VIEWS.map((sliceView) => (
                        <option key={sliceView} value={sliceView}>{getSliceName(sliceView)}</option>
                    ))}
                </select>
            </label>

            <label>
                Multiplanar layout { }
                <select value={currentMultiplanarLayout} onChange={handleMultiplanarLayoutChange}>
                    {AVAILABLE_MULTIPLANAR_LAYOUTS.map((layout) => (
                        <option key={layout} value={layout}>{getMultiplanarLayoutName(layout)}</option>
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
            <button onClick={handleSaveDrawing} style={styles.button}>Save Segmentation</button>
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
                checked={worldspace}
                onChange={handleWorldspaceChange}
                />
                Worldspace
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
    </div>
    )
};

NiiVue_comp.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        file: PropTypes.instanceOf(File).isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    segmentationUrl: PropTypes.shape({
        file: PropTypes.instanceOf(File).isRequired,
    }).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
}


export default NiiVue_comp;