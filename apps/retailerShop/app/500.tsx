import styles from './error.module.css'

// Make this a server component
export default async function Custom500() {
  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title500}>500 - Server Error</h1>
      <p className={styles.message}>Something went wrong on our end.</p>
      <a href="/" className={styles.link}>Go Home</a>
    </div>
  )
}

// This ensures fresh data for dynamic routes
export const dynamic = 'force-dynamic'
