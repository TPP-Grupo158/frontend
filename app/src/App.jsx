import NiiVue from './components/Niivue.jsx'

const imagesUrls = ["/flair.nii.gz", "/bravo.nii.gz", "/t1_gd.nii.gz", "/t1_pre.nii.gz"];

function App() {

  return (
    <>
      <NiiVue imagesUrls={imagesUrls} segmentationUrl={"/seg.nii.gz"} />
    </>
  )
}

export default App
