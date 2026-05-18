import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

// Omit the duplicate routing props from the native HTML anchor definitions
type BaseAnchorProps = Omit<ComponentPropsWithoutRef<'a'>, keyof LinkProps>

interface CustomLinkProps extends BaseAnchorProps {
    href: LinkProps['href']
    children?: ReactNode
    replace?: boolean
    scroll?: boolean
    shallow?: boolean
    passHref?: boolean
    prefetch?: boolean | 'auto' | 'unstable_forceStale' | null
}

const CustomLink = ({ href, children, replace, scroll, shallow, passHref, prefetch, ...rest }: CustomLinkProps) => {
    const hrefString = typeof href === 'object' ? href.pathname || '' : href || ''

    const isInternalLink = hrefString.startsWith('/')
    const isAnchorLink = hrefString.startsWith('#')

    // Properties explicitly meant for the Next.js routing wrapper
    const linkProps = { href, replace, scroll, shallow, passHref, prefetch }

    if (isInternalLink) {
        return (
            <Link className="break-words" {...linkProps} {...rest}>
                {children}
            </Link>
        )
    }

    if (isAnchorLink) {
        return (
            <a className="break-words" href={hrefString} {...rest}>
                {children}
            </a>
        )
    }

    return (
        <a
            className="break-words"
            target="_blank"
            rel="noopener noreferrer"
            href={hrefString}
            {...rest}
        >
            {children}
        </a>
    )
}

export default CustomLink
