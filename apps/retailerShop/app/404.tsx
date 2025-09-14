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
