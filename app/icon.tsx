import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '2px',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                background: '#1a1a2e',
                borderRadius: '1px',
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                background: '#1a1a2e',
                borderRadius: '1px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '2px',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                background: '#1a1a2e',
                borderRadius: '1px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '2px',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                background: '#1a1a2e',
                borderRadius: '1px',
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
