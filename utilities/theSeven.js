// Get's the day, week and month.
exports.index = function() {
  const iAccNo = Math.floor(Math.random()*9);
  const iiAccNo = Math.floor(Math.random()*9);
  const iiiAccNo = Math.floor(Math.random()*9);
  const ivAccNo = Math.floor(Math.random()*9);
  const vAccNo = Math.floor(Math.random()*9);
  const viAccNo = Math.floor(Math.random()*9);
  const viiAccNo = Math.floor(Math.random()*9);

  const theIndex = `${iAccNo}${iiAccNo}${iiiAccNo}${ivAccNo}${vAccNo}${viAccNo}${viiAccNo}`;


  return theIndex;
};

exports.index14 = function() {
  const iNo = Math.floor(Math.random()*9);
  const iiNo = Math.floor(Math.random()*9);
  const iiiNo = Math.floor(Math.random()*9);
  const ivNo = Math.floor(Math.random()*9);
  const vNo = Math.floor(Math.random()*9);
  const viNo = Math.floor(Math.random()*9);
  const viiNo = Math.floor(Math.random()*9);
  const viiiNo = Math.floor(Math.random()*9);
  const ixNo = Math.floor(Math.random()*9);
  const xNo = Math.floor(Math.random()*9);
  const xiNo = Math.floor(Math.random()*9);
  const xiiNo = Math.floor(Math.random()*9);
  const xiiiNo = Math.floor(Math.random()*9);
  const xivNo = Math.floor(Math.random()*9);

  const theIndex14 = 
  `${iNo}${iiNo}${iiiNo}${ivNo}${vNo}${viNo}${viiNo}${viiiNo}${ixNo}${xNo}${xiNo}${xiiNo}${xiiiNo}${xivNo}`;


  return theIndex14;
};