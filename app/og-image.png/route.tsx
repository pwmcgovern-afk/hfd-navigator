import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0D6E6E 0%, #064040 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: 'white',
          padding: '60px',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)', display: 'flex',
        }} />

        <div style={{ fontSize: '28px', opacity: 0.9, marginBottom: '12px', display: 'flex' }}>
          &#10024;
        </div>
        <div style={{
          fontSize: '56px', fontWeight: 800, marginBottom: '16px',
          letterSpacing: '-0.02em', display: 'flex',
        }}>
          Hartford Navigator
        </div>
        <div style={{
          fontSize: '24px', opacity: 0.85, marginBottom: '48px',
          maxWidth: '600px', textAlign: 'center', lineHeight: 1.4,
          display: 'flex',
        }}>
          Find resources to help you thrive
        </div>
        <div style={{
          display: 'flex', gap: '32px', fontSize: '20px', opacity: 0.8,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            192 Resources
          </span>
          <span style={{ display: 'flex' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            12 Categories
          </span>
          <span style={{ display: 'flex' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Bilingual
          </span>
        </div>
        <div style={{
          position: 'absolute', bottom: '30px',
          fontSize: '16px', opacity: 0.5, display: 'flex',
        }}>
          hfdnavigator.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
