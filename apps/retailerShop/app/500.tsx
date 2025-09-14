// Mark this page as staimport styles from './error.module.css'

export const dynamic = 'force-dynamic'

export default function Custom500() {
  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title500}>500 - Server Error</h1>
      <p className={styles.message}>Something went wrong on our end.</p>
      <a href="/" className={styles.link}>Go Home</a>
    </div>
  )
}
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
    import styles from './styles/error.module.css'
export const dynamic = 'force-dynamic';

export default function Custom500() {
  return (
    <div className={styles.error}>
      <h1 className={styles.title500}>500 - Internal Server Error</h1>
      <p className={styles.message}>Something went wrong on our end. Please try again later.</p>
      <a href="/" className={styles.button}>Go Home</a>
    </div>
  )
}
  );
}
