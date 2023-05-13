import dotenv from 'dotenv';
import fs from 'fs';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

dotenv.config();

type EventNameObject = {
  [feature: string]: {
    [type: string]: {
      [location: string]: {
        [target: string]: {
          [action: string]: string;
        };
      };
    };
  };
};

type EventPropertyObject = {
  [feature: string]: {
    [type: string]: {
      [location: string]: {
        [target: string]: {
          [action: string]: Record<string, string>;
        };
      };
    };
  };
};

const fetchSpreadsheetData = async (): Promise<GoogleSpreadsheet> => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
      private_key: (process.env.GOOGLE_PRIVATE_KEY as string).replace(/(\\r)|(\\n)/g, '\n'),
    });
    await doc.loadInfo();
    return doc;
  } catch (e) {
    throw e;
  }
};

const generateEventNameFileData = (eventNameObject: EventNameObject) => {
  const jsonString = JSON.stringify(eventNameObject, null, 2);
  return `export const EVENT_NAME = ${jsonString};\n`;
};

// "string" -> string 과 같이 변환함
const removeQuotationMarkOfValue = (jsonString: string) =>
  jsonString.replace(/"([^"]+)": "(.*?)"/g, (_, p1, p2) => `"${p1}": ${p2}`);

const generateEventPropertyTypeFileData = (eventPropertyTypeObject: EventPropertyObject) => {
  const jsonString = JSON.stringify(eventPropertyTypeObject, null, 2);
  const formattedString = removeQuotationMarkOfValue(jsonString);
  return `export type EventProperty = ${formattedString};\n`;
};

const generateIndexFileData = () => `export { EVENT_NAME } from './eventName';
export type { EventProperty } from './eventProperty';`;

const convertArrayToEventNameObject = (arr: string[][]): EventNameObject => {
  const result: EventNameObject = {};
  arr
    .filter(([feature, type, location, target, action, name]) =>
      [feature, type, location, target, action, name].every(Boolean),
    )
    .forEach(([feature, type, location, target, action, name]) => {
      result[feature] = { ...result[feature] };
      result[feature][type] = { ...result[feature][type] };
      result[feature][type][location] = { ...result[feature][type][location] };
      result[feature][type][location][target] = { ...result[feature][type][location][target] };
      result[feature][type][location][target][action] = name;
    });
  return result;
};

const convertEventPropertyObject = (arr: string[][]): EventPropertyObject => {
  const result: EventPropertyObject = {};

  arr
    .filter(([feature, type, location, target, action, event]) =>
      [feature, type, location, target, action, event].every(Boolean),
    )
    .forEach(([feature, type, location, target, action, event, ...rest]) => {
      result[feature] = { ...result[feature] };
      result[feature][type] = { ...result[feature][type] };
      result[feature][type][location] = { ...result[feature][type][location] };
      result[feature][type][location][target] = { ...result[feature][type][location][target] };
      result[feature][type][location][target][action] = {
        ...result[feature][type][location][target][action],
      };

      rest.reduce((obj, value, i) => {
        if (i % 2 !== 0) return obj;
        const key = value;
        const val = rest[i + 1] || '';
        if (key) {
          obj[key] = val;
        }
        return obj;
      }, result[feature][type][location][target][action]);
    });

  return result;
};

const writeToFile = async (data: string, fileName: string) => {
  await fs.writeFile(fileName, data, (err) => {
    if (err) throw err;
    console.log(`The file ${fileName} has been saved!`);
  });
};

const findClosetValue = (rows: GoogleSpreadsheetRow[], startIndex: number, key: string): string => {
  let currentIndex = startIndex;
  let value = rows[currentIndex][key];

  while (currentIndex >= 0 && value === '') {
    currentIndex--;
    value = rows[currentIndex]?.[key];
  }

  return value;
};

// sheet title, 구분 (Type), 위치 (Location), 대상 (Target) 이라면
const isPossibleKorean = (idx: number) => idx < 4;
const replaceSpaceToUnderscore = (str: string) => str.replaceAll(' ', '_');

const parseRow = (
  row: GoogleSpreadsheetRow,
  rowIndex: number,
  rows: GoogleSpreadsheetRow[],
  keyArray: string[],
  title: string,
): string[] => {
  const rowData: string[] = [title];

  keyArray.forEach((key) => {
    const value = row[key] || findClosetValue(rows, rowIndex, key);
    if (value) {
      rowData.push(value);
    }
  });

  return rowData.map((rowValue, idx) =>
    isPossibleKorean(idx) ? replaceSpaceToUnderscore(rowValue) : rowValue,
  );
};

const generateDataEvent = async () => {
  try {
    console.log('fetching google spread sheet...');
    const doc = await fetchSpreadsheetData();
    const sheetCount = doc.sheetCount;

    const allEventRows: string[][] = [];

    console.log('read all sheet rows and parsing to array...');
    // 모든 sheet를 반복
    for (let i = 0; i < sheetCount; i++) {
      const sheets = doc.sheetsByIndex[i];

      const rows = await sheets.getRows();
      const keyArray = sheets.headerValues;
      const title = sheets.title;

      // sheet의 모든 row를 반복하며 parsing
      const currentSheetRows = rows.map((row, idx, arr) =>
        parseRow(row, idx, arr, keyArray, title),
      );
      allEventRows.push(...currentSheetRows);
    }

    console.log('convert all eventRows array to object...');
    const eventNameObject = convertArrayToEventNameObject(allEventRows);
    const eventPropertyTypeObject = convertEventPropertyObject(allEventRows);

    console.log('convert object to fileString...');
    const eventNameFileData = generateEventNameFileData(eventNameObject);
    const eventPropertyFileData = generateEventPropertyTypeFileData(eventPropertyTypeObject);
    const indexFileData = generateIndexFileData();

    console.log('writing file...');
    await writeToFile(eventNameFileData, 'src/dataEvent/eventName.ts');
    await writeToFile(eventPropertyFileData, 'src/dataEvent/eventProperty.ts');
    await writeToFile(indexFileData, 'src/dataEvent/index.ts');
  } catch (e) {
    throw e;
  }
};

(async function () {
  await generateDataEvent();
})();
