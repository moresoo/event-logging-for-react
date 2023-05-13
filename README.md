# 1. Google SpreadSheet 기반 데이터 이벤트 제너레이터

<img width="1598" alt="스크린샷 2023-05-13 오후 10 49 21" src="https://github.com/moresoo/data-event-design-for-react/assets/45632773/e6ac59bb-e998-49d5-b761-9940e5494b68">

> https://docs.google.com/spreadsheets/d/1H8kjFsnpSP6nrnWzUkvszCI7DsanTamgoGg0_dm4BHg/edit#gid=0

### 데이터 이벤트 Map

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

### 데이터 프로퍼티 Type

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

# 2. 이벤트 로깅 컴포넌트 (React + Typescript)

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
