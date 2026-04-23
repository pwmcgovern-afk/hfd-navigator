'use client'

import Link from 'next/link'
import LanguageToggle from '@/components/LanguageToggle'

// PageHeader — shared top-of-page lockup for /about, /resources, /category,
// /wizard. Mirrors the home hero strip (back link · edition · language toggle)
// + a serif title block, so every page reads as part of the same publication.

interface PageHeaderProps {
  back?: string
  backLabel: string
  edition: string
  eyebrow?: string
  title: string
}

export default function PageHeader({
  back = '/',
  backLabel,
  edition,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header className="page-header" role="banner">
      <div className="hero__strip">
        <Link href={back} className="page-header__back" aria-label={backLabel}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{backLabel}</span>
        </Link>
        <span className="hero__edition">{edition}</span>
        <LanguageToggle />
      </div>
      <div className="page-header__title-block">
        {eyebrow && <p className="hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
      </div>
    </header>
  )
}
