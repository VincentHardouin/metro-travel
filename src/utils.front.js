function filterStationsForList(search, stations) {
  const normalizedSearch = search
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[ -]/g, '[ -]')
    .toLowerCase();
  const searchRegex = new RegExp(normalizedSearch, 'i');
  const startRegex = new RegExp(`^${normalizedSearch}`);
  return stations
    .sort((a, b) => a.localeCompare(b))
    .filter((name) => {
      const normalizedName = name.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
      return normalizedName.match(searchRegex);
    })
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      if (aLower.match(startRegex) && !bLower.match(startRegex))
        return -1;

      if (!aLower.match(startRegex) && bLower.match(startRegex))
        return 1;

      return 0;
    });
}

export {
  filterStationsForList,
};
