import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

type EventNameObject = {
  [feature: string]: {
    [location: string]: {
      [target: string]: {
        [action: string]: string
      };
    };
  };
};

type EventPropertyObject = {
  [feature: string]: {
    [location: string]: {
      [target: string]: {
        [action: string]: Record<string, string>
      },
    };
  };
};

type GoogleSpreadsheetRow = {
  c: [{ v: string | null }];
};

const parseSpreadsheetData = (data: string) => {
  const startIndex = data.indexOf('{');
  const endIndex = data.lastIndexOf('}') + 1;
  return JSON.parse(data.slice(startIndex, endIndex));
};

const parseSpreadsheetRow = (row: GoogleSpreadsheetRow): string[] =>
  row.c.map((obj) => obj?.v).filter((v) => !!v) as string[];

const removeRowsBeforeDataStart = (
  rows: GoogleSpreadsheetRow[],
  removeUntil: number,
): GoogleSpreadsheetRow[] => rows.slice(removeUntil);

const fetchSpreadsheetData = async (sheetId: string): Promise<string[][]> => {
  // Google Sheet에서 데이터 가져오기
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const query = encodeURIComponent('Select *');
  const response = await fetch(`${base}&tq=${query}`);

  // 데이터 파싱하기
  const text = await response.text();
  const jsonData = parseSpreadsheetData(text);
  const allRows = jsonData.table.rows as GoogleSpreadsheetRow[];
  const dataRows = removeRowsBeforeDataStart(allRows, 1);
  return dataRows.map(parseSpreadsheetRow);
};

const generateEventNameFileData = (
  eventNameObject: EventNameObject,
) => `type EventName = {
  [feature: string]: {
    [location: string]: {
      [target: string]: {
        [action: string]: string
      };
    };
  };
};

export const EVENT_NAME: EventName = ${JSON.stringify(eventNameObject, null, 2)};\n`;

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
    .filter(([feature, location, target, action, name]) => [feature, location, target, action, name].every(Boolean))
    .forEach(([feature, location, target, action, name]) => {
      result[feature] = { ...result[feature] };
      result[feature][location] = { ...result[feature][location] };
      result[feature][location][target] = { ...result[feature][location][target] };
      result[feature][location][target][action] = name;
    });
  return result;
};

const convertEventPropertyObject = (arr: string[][]): EventPropertyObject => {
  const result: EventPropertyObject = {};

  arr
    .filter(([feature, location, target, action, event]) => [feature, location, target, action, event].every(Boolean))
    .forEach(([feature, location, target, action, event, ...rest]) => {
      result[feature] = { ...result[feature] };
      result[feature][location] = { ...result[feature][location] };
      result[feature][location][target] = { ...result[feature][location][target] };
      result[feature][location][target][action] = { ...result[feature][location][target][action] };

      rest.reduce((obj, value, i) => {
        if (i % 2 !== 0) return obj;
        const key = value;
        const val = rest[i + 1] || '';
        if (key) {
          obj[key] = val;
        }
        return obj;
      }, result[feature][location][target][action]);
    });

  return result;
};

const writeToFile = async (data: string, fileName: string) => {
  await fs.writeFile(fileName, data, (err) => {
    if (err) throw err;
    console.log(`The file ${fileName} has been saved!`);
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const eventArr = await fetchSpreadsheetData(process.env.SHEET_ID as string);

    const eventNameObject = convertArrayToEventNameObject(eventArr);
    const eventPropertyTypeObject = convertEventPropertyObject(eventArr);

    const eventNameFileData = generateEventNameFileData(eventNameObject);
    const eventPropertyFileData = generateEventPropertyTypeFileData(eventPropertyTypeObject);
    const indexFileData = generateIndexFileData();

    await writeToFile(eventNameFileData, 'src/dataEvent/eventName.ts');
    await writeToFile(eventPropertyFileData, 'src/dataEvent/eventProperty.ts');
    await writeToFile(indexFileData, 'src/dataEvent/index.ts');

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({});
  }
}
