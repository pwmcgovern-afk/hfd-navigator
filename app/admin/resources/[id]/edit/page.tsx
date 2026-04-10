import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ResourceForm from '../../ResourceForm'

export default async function EditResourcePage({
  params
}: {
  params: { id: string }
}) {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id }
  })

  if (!resource) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Resource</h1>
      <p className="text-sm text-gray-500 mb-6">ID: {resource.id}</p>
      <ResourceForm
        mode="edit"
        initialData={{
          id: resource.id,
          name: resource.name,
          organization: resource.organization,
          description: resource.description,
          categories: resource.categories,
          address: resource.address,
          city: resource.city,
          state: resource.state,
          zip: resource.zip,
          phone: resource.phone,
          website: resource.website,
          email: resource.email,
          hours: resource.hours,
          eligibility: resource.eligibility as Record<string, unknown> | null,
          howToApply: resource.howToApply,
          tips: resource.tips,
          nameEs: resource.nameEs,
          descriptionEs: resource.descriptionEs,
          howToApplyEs: resource.howToApplyEs,
          tipsEs: resource.tipsEs,
        }}
      />
    </div>
  )
}
