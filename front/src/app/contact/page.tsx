"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import styles from "../home.module.css";
import contactStyles from "./contact.module.css";

// Add metadata for SEO
export const dynamic = 'force-dynamic';

export default function ContactPage() {
  const { t, lang, isTransitioning } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "" // honeypot (gizli) — botlar doldurur, gerçek kullanıcı boş bırakır
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Update document title based on language
  useEffect(() => {
    const title = lang === 'tr' 
      ? "İletişim"
      : "Contact";
    
    // Update the document title using Next.js template
    document.title = `${title} - Kemal Kondakçı | AI Engineer & Software Developer`;
  }, [lang]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Gerçek gönderim: backend /api/contact -> SMTP ile e-posta.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", subject: "", message: "", company: "" });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`ktn-scope ${styles.home} language-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} style={{ gridTemplateColumns: "1fr" }}>
          <div className={styles.heroText} style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <div className={styles.eyebrow}>{t.contact.title}</div>
            <h1 className={styles.title}>
              <span className="ktn-glitch" data-text={t.contact.getInTouch}>
                {t.contact.getInTouch}
              </span>
            </h1>
            <p className={styles.usp}>
              {t.contact.description}
            </p>
            <div className={contactStyles.statsGrid}>
              <div className={contactStyles.statItem}>
                <div className={contactStyles.statIcon}>🟢</div>
                <span className={contactStyles.statLabel}>{t.contact.info.availability}</span>
              </div>
              <div className={contactStyles.statItem}>
                <div className={contactStyles.statIcon}>24h</div>
                <span className={contactStyles.statLabel}>{t.contact.info.responseTime}</span>
              </div>
              <div className={contactStyles.statItem}>
                <div className={contactStyles.statIcon}>📍</div>
                <span className={contactStyles.statLabel}>{t.contact.info.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Social Links Section */}
      <section className={styles.section}>
        <h2 className={`${styles.h2}`}>
          {lang === 'tr' ? 'İletişim & Sosyal Medya' : 'Contact & Social Media'}
        </h2>
        <div className={contactStyles.socialLinksGrid}>
          <a href="mailto:kondakci.k@gmail.com" className={`ktn-btn ${contactStyles.socialLink}`}>
            <span className={contactStyles.socialIcon}>📧</span>
            kondakci.k@gmail.com
          </a>
          <a href="https://wa.me/+905538790853" 
             target="_blank" 
             rel="noopener noreferrer" 
             className={`ktn-btn ktn-btn--ghost ${contactStyles.socialLink}`}>
            <span className={contactStyles.socialIcon}>💬</span>
            +90 553 879 0853
          </a>
          <a href="https://www.linkedin.com/in/kemal-kondak%C3%A7%C4%B1-b62173157/" 
             target="_blank" 
             rel="noopener noreferrer" 
             className={`ktn-btn ktn-btn--ghost ${contactStyles.socialLink}`}>
            <span className={contactStyles.socialIcon}>💼</span>
            LinkedIn
          </a>
          <a href="https://github.com/kemkum53" 
             target="_blank" 
             rel="noopener noreferrer" 
             className={`ktn-btn ktn-btn--ghost ${contactStyles.socialLink}`}>
            <span className={contactStyles.socialIcon}>⚡</span>
            GitHub
          </a>
          <a href="https://instagram.com/53kemkum" 
             target="_blank" 
             rel="noopener noreferrer" 
             className={`ktn-btn ktn-btn--ghost ${contactStyles.socialLink}`}>
            <span className={contactStyles.socialIcon}>📸</span>
            Instagram
          </a>
        </div>
      </section>

      {/* Contact Content */}
      <section className={styles.section}>
        <div className={contactStyles.contactGridSingle}>
          {/* Contact Form */}
          <div className={`${styles.card} ${contactStyles.contactPageCard}`}>
            <h2 className={`${styles.h2} ${styles.cardTitle}`}>
              {t.contact.sections.sendMessage}
            </h2>
            <div className={styles.cardBody}>
              <form onSubmit={handleSubmit} className={contactStyles.contactForm}>
                {/* Honeypot — gizli alan; botlar doldurur, sunucu sessizce yutar. */}
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                {/* Status Message */}
                {submitStatus === 'success' && (
                  <div className={`${contactStyles.statusMessage} ${contactStyles.statusSuccess}`}>
                    {t.contact.form.success}
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className={`${contactStyles.statusMessage} ${contactStyles.statusError}`}>
                    {t.contact.form.error}
                  </div>
                )}

                <div className={contactStyles.formRow}>
                  <div className={contactStyles.formGroup}>
                    <label className={contactStyles.formLabel}>
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t.contact.form.namePlaceholder}
                      required
                      minLength={2}
                      maxLength={100}
                      className={contactStyles.formInput}
                    />
                  </div>
                  <div className={contactStyles.formGroup}>
                    <label className={contactStyles.formLabel}>
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t.contact.form.emailPlaceholder}
                      required
                      maxLength={200}
                      className={contactStyles.formInput}
                    />
                  </div>
                </div>
                
                <div className={contactStyles.formGroup}>
                  <label className={contactStyles.formLabel}>
                    {t.contact.form.subject}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t.contact.form.subjectPlaceholder}
                    maxLength={150}
                    className={contactStyles.formInput}
                  />
                </div>

                <div className={contactStyles.formGroup}>
                  <label className={contactStyles.formLabel}>
                    {t.contact.form.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.contact.form.messagePlaceholder}
                    required
                    minLength={10}
                    maxLength={5000}
                    className={contactStyles.formTextarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={contactStyles.submitBtn}
                  data-umami-event="contact-submit"
                >
                  {isSubmitting ? t.contact.form.sending : t.contact.form.send}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
