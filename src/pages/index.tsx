import { ClickEventLogging, ViewEventLogging } from '@/EventLoggingComponents';
import { useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <ClickEventLogging
        path={['인사이트', '메인', '인기_콘텐츠', '콘텐츠']}
        property={{ contentsId: 'abc' }}
      >
        <button onClick={() => console.log('카테고리 Click')}>
          {`인사이트 > 메인 > 인기_콘텐츠_리스트 > 콘텐츠`}
        </button>
      </ClickEventLogging>

      <ClickEventLogging
        path={['인사이트', '메인', '리스트_콘텐츠', '콘텐츠']}
        property={{ contentsId: 'abc', category: '엔젤투자', isBookmarked: true }}
      >
        <button onClick={() => console.log('콘텐츠 Click')}>
          {`인사이트 > 메인 > 콘텐츠_리스트 > 콘텐츠`}
        </button>
      </ClickEventLogging>

      <button onClick={() => setIsVisible((prev) => !prev)}>뷰 이벤트 Toggle</button>
      {isVisible && (
        <ViewEventLogging
          path={['인사이트', '메인', '리스트_콘텐츠', '콘텐츠']}
          property={{ contentsId: 'abc' }}
        >
          <div>{`인사이트 > 메인 > 리스트_콘텐츠 > 콘텐츠`}</div>
        </ViewEventLogging>
      )}
    </div>
  );
}
