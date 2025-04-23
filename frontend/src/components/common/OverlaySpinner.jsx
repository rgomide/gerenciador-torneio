import Spinner from './Spinner'

const OverlaySpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/40">
      <Spinner />
    </div>
  )
}

export default OverlaySpinner
