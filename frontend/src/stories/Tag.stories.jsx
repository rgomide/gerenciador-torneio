import Tag from '../components/common/Tag'

export default {
  title: 'Components/Tag',
  component: Tag
}

export const Default = {
  name: 'Tags Colors',
  render: () => (
    <div className="flex flex-col gap-4">
      <Tag label="Blue" color="blue" />
      <Tag label="Red" color="red" />
      <Tag label="Green" color="green" />
      <Tag label="Yellow" color="yellow" />
      <Tag label="Purple" color="purple" />
      <Tag label="Orange" color="orange" />
      <Tag label="Pink" color="pink" />
      <Tag label="Gray" color="gray" />
    </div>
  )
}
