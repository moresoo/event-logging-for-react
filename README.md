해당 링크에서 프로젝트의 목적과 과정에 대한 내용을 볼 수 있습니다.
> 프론트엔드 개발자의 이벤트 로깅 설계와 생산성 극대화: https://velog.io/@moreso/data-event-design-for-frontend

## 1. Start

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

> 참고: https://github.com/theoephraim/node-google-spreadsheet

적용 후 
```
yarn generate:dataEvent
```

## 2. Google SpreadSheet 기반 데이터 이벤트 생성

### Input

<img width="1638" alt="스크린샷 2023-05-18 오전 3 00 10" src="https://github.com/moresoo/event-logging-for-react/assets/45632773/cc980213-b699-482d-8088-216bd3ef94ae">

> https://docs.google.com/spreadsheets/d/1H8kjFsnpSP6nrnWzUkvszCI7DsanTamgoGg0_dm4BHg

### Output

#### 데이터 이벤트명 Map

```typescript
// src/dataEvent/eventName.ts

export const EVENT_NAME = {
  "인사이트": {
    "메인": {
      "인기_콘텐츠": {
        "콘텐츠": {
          "click": "click__insight__contents",
          "view": "view__insight__contents"
        }
      },
      "카테고리_슬라이더": {
        "카테고리": {
          "click": "click__insight__category"
        }
      },
      "리스트_콘텐츠": {
        "콘텐츠": {
          "click": "click__insight__contents",
          "view": "view__insight__contents"
        }
      }
    },
    "상세페이지": {
      "콘텐츠_헤더": {
        "공유하기": {
          "click": "click__insight__share"
        }
      },
      "추천_콘텐츠": {
        "콘텐츠": {
          "click": "click__insight__contents",
          "view": "view__insight__contents"
        }
      },
      "관련_콘텐츠": {
        "콘텐츠": {
          "click": "click__insight__contents",
          "view": "view__insight__contents"
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
      "인기_콘텐츠": {
        "콘텐츠": {
          "click": {
            "contentsId": string
          },
          "view": {
            "contentsId": string
          }
        }
      },
      "카테고리_슬라이더": {
        "카테고리": {
          "click": {
            "name": string
          }
        }
      },
      "리스트_콘텐츠": {
        "콘텐츠": {
          "click": {
            "contentsId": string,
            "category": string,
            "isBookmarked": boolean
          },
          "view": {
            "contentsId": string
          }
        }
      }
    },
    "상세페이지": {
      "콘텐츠_헤더": {
        "공유하기": {
          "click": {
            "type": 'kakao' | 'facebook' | 'url'
          }
        }
      },
      "추천_콘텐츠": {
        "콘텐츠": {
          "click": {
            "contentsId": string
          },
          "view": {
            "contentsId": string
          }
        }
      },
      "관련_콘텐츠": {
        "콘텐츠": {
          "click": {
            "contentsId": string
          },
          "view": {
            "contentsId": string
          }
        }
      }
    }
  }
};
```

## 3. 이벤트 로깅 컴포넌트 (React + Typescript)

### (1) 클릭 이벤트 로깅 컴포넌트

```tsx
<ClickEventLogging
  path={['인사이트', '메인', '인기_콘텐츠', '콘텐츠']}
  property={{ contentsId: 'abc' }}
>
  <button onClick={() => console.log('콘텐츠 Click')}>
    {`인사이트 > 메인 > 인기_콘텐츠 > 콘텐츠`}
  </button>
</ClickEventLogging>
```

<img width="696" alt="스크린샷 2023-05-18 오전 2 56 49" src="https://github.com/moresoo/event-logging-for-react/assets/45632773/b0084b40-63b8-4b75-a18d-dc618a11fa18">

### (2) 뷰 이벤트 로깅 컴포넌트

```tsx
{isVisible && (
  <ViewEventLogging
    path={['인사이트', '메인', '리스트_콘텐츠', '콘텐츠']}
    property={{ contentsId: 'abc' }}
  >
    <div>{`인사이트 > 메인 > 리스트_콘텐츠 > 콘텐츠`}</div>
  </ViewEventLogging>
)}
```

<img width="692" alt="스크린샷 2023-05-18 오전 2 56 59" src="https://github.com/moresoo/event-logging-for-react/assets/45632773/ac8d4678-4241-4f07-aca8-eff9ab6d520d">
