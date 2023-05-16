import { ClickEventLogging, ViewEventLogging } from '@/EventLoggingComponents';
import { useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <ClickEventLogging
        path={['인사이트', '메인', '콘텐츠_리스트', '콘텐츠_카드']}
        property={{ contentsId: 'abc', category: '엔젤투자', isBookmarked: true }}
      >
        <button onClick={() => console.log('콘텐츠 카드 Click')}>
          {`ClickEventLogging (인사이트 > 메인 > 콘텐츠_리스트 > 콘텐츠_카드)`}
        </button>
      </ClickEventLogging>

      <ClickEventLogging
        path={['인사이트', '메인', '콘텐츠_리스트', '카테고리']}
        property={{ name: '엔젤투자' }}
      >
        <button onClick={() => console.log('카테고리 Click')}>
          {`ClickEventLogging (인사이트 > 메인 > 콘텐츠_리스트 > 카테고리)`}
        </button>
      </ClickEventLogging>

      <ClickEventLogging
        path={['인사이트', '메인', '카테고리_리스트', '카테고리']}
        property={{ name: '엔젤투자' }}
      >
        <button onClick={() => console.log('카테고리 Click')}>
          {`ClickEventLogging (인사이트 > 메인 > 카테고리_리스트 > 카테고리)`}
        </button>
      </ClickEventLogging>

      <button onClick={() => setIsVisible((prev) => !prev)}>
        ViewEventLogging 테스트 (클릭하면 열림)
      </button>
      {isVisible && (
        <ViewEventLogging
          path={['인사이트', '메인', '콘텐츠_리스트', '콘텐츠_카드']}
          property={{ contentsId: 'abc' }}
        >
          <div>{`콘텐츠 카드 View`}</div>
        </ViewEventLogging>
      )}
    </div>
  );
}
