/* Map colour schemes, shared by every generator. */
(function (Carto) {
  'use strict';

  Carto.Palettes = {
    parchment: {
      paper: '#efe4c9', paperShade: '#e2d3ad', ink: '#3a2e24', inkSoft: '#8a7458',
      building: '#d2bc92', buildingSpecial: '#b99a6b', roof: '#c4ab7f',
      water: '#a8bdb8', waterInk: '#5f7f80', green: '#c3c79a', greenInk: '#7f8a55',
      tree: '#a7b07a', field: '#e3d6aa', fieldAlt: '#d6cf9c', fieldInk: '#b5a171',
      road: '#f3ead4', sand: '#e9d7a6', floor: '#fbf6ea', grid: '#d9ccb0',
      hatch: '#3a2e24', label: '#2c2219', accent: '#8e3324', rock: '#cfc1a2', mountain: '#e6d6b0',
    },
    ink: {
      paper: '#ffffff', paperShade: '#f0f0f0', ink: '#141414', inkSoft: '#777777',
      building: '#e2e2e2', buildingSpecial: '#c4c4c4', roof: '#d4d4d4',
      water: '#dfe6e9', waterInk: '#6b7c84', green: '#e9ede2', greenInk: '#7f8a7a',
      tree: '#d9dfd0', field: '#f4f4ee', fieldAlt: '#ebebe2', fieldInk: '#b9b9b0',
      road: '#ffffff', sand: '#f2efe6', floor: '#ffffff', grid: '#dddddd',
      hatch: '#141414', label: '#111111', accent: '#141414', rock: '#e4e4e4', mountain: '#f2f2f2',
    },
    night: {
      paper: '#1b2230', paperShade: '#222b3b', ink: '#cfd6e2', inkSoft: '#7d8aa0',
      building: '#3a4559', buildingSpecial: '#4d5a72', roof: '#445067',
      water: '#121a29', waterInk: '#3f5574', green: '#26332f', greenInk: '#4d6b5c',
      tree: '#2d3d36', field: '#242d3c', fieldAlt: '#29313f', fieldInk: '#3d4a60',
      road: '#262f40', sand: '#2e3445', floor: '#2a3242', grid: '#364056',
      hatch: '#8793a8', label: '#ece3c9', accent: '#e0b25c', rock: '#323b4d', mountain: '#2d3647',
    },
    blueprint: {
      paper: '#1f4f7a', paperShade: '#24598a', ink: '#eaf3fb', inkSoft: '#9fc0dc',
      building: '#2a6496', buildingSpecial: '#3373aa', roof: '#2d6a9e',
      water: '#1a4166', waterInk: '#8fb5d6', green: '#245b85', greenInk: '#8fb5d6',
      tree: '#2a6290', field: '#22567f', fieldAlt: '#255b86', fieldInk: '#6e9cc4',
      road: '#22577f', sand: '#2a5e8a', floor: '#235a86', grid: '#3b6f9c',
      hatch: '#cfe2f3', label: '#ffffff', accent: '#ffd479', rock: '#2b6391', mountain: '#265c88',
    },
  };

  Carto.PaletteOrder = ['parchment', 'ink', 'night', 'blueprint'];
})(window.Carto = window.Carto || {});
