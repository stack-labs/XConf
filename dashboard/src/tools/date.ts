import moment, { Moment } from 'moment';

export const formatDate = (date: number | string | Date | Moment) => {
  let d = date;
  if (typeof date === 'number') {
    if ((date + '').length === 10) d = date * 1000;
  }
  const m = moment(d);
  return m.format('YYYY-MM-DD HH:mm:ss');
};
