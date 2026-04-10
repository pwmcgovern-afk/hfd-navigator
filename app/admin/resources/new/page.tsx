import ResourceForm from '../ResourceForm'

export default function NewResourcePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Resource</h1>
      <ResourceForm mode="create" />
    </div>
  )
}
