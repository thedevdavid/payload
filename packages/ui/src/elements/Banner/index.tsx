'use client'
import LinkImport from 'next/link.js' // TODO: abstract this out to support all routers
import type { MouseEvent } from 'react'

import React from 'react'

import './index.scss'

const Link = (LinkImport.default || LinkImport) as unknown as typeof LinkImport.default

const baseClass = 'banner'

type onClick = (event: MouseEvent) => void

export type Props = {
  alignIcon?: 'left' | 'right'
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  onClick?: onClick
  to?: string
  type?: 'default' | 'error' | 'info' | 'success'
}

export type RenderedTypeProps = {
  children?: React.ReactNode
  className?: string
  onClick?: onClick
  to: string
}

export const Banner: React.FC<Props> = ({
  type = 'default',
  alignIcon = 'right',
  children,
  className,
  icon,
  onClick,
  to,
}) => {
  const classes = [
    baseClass,
    `${baseClass}--type-${type}`,
    className && className,
    to && `${baseClass}--has-link`,
    (to || onClick) && `${baseClass}--has-action`,
    icon && `${baseClass}--has-icon`,
    icon && `${baseClass}--align-icon-${alignIcon}`,
  ]
    .filter(Boolean)
    .join(' ')

  let RenderedType: React.ComponentType<RenderedTypeProps> | React.ElementType = 'div'

  if (onClick && !to) RenderedType = 'button'
  if (to) RenderedType = Link

  return (
    <RenderedType className={classes} href={to || null} onClick={onClick}>
      {icon && alignIcon === 'left' && <React.Fragment>{icon}</React.Fragment>}
      <span className={`${baseClass}__content`}>{children}</span>
      {icon && alignIcon === 'right' && <React.Fragment>{icon}</React.Fragment>}
    </RenderedType>
  )
}