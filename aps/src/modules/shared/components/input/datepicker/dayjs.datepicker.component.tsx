/**
 * @module DatePickerSetup
 */

import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
/** Configures the date picker */
const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export default DatePicker;
