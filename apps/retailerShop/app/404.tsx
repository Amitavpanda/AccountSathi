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

export default function Custom404() {
  return (
    import styles from './error.module.css'

export const dynamic = 'force-dynamic'

export default function Custom404() {
  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title404}>404 - Page Not Found</h1>
      <p className={styles.message}>The page you are looking for does not exist.</p>
      <a href="/" className={styles.link}>Go Home</a>
    </div>
  )
}
  );
}
