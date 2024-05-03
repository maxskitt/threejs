const createFactionComponent = (faction) => {
  return {
    getFaction: () => faction,
    setFaction: (newFaction) => {
      faction = newFaction;
    },
  };
};

export default createFactionComponent;
