## 0. Start

### 실행하기
```
yarn dev
```

### 데이터 이벤트 생성하기


```
// .env

GOOGLE_SHEET_ID=/* GOOGLE_SHEET_ID */
GOOGLE_SERVICE_ACCOUNT_EMAIL=/* GOOGLE_SERVICE_ACCOUNT_EMAIL */
GOOGLE_PRIVATE_KEY=/* GOOGLE_PRIVATE_KEY */
```

적용 후 
```
yarn generate:dataEvent
```

> 참고: https://github.com/theoephraim/node-google-spreadsheet

## 1. Google SpreadSheet 기반 데이터 이벤트 생성

### Input

<img width="1598" alt="스크린샷 2023-05-13 오후 10 49 21" src="https://github.com/moresoo/data-event-design-for-react/assets/45632773/e6ac59bb-e998-49d5-b761-9940e5494b68">

> https://docs.google.com/spreadsheets/d/1H8kjFsnpSP6nrnWzUkvszCI7DsanTamgoGg0_dm4BHg/edit#gid=0

### Output

#### 데이터 이벤트명 Map

```typescript
// src/dataEvent/eventName.ts

export const EVENT_NAME = {
  "인사이트": {
    "메인": {
      "카테고리_리스트": {
        "카테고리": {
          "click": "click__insight__category"
        }
      },
      "인사이트_리스트": {
        "콘텐츠_카드": {
          "click": "click__insight__insightCard",
          "view": "view__insight__insightCard"
        },
        "카테고리": {
          "click": "click__insight__category"
        }
      }
    },
    "상세페이지": {
      "콘텐츠_헤더": {
        "카테고리": {
          "click": "click__insight__category"
        },
        "공유하기": {
          "click": "click__insight__share"
        }
      },
      "콘텐츠_푸터": {
        "추천_콘텐츠_카드": {
          "click": "click__insight__insightCard",
          "view": "view__insight__insightCard"
        },
        "카테고리": {
          "click": "click__insight__category"
        }
      }
    }
  }
};
```

#### 데이터 프로퍼티 Type

```typescript
// src/dataEvent/eventProperty.ts

export type EventProperty = {
  "인사이트": {
    "메인": {
      "카테고리_리스트": {
        "카테고리": {
          "click": {
            "name": string
          }
        }
      },
      "인사이트_리스트": {
        "콘텐츠_카드": {
          "click": {
            "insightId": string,
            "category": string,
            "isBookmarked": boolean
          },
          "view": {
            "insightId": string
          }
        },
        "카테고리": {
          "click": {
            "name": string
          }
        }
      }
    },
    "상세페이지": {
      "콘텐츠_헤더": {
        "카테고리": {
          "click": {
            "name": string
          }
        },
        "공유하기": {
          "click": {
            "type": 'kakao' | 'facebook' | 'url'
          }
        }
      },
      "콘텐츠_푸터": {
        "추천_콘텐츠_카드": {
          "click": {
            "insightId": string
          },
          "view": {
            "insightId": string
          }
        },
        "카테고리": {
          "click": {
            "name": string
          }
        }
      }
    }
  }
};
```

## 2. 이벤트 로깅 컴포넌트 (React + Typescript)

### (1) 클릭 이벤트 로깅 컴포넌트

```tsx
<ClickEventLogging
  path={['인사이트', '메인', '인사이트_리스트', '콘텐츠_카드']}
  property={{ insightId: 'abc', category: '엔젤투자', isBookmarked: true }}
>
  <button onClick={() => console.log('인사이트_카드_클릭')}>
    {`인사이트 > 인사이트_리스트 > 인사이트_카드`}
  </button>
</ClickEventLogging>
```

<img width="772" alt="스크린샷 2023-05-13 오후 11 19 23" src="https://github.com/moresoo/data-event-design-for-react/assets/45632773/27686036-11b0-40d3-8893-7bd3b9da8346">

### (2) 뷰 이벤트 로깅 컴포넌트

```tsx
{isVisible && (
  <ViewEventLogging
    path={['인사이트', '메인', '인사이트_리스트', '콘텐츠_카드']}
    property={{ insightId: 'abc' }}
  >
    <div>{`인사이트 카드 View`}</div>
  </ViewEventLogging>
)}
```

<img width="772" alt="스크린샷 2023-05-13 오후 11 19 33" src="https://github.com/moresoo/data-event-design-for-react/assets/45632773/e17dd942-e4a2-4d3d-aedf-707e1134d9aa">
