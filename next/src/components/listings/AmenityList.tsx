import { LISTING_FEATURES } from '@/lib/listingFeatures'

interface AmenityListProps {
  features: string[]
}

export function AmenityList({ features }: AmenityListProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <div className="mt-3">
      <h3 className="font-label-caps text-label-caps uppercase text-slate-700 text-xs mb-2">
        Plot Highlights & Amenities
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {features.map((f) => {
          const label = LISTING_FEATURES.find((x) => x.key === f)?.label ?? f
          return (
            <div key={f} className="flex items-center gap-2 text-xs text-slate-700">
              <span className="text-green-600">
                \u2713
              </span>
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}