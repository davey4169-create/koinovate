import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ width = 140, height = 46, linkTo = '/', showText = false }) {
  return (
    <Link href={linkTo} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
      <Image
        src="/koinovate-logo.png"
        alt="KOINOVATE"
        width={width}
        height={height}
        style={{ objectFit: 'contain', filter: 'brightness(1.1)' }}
        priority
      />
      {showText && (
        <span style={{
          fontFamily: '"Orbitron", monospace',
          color: '#64ffda', fontSize: 16,
          fontWeight: 700, letterSpacing: '0.12em',
          marginLeft: 10,
        }}>KOINOVATE</span>
      )}
    </Link>
  )
}