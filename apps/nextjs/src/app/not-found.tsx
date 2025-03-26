"use client"

import Link from "next/link"

import { Button } from "@acme/ui/components/button"

export default function ErrorPage() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button variant="default" asChild>
              <Link href="/">Go back home</Link>
            </Button>
            <Button variant="link">
              <a href="mailto:dbsdl@deutschebahn.com">
                Contact us <span aria-hidden="true">&rarr;</span>
              </a>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
