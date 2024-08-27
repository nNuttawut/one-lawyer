import React from "react";

const arabicToThai = () => {
  const convertToThaiNumerals = (text) => {
    const arabicToThai = {
      0: "๐",
      1: "๑",
      2: "๒",
      3: "๓",
      4: "๔",
      5: "๕",
      6: "๖",
      7: "๗",
      8: "๘",
      9: "๙",
    };
    return text.replace(/[0-9]/g, (match) => arabicToThai[match]);
  };
  return [convertToThaiNumerals];
};

export default arabicToThai;
