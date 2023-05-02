type EventValue = Record<string, Record<string, Record<string, { event: string; eventPath: string }>>>;

export const EVENT_VALUE: EventValue = {
  "인사이트": {
    "카테고리_리스트": {
      "카테고리_Click": {
        "event": "category/click",
        "eventPath": "인사이트/카테고리_리스트/카테고리_Click"
      }
    },
    "인사이트_리스트": {
      "인사이트_카드_Click": {
        "event": "insight/click",
        "eventPath": "인사이트/인사이트_리스트/인사이트_카드_Click"
      },
      "인사이트_카드_View": {
        "event": "insight/view",
        "eventPath": "인사이트/인사이트_리스트/인사이트_카드_View"
      },
      "카테고리_Click": {
        "event": "category/click",
        "eventPath": "인사이트/인사이트_리스트/카테고리_Click"
      }
    }
  }
};
