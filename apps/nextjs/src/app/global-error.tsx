"use client"

import Link from "next/link"

import { Button } from "@acme/ui/button"

export default function GlobalErrorPage() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
            Something went totally wrong
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400"></p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button variant="default" asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
