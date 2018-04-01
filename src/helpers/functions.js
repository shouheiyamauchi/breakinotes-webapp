const sentenceCase = camelCaseString => {
  return camelCaseString[0].toUpperCase() + camelCaseString.replace( /([A-Z])/g, " $1" ).substr(1);
};

export { sentenceCase };
