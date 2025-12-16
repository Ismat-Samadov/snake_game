import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                background: '#1a1a2e',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: 24,
                height: 24,
                background: '#1a1a2e',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: 24,
                height: 24,
                background: '#1a1a2e',
                borderRadius: '4px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                background: '#1a1a2e',
                borderRadius: '4px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                background: '#1a1a2e',
                borderRadius: '4px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                background: '#1a1a2e',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
