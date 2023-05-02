export type EventProperty = {
  인사이트: {
    카테고리_리스트: {
      카테고리_Click: {
        name: string
      }
    },
    인사이트_리스트: {
      인사이트_카드_Click: {
        insightId: string,
        category: string,
        isBookmarked: boolean
      },
      인사이트_카드_View: {
        insightId: string
      },
      카테고리_Click: {
        name: string
      }
    }
  }
};
