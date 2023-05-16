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
      "콘텐츠_리스트": {
        "콘텐츠_카드": {
          "click": {
            "contentsId": string,
            "category": string,
            "isBookmarked": boolean
          },
          "view": {
            "contentsId": string
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
            "contentsId": string
          },
          "view": {
            "contentsId": string
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
