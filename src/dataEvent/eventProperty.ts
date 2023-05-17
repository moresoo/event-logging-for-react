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
      "카테고리_리스트": {
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
