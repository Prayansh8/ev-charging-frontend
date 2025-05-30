export const CONNECTOR_TYPES = [
    'Type 1',
    'Type 2',
    'CCS',
    'CHAdeMO',
    'Tesla Supercharger',
    'GB/T'
  ]
  
  export const STATION_STATUS = {
    active: { label: 'Active', color: 'green' },
    inactive: { label: 'Inactive', color: 'gray' },
    maintenance: { label: 'Maintenance', color: 'yellow' }
  }
  
  export const AVAILABILITY_STATUS = {
    available: { label: 'Available', color: 'green' },
    occupied: { label: 'Occupied', color: 'orange' },
    'out-of-service': { label: 'Out of Service', color: 'red' }
  }
  
  export const POWER_OUTPUT_RANGES = [
    { label: 'All', value: '' },
    { label: '0-50 kW', value: '50' },
    { label: '50-150 kW', value: '150' },
    { label: '150+ kW', value: '350' }
  ]