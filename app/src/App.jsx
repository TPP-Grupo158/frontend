import NiiVue from './components/Niivue.jsx'

function App() {

  return (
    <>
      <NiiVue imageUrl={"/flair.nii.gz"} segmentationUrl={"/seg.nii.gz"} />
    </>
  )
}

export default App
