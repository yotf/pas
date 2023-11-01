/**@module SimulationInterfaces */
import BaseResponse from '@/modules/shared/services/interfaces';
/**One routing on the simulation page */
export interface RoutingInputs {
  routingId?: number;
  quantity: number;
  numberOfPOs: number;
  repeat: number;
  routingInitialDate: string;
  routingDeliveryDate?: string;
}
/**Form sent to APi in order to recieve data for tables and routing delivery dates */
export interface SimulationFormData {
  initialDate: string;
  finalDate: string;
  routings: RoutingInputs[];
}
/**Data presented in the overview sections of the page. Recieved from the API */
export interface DataOverview {
  occupancy: string;
  totalMinutes: string;
  allocatedMinutes: string;
  minutes: string;
  availableMinutes: string;
}
/**One work center of the simulation page table */
export interface SimulationWorkCenter {
  workCenterId: number;
  workCenterName: string;
  totalAvailability: number;
  allocatedTime: number;
  setupTime: number;
  availableTime: number;
  simulatedAllocatedTime: number;
  simulatedSetupTime: number;
  simulatedAvailableTime: number;
}
/**Delivery date of a routing. Is later matched with routings inputed by the user by using {@link useSimulationDeliveryDates} hook */
export interface RoutingDeliveryDate {
  routingId: number;
  deliveryDate: string;
}
/**Full API response for simulation page */
export interface SimulationDataOverview {
  realDataOverview: DataOverview;
  simulationDataOverview: DataOverview;
  workCenterSimulation: SimulationWorkCenter[];
  routingsDeliveryDates: RoutingDeliveryDate[];
}

export type SimulationResponse = SimulationDataOverview & BaseResponse;
