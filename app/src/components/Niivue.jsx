import { useRef, useEffect, useState } from "react";
import { Niivue, SLICE_TYPE, SHOW_RENDER, MULTIPLANAR_TYPE } from "@niivue/niivue";


const defaultNiivueOptions = {
    logLevel: "debug",
    show3Dcrosshair: true,
    crosshairWidth: 1,
    crosshairWidthUnit: "mm",
    sliceType: SLICE_TYPE.MULTIPLANAR,
    multiplanarShowRender: SHOW_RENDER.NEVER,
    multiplanarEqualSize: true
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

const NiiVue = ({ imagesUrls, segmentationUrl }) => {
    const canvas = useRef();
    const nvRef = useRef();

    const [currentVolumeUrl, setCurrentVolumeUrl] = useState(imagesUrls[0]);
    const volumeList = [{url: currentVolumeUrl,...defaultVolumeOptions}];

    const [isCrosshairChecked, setIsCrosshairChecked] = useState(false);
    const [isDrawOpacityChecked, setIsDrawOpacityChecked] = useState(false);

    const [availableColormaps, setAvailableColormaps] = useState([]); 
    const [currentColormap, setCurrentColormap] = useState("gray");
    
    const availibleViews = [SLICE_TYPE.MULTIPLANAR, SLICE_TYPE.AXIAL, SLICE_TYPE.CORONAL, SLICE_TYPE.SAGITTAL, SLICE_TYPE.RENDER];   
    const [currentSliceView, setCurrentSliceView] = useState(SLICE_TYPE.MULTIPLANAR);

    const [isDrawModeActive, setIsDrawModeActive] = useState(false);
    const [penValue, setPenValue] = useState(PEN_COLOR_RED);

    useEffect(() => {

        async function setupAndLoad() {
            const nv = new Niivue(defaultNiivueOptions);
            
            const availableColormaps = nv.colormaps();
            setAvailableColormaps(availableColormaps);
            nv.setMultiplanarLayout(MULTIPLANAR_TYPE.ROW); 
            nv.attachToCanvas(canvas.current);
            await nv.loadVolumes(volumeList);
            await nv.loadDrawingFromUrl(segmentationUrl);
            nvRef.current = nv
        }

        setupAndLoad()

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
        const newVolumeUrl = event.target.value;
        console.debug("Changing volume to:", newVolumeUrl);
        if (nvRef.current) {
            await nvRef.current.removeVolumeByUrl(currentVolumeUrl);
            await nvRef.current.addVolumeFromUrl({
                url: newVolumeUrl,
                ...defaultVolumeOptions, 
                colormap: currentColormap
            });
            setCurrentVolumeUrl(newVolumeUrl);
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
            nvRef.current.setPenValue(newPenValue);
            setPenValue(newPenValue);
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

    return (
        <>  
        <div>
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
                <select value={currentVolumeUrl} onChange={handleVolumeChange}>
                    {imagesUrls.map((volume) => (
                            <option key={volume} value={volume}>{volume}</option>
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
                checked={isDrawModeActive}
                onChange={handleDrawingActivation}
                />
                Draw Mode
            </label>

            {isDrawModeActive && (
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
            )}
            
        </div>
        <div>
            <canvas ref={canvas} height={700} width={700} />
        </div>
        </>
    )
};


export default NiiVue;