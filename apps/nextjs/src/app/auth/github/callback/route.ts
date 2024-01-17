import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { GithubUser, GithubUserEmail } from "@acme/auth";
import { github, lucia } from "@acme/auth";
import { db, schema } from "@acme/db";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser =
      (await githubUserResponse.json()) as GithubUser["response"]["data"];

    const existingUser = await db.query.accounts.findFirst({
      columns: {
        userId: true,
      },

      where: (accounts, { and, eq }) => {
        return and(
          eq(accounts.providerId, "github"),
          // since the id in github is a number, we have to convert it
          // to a string, because our accounts tables expects a string
          // easy peacy, lemon squeezy
          eq(accounts.providerUserId, githubUser.id.toString()),
        );
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    let userId = generateId(15);
    const userEmail = githubUser.email!;

    await db.transaction(async (tx) => {
      const existingUser = await tx.query.users.findFirst({
        columns: {
          id: true,
        },
        where: (users, { and, eq }) => {
          return and(eq(users.email, userEmail));
        },
      });

      if (!existingUser) {
        await tx.insert(schema.users).values({
          id: userId,
          name: githubUser.login,
          email: userEmail,
        });
      } else {
        userId = existingUser.id;
      }

      await tx.insert(schema.accounts).values({
        providerId: "github",
        providerUserId: githubUser.id.toString(),
        userId,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
