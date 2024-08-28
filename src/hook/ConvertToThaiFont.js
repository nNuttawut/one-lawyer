const ConvertToThaiFont = () => {
  const convertToThaiFont = (text) => {
    const engToThai = {
      A: "เอ",
      B: "บี",
      C: "ซี",
      D: "ดี",
      E: "อี",
      F: "เอฟ",
      G: "จี",
      H: "แฮช",
      I: "ไอ",
      J: "เจ",
      K: "เค",
      L: "แอล",
      M: "เอ็ม",
      N: "เอ็น",
      O: "โอ",
      P: "พี",
      Q: "คิว",
      R: "อาร์",
      S: "เอส",
      T: "ที",
      U: "ยู",
      V: "วี",
      W: "ดับบิว",
      X: "เอ็กซ์",
      Y: "วาย",
      Z: "แซต",
    };
    return text.replace(/[A-Z]/g, (match) => engToThai[match]);
  };
  return [convertToThaiFont];
};

export default ConvertToThaiFont;
