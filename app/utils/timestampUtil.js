const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var getDateFromTimestamp = timestamp => {
  var date = new Date(timestamp*1000);
  var time = date.toISOString().slice(0, 19).replace('T', ' ')
  return time;
};

export { getDateFromTimestamp };
