export type EventProperty = {
  인사이트: {
    카테고리_리스트: {
      카테고리: {
        click: {
          name: string
        }
      }
    },
    인사이트_리스트: {
      인사이트_카드: {
        click: {
          insightId: string,
          category: string,
          isBookmarked: boolean
        },
        view: {
          insightId: string
        }
      },
      카테고리: {
        click: {
          name: string
        }
      }
    }
  }
};
