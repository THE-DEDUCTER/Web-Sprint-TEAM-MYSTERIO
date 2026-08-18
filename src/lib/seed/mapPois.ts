import type { MapPoi } from '@/types'

// Approximate coordinates around PCCOE, Nigdi, Pune (18.6533 N, 73.7592 E).
// These are illustrative placements around the real campus location, not
// surveyed exact building coordinates.
export const CAMPUS_CENTER: [number, number] = [73.7592, 18.6533]

export const seedMapPois: MapPoi[] = [
  { id: 'poi-1', name: 'Pimpri Chinchwad College of Engineering', category: 'academic', lat: 18.6533, lng: 73.7592, description: 'Main academic building.' },
  { id: 'poi-2', name: 'Main Auditorium', category: 'academic', lat: 18.6538, lng: 73.7598, description: 'Seminar halls and the main auditorium.' },
  { id: 'poi-3', name: 'Computer Department Block', category: 'academic', lat: 18.6529, lng: 73.7586, description: 'Computer & IT department classrooms and labs.' },
  { id: 'poi-4', name: 'Mechanical Workshop', category: 'academic', lat: 18.6541, lng: 73.7583, description: 'Mechanical labs and workshop.' },
  { id: 'poi-5', name: 'Cafe Lifeline', category: 'food', lat: 18.6536, lng: 73.7601, description: 'Popular campus-adjacent cafe.' },
  { id: 'poi-6', name: 'R R Tea Corner', category: 'food', lat: 18.6524, lng: 73.7595, description: 'Chai and quick snacks stall.' },
  { id: 'poi-7', name: 'College Canteen', category: 'food', lat: 18.6531, lng: 73.7589, description: 'Main student canteen.' },
  { id: 'poi-8', name: 'Axis Bank ATM', category: 'atm', lat: 18.6527, lng: 73.7605, description: 'ATM near the main gate.' },
  { id: 'poi-9', name: 'Western Union', category: 'atm', lat: 18.6519, lng: 73.7599, description: 'Currency/remittance services.' },
  { id: 'poi-10', name: 'Sangeeta Medical', category: 'medical', lat: 18.6544, lng: 73.7596, description: 'Pharmacy and first-aid supplies.' },
  { id: 'poi-11', name: 'Campus Medical Room', category: 'medical', lat: 18.6534, lng: 73.7590, description: 'On-campus first-aid and nurse station.' },
  { id: 'poi-12', name: 'Badminton Court', category: 'sports', lat: 18.6547, lng: 73.7588, description: 'Indoor badminton courts.' },
  { id: 'poi-13', name: 'Football & Cricket Ground', category: 'sports', lat: 18.6551, lng: 73.7579, description: 'Main sports ground.' },
  { id: 'poi-14', name: 'Basketball Court', category: 'sports', lat: 18.6522, lng: 73.7582, description: 'Outdoor basketball court.' },
  { id: 'poi-15', name: "Boys' Hostel", category: 'hostel', lat: 18.6512, lng: 73.7590, description: 'On-campus boys hostel.' },
  { id: 'poi-16', name: "Girls' Hostel", category: 'hostel', lat: 18.6555, lng: 73.7601, description: 'On-campus girls hostel.' },
  { id: 'poi-17', name: 'PCCOE Bus Stop', category: 'bus', lat: 18.6516, lng: 73.7605, description: 'College bus pickup/drop point.' },
  { id: 'poi-18', name: 'Nigdi Bus Depot', category: 'bus', lat: 18.6489, lng: 73.7622, description: 'PMPML bus depot nearby.' },
  { id: 'poi-19', name: 'Library', category: 'academic', lat: 18.6536, lng: 73.7586, description: 'Central library.' },
  { id: 'poi-20', name: 'Admin Block', category: 'other', lat: 18.6530, lng: 73.7597, description: 'Administrative offices.' },
]

export const POI_COLORS: Record<string, string> = {
  academic: '#4F46E5',
  food: '#F59E0B',
  atm: '#10B981',
  sports: '#EC4899',
  medical: '#EF4444',
  hostel: '#8B5CF6',
  bus: '#0EA5E9',
  other: '#6B7280',
}
