import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Untitled';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a2e',          // your bg color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <p style={{ color: 'white', fontSize: 64, textAlign: 'center' }}>
          {title}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}