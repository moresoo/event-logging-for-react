import { ClickEventLogging, ViewEventLogging } from '@/EventLoggingComponents';
import { useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <ClickEventLogging
        path={['인사이트', '인사이트_리스트', '인사이트_카드']}
        property={{ insightId: 'abc', category: '엔젤투자', isBookmarked: true }}
      >
        <button onClick={() => console.log('인사이트_카드_클릭')}>
          {`인사이트 > 인사이트_리스트 > 인사이트_카드`}
        </button>
      </ClickEventLogging>

      <ClickEventLogging
        path={['인사이트', '인사이트_리스트', '카테고리']}
        property={{ name: '엔젤투자' }}
      >
        <button onClick={() => console.log('카테고리_클릭')}>
          {`인사이트 > 인사이트_리스트 > 카테고리`}
        </button>
      </ClickEventLogging>

      <ClickEventLogging
        path={['인사이트', '카테고리_리스트', '카테고리']}
        property={{ name: '엔젤투자' }}
      >
        <button onClick={() => console.log('카테고리_클릭')}>
          {`인사이트 > 카테고리_리스트 > 카테고리`}
        </button>
      </ClickEventLogging>

      <button onClick={() => setIsVisible((prev) => !prev)}>클릭하시면 열립니다.</button>
      {isVisible && (
        <ViewEventLogging
          path={['인사이트', '인사이트_리스트', '인사이트_카드']}
          property={{ insightId: 'abc' }}
        >
          <div>{`인사이트 카드 View`}</div>
        </ViewEventLogging>
      )}
    </>
  );
}
