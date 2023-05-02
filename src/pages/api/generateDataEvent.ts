import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

type EventValueObject = Record<
  string,
  Record<string, Record<string, { event: string; eventPath: string }>>
>;

type EventPropertyTypeObject = Record<
  string,
  Record<string, Record<string, Record<string, string>>>
>;

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

const generateEventValueFileData = (
  eventValueObject: EventValueObject,
) => `type EventValue = Record<string, Record<string, Record<string, { event: string; eventPath: string }>>>;

export const EVENT_VALUE: EventValue = ${JSON.stringify(eventValueObject, null, 2)};\n`;

// "string" -> string 과 같이 변환함
const removeQuotes = (str: string) => str.replace(/["']/g, '');
const generateEventTypeFileData = (eventPropertyTypeObject: EventPropertyTypeObject) =>
  `export type EventProperty = ${removeQuotes(
    JSON.stringify(eventPropertyTypeObject, null, 2),
  )};\n`;

const generateIndexFileData = () => `export { EVENT_VALUE } from './eventValue';
export type { EventProperty } from './eventProperty';`;

const convertArrayToEventValueObject = (arr: string[][]): EventValueObject => {
  const result: EventValueObject = {};
  arr
    .filter(([l1, l2, l3, event]) => [l1, l2, l3, event].every(Boolean))
    .forEach(([l1, l2, l3, event]) => {
      const eventPath = [l1, l2, l3].join('/');
      result[l1] = { ...result[l1] };
      result[l1][l2] = { ...result[l1][l2] };
      result[l1][l2][l3] = { event, eventPath };
    });
  return result;
};

const convertEventPropertyTypeObject = (arr: string[][]): EventPropertyTypeObject => {
  const result: EventPropertyTypeObject = {};

  arr
    .filter(([l1, l2, l3, event]) => [l1, l2, l3, event].every(Boolean))
    .forEach(([l1, l2, l3, event, ...rest]) => {
      result[l1] = { ...result[l1] };
      result[l1][l2] = { ...result[l1][l2] };
      result[l1][l2][l3] = { ...result[l1][l2][l3] };

      rest.reduce((obj, value, i) => {
        if (i % 2 !== 0) return obj;
        const key = value;
        const val = rest[i + 1] || '';
        if (key) {
          obj[key] = val;
        }
        return obj;
      }, result[l1][l2][l3]);
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

    const eventValueObject = convertArrayToEventValueObject(eventArr);
    const eventPropertyTypeObject = convertEventPropertyTypeObject(eventArr);

    const eventValueFileData = generateEventValueFileData(eventValueObject);
    const eventTypeFileData = generateEventTypeFileData(eventPropertyTypeObject);
    const indexFileData = generateIndexFileData();

    await writeToFile(eventValueFileData, 'src/dataEvent/eventValue.ts');
    await writeToFile(eventTypeFileData, 'src/dataEvent/eventProperty.ts');
    await writeToFile(indexFileData, 'src/dataEvent/index.ts');

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({});
  }
}
