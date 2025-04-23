import Spinner from './Spinner'

const OverlaySpinner = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-gray-200/40">
      {message && <h2 className="text-sm text-black">{message}</h2>}
      <Spinner size="xl" />
    </div>
  )
}

export default OverlaySpinner
