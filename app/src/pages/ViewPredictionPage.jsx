import { useLocation } from "react-router-dom"
import NiiVue_comp from "../components/Niivue/Niivue_comp";

const ViewPredictionPage = () => {

  const location = useLocation();
  const { images, segmentationUrl, labels } = location.state || {};

  return (
    <div style={{padding: '2% 5%', display: 'flex', flexDirection: 'column'}}>
      <NiiVue_comp
        images={images}
        segmentationUrl={segmentationUrl}
        labels={labels} 
      />
    </div>
    
  )
}

export default ViewPredictionPage;