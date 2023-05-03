type EventName = {
  [feature: string]: {
    [location: string]: {
      [target: string]: {
        [action: string]: string
      };
    };
  };
};

export const EVENT_NAME: EventName = {
  "인사이트": {
    "카테고리_리스트": {
      "카테고리": {
        "click": "click__insight__category"
      }
    },
    "인사이트_리스트": {
      "인사이트_카드": {
        "click": "click__insight__insightCard",
        "view": "view__insight__insightCard"
      },
      "카테고리": {
        "click": "click__insight__category"
      }
    }
  }
};
