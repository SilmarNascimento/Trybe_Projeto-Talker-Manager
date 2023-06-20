const rateFilter = (array, filter) => array.filter(({ talk }) => talk.rate === Number(filter));

const dateFilter = (array, filter) => array.filter(({ talk }) => talk.watchedAt === filter);

const aditionalFIlters = (propArray, lastFilter) => {
  let response = [...lastFilter];
  propArray.forEach((prop, index) => {
    if (propArray[0] && index === 0) {
      response = rateFilter(response, prop);
    }
    if (propArray[1] && index === 1) {
      response = dateFilter(response, prop);
    }
  });
  return response;
};

module.exports = {
  rateFilter,
  dateFilter,
  aditionalFIlters,
};
