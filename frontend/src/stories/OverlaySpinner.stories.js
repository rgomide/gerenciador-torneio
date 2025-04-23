import OverlaySpinner from '../components/common/OverlaySpinner'

export default {
  title: 'Components/OverlaySpinner',
  component: OverlaySpinner
}

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Lorem ipsum dolor sit amet</h1>
      <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet</p>
      <OverlaySpinner />
    </div>
  )
}

export const WithMessage = {
  name: 'With Message',
  render: () => <OverlaySpinner message="Loading..." />
}
