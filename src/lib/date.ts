import { toDate, toZonedTime } from 'date-fns-tz';
import { SolarTime } from 'tyme4ts';

/**
 * Convert ISO datetime string to SolarTime (China UTC+8).
 */
export const getSolarTime = (isoDate: string) => {
  const date = toDate(isoDate);
  const zonedDate = toZonedTime(date, '+08:00');
  return SolarTime.fromYmdHms(
    zonedDate.getFullYear(),
    zonedDate.getMonth() + 1,
    zonedDate.getDate(),
    zonedDate.getHours(),
    zonedDate.getMinutes(),
    0,
  );
};

export const today = () => {
  const date = toDate(new Date());
  const zonedDate = toZonedTime(date, '+08:00');
  return zonedDate.toISOString();
};

export function formatSolarTime(solarTime: SolarTime) {
  return (
    [
      solarTime.getYear(),
      solarTime.getMonth().toString().padStart(2, '0'),
      solarTime.getDay().toString().padStart(2, '0'),
    ].join('-') +
    ' ' +
    [
      solarTime.getHour().toString().padStart(2, '0'),
      solarTime.getMinute().toString().padStart(2, '0'),
      solarTime.getSecond().toString().padStart(2, '0'),
    ].join(':')
  );
}
