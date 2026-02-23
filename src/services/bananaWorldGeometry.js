const RIM_RISE = 40;

export const getTablePx = (ratio) =>
  ratio * window.innerWidth * (window.innerWidth <= 430 ? 0.75 : 1);

export const rimSpread = (tableWidthPx) => tableWidthPx * 0.15;

export const rimLength = (tableWidthPx) =>
  Math.sqrt(
    RIM_RISE * RIM_RISE + rimSpread(tableWidthPx) * rimSpread(tableWidthPx),
  );

export const rimAngle = (tableWidthPx) =>
  Math.atan2(RIM_RISE, rimSpread(tableWidthPx));

export const calcBarCenterY = (windowHeight, panelHeight, tableHeight) =>
  windowHeight - panelHeight - tableHeight / 2 - 20;
