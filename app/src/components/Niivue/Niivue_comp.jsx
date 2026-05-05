import { useRef, useEffect, useState } from "react";
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


import * as MenuBar from "@radix-ui/react-menubar";
import MenubarMenu from "./radix-ui/MenubarMenu.jsx";
import MenuBarRadioGroup from "./radix-ui/MenubarRadioGroup.jsx";
import MenubarCheckboxItem from "./radix-ui/MenubarCheckbox.jsx";

import SegmentationStatsDisplay from "./SegmentationStatsDisplay.jsx";
import LabelsDisplay from "./LabelsDisplay.jsx";
import CoordinatesDisplay from "./CoordinatesDisplay.jsx";

const NiiVue_comp = ({ images, segmentationUrl = { url: '' }, labels }) => {
    const canvas = useRef(null);
    const nvRef = useRef(null);

    const [currentVolume, setCurrentVolume] = useState(images[0]);

    const [isCrosshairChecked, setIsCrosshairChecked] = useState(true);

    const [availableColormaps, setAvailableColormaps] = useState([]); 
    const [currentColormap, setCurrentColormap] = useState(DEFAULT_VOLUME_OPTIONS.colormap);
    
    const [currentSliceView, setCurrentSliceView] = useState(DEFAULT_NIIVUE_OPTIONS.sliceType);
    const [currentMultiplanarLayout, setCurrentMultiplanarLayout] = useState(DEFAULT_NIIVUE_OPTIONS.multiplanarLayout);

    const [currentDragMode, setCurrentDragMode] = useState(DEFAULT_NIIVUE_OPTIONS.dragMode);

    const [currentSlice, setCurrentSlice] = useState({ x: 0, y: 0, z: 0 });

    const[currentVolumeGamma, setCurrentVolumeGamma] = useState(1.0);
    const[currentDrawOpacity, setCurrentDrawOpacity] = useState(0.6);

    const [segmentationStats, setSegmentationStats] = useState(null);
    const [coloredLabels, setColoredLabels] = useState({});

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

            // Get initial segmentation stats
            const stats = nv.getDescriptives({
                layer: 0,
                drawingIsMask: true,
            });
            setSegmentationStats(parseSegmentationStats(stats));
            
            // Get segmentation colors and map to labels
            const labelsWithColors = {};
            labels.forEach((label, i) => {
                const labelColor = nv.drawLut.lut.slice((i+1)*4, (i+2)*4);
                labelsWithColors[label] = labelColor;
            });
            setColoredLabels(labelsWithColors);
            
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

    const handleColormapChange = (newColormap) => {
        if (nvRef.current && nvRef.current.volumes.length > 0) {
            const volumeId = nvRef.current.volumes[0].id;
            nvRef.current.setColormap(volumeId, newColormap);
            setCurrentColormap(newColormap);
        }
    };

    const handleSliceViewChange = (newView) => {
        if (nvRef.current) {
            nvRef.current.setSliceType(newView);
            setCurrentSliceView(newView);
        }
    };


    const handleCrosshairChange = (checked) => {
        if (nvRef.current) {
            nvRef.current.opts.crosshairWidth = checked ? CROSSHAIR.VISIBLE : CROSSHAIR.HIDDEN;
            nvRef.current.opts.show3Dcrosshair = checked;
            nvRef.current.drawScene();
            setIsCrosshairChecked(checked);
        }
    }

    const handleDrawOpacityChange = (event) => {
        const newOpacity = parseFloat(event.target.value);
        if (nvRef.current) {
            nvRef.current.setDrawOpacity(newOpacity);
            setCurrentDrawOpacity(newOpacity);
        }
    }

    const handleVolumeChange = async (newVolumeName) => {
        const newVolume = images.find(v => v.name === newVolumeName);

        if (nvRef.current) {

            nvRef.current.setDrawingEnabled(false);

            await nvRef.current.removeVolumeByIndex(0);
            await nvRef.current.addVolumeFromUrl({
                url: currentVolume.url || currentVolume.file,
                name: currentVolume.name,
                ...DEFAULT_VOLUME_OPTIONS
            });
            setCurrentVolume(newVolume);
        }
    }

    const handleSaveDrawing = () => {
        if (!nvRef.current) return;
            nvRef.current.saveImage({filename: 'segmentation.nii.gz', isSaveDrawing: true});
    }

    const handleDragModeChange = (newDragMode) => {
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

    const handleMultiplanarLayoutChange = (newLayout) => {
        if (nvRef.current) {
            nvRef.current.setMultiplanarLayout(newLayout);
            setCurrentMultiplanarLayout(newLayout);
        }
    }

    
    return (  
    <div style={{ 
        display: "flex",
        flexDirection: "column",
        gap: "8px"
        }}>
        
        <MenuBar.Root style={{
            display: "flex",
            width: "fit-content",
            backgroundColor: "white",
            padding: "3px",
            borderRadius: "6px",
            border: "1px solid #ccc",
        }}>
            <MenubarMenu label="File">
                <MenuBarRadioGroup
                    value={currentVolume.name}
                    onValueChange={handleVolumeChange}
                    items={images.map(volume => ({
                        value: volume.name,
                        label: volume.name
                    }))}
                />
                <MenuBar.Separator style={{ height: '1px', backgroundColor: '#ccc', margin: '4px 0' }} />
                <MenuBar.Item onSelect={handleSaveDrawing} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                    Save Segmentation
                </MenuBar.Item>
            </MenubarMenu>
            
            <MenubarMenu
                style={{
                    padding: '4px 8px',
                    cursor: 'pointer',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: 18,
                }}
                label="Colormap"
            >
                <MenuBarRadioGroup
                    value={currentColormap}
                    onValueChange={handleColormapChange}
                    items={availableColormaps.map(colormap => ({
                        value: colormap,
                        label: colormap
                    }))}
                />
            </MenubarMenu>

            <MenubarMenu label="View">
                <MenuBarRadioGroup
                    value={currentSliceView}
                    onValueChange={handleSliceViewChange}
                    items={AVAILABLE_VIEWS.map(view => ({
                        value: view,
                        label: getSliceName(view)
                    }))}
                />
                <MenuBar.Separator style={{ height: '1px', backgroundColor: '#ccc', margin: '4px 0' }} />
                <MenubarCheckboxItem
                    checked={isCrosshairChecked}
                    onCheckedChange={handleCrosshairChange}
                    label="Show Crosshair"
                />
            </MenubarMenu>

            <MenubarMenu label="Layout">
                <MenuBarRadioGroup
                    value={currentMultiplanarLayout}
                    onValueChange={handleMultiplanarLayoutChange}
                    items={AVAILABLE_MULTIPLANAR_LAYOUTS.map(layout => ({
                        value: layout,
                        label: getMultiplanarLayoutName(layout)
                    }))}
                />
            </MenubarMenu>

            <MenubarMenu label="Mode">
                <MenuBarRadioGroup
                    value={currentDragMode}
                    onValueChange={handleDragModeChange}
                    items={AVAILABLE_DRAG_MODES.map(mode => ({
                        value: mode,
                        label: getDragModeName(mode)
                    }))}
                />
            </MenubarMenu>

        </MenuBar.Root>

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
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
                height: 700,
                borderBottom: "1px solid #e5e7eb",
            }}>
            <canvas ref={canvas} style={{ width: "100%", height: "100%" }} />
             <div style={{
                display: 'flex',
                gap: '12px',
                padding: "4px 0 4px 12px",
                backgroundColor: "#1e1e1e",
                boxSizing: "border-box",
            }}>
                <LabelsDisplay coloredLabels={coloredLabels} />
                <CoordinatesDisplay coordinates={currentSlice} />
            </div>
        </div>
        
        <div style={{marginTop: '1rem'}}>
            <SegmentationStatsDisplay stats={segmentationStats} />
        </div>
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