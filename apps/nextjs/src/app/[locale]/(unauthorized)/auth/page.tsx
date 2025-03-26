import type { Metadata } from "next"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { auth, providers } from "@acme/auth"
import { redirect } from "@acme/locales/react"
import { Alert, AlertDescription, AlertTitle } from "@acme/ui/components/alert"
import { Button } from "@acme/ui/components/button"

import Logo from "~/components/logo"

interface LoginPageProps {
  searchParams: Promise<{
    error?: string
    redirectTo?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t("auth.title"),
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo, error } = await searchParams
  const t = await getTranslations()
  const { session } = await auth()

  // check if the user is already logged in
  if (session) {
    if (redirectTo) {
      redirect({ href: redirectTo, locale: await getLocale() })
    }
    redirect({ href: "/", locale: await getLocale() })
  }

  const errors: Record<string, string> = {
    AUTH_INVALID_PROVIDER: t("auth.error.invalid_provider"),
    AUTH_CODE_ERROR: t("auth.error.code_error"),
    AUTH_CALLBACK_ERROR: t("auth.error.callback_error"),
    AUTH_UNKNOWN_ERROR: t("auth.error.unknown_error"),
  }

  return (
    <div className="xl:min-h-[800px h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[450px] gap-6">
          <div className="mb-4 flex justify-center">
            <Link href={"/"} className="mx-auto flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{t("auth.page_title")}</h1>
            {/* <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p> */}
          </div>
          {error && (
            <Alert variant={"destructive"} className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("auth.error.title")}</AlertTitle>
              <AlertDescription>{errors[error] ?? errors.AUTH_UNKNOWN_ERROR}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            {Object.entries(providers).map(([providerKey, provider], index) => (
              <Button
                variant="outline"
                className="w-full"
                type="button"
                asChild
                key={index}
                id={providerKey}
              >
                <a
                  href={`/api/auth/${providerKey}/login?redirectTo=${encodeURIComponent(redirectTo ?? "/")}`}
                  aria-checked
                >
                  {t("auth.signin_button")} {provider.name}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden bg-secondary lg:block"></div>
    </div>
  )
}
