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
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
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

const generateEventNameFileData = (eventNameObject: EventNameObject) =>
  `export const EVENT_NAME = ${JSON.stringify(eventNameObject, null, 2)};\n`;

// "string" -> string 과 같이 변환함
const removeQuotes = (str: string) => str.replace(/["']/g, '');
const generateEventPropertyTypeFileData = (eventPropertyTypeObject: EventPropertyObject) =>
  `export type EventProperty = ${removeQuotes(
    JSON.stringify(eventPropertyTypeObject, null, 2),
  )};\n`;

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

const generateDataEvent = async () => {
  try {
    const doc = await fetchSpreadsheetData();

    const sheetCount = doc.sheetCount;

    const allEventRows: string[][] = [];
    for (let i = 0; i < sheetCount; i++) {
      const sheets = doc.sheetsByIndex[i];

      const rows = await sheets.getRows();
      const keys = sheets.headerValues;
      const title = sheets.title;

      rows.forEach((row, rowIdx) => {
        const currentRow = keys.reduce(
          (acc, key) => {
            const value = row[key] ? row[key] : findClosetValue(rows, rowIdx, key);
            if (!value) {
              return acc;
            }
            return [...acc, value.replaceAll(' ', '_')];
          },
          [title.replaceAll(' ', '_')],
        );
        allEventRows.push(currentRow);
      });
    }

    const eventNameObject = convertArrayToEventNameObject(allEventRows);
    const eventPropertyTypeObject = convertEventPropertyObject(allEventRows);

    const eventNameFileData = generateEventNameFileData(eventNameObject);
    const eventPropertyFileData = generateEventPropertyTypeFileData(eventPropertyTypeObject);
    const indexFileData = generateIndexFileData();

    console.log('eventNameObject', eventNameFileData);
    console.log('eventPropertyTypeObject', eventPropertyFileData);

    await writeToFile(eventNameFileData, 'src/dataEvent/eventName.ts');
    await writeToFile(eventPropertyFileData, 'src/dataEvent/eventProperty.ts');
    await writeToFile(indexFileData, 'src/dataEvent/index.ts');

    // res.status(200).json('The data event generator succeeded');
  } catch (e) {
    throw e;
    // res.status(500).json('오류가 발생했습니다.');
  }
};

(async function () {
  await generateDataEvent();
})();
