import { useRef, useEffect, useState } from "react";
import { Niivue, SLICE_TYPE, SHOW_RENDER, MULTIPLANAR_TYPE } from "@niivue/niivue";


const defaultNiivueOptions = {
    logLevel: "info",
    show3Dcrosshair: true,
    crosshairWidth: 1,
    crosshairWidthUnit: "mm",
    sliceType: SLICE_TYPE.MULTIPLANAR,
    multiplanarShowRender: SHOW_RENDER.AUTO,
    multiplanarEqualSize: true
}

const HIDE_CROSSHAIR_SIZE = 0;
const SHOW_CROSSHAIR_SIZE = 1;

const NiiVue = ({ imageUrl, segmentationUrl }) => {
    const canvas = useRef();
    const nvRef = useRef();

    const volumeList = [
            {
            url: imageUrl,
            colormap: "gray",
            opacity: 1,
            visible: true,
            },
        ];
    
    const [isCrosshairChecked, setIsCrosshairChecked] = useState(false);
    const [isDrawOpacityChecked, setIsDrawOpacityChecked] = useState(false);

    const [availableColormaps, setAvailableColormaps] = useState([]); 
    const [currentColormap, setCurrentColormap] = useState("gray");
    
    const availibleViews = [SLICE_TYPE.MULTIPLANAR, SLICE_TYPE.AXIAL, SLICE_TYPE.CORONAL, SLICE_TYPE.SAGITTAL, SLICE_TYPE.RENDER];   
    const [currentSliceView, setCurrentSliceView] = useState(SLICE_TYPE.MULTIPLANAR);

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
            isChecked ? nvRef.current.setDrawOpacity(0.0) : nvRef.current.setDrawOpacity(0.9); 
            setIsDrawOpacityChecked(isChecked);
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
                Colormap:
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
        </div>
        <div>
            <canvas ref={canvas} height={700} width={700} />
        </div>
            
        </>
    )
};


export default NiiVue;