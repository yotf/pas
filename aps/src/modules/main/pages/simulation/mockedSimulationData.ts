/**@module MockedSimulationData */
import { SimulationDataOverview } from '../settings/redux/simulation/interfaces';

export const mockedSimulationData: SimulationDataOverview = {
  realDataOverview: {
    allocatedMinutes: 150,
    availableMinutes: 120,
    minutes: 50,
    occupancy: 90,
    totalMinutes: 360,
  },
  simulationDataOverview: {
    allocatedMinutes: 150,
    availableMinutes: 120,
    minutes: 50,
    occupancy: 90,
    totalMinutes: 360,
  },
  workCenterSimulation: [
    {
      workCenterId: 120,
      workCenterName: 'Tanning',
      totalAvailability: 120,
      allocatedTime: 120,
      setupTime: 120,
      availableTime: 120,
      simulatedAllocatedTime: 120,
      simulatedSetupTime: 120,
      simulatedAvailableTime: 120,
    },
    {
      workCenterId: 240,
      workCenterName: 'Coloring',
      totalAvailability: 240,
      allocatedTime: 240,
      setupTime: 240,
      availableTime: 240,
      simulatedAllocatedTime: 240,
      simulatedSetupTime: 240,
      simulatedAvailableTime: 240,
    },
    {
      workCenterId: 300,
      workCenterName: 'Something',
      totalAvailability: 300,
      allocatedTime: 300,
      setupTime: 300,
      availableTime: 300,
      simulatedAllocatedTime: 300,
      simulatedSetupTime: 300,
      simulatedAvailableTime: 300,
    },
  ],
  routingsDeliveryDates: [
    { routingId: 41, deliveryDate: '2023-03-15T14:44:31.54233' },
    { routingId: 7, deliveryDate: '2023-04-08T14:44:31.54233' },
    { routingId: 40, deliveryDate: '2023-03-04T14:44:31.54233' },
  ],
};
