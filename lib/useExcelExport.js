import react, { useEffect, useState } from "react";

import XLSX from "xlsx";

const useExcelExport = ({ model, onBeforeExport, onBeforeParse }) => {

  const changePropertyNames = (dataToParse, fieldsMap) => {
    let dataWithNewProperties = [];
    let newObj = {};
    let dataToPrepare = onBeforeParse ? onBeforeParse(dataToParse) : dataToParse;

    dataToPrepare.map(item => {
      fieldsMap.map(field => {
        newObj = {
          ...newObj,
          [field.new]: field.render
            ? field.render(item[field.old])
            : item[field.old]
        };
      });
      dataWithNewProperties.push(newObj);
    });
    
    return dataWithNewProperties;
  };

  const save = (filename, overrideData) => {
    const parsedData = changePropertyNames(overrideData, model);
    const ws = XLSX.utils.json_to_sheet(onBeforeExport ? onBeforeExport(parsedData) : parsedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename.substring(0, 30));
    XLSX.writeFile(wb, filename + ".xlsx");
  };

  return [save];
};

export default useExcelExport;
