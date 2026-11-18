'use client'

import { useActionState } from 'react'
import { login } from './actions'

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null)
  return (
    <form action={action} className="card mx-auto flex max-w-sm flex-col gap-3 p-6">
      <h1 className="text-xl font-extrabold">Masuk Admin</h1>
      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input id="password" name="password" type="password" required placeholder="Password admin" className="input" />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? 'Memeriksa...' : 'Masuk'}
      </button>
    </form>
  )
}
