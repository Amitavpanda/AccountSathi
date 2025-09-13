// Mark this page as static to avoid SSR context issues
export const dynamic = 'error'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: '100vh'
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  text: {
    color: '#4b5563'
  }
}

export default function Custom500() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>500 - Server Error</h1>
      <p style={styles.text}>Something went wrong on our end. Please try again later.</p>
    </div>
  );
}
