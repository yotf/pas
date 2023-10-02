/**
 * @module SimulationPage
 */

import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { useAppSelector } from '@/store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DataOverview, SimulationFormData } from '../settings/redux/simulation/interfaces';
import SimulationActions from './components/simulationActions';
import SimulationDataOverview from './components/simulationDataOverview';
import SimulationRoutings from './components/simulationRoutings';
import SimulationTable from './components/simulationTable';
import { emptyRouting } from './emptyRouting';
import { useSimulationDataForm } from './hooks/useSimulationDataForm';
import { useSimulationDeliveryDates } from './hooks/useSimulationDeliveryDates';
import { useSimulationSchema } from './hooks/useSimulationSchema';
import './simulation.scss';
import { notificationFail } from '@/modules/shared/services/notification.service';
/**
 *
 * @returns
 */
const Simulation: FC = () => {
  const { realDataOverview, simulationDataOverview, error, loading } = useAppSelector(
    (state) => state.simulation,
  );

  const { translate } = useTranslate({ ns: 'simulation' });

  const validationSchema = useSimulationSchema();
  const form = useForm<SimulationFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      routings: [emptyRouting],
    },
  });

  const realDataForm = useForm<DataOverview>();
  const simulationDataForm = useForm<DataOverview>();

  useSimulationDataForm({ simulationOverviewData: realDataOverview, form: realDataForm });
  useSimulationDataForm({
    simulationOverviewData: simulationDataOverview,
    form: simulationDataForm,
  });

  const {
    watch,
    trigger,
    getFieldState,
    formState: { isSubmitted },
  } = form;

  const { initialDate, routings, finalDate } = watch();

  useEffect(() => {
    routings?.map((routing, i) => {
      if (routing.routingDeliveryDate) {
        trigger(`routings.${i}.routingDeliveryDate`);
      }
      if (routing.routingInitialDate) {
        trigger(`routings.${i}.routingInitialDate`);
      }
    });
  }, [initialDate, finalDate, routings, getFieldState, trigger]);

  useEffect(() => {
    if (finalDate && initialDate) trigger('initialDate');
  }, [finalDate, initialDate, trigger]);

  useEffect(() => {
    if (loading) return;
    if (error) {
      notificationFail(error);
      return;
    }
  }, [error, loading, isSubmitted, translate]);

  useSimulationDeliveryDates(form);

  return (
    <FormProvider {...form}>
      <div className='simulation-container'>
        <h1 className='table-container__title'>{translate('title')}</h1>
        <div className='simulation-inputs'>
          <SimulationActions />
          <SimulationRoutings />
          <div className='simulation-data-container'>
            <SimulationDataOverview form={realDataForm} dataType={'real'} />
            <SimulationDataOverview form={simulationDataForm} dataType={'simulation'} />
          </div>
          <SimulationTable />
        </div>
      </div>
    </FormProvider>
  );
};

export default Simulation;
