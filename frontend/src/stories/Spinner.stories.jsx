import Spinner from '../components/common/Spinner'

export default {
  title: 'Components/Spinner',
  component: Spinner
}

export const Default = {
  name: 'Default'
}

export const SpinnersSizes = {
  name: 'Spinners Sizes',
  render: () => (
    <div className="flex flex-col gap-4">
      <h2>Small (sm)</h2>
      <Spinner size="sm" />
      <h2>Medium (md)</h2>
      <Spinner size="md" />
      <h2>Large (lg)</h2>
      <Spinner size="lg" />
      <h2>XLarge (xl)</h2>
      <Spinner size="xl" />
    </div>
  )
}

export const SpinnersColors = {
  name: 'Spinners Colors',
  render: () => (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col items-center gap-2">
        <h2>Blue</h2>
        <Spinner size="md" color="blue" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2>Red</h2>
        <Spinner size="md" color="red" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2>Green</h2>
        <Spinner size="md" color="green" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2>Yellow</h2>
        <Spinner size="md" color="yellow" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2>Purple</h2>
        <Spinner size="md" color="purple" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2>Orange</h2>
        <Spinner size="md" color="orange" />
      </div>
      <div className="flex flex-col items-center gap-2">
        Pink
        <Spinner size="md" color="pink" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2>Gray</h2>
        <Spinner size="md" color="gray" />
      </div>
    </div>
  )
}
