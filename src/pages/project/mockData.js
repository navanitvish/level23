// src/pages/project/mockData.js
// ─── Used as fallback when API returns empty/fails ───────────

export const MOCK_WINGS = [
  {
    _id:         'wing_001',
    name:        'Wing A',
    totalFloors: 10,
    description: 'East facing wing with garden view',
    isActive:    true,
    projectId:   'project_001',
    createdAt:   '2024-01-10',
  },
  {
    _id:         'wing_002',
    name:        'Wing B',
    totalFloors: 10,
    description: 'West facing wing with pool view',
    isActive:    true,
    projectId:   'project_001',
    createdAt:   '2024-01-10',
  },
  {
    _id:         'wing_003',
    name:        'Tower C',
    totalFloors: 15,
    description: 'Premium tower with city skyline view',
    isActive:    false,
    projectId:   'project_001',
    createdAt:   '2024-02-01',
  },
]

// Statuses pool for random assignment
const STATUSES  = ['Available', 'Available', 'Available', 'Sold', 'Hold']
const TYPES     = ['1BHK', '2BHK', '2BHK', '3BHK', '3BHK']
const FACINGS   = ['North', 'South', 'East', 'West', 'North-East']
const HELD_BY   = ['Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Sneha Joshi']
const SOLD_BY   = ['Ankit Mehta', 'Ravi Kumar', 'Sunita Desai']

const pick = (arr, i) => arr[i % arr.length]

// Generate units for a wing
export const generateMockUnits = (wingId, wingName, floors = 5, unitsPerFloor = 4) => {
  const units = []
  const letter = wingName?.replace(/[^A-Z]/gi, '').charAt(0).toUpperCase() || 'U'

  for (let floor = 1; floor <= floors; floor++) {
    for (let u = 1; u <= unitsPerFloor; u++) {
      const idx    = (floor - 1) * unitsPerFloor + (u - 1)
      const status = pick(STATUSES, idx + floor)
      const type   = pick(TYPES, idx)
      const carpet = type === '1BHK' ? 620 : type === '2BHK' ? 920 : 1250
      const scale  = Math.round(carpet * 1.18)
      const price  = carpet * (type === '1BHK' ? 4200 : type === '2BHK' ? 4800 : 5500)

      units.push({
        _id:          `unit_${wingId}_${floor}_${u}`,
        wingId,
        projectId:    'project_001',
        unitNo:       `${letter}-${floor}0${u}`,
        unitType:     type,
        floor,
        carpetArea:   carpet,
        scalableArea: scale,
        facing:       pick(FACINGS, idx + u),
        price,
        status,
        heldBy:       status === 'Hold' ? pick(HELD_BY, idx) : '',
        soldBy:       status === 'Sold' ? pick(SOLD_BY, idx) : '',
        isActive:     true,
        createdAt:    '2024-01-15',
      })
    }
  }
  return units
}

// Pre-generated units for each mock wing
export const MOCK_UNITS = {
  wing_001: generateMockUnits('wing_001', 'Wing A', 5, 4),
  wing_002: generateMockUnits('wing_002', 'Wing B', 4, 3),
  wing_003: generateMockUnits('wing_003', 'Tower C', 6, 5),
}